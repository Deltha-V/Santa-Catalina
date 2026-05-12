from pydantic import BaseModel, Field


class LoteImagenRead(BaseModel):
    id: int
    lote_numero: str
    image_url: str
    orden: int

    model_config = {"from_attributes": True}


class LoteImagenOrderUpdate(BaseModel):
    image_ids: list[int] = Field(min_length=1)
