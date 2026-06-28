from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends

import uuid
from db import db
from auth import verify_password, create_access_token, get_current_user, hash_password
from models import LoginRequest, LoginResponse, User, UserCreate, UserUpdate

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")
    if user.get("status") == "Inativo":
        raise HTTPException(status_code=403, detail="Usuário inativo. Contate o administrador.")

    now = datetime.now(timezone.utc).strftime("%d/%m/%Y %H:%M")
    await db.users.update_one({"id": user["id"]}, {"$set": {"ultimoAcesso": now}})
    user["ultimoAcesso"] = now

    token = create_access_token(user["id"], email)
    user.pop("_id", None)
    user.pop("password_hash", None)
    return {"token": token, "user": user}


@auth_router.get("/me")
async def me(current=Depends(get_current_user)):
    return current


# ---------------- Dashboard ----------------
dashboard_router = APIRouter(prefix="/dashboard", tags=["dashboard"], dependencies=[Depends(get_current_user)])


def _status_breakdown(items, statuses):
    return [{"name": s, "value": sum(1 for i in items if i.get("status") == s)} for s in statuses]


def _parse_ddmmyyyy(s):
    """Parse 'dd/mm/yyyy' to a sortable (yyyy, mm, dd) tuple; unknown dates sort last."""
    try:
        d, m, y = (s or "").split("/")
        return (int(y), int(m), int(d))
    except (ValueError, AttributeError):
        return (0, 0, 0)


@dashboard_router.get("/stats")
async def dashboard_stats():
    li = await db.licenses_in.find({}, {"_id": 0}).to_list(2000)
    lo = await db.licenses_out.find({}, {"_id": 0}).to_list(2000)
    ss = await db.sony_sony.find({}, {"_id": 0}).to_list(2000)
    d2c = await db.licenses_d2c.find({}, {"_id": 0}).to_list(2000)

    statuses = ["Finalizado", "Em Análise", "Pendente"]
    all_items = li + lo + ss + d2c
    pendentes = sum(1 for i in all_items if i.get("status") == "Pendente")
    ativas = sum(1 for i in all_items if i.get("status") == "Finalizado")

    recent = sorted(li, key=lambda x: _parse_ddmmyyyy(x.get("previsao")), reverse=True)[:5]
    recent_activity = [
        {"project": i.get("projeto"), "artist": i.get("artista"), "status": i.get("status"),
         "date": i.get("previsao"), "type": "License In"} for i in recent
    ]

    return {
        "stats": {
            "licencasAtivas": ativas,
            "pendentes": pendentes,
            "licenseIn": len(li),
            "licenseOut": len(lo),
            "sonySony": len(ss),
            "d2c": len(d2c),
        },
        "licenseInData": _status_breakdown(li, statuses),
        "licenseOutData": _status_breakdown(lo, statuses),
        "sonySonyData": _status_breakdown(ss, statuses),
        "d2cData": _status_breakdown(d2c, statuses),
        "recentActivity": recent_activity,
    }


# ---------------- Users (special CRUD with password hashing) ----------------
users_router = APIRouter(prefix="/users", tags=["users"], dependencies=[Depends(get_current_user)])

_DEFAULT_PWD = None


def _default_pwd():
    import os
    return os.environ.get("DEFAULT_USER_PASSWORD", "sony2025")


@users_router.get("", response_model=list[User])
async def list_users():
    return await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(2000)


@users_router.post("", response_model=User, status_code=201)
async def create_user(payload: UserCreate):
    email = payload.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="Email já cadastrado")
    data = payload.model_dump()
    password = data.pop("password", "") or _default_pwd()
    data["email"] = email
    obj = User(**data)
    doc = obj.model_dump()
    doc["password_hash"] = hash_password(password)
    await db.users.insert_one(dict(doc))
    return obj


@users_router.put("/{user_id}", response_model=User)
async def update_user(user_id: str, payload: UserUpdate):
    existing = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    data = payload.model_dump()
    password = data.pop("password", None)
    data["email"] = data["email"].lower()
    update_doc = {**data}
    if password:
        update_doc["password_hash"] = hash_password(password)
    await db.users.update_one({"id": user_id}, {"$set": update_doc})
    merged = {**existing, **data, "id": user_id}
    merged.pop("password_hash", None)
    return User(**merged)


@users_router.delete("/{user_id}")
async def delete_user(user_id: str, current=Depends(get_current_user)):
    if current.get("id") == user_id:
        raise HTTPException(status_code=400, detail="Não é possível excluir o próprio usuário")
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {"success": True, "id": user_id}
