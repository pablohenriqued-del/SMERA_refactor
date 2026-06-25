import os
import uuid
from datetime import datetime, timezone

from db import db
from auth import hash_password, verify_password


def _id():
    return str(uuid.uuid4())


def _future_date(i):
    """Spread dates across June + July 2026 (stride to cover both months), deterministic."""
    total = (i * 3) % 61  # 0..60 spread across the 61 days of Jun+Jul
    if total < 30:
        return f"{total + 1:02d}/06/2026"
    return f"{total - 30 + 1:02d}/07/2026"


_STATUS = ["Finalizado", "Em Análise", "Pendente"]
_MEIOS = ["Físico e Digital", "Digital", "Físico"]

_ARTISTAS = [
    "Pabllo Vittar", "Pedro Sampaio", "Anitta", "Marília Mendonça", "MC Hariel",
    "Luísa Sonza", "Jão", "Ludmilla", "MC Luuky", "Gloria Groove",
    "Xamã", "Pocah", "Dilsinho", "Iza", "Vintage Culture",
    "Alok", "Manu Gavassi", "Mc Don Juan", "Tom Veloso", "Lagum",
    "Jorge & Mateus", "Maiara & Maraisa",
]
_CONVIDADOS = [
    "Will Love", "EPX", "MC Meno K", "Ludmilla", "Kevin O Chris", "Henrique & Juliano",
    "Wesley Safadão", "DJ GBR", "Tropkillaz", "Gaab", "Major Lazer", "Felipe Amorim",
    "MC Ryan SP", "Veigh", "Matuê", "Filipe Ret", "Orochi", "Hungria",
    "DJ Marsha", "Murda Beatz", "Liu", "Oruam",
]
_TITULOS_IN = [
    "Rubi", "Culpa do Cupido", "JETSKI", "Romance Proibido", "Beat Pesado", "Coração Partido",
    "Verão Tropical", "Noite de Festa", "Amor de Verdade", "Sem Limites", "Brilho da Lua",
    "Dança Comigo", "Vai com Tudo", "Tarde Demais", "Sol Nascente", "Madrugada Quente",
    "Pra Sempre", "Liberdade", "Onda Boa", "Recomeço", "Vibração", "Saudade",
]
_FORMATOS = ["Participação Especial", "Sampleamento", "Cover", "Trilha Sonora"]

_SOLICITANTES = [
    "Netflix Brasil", "Coca-Cola Brasil", "Gameloft", "Amazon Prime", "Globo",
    "Spotify Studios", "Heineken", "Nike Brasil", "Itaú", "Magazine Luiza",
    "O Boticário", "Ambev", "Disney+", "TikTok", "Mercado Livre",
    "Riot Games", "Electronic Arts", "Burger King", "Natura", "C&A",
    "Vivo", "Claro",
]
_TIPOS_OUT = ["Remix", "Participação Especial", "Streaming", "Publicidade", "Games"]

_SELOS = ["Columbia Records", "RCA Records", "Epic Records", "Legacy Recordings", "Sony Music Latin"]
_TIPOS_SONY = ["Single", "EP", "Album Completo", "Live Album", "Compilation"]
_PROJ_SONY = [
    "Album Collaboration", "Crossover EP", "Remix Collection", "Acoustic Sessions", "Summer Hits",
    "Winter Tour", "Studio Live", "Deluxe Edition", "Unplugged", "Future Beats",
    "Latin Fusion", "Urban Nights", "Pop Explosion", "Funk Universe", "Sertanejo Raiz",
    "Trap Brasil", "Eletrônica BR", "MPB Sessions", "Festival Mix", "Coletânea Verão",
    "Hits 2026", "Encontros",
]


def _build_licenses_in(n=22):
    rows = []
    for i in range(n):
        rows.append({
            "projeto": f"{_TITULOS_IN[i % len(_TITULOS_IN)]} - Projeto {i + 1:02d}",
            "titulo": _TITULOS_IN[i % len(_TITULOS_IN)],
            "artista": _ARTISTAS[i % len(_ARTISTAS)],
            "artistasConvidados": _CONVIDADOS[i % len(_CONVIDADOS)],
            "proRata": "Sim" if i % 3 == 0 else "Não",
            "previsao": _future_date(i),
            "formato": _FORMATOS[i % len(_FORMATOS)],
            "meios": _MEIOS[i % len(_MEIOS)],
            "status": _STATUS[i % len(_STATUS)],
        })
    return rows


