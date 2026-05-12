from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class LoteImagen(Base):
    __tablename__ = "lote_imagenes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lote_numero: Mapped[str] = mapped_column(
        String(50),
        ForeignKey("lotes.numero_lote", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)
    orden: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
