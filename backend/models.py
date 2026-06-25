import uuid
from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict, EmailStr


def _uuid() -> str:
    return str(uuid.uuid4())


# ---------------- License In ----------------
class LicenseInBase(BaseModel):
    projeto: str
    titulo: str
    artista: str
    artistasConvidados: str = ""
    proRata: str = "Não"
    previsao: str = ""
    formato: str = ""
    meios: str = ""
    status: str = "Pendente"


class LicenseInCreate(LicenseInBase):
    pass


class LicenseIn(LicenseInBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uuid)


# ---------------- License Out ----------------
class LicenseOutBase(BaseModel):
    projeto: str
    titulo: str
    artistaSony: str
    solicitante: str
    tipo: str = ""
    prazo: str = ""
    status: str = "Pendente"


class LicenseOutCreate(LicenseOutBase):
    pass


class LicenseOut(LicenseOutBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uuid)


# ---------------- Sony / Sony ----------------
class SonySonyBase(BaseModel):
    codigo: str
    projeto: str
    artistaPrincipal: str
    artistaConvidado: str = ""
    selo: str = ""
    tipo: str = ""
    lancamento: str = ""
    status: str = "Pendente"


class SonySonyCreate(SonySonyBase):
    pass


class SonySony(SonySonyBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uuid)


# ---------------- RLM Rights ----------------
class RLMRightBase(BaseModel):
    codigo: str
    obra: str
    titular: str
    tipo: str = ""
    territorio: str = ""
    vencimento: str = ""
    valor: str = ""
    status: str = "Ativo"


class RLMRightCreate(RLMRightBase):
    pass


class RLMRight(RLMRightBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uuid)


# ---------------- Artist ----------------
class ArtistBase(BaseModel):
    nome: str
    gravadora: str = ""
    genero: str = ""
    pais: str = ""
    email: str = ""
    telefone: str = ""
    status: str = "Ativo"


class ArtistCreate(ArtistBase):
    pass


class Artist(ArtistBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uuid)


# ---------------- Label (Gravadora) ----------------
class LabelBase(BaseModel):
    nome: str
    pais: str = ""
    tipo: str = ""
    contato: str = ""
    telefone: str = ""
    status: str = "Ativo"


class LabelCreate(LabelBase):
    pass


class Label(LabelBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uuid)


# ---------------- Company (Empresa) ----------------
class CompanyBase(BaseModel):
    nome: str
    segmento: str = ""
    pais: str = ""
    contato: str = ""
    telefone: str = ""
    status: str = "Ativo"


class CompanyCreate(CompanyBase):
    pass


class Company(CompanyBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uuid)


# ---------------- User ----------------
class UserBase(BaseModel):
    nome: str
    email: EmailStr
    cargo: str = ""
    perfil: str = "Usuário"
    departamento: str = ""
    status: str = "Ativo"


class UserCreate(UserBase):
    password: str = ""


class UserUpdate(UserBase):
    password: Optional[str] = None


class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_uuid)
    ultimoAcesso: str = ""


# ---------------- Auth ----------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    token: str
    user: User
