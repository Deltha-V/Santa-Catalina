from pathlib import Path
from tempfile import NamedTemporaryFile
import os

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from openpyxl import load_workbook
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.lote import EstadoLote, Lote
from app.schemas.lote import LoteCreate, LoteRead

router = APIRouter(prefix="/lotes", tags=["lotes"])


def _to_estado(raw: str):
    value = raw.strip().lower()
    if "disponible" == value:
        return EstadoLote.disponible
    if "vendido" in value:
        return EstadoLote.vendido
    if "reservado" in value:
        return EstadoLote.reservado
    if "acuerdos privados" in value or "fideicomiso" in value:
        return EstadoLote.acuerdo_privado
    if "no disponible" in value:
        return EstadoLote.no_disponible
    return EstadoLote.no_disponible


def _to_bool_comercializable(raw: str):
    value = raw.strip().lower()
    if "no comercializable" in value:
        return False
    return True


def _parse_medidas(raw: str):
    cleaned = raw.lower().replace(" ", "")
    if "x" not in cleaned:
        raise ValueError("Formato de medidas invalido")
    frente_raw, fondo_raw = cleaned.split("x", 1)
    frente = float(frente_raw.replace(",", "."))
    fondo = float(fondo_raw.replace(",", "."))
    return frente, fondo, frente * fondo


@router.get("", response_model=list[LoteRead])
def list_lotes(db: Session = Depends(get_db)):
    return db.scalars(select(Lote).order_by(Lote.numero_lote.asc())).all()


@router.post("", response_model=LoteRead, status_code=status.HTTP_201_CREATED)
def create_lote(payload: LoteCreate, db: Session = Depends(get_db)):
    exists = db.get(Lote, payload.numero_lote)
    if exists:
        raise HTTPException(status_code=400, detail="El numero de lote ya existe")

    lote = Lote(**payload.model_dump())
    db.add(lote)
    db.commit()
    db.refresh(lote)
    return lote


@router.post("/{numero_lote}/plano", response_model=LoteRead)
def upload_plano(numero_lote: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    lote = db.get(Lote, numero_lote)
    if not lote:
        raise HTTPException(status_code=404, detail="Lote no encontrado")

    ext = Path(file.filename or "").suffix.lower()
    if ext not in {".png", ".jpg", ".jpeg", ".webp"}:
        raise HTTPException(status_code=400, detail="Formato de imagen no soportado")

    target_dir = Path(settings.uploads_dir)
    target_dir.mkdir(parents=True, exist_ok=True)
    safe_name = f"{numero_lote}{ext}"
    target = target_dir / safe_name

    with target.open("wb") as out:
        out.write(file.file.read())

    lote.plano_imagen_url = f"/uploads/{safe_name}"
    db.commit()
    db.refresh(lote)
    return lote


@router.post("/import-excel")
def import_lotes_from_excel(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename or not file.filename.lower().endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Sube un archivo .xlsx")

    inserted = 0
    updated = 0
    skipped = 0
    errors: list[str] = []

    with NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name

    wb = load_workbook(tmp_path, data_only=True)
    try:
        for ws in wb.worksheets:
            if not ws.title.upper().startswith("MZ"):
                continue

            manzana = ws.title.replace("MZ", "").strip()
            for row in ws.iter_rows(min_row=2, max_col=13, values_only=True):
                lote_name = row[10] if len(row) > 10 else None  # col K
                medidas = row[11] if len(row) > 11 else None  # col L
                disponibilidad = row[12] if len(row) > 12 else None  # col M

                if not lote_name or not medidas or not disponibilidad:
                    continue
                if not str(lote_name).strip().upper().startswith("LOTE"):
                    skipped += 1
                    continue

                try:
                    lote_num = str(lote_name).strip().upper().replace("LOTE", "").strip()
                    frente_m, fondo_m, area_m2 = _parse_medidas(str(medidas))
                    estado = _to_estado(str(disponibilidad))
                    comercializable = _to_bool_comercializable(str(disponibilidad))
                    numero_lote = f"MZ{manzana}-L{lote_num}"
                except Exception as exc:
                    errors.append(f"{ws.title} {lote_name}: {str(exc)}")
                    skipped += 1
                    continue

                current = db.get(Lote, numero_lote)
                if current:
                    current.manzana = manzana
                    current.estado = estado
                    current.comercializable = comercializable
                    current.frente_m = frente_m
                    current.fondo_m = fondo_m
                    current.area_m2 = area_m2
                    updated += 1
                else:
                    db.add(
                        Lote(
                            numero_lote=numero_lote,
                            manzana=manzana,
                            estado=estado,
                            comercializable=comercializable,
                            frente_m=frente_m,
                            fondo_m=fondo_m,
                            area_m2=area_m2,
                        )
                    )
                    inserted += 1

        db.commit()
    finally:
        wb.close()
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

    return {
        "inserted": inserted,
        "updated": updated,
        "skipped": skipped,
        "errors_preview": errors[:15],
    }
