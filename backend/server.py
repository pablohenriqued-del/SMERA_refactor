import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

from db import client
from crud import make_crud_router
from routes import auth_router, dashboard_router, users_router
from rlm import router as rlm_router, misc_router as rlm_misc_router, seed_rlm
from seed_data import seed_all
import models as m

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await seed_all()
    await seed_rlm()
    logger.info("Database seeded")
    yield
    client.close()


app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"message": "SMERA API", "status": "ok"}


# Auth & dashboard
api_router.include_router(auth_router)
api_router.include_router(dashboard_router)
api_router.include_router(users_router)
api_router.include_router(rlm_router)
api_router.include_router(rlm_misc_router)

# Generic CRUD routers
api_router.include_router(make_crud_router(path="/licenses-in", collection="licenses_in", create_model=m.LicenseInCreate, full_model=m.LicenseIn))
api_router.include_router(make_crud_router(path="/licenses-out", collection="licenses_out", create_model=m.LicenseOutCreate, full_model=m.LicenseOut))
api_router.include_router(make_crud_router(path="/licenses-d2c", collection="licenses_d2c", create_model=m.LicenseD2CCreate, full_model=m.LicenseD2C))
api_router.include_router(make_crud_router(path="/sony-sony", collection="sony_sony", create_model=m.SonySonyCreate, full_model=m.SonySony))
api_router.include_router(make_crud_router(path="/rlm-rights", collection="rlm_rights", create_model=m.RLMRightCreate, full_model=m.RLMRight))
api_router.include_router(make_crud_router(path="/artists", collection="artists", create_model=m.ArtistCreate, full_model=m.Artist))
api_router.include_router(make_crud_router(path="/labels", collection="labels", create_model=m.LabelCreate, full_model=m.Label))
api_router.include_router(make_crud_router(path="/companies", collection="companies", create_model=m.CompanyCreate, full_model=m.Company))

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