def _build_licenses_out(n=22):
    rows = []
    for i in range(n):
        solicitante = _SOLICITANTES[i % len(_SOLICITANTES)]
        rows.append({
            "projeto": f"Licenciamento {solicitante} #{i + 1:02d}",
            "titulo": _TITULOS_IN[(i + 5) % len(_TITULOS_IN)],
            "artistaSony": _ARTISTAS[(i + 3) % len(_ARTISTAS)],
            "solicitante": solicitante,
            "tipo": _TIPOS_OUT[i % len(_TIPOS_OUT)],
            "prazo": _future_date(i + 7),
            "status": _STATUS[i % len(_STATUS)],
        })
    return rows


def _build_sony_sony(n=22):
    rows = []
    for i in range(n):
        rows.append({
            "codigo": f"SONY-2026-{i + 1:03d}",
            "projeto": _PROJ_SONY[i % len(_PROJ_SONY)],
            "artistaPrincipal": _ARTISTAS[i % len(_ARTISTAS)],
            "artistaConvidado": _ARTISTAS[(i + 7) % len(_ARTISTAS)],
            "selo": _SELOS[i % len(_SELOS)],
            "tipo": _TIPOS_SONY[i % len(_TIPOS_SONY)],
            "lancamento": _future_date(i + 14),
            "status": _STATUS[i % len(_STATUS)],
        })
    return rows


LICENSES_IN = _build_licenses_in()
LICENSES_OUT = _build_licenses_out()
SONY_SONY = _build_sony_sony()

RLM_RIGHTS = [
    {"codigo": "RLM-2025-001", "obra": "Summer Vibes", "titular": "Sony Music Publishing", "tipo": "Master", "territorio": "Global", "vencimento": "15/06/2027", "status": "Ativo", "valor": "R$ 500.000"},
    {"codigo": "RLM-2025-002", "obra": "Nocturne Dreams", "titular": "Warner Chappell", "tipo": "Publishing", "territorio": "Américas", "vencimento": "20/03/2026", "status": "Ativo", "valor": "R$ 350.000"},
    {"codigo": "RLM-2025-003", "obra": "Electric Pulse", "titular": "Universal Music", "tipo": "Sync", "territorio": "Europa", "vencimento": "10/12/2025", "status": "Em Renovação", "valor": "R$ 280.000"},
    {"codigo": "RLM-2025-004", "obra": "Urban Legends", "titular": "Sony Music", "tipo": "Master", "territorio": "Brasil", "vencimento": "05/08/2025", "status": "Próximo a Vencer", "valor": "R$ 420.000"},
    {"codigo": "RLM-2025-005", "obra": "Acoustic Sessions", "titular": "Independent Rights", "tipo": "Performance", "territorio": "Ásia", "vencimento": "30/11/2028", "status": "Ativo", "valor": "R$ 180.000"},
]

ARTISTS = [
    {"nome": "Pabllo Vittar", "gravadora": "Sony Music", "genero": "Pop/Funk", "pais": "Brasil", "status": "Ativo", "email": "pabllo@sony.com", "telefone": "+55 11 98765-0001"},
    {"nome": "Pedro Sampaio", "gravadora": "Sony Music", "genero": "Funk", "pais": "Brasil", "status": "Ativo", "email": "pedro@sony.com", "telefone": "+55 11 98765-0002"},
    {"nome": "Anitta", "gravadora": "Sony Music", "genero": "Pop/Funk", "pais": "Brasil", "status": "Ativo", "email": "anitta@sony.com", "telefone": "+55 11 98765-0003"},
    {"nome": "Marília Mendonça", "gravadora": "Sony Music", "genero": "Sertanejo", "pais": "Brasil", "status": "Ativo", "email": "marilia@sony.com", "telefone": "+55 11 98765-0004"},
    {"nome": "MC Hariel", "gravadora": "Sony Music", "genero": "Funk", "pais": "Brasil", "status": "Ativo", "email": "hariel@sony.com", "telefone": "+55 11 98765-0005"},
]

