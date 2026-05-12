from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import auth, clientes, lotes, simulaciones
from app.core.config import settings
from app.models import *  # noqa: F403,F401

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clientes.router)
app.include_router(lotes.router)
app.include_router(simulaciones.router)
app.include_router(auth.router)
app.mount("/uploads", StaticFiles(directory=settings.uploads_dir), name="uploads")


@app.get("/health")
def health():
    return {"status": "ok"}
