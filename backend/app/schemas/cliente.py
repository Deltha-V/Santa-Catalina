from pydantic import BaseModel, EmailStr


class ClienteCreate(BaseModel):
    email: EmailStr


class ClienteRead(BaseModel):
    id: int
    email: EmailStr

    model_config = {"from_attributes": True}
