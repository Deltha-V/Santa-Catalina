from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.cliente import Cliente
from app.models.lote import Lote
from app.models.simulacion import SimulacionFinanciamiento
from app.schemas.simulacion import (
    DashboardByCurrency,
    DashboardByModality,
    DashboardStats,
    DashboardTotals,
    SimulacionCreate,
    SimulacionRead,
)

router = APIRouter(prefix="/simulaciones", tags=["simulaciones"])


@router.post("", response_model=SimulacionRead, status_code=status.HTTP_201_CREATED)
def create_simulacion(payload: SimulacionCreate, db: Session = Depends(get_db)):
    if payload.cliente_id is not None and db.get(Cliente, payload.cliente_id) is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    if payload.lote_numero is not None and db.get(Lote, payload.lote_numero) is None:
        raise HTTPException(status_code=404, detail="Lote no encontrado")

    simulacion = SimulacionFinanciamiento(**payload.model_dump())
    db.add(simulacion)
    db.commit()
    db.refresh(simulacion)
    return simulacion


@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    totals_row = db.execute(
        select(
            func.count(SimulacionFinanciamiento.id),
            func.coalesce(func.avg(SimulacionFinanciamiento.monto_financiado), 0),
        )
    ).one()

    by_modality_rows = db.execute(
        select(
            SimulacionFinanciamiento.modalidad,
            func.count(SimulacionFinanciamiento.id),
        )
        .group_by(SimulacionFinanciamiento.modalidad)
        .order_by(func.count(SimulacionFinanciamiento.id).desc())
    ).all()

    by_currency_rows = db.execute(
        select(
            SimulacionFinanciamiento.moneda_base,
            func.count(SimulacionFinanciamiento.id),
        )
        .group_by(SimulacionFinanciamiento.moneda_base)
        .order_by(func.count(SimulacionFinanciamiento.id).desc())
    ).all()

    return DashboardStats(
        totals=DashboardTotals(
            total_simulaciones=int(totals_row[0]),
            monto_promedio_financiado=float(totals_row[1]),
        ),
        por_modalidad=[
            DashboardByModality(modalidad=row[0], cantidad=int(row[1])) for row in by_modality_rows
        ],
        por_moneda=[
            DashboardByCurrency(moneda_base=row[0], cantidad=int(row[1])) for row in by_currency_rows
        ],
    )
