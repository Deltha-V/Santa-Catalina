from datetime import datetime

from pydantic import BaseModel, Field

from app.models.simulacion import Currency, Modality


class SimulacionCreate(BaseModel):
    cliente_id: int | None = None
    lote_numero: str | None = None
    modalidad: Modality
    moneda_base: Currency
    precio_lista: float = Field(gt=0)
    entrega_inicial: float = Field(ge=0)
    monto_financiado: float = Field(ge=0)
    cuotas: int = Field(gt=0)
    valor_cuota: float = Field(ge=0)


class SimulacionRead(SimulacionCreate):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class DashboardTotals(BaseModel):
    total_simulaciones: int
    monto_promedio_financiado: float


class DashboardByModality(BaseModel):
    modalidad: Modality
    cantidad: int


class DashboardByCurrency(BaseModel):
    moneda_base: Currency
    cantidad: int


class DashboardStats(BaseModel):
    totals: DashboardTotals
    por_modalidad: list[DashboardByModality]
    por_moneda: list[DashboardByCurrency]
