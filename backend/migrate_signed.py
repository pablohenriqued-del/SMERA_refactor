"""One-off migration: move any base64 signedDocFile (dataUrl) to object storage."""
import os
import re
import uuid
import base64
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv(Path(__file__).parent / ".env")

import storage_service  # noqa: E402

EXT_BY_MIME = {"application/pdf": "pdf", "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp"}


def main():
    client = MongoClient(os.environ["MONGO_URL"])
    db = client[os.environ["DB_NAME"]]
    storage_service.init_storage()

    cursor = db.rlm_processes.find({"signedDocFile.dataUrl": {"$exists": True, "$ne": ""}}, {"_id": 0})
    migrated, failed = 0, 0
    for p in cursor:
        sf = p.get("signedDocFile") or {}
        data_url = sf.get("dataUrl", "")
        m = re.match(r"data:([^;]+);base64,(.*)", data_url, re.DOTALL)
        if not m:
            continue
        ct, b64 = m.group(1), m.group(2)
        try:
            raw = base64.b64decode(b64)
            ext = EXT_BY_MIME.get(ct, "bin")
            path = f"smera/rlm/{p['id']}/{uuid.uuid4()}.{ext}"
            result = storage_service.put_object(path, raw, ct)
            db.rlm_processes.update_one(
                {"id": p["id"]},
                {"$set": {"signedDocFile": {"name": sf.get("name", f"documento.{ext}"), "path": result["path"], "contentType": ct, "size": result.get("size", len(raw))}}},
            )
            migrated += 1
            print(f"migrated {p['id']} -> {result['path']}")
        except Exception as e:  # noqa: BLE001
            failed += 1
            print(f"FAILED {p['id']}: {e}")

    print(f"Done. migrated={migrated} failed={failed}")


if __name__ == "__main__":
    main()