LABELS = [
    {"nome": "Sony Music Entertainment", "pais": "Brasil", "tipo": "Major", "contato": "contato@sonymusic.com", "telefone": "+55 11 3333-0001", "status": "Ativo"},
    {"nome": "Universal Music", "pais": "Brasil", "tipo": "Major", "contato": "info@universal.com", "telefone": "+55 11 3333-0002", "status": "Ativo"},
    {"nome": "Warner Music", "pais": "EUA", "tipo": "Major", "contato": "contact@warner.com", "telefone": "+1 555 0001", "status": "Ativo"},
]

COMPANIES = [
    {"nome": "Nike Inc.", "segmento": "Esportes", "pais": "EUA", "contato": "licensing@nike.com", "telefone": "+1 555 1000", "status": "Ativo"},
    {"nome": "Netflix", "segmento": "Entretenimento", "pais": "EUA", "contato": "music@netflix.com", "telefone": "+1 555 2000", "status": "Ativo"},
    {"nome": "EA Games", "segmento": "Games", "pais": "EUA", "contato": "soundtrack@ea.com", "telefone": "+1 555 4000", "status": "Ativo"},
]

# users WITHOUT admin; admin is created from env separately
USERS = [
    {"nome": "Maria Silva", "email": "maria.silva@sonymusic.com", "cargo": "Analista de Direitos", "perfil": "Gestor", "departamento": "RLM", "ultimoAcesso": "12/11/2025 10:15", "status": "Ativo"},
    {"nome": "João Santos", "email": "joao.santos@sonymusic.com", "cargo": "Coordenador", "perfil": "Gestor", "departamento": "License In", "ultimoAcesso": "11/11/2025 16:45", "status": "Ativo"},
    {"nome": "Ana Costa", "email": "ana.costa@sonymusic.com", "cargo": "Assistente", "perfil": "Usuário", "departamento": "License Out", "ultimoAcesso": "10/11/2025 09:20", "status": "Ativo"},
    {"nome": "Carlos Oliveira", "email": "carlos.oliveira@sonymusic.com", "cargo": "Consultor", "perfil": "Usuário", "departamento": "Cadastros", "ultimoAcesso": "05/11/2025 14:00", "status": "Inativo"},
]


async def _seed_collection(name: str, rows: list):
    coll = db[name]
    if await coll.count_documents({}) == 0:
        docs = [{**row, "id": _id()} for row in rows]
        await coll.insert_many(docs)


async def seed_users():
    """Idempotent admin + demo user seeding with hashed passwords."""
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    default_password = os.environ.get("DEFAULT_USER_PASSWORD", "sony2025")

    admin = await db.users.find_one({"email": admin_email})
    if admin is None:
        await db.users.insert_one({
            "id": _id(),
            "nome": "Pablo Duartel",
            "email": admin_email,
            "cargo": "Gerente de Licenciamento",
            "perfil": "Administrador",
            "departamento": "Sony Music Entertainment",
            "ultimoAcesso": "12/11/2025 14:30",
            "status": "Ativo",
            "password_hash": hash_password(admin_password),
        })
    elif not verify_password(admin_password, admin.get("password_hash", "")):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})

    for row in USERS:
        existing = await db.users.find_one({"email": row["email"].lower()})
        if existing is None:
            await db.users.insert_one({
                **row,
                "email": row["email"].lower(),
                "id": _id(),
                "password_hash": hash_password(default_password),
            })


async def seed_all():
    await _seed_collection("licenses_in", LICENSES_IN)
    await _seed_collection("licenses_out", LICENSES_OUT)
    await _seed_collection("sony_sony", SONY_SONY)
    await _seed_collection("rlm_rights", RLM_RIGHTS)
    await _seed_collection("artists", ARTISTS)
    await _seed_collection("labels", LABELS)
    await _seed_collection("companies", COMPANIES)
    await seed_users()
    await db.users.create_index("email", unique=True)
