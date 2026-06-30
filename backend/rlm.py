import re
import uuid
import secrets
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import APIRouter, HTTPException, Depends, Body, UploadFile, File
from fastapi.responses import Response
from pydantic import BaseModel, Field, ConfigDict

from db import db
from auth import get_current_user
from email_service import send_email, invite_html, ar_notification_html, is_configured
import storage_service

# ---------------- CPF / CNPJ validation ----------------

def _digits(v: str) -> str:
    return re.sub(r"\D", "", v or "")


def validate_cpf(cpf: str) -> bool:
    c = _digits(cpf)
    if len(c) != 11 or c == c[0] * 11:
        return False

    def dv(part, factor):
        s = sum(int(d) * (factor - i) for i, d in enumerate(part))
        r = (s * 10) % 11
        return 0 if r == 10 else r

    if dv(c[:9], 10) != int(c[9]):
        return False
    return dv(c[:10], 11) == int(c[10])


def validate_cnpj(cnpj: str) -> bool:
    c = _digits(cnpj)
    if len(c) != 14 or c == c[0] * 14:
        return False

    def dv(part, weights):
        s = sum(int(d) * w for d, w in zip(part, weights))
        r = s % 11
        return 0 if r < 2 else 11 - r

    w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    if dv(c[:12], w1) != int(c[12]):
        return False
    w2 = [6] + w1
    return dv(c[:13], w2) == int(c[13])


def validate_document(value: str) -> dict:
    c = _digits(value)
    if len(c) == 11:
        return {"valid": validate_cpf(c), "type": "CPF", "digits": c}
    if len(c) == 14:
        return {"valid": validate_cnpj(c), "type": "CNPJ", "digits": c}
    return {"valid": False, "type": None, "digits": c}


# ---------------- Workflow stages ----------------
STAGE_ORDER = [
    "aguardando_royalty_ar",
    "aguardando_escritorio",
    "validacao_ar",
    "aguardando_isrc_label",
    "aguardando_vendor_ops",
    "aguardando_input_sistema",
    "validacao_final",
    "pronto_royalties",
]

STAGE_META = {
    "aguardando_royalty_ar": {"label": "Aguardando % de Royalties", "role": "A&R", "order": 1},
    "aguardando_escritorio": {"label": "Preenchimento do Escritório", "role": "Escritório", "order": 2},
    "validacao_ar": {"label": "Validação do Preenchimento", "role": "A&R", "order": 3},
    "aguardando_isrc_label": {"label": "Inclusão de ISRC/GRID", "role": "Label", "order": 4},
    "aguardando_vendor_ops": {"label": "Criação do Vendor / Callback / Envio ao Exterior", "role": "A&R OPS", "order": 5},
    "aguardando_input_sistema": {"label": "Input do Vendor e ISRCs no Sistema", "role": "A&R OPS / Label", "order": 6},
    "validacao_final": {"label": "Validação Final (Vendor / ISRCs OK?)", "role": "A&R OPS", "order": 7},
    "pronto_royalties": {"label": "Pronto para Cadastro de Royalties", "role": "ROY", "order": 8},
}


def _now_iso():
    return datetime.now(timezone.utc).strftime("%d/%m/%Y %H:%M")


def _id():
    return str(uuid.uuid4())


# ---------------- Models ----------------
class Participante(BaseModel):
    nome: str = ""
    royalty: float = 0


class EscritorioData(BaseModel):
    nomeArtista: str = ""
    tipoContratoArtista: str = ""
    artistaBeneficiario: str = ""
    cpfCnpj: str = ""
    banco: str = ""
    agencia: str = ""
    conta: str = ""
    observacoes: str = ""
    participantes: List[Participante] = Field(default_factory=list)
    royaltyPorFaixa: float = 0
    submittedAt: str = ""


class VendorData(BaseModel):
    nomeFornecedor: str = ""
    cpfCnpj: str = ""
    banco: str = ""
    agencia: str = ""
    conta: str = ""


class CallbackDoc(BaseModel):
    data: str = ""
    solicitante: str = ""
    dataConfirmacao: str = ""
    confirmadoPor: str = ""
    email: str = ""


class RlmProcessBase(BaseModel):
    projeto: str
    titulo: str = ""
    artistaPrincipal: str = ""
    licenseInId: str = ""


class RlmProcessCreate(RlmProcessBase):
    pass


