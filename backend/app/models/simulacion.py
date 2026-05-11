from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SqlEnum, Float, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Modality(str, Enum):
    contado = "contado"
    pesos_12 = "12_pesos"
    usd_12 = "12_usd"
    usd_36 = "36_usd"


class Currency(str, Enum):
    ars = "ARS"
    usd = "USD"


class SimulacionFinanciamiento(Base):
    __tablename__ = "simulaciones_financiamiento"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    cliente_id: Mapped[int | None] = mapped_column(ForeignKey("clientes.id"), nullable=True, index=True)
    lote_numero: Mapped[str | None] = mapped_column(ForeignKey("lotes.numero_lote"), nullable=True, index=True)
    modalidad: Mapped[Modality] = mapped_column(SqlEnum(Modality), nullable=False, index=True)
    moneda_base: Mapped[Currency] = mapped_column(SqlEnum(Currency), nullable=False, index=True)
    precio_lista: Mapped[float] = mapped_column(Float, nullable=False)
    entrega_inicial: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    monto_financiado: Mapped[float] = mapped_column(Float, nullable=False)
    cuotas: Mapped[int] = mapped_column(nullable=False)
    valor_cuota: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
