from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.cliente import Cliente
from app.schemas.cliente import ClienteCreate, ClienteRead

router = APIRouter(prefix="/clientes", tags=["clientes"])


@router.get("", response_model=list[ClienteRead])
def list_clientes(db: Session = Depends(get_db)):
    return db.scalars(select(Cliente).order_by(Cliente.id.desc())).all()


@router.post("", response_model=ClienteRead, status_code=status.HTTP_201_CREATED)
def create_cliente(payload: ClienteCreate, db: Session = Depends(get_db)):
    exists = db.scalar(select(Cliente).where(Cliente.email == payload.email))
    if exists:
        raise HTTPException(status_code=400, detail="El email ya existe")

    cliente = Cliente(email=payload.email)
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return cliente
