from enum import Enum

from sqlalchemy import Boolean, Enum as SqlEnum, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class EstadoLote(str, Enum):
    disponible = "disponible"
    vendido = "vendido"
    reservado = "reservado"
    no_disponible = "no_disponible"
    acuerdo_privado = "acuerdo_privado"


class Lote(Base):
    __tablename__ = "lotes"

    numero_lote: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    manzana: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    estado: Mapped[EstadoLote] = mapped_column(SqlEnum(EstadoLote), nullable=False, default=EstadoLote.disponible)
    comercializable: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    frente_m: Mapped[float] = mapped_column(Float, nullable=False)
    fondo_m: Mapped[float] = mapped_column(Float, nullable=False)
    area_m2: Mapped[float] = mapped_column(Float, nullable=False)
    plano_imagen_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