class RlmProcess(RlmProcessBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_id)
    status: str = "aguardando_royalty_ar"
    artistRoyaltyPercent: float = 0
    escritorio: EscritorioData = Field(default_factory=EscritorioData)
    escritorioToken: str = ""
    escritorioSubmissionCount: int = 0
    isrc: str = ""
    grid: str = ""
    vendor: VendorData = Field(default_factory=VendorData)
    callbackDoc: CallbackDoc = Field(default_factory=CallbackDoc)
    signedDocLink: str = ""
    signedDocFile: dict = Field(default_factory=dict)
    signedAt: str = ""
    envioExteriorDone: bool = False
    vendorInputDone: bool = False
    isrcInputDone: bool = False
    royaltyRightId: str = ""
    escritorioEmail: str = ""
    escritorioNome: str = ""
    escritorioSentAt: str = ""
    arEmail: str = ""
    appOrigin: str = ""
    history: List[dict] = Field(default_factory=list)
    createdAt: str = ""
    updatedAt: str = ""


class TransitionRequest(BaseModel):
    to: str
    note: str = ""


class SendEscritorioRequest(BaseModel):
    email: str
    nome: str = ""
    origin: str = ""
    reminder: bool = False


def _validate_participantes(esc: dict):
    """Sum of participant royalties must not exceed the track total (royaltyPorFaixa)."""
    if not esc:
        return
    try:
        total = float(esc.get("royaltyPorFaixa") or 0)
        soma = sum(float(p.get("royalty") or 0) for p in (esc.get("participantes") or []))
    except (ValueError, TypeError):
        return
    if soma > total + 1e-9:
        raise HTTPException(
            status_code=400,
            detail=f"A soma dos royalties dos participantes ({soma:g}%) ultrapassa o total da faixa ({total:g}%).",
        )


# fields the generic update accepts
_UPDATABLE = {
    "projeto", "titulo", "artistaPrincipal", "licenseInId",
    "artistRoyaltyPercent", "escritorio", "isrc", "grid",
    "vendor", "callbackDoc", "signedDocLink", "signedDocFile", "signedAt", "envioExteriorDone",
    "vendorInputDone", "isrcInputDone",
}

router = APIRouter(prefix="/rlm-processes", tags=["rlm"], dependencies=[Depends(get_current_user)])
misc_router = APIRouter(tags=["rlm-misc"], dependencies=[Depends(get_current_user)])
public_router = APIRouter(prefix="/public/escritorio", tags=["rlm-public"])  # no auth


@public_router.get("/{token}")
async def public_get(token: str):
    p = await db.rlm_processes.find_one({"escritorioToken": token}, {"_id": 0})
    if not p:
        raise HTTPException(status_code=404, detail="Link inválido ou expirado")
    return {
        "projeto": p.get("projeto"),
        "titulo": p.get("titulo"),
        "artistaPrincipal": p.get("artistaPrincipal"),
        "artistRoyaltyPercent": p.get("artistRoyaltyPercent", 0),
        "escritorio": p.get("escritorio", {}),
        "status": p.get("status"),
        "submissionCount": p.get("escritorioSubmissionCount", 0),
    }


@public_router.post("/{token}")
async def public_submit(token: str, escritorio: dict = Body(...)):
    p = await db.rlm_processes.find_one({"escritorioToken": token}, {"_id": 0})
    if not p:
        raise HTTPException(status_code=404, detail="Link inválido ou expirado")
    _validate_participantes(escritorio)
    escritorio["submittedAt"] = _now_iso()
    count = p.get("escritorioSubmissionCount", 0) + 1
    history = p.get("history", []) + [{
        "from": p.get("status"), "to": p.get("status"),
        "note": f"Escritório enviou o preenchimento (envio #{count})",
        "by": p.get("escritorioNome") or "Escritório", "at": _now_iso(),
    }]
    await db.rlm_processes.update_one(
        {"escritorioToken": token},
        {"$set": {"escritorio": escritorio, "escritorioSubmissionCount": count, "history": history, "updatedAt": _now_iso()}},
    )
    # notify A&R (best-effort)
    ar_email = p.get("arEmail")
    if ar_email:
        origin = (p.get("appOrigin") or "").rstrip("/")
        proc_link = f"{origin}/rlm/processos/{p['id']}" if origin else ""
        await send_email(ar_email, f"[SMERA] Escritório devolveu — {p.get('projeto')}", ar_notification_html(p.get("projeto", ""), proc_link))
    return {"success": True, "submissionCount": count}


@misc_router.get("/rlm/stages")
async def get_stages():
    return [{"key": k, **STAGE_META[k]} for k in STAGE_ORDER]


@misc_router.post("/validate/document")
async def validate_doc(payload: dict = Body(...)):
    return validate_document(payload.get("value", ""))


