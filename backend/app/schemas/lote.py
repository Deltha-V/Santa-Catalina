from enum import Enum

from pydantic import BaseModel, Field


class EstadoLote(str, Enum):
    disponible = "disponible"
    vendido = "vendido"
    reservado = "reservado"
    no_disponible = "no_disponible"
    acuerdo_privado = "acuerdo_privado"


class LoteBase(BaseModel):
    manzana: str = Field(min_length=1, max_length=100)
    estado: EstadoLote
    comercializable: bool = True
    frente_m: float = Field(gt=0)
    fondo_m: float = Field(gt=0)
    area_m2: float = Field(gt=0)


class LoteCreate(LoteBase):
    numero_lote: str = Field(min_length=1, max_length=50)


class LoteUpdate(LoteBase):
    pass


class LoteRead(LoteBase):
    numero_lote: str
    plano_imagen_url: str | None = None

    model_config = {"from_attributes": True}
