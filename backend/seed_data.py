import os
import uuid
from datetime import datetime, timezone

from db import db
from auth import hash_password, verify_password


def _id():
    return str(uuid.uuid4())


LICENSES_IN = [
    {"projeto": "Batidão Tropical 2", "titulo": "Rubi", "artista": "Pabllo Vittar", "artistasConvidados": "Will Love", "proRata": "Não", "previsao": "15/11/2024", "formato": "Participação Especial", "meios": "Físico e Digital", "status": "Finalizado"},
    {"projeto": "AFTER", "titulo": "Culpa do Cupido", "artista": "Pabllo Vittar", "artistasConvidados": "EPX", "proRata": "Não", "previsao": "20/11/2024", "formato": "Participação Especial", "meios": "Físico e Digital", "status": "Finalizado"},
    {"projeto": "JETSKI", "titulo": "JETSKI", "artista": "Pedro Sampaio", "artistasConvidados": "MC Meno K", "proRata": "Não", "previsao": "18/12/2025", "formato": "Participação Especial", "meios": "Físico e Digital", "status": "Pendente"},
    {"projeto": "Noite Perfeita", "titulo": "Romance Proibido", "artista": "Anitta", "artistasConvidados": "Ludmilla", "proRata": "Sim", "previsao": "15/01/2026", "formato": "Participação Especial", "meios": "Físico e Digital", "status": "Em Análise"},
    {"projeto": "Funk Remix", "titulo": "Beat Pesado", "artista": "MC Hariel", "artistasConvidados": "Kevin O Chris", "proRata": "Não", "previsao": "20/12/2024", "formato": "Participação Especial", "meios": "Digital", "status": "Pendente"},
    {"projeto": "Sertanejo Top", "titulo": "Coração Partido", "artista": "Marília Mendonça", "artistasConvidados": "Henrique & Juliano", "proRata": "Sim", "previsao": "10/12/2024", "formato": "Participação Especial", "meios": "Físico e Digital", "status": "Finalizado"},
]

LICENSES_OUT = [
    {"projeto": "Novo Licenciamento - CAROLINA APARECIDA RIBEIRO", "titulo": "Pedido a Padre Cícero", "artistaSony": "Ary Lobo", "solicitante": "Carolina Aparecida Ribeiro", "tipo": "Remix", "prazo": "15/12/2024", "status": "Em Análise"},
    {"projeto": "Novo Licenciamento - Vitor Hugo Souza Silva", "titulo": "Breca Não", "artistaSony": "MC Luuky", "solicitante": "Vitor Hugo Souza Silva", "tipo": "Participação Especial", "prazo": "20/12/2024", "status": "Em Análise"},
    {"projeto": "Novo Licenciamento - Leila Ouchi de Oliveira", "titulo": "Academia Privada", "artistaSony": "MC Luuky", "solicitante": "Leila Ouchi de Oliveira", "tipo": "Participação Especial", "prazo": "10/11/2024", "status": "Em Análise"},
    {"projeto": "Licenciamento Netflix - Série Original", "titulo": "Funk Pesado", "artistaSony": "Pedro Sampaio", "solicitante": "Netflix Brasil", "tipo": "Streaming", "prazo": "05/12/2024", "status": "Finalizado"},
    {"projeto": "Publicidade Coca-Cola", "titulo": "JETSKI", "artistaSony": "Pedro Sampaio", "solicitante": "Coca-Cola Brasil", "tipo": "Publicidade", "prazo": "25/11/2024", "status": "Finalizado"},
    {"projeto": "Game Mobile - Soundtrack", "titulo": "Rubi", "artistaSony": "Pabllo Vittar", "solicitante": "Gameloft", "tipo": "Games", "prazo": "30/01/2025", "status": "Pendente"},
]

SONY_SONY = [
    {"codigo": "SONY-2025-001", "projeto": "Album Collaboration", "artistaPrincipal": "John Artist", "artistaConvidado": "Featured Star", "selo": "Columbia Records", "tipo": "Album Completo", "lancamento": "15/12/2024", "status": "Finalizado"},
    {"codigo": "SONY-2025-002", "projeto": "Crossover EP", "artistaPrincipal": "Pop Sensation", "artistaConvidado": "Urban Legend", "selo": "RCA Records", "tipo": "EP", "lancamento": "20/11/2024", "status": "Em Análise"},
    {"codigo": "SONY-2025-003", "projeto": "Remix Collection", "artistaPrincipal": "Electronic Duo", "artistaConvidado": "DJ Producer", "selo": "Epic Records", "tipo": "Single", "lancamento": "10/12/2024", "status": "Pendente"},
    {"codigo": "SONY-2025-004", "projeto": "Acoustic Sessions", "artistaPrincipal": "Singer Songwriter", "artistaConvidado": "Classical Artist", "selo": "Legacy Recordings", "tipo": "Live Album", "lancamento": "25/01/2025", "status": "Pendente"},
    {"codigo": "SONY-2025-005", "projeto": "Summer Hits", "artistaPrincipal": "Pop Group", "artistaConvidado": "Tropical Band", "selo": "Sony Music Latin", "tipo": "Compilation", "lancamento": "01/12/2024", "status": "Finalizado"},
]

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