@misc_router.get("/rlm/pendencies")
async def pendencies():
    procs = await db.rlm_processes.find({}, {"_id": 0}).to_list(2000)
    groups = []
    for key in STAGE_ORDER:
        if key == "pronto_royalties":
            continue
        items = [
            {"id": p["id"], "projeto": p["projeto"], "titulo": p.get("titulo", ""), "artistaPrincipal": p.get("artistaPrincipal", ""), "updatedAt": p.get("updatedAt", ""),
             "status": p.get("status"), "escritorioSentAt": p.get("escritorioSentAt", ""), "escritorioSubmissionCount": p.get("escritorioSubmissionCount", 0)}
            for p in procs if p.get("status") == key
        ]
        groups.append({"stage": key, **STAGE_META[key], "count": len(items), "items": items})
    ready = [p for p in procs if p.get("status") == "pronto_royalties"]
    return {
        "totalProcessos": len(procs),
        "pendentes": sum(g["count"] for g in groups),
        "prontos": len(ready),
        "groups": groups,
    }


@router.get("", response_model=List[RlmProcess])
async def list_processes():
    return await db.rlm_processes.find({}, {"_id": 0}).to_list(2000)


@router.get("/{pid}", response_model=RlmProcess)
async def get_process(pid: str):
    p = await db.rlm_processes.find_one({"id": pid}, {"_id": 0})
    if not p:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    return p


@router.post("", response_model=RlmProcess, status_code=201)
async def create_process(payload: RlmProcessCreate, current=Depends(get_current_user)):
    obj = RlmProcess(**payload.model_dump())
    obj.escritorioToken = secrets.token_urlsafe(16)
    obj.createdAt = _now_iso()
    obj.updatedAt = _now_iso()
    obj.history = [{"to": obj.status, "note": "Processo criado", "by": current.get("nome", ""), "at": obj.createdAt}]
    await db.rlm_processes.insert_one(obj.model_dump())
    return obj


