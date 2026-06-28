import re
import uuid
import secrets
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import APIRouter, HTTPException, Depends, Body
from pydantic import BaseModel, Field, ConfigDict

from db import db
from auth import get_current_user

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
    envioExteriorDone: bool = False
    vendorInputDone: bool = False
    isrcInputDone: bool = False
    history: List[dict] = Field(default_factory=list)
    createdAt: str = ""
    updatedAt: str = ""


class TransitionRequest(BaseModel):
    to: str
    note: str = ""


# fields the generic update accepts
_UPDATABLE = {
    "projeto", "titulo", "artistaPrincipal", "licenseInId",
    "artistRoyaltyPercent", "escritorio", "isrc", "grid",
    "vendor", "callbackDoc", "signedDocLink", "envioExteriorDone",
    "vendorInputDone", "isrcInputDone",
}

router = APIRouter(prefix="/rlm-processes", tags=["rlm"], dependencies=[Depends(get_current_user)])
misc_router = APIRouter(tags=["rlm-misc"], dependencies=[Depends(get_current_user)])


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
            {"id": p["id"], "projeto": p["projeto"], "titulo": p.get("titulo", ""), "artistaPrincipal": p.get("artistaPrincipal", ""), "updatedAt": p.get("updatedAt", "")}
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
