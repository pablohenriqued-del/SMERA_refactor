from typing import Type
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from db import db
from auth import get_current_user


def make_crud_router(
    *,
    path: str,
    collection: str,
    create_model: Type[BaseModel],
    full_model: Type[BaseModel],
) -> APIRouter:
    """Generic CRUD router for a MongoDB collection using uuid string ids."""
    router = APIRouter(prefix=path, tags=[collection], dependencies=[Depends(get_current_user)])
    coll = db[collection]

    @router.get("", response_model=list[full_model])
    async def list_items():
        items = await coll.find({}, {"_id": 0}).to_list(2000)
        return items

    @router.get("/{item_id}", response_model=full_model)
    async def get_item(item_id: str):
        item = await coll.find_one({"id": item_id}, {"_id": 0})
        if not item:
            raise HTTPException(status_code=404, detail="Registro não encontrado")
        return item

    @router.post("", response_model=full_model, status_code=201)
    async def create_item(payload: create_model):  # type: ignore
        obj = full_model(**payload.model_dump())
        doc = obj.model_dump()
        await coll.insert_one(dict(doc))
        return obj

    @router.put("/{item_id}", response_model=full_model)
    async def update_item(item_id: str, payload: create_model):  # type: ignore
        existing = await coll.find_one({"id": item_id}, {"_id": 0})
        if not existing:
            raise HTTPException(status_code=404, detail="Registro não encontrado")
        updated = {**existing, **payload.model_dump()}
        updated["id"] = item_id
        await coll.update_one({"id": item_id}, {"$set": payload.model_dump()})
        return full_model(**updated)

    @router.delete("/{item_id}")
    async def delete_item(item_id: str):
        result = await coll.delete_one({"id": item_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Registro não encontrado")
        return {"success": True, "id": item_id}

    return router