@router.put("/{pid}", response_model=RlmProcess)
async def update_process(pid: str, payload: dict = Body(...)):
    existing = await db.rlm_processes.find_one({"id": pid}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    if "escritorio" in payload:
        _validate_participantes(payload["escritorio"])
    update = {k: v for k, v in payload.items() if k in _UPDATABLE}
    update["updatedAt"] = _now_iso()
    await db.rlm_processes.update_one({"id": pid}, {"$set": update})
    merged = {**existing, **update}
    return RlmProcess(**merged)


@router.post("/{pid}/transition", response_model=RlmProcess)
async def transition(pid: str, payload: TransitionRequest, current=Depends(get_current_user)):
    if payload.to not in STAGE_ORDER:
        raise HTTPException(status_code=400, detail="Status inválido")
    existing = await db.rlm_processes.find_one({"id": pid}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    entry = {"from": existing.get("status"), "to": payload.to, "note": payload.note, "by": current.get("nome", ""), "at": _now_iso()}
    history = existing.get("history", []) + [entry]
    await db.rlm_processes.update_one({"id": pid}, {"$set": {"status": payload.to, "history": history, "updatedAt": _now_iso()}})
    return RlmProcess(**{**existing, "status": payload.to, "history": history})


@router.delete("/{pid}")
async def delete_process(pid: str):
    res = await db.rlm_processes.delete_one({"id": pid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    return {"success": True, "id": pid}


@router.post("/{pid}/send-escritorio")
async def send_escritorio(pid: str, payload: SendEscritorioRequest, current=Depends(get_current_user)):
    """A&R sends the unique form link to the responsible office (escritório)."""
    p = await db.rlm_processes.find_one({"id": pid}, {"_id": 0})
    if not p:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    token = p.get("escritorioToken") or secrets.token_urlsafe(16)
    origin = (payload.origin or "").rstrip("/")
    link = f"{origin}/form/escritorio/{token}" if origin else f"/form/escritorio/{token}"

    updates = {
        "escritorioToken": token,
        "escritorioEmail": payload.email,
        "escritorioNome": payload.nome,
        "escritorioSentAt": datetime.now(timezone.utc).isoformat(),
        "arEmail": current.get("email", ""),
        "appOrigin": origin,
        "status": "aguardando_escritorio",
        "updatedAt": _now_iso(),
    }
    history = p.get("history", []) + [{
        "from": p.get("status"), "to": "aguardando_escritorio",
        "note": (f"Lembrete reenviado ao escritório {payload.nome} <{payload.email}>" if payload.reminder
                 else f"Formulário enviado ao escritório {payload.nome} <{payload.email}>"),
        "by": current.get("nome", ""), "at": _now_iso(),
    }]
    updates["history"] = history
    await db.rlm_processes.update_one({"id": pid}, {"$set": updates})

    prefix = "Lembrete: " if payload.reminder else ""
    subject = f"[SMERA] {prefix}Preenchimento de Vendors — {p.get('projeto')}"
    email_result = await send_email(payload.email, subject, invite_html(p.get("projeto", ""), link, p.get("artistRoyaltyPercent", 0)))
    return {"link": link, "email": email_result, "emailConfigured": is_configured()}


@router.post("/{pid}/upload-signed")
async def upload_signed(pid: str, file: UploadFile = File(...)):
    p = await db.rlm_processes.find_one({"id": pid}, {"_id": 0})
    if not p:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    if not storage_service.is_configured():
        raise HTTPException(status_code=503, detail="Object storage não configurado")
    data = await file.read()
    if len(data) > 8 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Arquivo muito grande (máx. 8MB)")
    ext = (file.filename or "bin").rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "bin"
    ct = file.content_type or storage_service.MIME_BY_EXT.get(ext, "application/octet-stream")
    path = f"smera/rlm/{pid}/{uuid.uuid4()}.{ext}"
    try:
        result = storage_service.put_object(path, data, ct)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Falha no upload: {e}")
    signed = {"name": file.filename, "path": result["path"], "contentType": ct, "size": result.get("size", len(data))}
    await db.rlm_processes.update_one({"id": pid}, {"$set": {"signedDocFile": signed, "signedAt": datetime.now(timezone.utc).strftime("%d/%m/%Y"), "updatedAt": _now_iso()}})
    return signed


@router.get("/{pid}/signed-file")
async def download_signed(pid: str):
    p = await db.rlm_processes.find_one({"id": pid}, {"_id": 0})
    if not p or not p.get("signedDocFile", {}).get("path"):
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    sf = p["signedDocFile"]
    try:
        content, ct = storage_service.get_object(sf["path"])
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Falha ao obter arquivo: {e}")
    return Response(content=content, media_type=sf.get("contentType", ct),
                    headers={"Content-Disposition": f'inline; filename="{sf.get("name", "documento")}"'})


@router.post("/{pid}/create-royalty")
async def create_royalty(pid: str):
    """Connect Phase 1 -> Phase 2: create (once) an RLM right (Cadastro de Royalties) from the process."""
    p = await db.rlm_processes.find_one({"id": pid}, {"_id": 0})
    if not p:
        raise HTTPException(status_code=404, detail="Processo não encontrado")
    if p.get("status") != "pronto_royalties":
        raise HTTPException(status_code=400, detail="Processo ainda não está pronto para Royalties")

    existing_id = p.get("royaltyRightId")
    if existing_id:
        right = await db.rlm_rights.find_one({"id": existing_id}, {"_id": 0})
        if right:
            return {"created": False, "right": right}

    year = datetime.now(timezone.utc).year
    codigo = f"RLM-{year}-{p['id'][:6].upper()}"
    right = {
        "id": _id(),
        "codigo": codigo,
        "obra": p.get("titulo") or p.get("projeto"),
        "titular": p.get("artistaPrincipal", ""),
        "tipo": "Master",
        "territorio": "Brasil",
        "vencimento": "",
        "valor": "",
        "status": "Ativo",
    }
    await db.rlm_rights.insert_one(dict(right))
    await db.rlm_processes.update_one({"id": pid}, {"$set": {"royaltyRightId": right["id"], "updatedAt": _now_iso()}})
    return {"created": True, "right": right}


# ---------------- Seed ----------------
async def seed_rlm():
    if await db.rlm_processes.count_documents({}) > 0:
        return
    samples = [
        {"projeto": "JETSKI", "titulo": "JETSKI", "artistaPrincipal": "Pedro Sampaio", "status": "aguardando_royalty_ar"},
        {"projeto": "Noite Perfeita", "titulo": "Romance Proibido", "artistaPrincipal": "Anitta", "status": "aguardando_escritorio"},
        {"projeto": "Batidão Tropical 2", "titulo": "Rubi", "artistaPrincipal": "Pabllo Vittar", "status": "aguardando_isrc_label"},
        {"projeto": "Funk Remix", "titulo": "Beat Pesado", "artistaPrincipal": "MC Hariel", "status": "aguardando_vendor_ops"},
        {"projeto": "Sertanejo Top", "titulo": "Coração Partido", "artistaPrincipal": "Marília Mendonça", "status": "validacao_final"},
    ]
    for s in samples:
        obj = RlmProcess(projeto=s["projeto"], titulo=s["titulo"], artistaPrincipal=s["artistaPrincipal"])
        obj.status = s["status"]
        obj.artistRoyaltyPercent = 50
        obj.escritorioToken = secrets.token_urlsafe(16)
        obj.createdAt = _now_iso()
        obj.updatedAt = _now_iso()
        obj.history = [{"to": obj.status, "note": "Seed inicial", "by": "Sistema", "at": obj.createdAt}]
        await db.rlm_processes.insert_one(obj.model_dump())
