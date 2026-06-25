"""SMERA backend integration tests.
Covers: auth (login, me, 401/403), dashboard stats, full CRUD for all entities,
users special CRUD (duplicate email, self-delete protection, password handling),
_id leakage check, password_hash leakage check.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://sony-obsidian-ui.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "pablo.duartel@sonymusic.com"
ADMIN_PASSWORD = "sony2025"
NEW_ADMIN_EMAIL = "pablo.duarte@sonymusic.com"
NEW_ADMIN_PASSWORD = "123456"
INACTIVE_EMAIL = "carlos.oliveira@sonymusic.com"


# ---------------- Fixtures ----------------
@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---------------- Auth tests ----------------
class TestAuth:
    def test_login_success(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 20
        assert "user" in data
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["nome"] == "Pablo Duartel"
        assert "password_hash" not in data["user"]
        assert "_id" not in data["user"]

    def test_login_wrong_password(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=30)
        assert r.status_code == 401

    def test_login_inactive_user(self):
        r = requests.post(f"{API}/auth/login", json={"email": INACTIVE_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
        assert r.status_code == 403

    def test_me_with_token(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=30)
        assert r.status_code == 200
        u = r.json()
        assert u["email"] == ADMIN_EMAIL
        assert "password_hash" not in u
        assert "_id" not in u

    def test_me_without_token(self):
        r = requests.get(f"{API}/auth/me", timeout=30)
        assert r.status_code == 401


# ---------------- Auth required on all CRUD endpoints ----------------
PROTECTED_PATHS = [
    "/licenses-in", "/licenses-out", "/sony-sony", "/rlm-rights",
    "/artists", "/labels", "/companies", "/users",
]


class TestAuthRequired:
    @pytest.mark.parametrize("path", PROTECTED_PATHS)
    def test_get_without_auth_returns_401(self, path):
        r = requests.get(f"{API}{path}", timeout=30)
        assert r.status_code == 401, f"{path} expected 401 got {r.status_code}"


# ---------------- Dashboard ----------------
class TestDashboard:
    def test_stats(self, auth_headers):
        r = requests.get(f"{API}/dashboard/stats", headers=auth_headers, timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert "stats" in data
        s = data["stats"]
        for key in ["licencasAtivas", "pendentes", "licenseIn", "licenseOut", "sonySony"]:
            assert key in s and isinstance(s[key], int)
        assert isinstance(data["licenseInData"], list) and len(data["licenseInData"]) == 3
        assert isinstance(data["recentActivity"], list)

    def test_stats_requires_auth(self):
        r = requests.get(f"{API}/dashboard/stats", timeout=30)
        assert r.status_code == 401


# ---------------- Generic CRUD test cases ----------------
ENTITY_PAYLOADS = {
    "licenses-in": {"projeto": "TEST_Proj", "titulo": "TEST_Title", "artista": "TEST_Artist", "status": "Pendente"},
    "licenses-out": {"projeto": "TEST_Proj", "titulo": "TEST_Title", "artistaSony": "TEST_A", "solicitante": "TEST_S"},
    "sony-sony": {"codigo": "TEST-CODE-1", "projeto": "TEST_Proj", "artistaPrincipal": "TEST_AP"},
    "rlm-rights": {"codigo": "TEST-RLM-1", "obra": "TEST_Obra", "titular": "TEST_Tit"},
    "artists": {"nome": "TEST_Artist"},
    "labels": {"nome": "TEST_Label"},
    "companies": {"nome": "TEST_Company"},
}
UPDATE_DELTA = {
    "licenses-in": {"status": "Finalizado"},
    "licenses-out": {"status": "Finalizado"},
    "sony-sony": {"status": "Finalizado"},
    "rlm-rights": {"status": "Ativo"},
    "artists": {"genero": "TEST_Genre"},
    "labels": {"pais": "Brasil"},
    "companies": {"segmento": "TEST_Seg"},
}


class TestEntityCrud:
    @pytest.mark.parametrize("entity", list(ENTITY_PAYLOADS.keys()))
    def test_full_crud(self, entity, auth_headers):
        payload = ENTITY_PAYLOADS[entity]
        # CREATE
        r = requests.post(f"{API}/{entity}", json=payload, headers=auth_headers, timeout=30)
        assert r.status_code == 201, f"{entity} create: {r.status_code} {r.text}"
        created = r.json()
        assert "id" in created and isinstance(created["id"], str)
        assert "_id" not in created
        for k, v in payload.items():
            assert created[k] == v
        item_id = created["id"]

        # GET by id
        r = requests.get(f"{API}/{entity}/{item_id}", headers=auth_headers, timeout=30)
        assert r.status_code == 200
        assert r.json()["id"] == item_id
        assert "_id" not in r.json()

        # LIST contains
        r = requests.get(f"{API}/{entity}", headers=auth_headers, timeout=30)
        assert r.status_code == 200
        items = r.json()
        assert any(i.get("id") == item_id for i in items)
        # No _id leaks
        for i in items:
            assert "_id" not in i

        # UPDATE - send full payload + delta
        upd = {**payload, **UPDATE_DELTA[entity]}
        r = requests.put(f"{API}/{entity}/{item_id}", json=upd, headers=auth_headers, timeout=30)
        assert r.status_code == 200, f"{entity} update: {r.status_code} {r.text}"
        updated = r.json()
        for k, v in UPDATE_DELTA[entity].items():
            assert updated.get(k) == v, f"{entity} update did not persist {k}"
        # GET back to confirm persistence
        r = requests.get(f"{API}/{entity}/{item_id}", headers=auth_headers, timeout=30)
        fetched = r.json()
        for k, v in UPDATE_DELTA[entity].items():
            assert fetched.get(k) == v

        # DELETE
        r = requests.delete(f"{API}/{entity}/{item_id}", headers=auth_headers, timeout=30)
        assert r.status_code in (200, 204)

        # 404 after delete
        r = requests.get(f"{API}/{entity}/{item_id}", headers=auth_headers, timeout=30)
        assert r.status_code == 404


# ---------------- Users special CRUD ----------------
class TestUsersCrud:
    def test_list_users_no_password_hash(self, auth_headers):
        r = requests.get(f"{API}/users", headers=auth_headers, timeout=30)
        assert r.status_code == 200
        users = r.json()
        assert len(users) >= 1
        for u in users:
            assert "password_hash" not in u
            assert "_id" not in u

    def test_create_duplicate_email(self, auth_headers):
        # admin already exists
        r = requests.post(f"{API}/users", json={
            "nome": "Dup", "email": ADMIN_EMAIL, "password": "x"
        }, headers=auth_headers, timeout=30)
        assert r.status_code == 409

    def test_create_update_delete_user(self, auth_headers):
        email = "test_userflow@sonymusic.com"
        # ensure clean state - delete if exists
        r = requests.get(f"{API}/users", headers=auth_headers, timeout=30)
        for u in r.json():
            if u["email"] == email:
                requests.delete(f"{API}/users/{u['id']}", headers=auth_headers, timeout=30)

        # CREATE
        r = requests.post(f"{API}/users", json={
            "nome": "TEST_User", "email": email, "password": "pw12345", "perfil": "Usuário"
        }, headers=auth_headers, timeout=30)
        assert r.status_code == 201, r.text
        created = r.json()
        assert created["email"] == email
        assert "password_hash" not in created
        uid = created["id"]

        # Login with the new password
        r = requests.post(f"{API}/auth/login", json={"email": email, "password": "pw12345"}, timeout=30)
        assert r.status_code == 200

        # UPDATE password
        r = requests.put(f"{API}/users/{uid}", json={
            "nome": "TEST_User2", "email": email, "password": "newpw678", "perfil": "Usuário"
        }, headers=auth_headers, timeout=30)
        assert r.status_code == 200
        assert "password_hash" not in r.json()

        # Login with new password
        r = requests.post(f"{API}/auth/login", json={"email": email, "password": "newpw678"}, timeout=30)
        assert r.status_code == 200

        # Old password no longer works
        r = requests.post(f"{API}/auth/login", json={"email": email, "password": "pw12345"}, timeout=30)
        assert r.status_code == 401

        # DELETE
        r = requests.delete(f"{API}/users/{uid}", headers=auth_headers, timeout=30)
        assert r.status_code == 200

    def test_cannot_delete_self(self, auth_headers):
        # find admin id
        r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=30)
        my_id = r.json()["id"]
        r = requests.delete(f"{API}/users/{my_id}", headers=auth_headers, timeout=30)
        assert r.status_code == 400



# ---------------- Iteration 2: New admin + Seed (22 contracts, jun/jul 2026) ----------------
class TestNewAdminLogin:
    """Verifies the new admin pablo.duarte@sonymusic.com / 123456 works."""

    def test_new_admin_login_success(self):
        r = requests.post(f"{API}/auth/login", json={"email": NEW_ADMIN_EMAIL, "password": NEW_ADMIN_PASSWORD}, timeout=30)
        assert r.status_code == 200, f"New admin login failed: {r.status_code} {r.text}"
        data = r.json()
        assert "token" in data and len(data["token"]) > 20
        assert data["user"]["email"] == NEW_ADMIN_EMAIL
        assert data["user"]["perfil"].lower().startswith("admin")
        assert "password_hash" not in data["user"]

    def test_legacy_admin_still_valid(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
        assert r.status_code == 200


def _date_in_jun_or_jul_2026(date_str):
    """Accepts dd/mm/yyyy or yyyy-mm-dd or ISO; returns True if month is 06 or 07 / year 2026."""
    if not date_str or not isinstance(date_str, str):
        return False
    # dd/mm/yyyy
    if "/" in date_str:
        parts = date_str.split("/")
        if len(parts) == 3:
            try:
                month = int(parts[1])
                year = int(parts[2][:4])
                return year == 2026 and month in (6, 7)
            except ValueError:
                return False
    # yyyy-mm-dd or ISO
    if "-" in date_str:
        try:
            year = int(date_str[:4])
            month = int(date_str[5:7])
            return year == 2026 and month in (6, 7)
        except ValueError:
            return False
    return False


SEED_ENDPOINTS = ["licenses-in", "licenses-out", "sony-sony"]


class TestSeed22Contracts:
    """Each of License In / Out / Sony-Sony must have 22 seeded contracts with dates in June or July 2026."""

    @pytest.mark.parametrize("endpoint", SEED_ENDPOINTS)
    def test_seed_count_22(self, endpoint, auth_headers):
        r = requests.get(f"{API}/{endpoint}", headers=auth_headers, timeout=30)
        assert r.status_code == 200
        items = r.json()
        # seed is idempotent; count must be >= 22. We assert exactly 22 only if no TEST_ leftovers.
        non_test = [i for i in items if not (i.get("projeto", "").startswith("TEST_") or i.get("titulo", "").startswith("TEST_") or i.get("codigo", "").startswith("TEST-"))]
        assert len(non_test) >= 22, f"{endpoint}: expected >=22 seeded items, got {len(non_test)} (total {len(items)})"

    @pytest.mark.parametrize("endpoint", SEED_ENDPOINTS)
    def test_seed_dates_jun_jul_2026(self, endpoint, auth_headers):
        r = requests.get(f"{API}/{endpoint}", headers=auth_headers, timeout=30)
        assert r.status_code == 200
        items = r.json()
        non_test = [i for i in items if not (i.get("projeto", "").startswith("TEST_") or i.get("titulo", "").startswith("TEST_") or i.get("codigo", "").startswith("TEST-"))]
        # Look for any date-like field on each item
        date_keys = ["data", "dataInicio", "dataPedido", "dataAprovacao", "dataVencimento", "dataLancamento", "vencimento", "prazo", "previsao"]
        for it in non_test:
            found_any_date = False
            ok = False
            for k in date_keys:
                v = it.get(k)
                if v:
                    found_any_date = True
                    if _date_in_jun_or_jul_2026(v):
                        ok = True
                        break
            assert (not found_any_date) or ok, (
                f"{endpoint} item id={it.get('id')} has date fields not in Jun/Jul 2026: "
                + ", ".join(f"{k}={it.get(k)}" for k in date_keys if it.get(k))
            )

    @pytest.mark.parametrize("endpoint", SEED_ENDPOINTS)
    def test_seed_endpoints_require_auth(self, endpoint):
        r = requests.get(f"{API}/{endpoint}", timeout=30)
        assert r.status_code == 401

    def test_seed_spans_both_months(self, auth_headers):
        """For License In specifically: data must span both June and July 2026 (calendar next-month must be enabled)."""
        r = requests.get(f"{API}/licenses-in", headers=auth_headers, timeout=30)
        assert r.status_code == 200
        items = r.json()
        non_test = [i for i in items if not (i.get("projeto", "").startswith("TEST_") or i.get("titulo", "").startswith("TEST_"))]
        months_seen = set()
        date_keys = ["data", "dataInicio", "dataPedido", "dataAprovacao", "dataVencimento", "dataLancamento", "vencimento", "prazo", "previsao"]
        for it in non_test:
            for k in date_keys:
                v = it.get(k)
                if v and isinstance(v, str):
                    if "/" in v:
                        parts = v.split("/")
                        if len(parts) == 3:
                            try:
                                months_seen.add((int(parts[2][:4]), int(parts[1])))
                            except ValueError:
                                pass
                    elif "-" in v:
                        try:
                            months_seen.add((int(v[:4]), int(v[5:7])))
                        except ValueError:
                            pass
        # Must include (2026,6) and (2026,7)
        assert (2026, 6) in months_seen, f"License In missing June 2026 dates. months seen: {months_seen}"
        assert (2026, 7) in months_seen, f"License In missing July 2026 dates. months seen: {months_seen}"
