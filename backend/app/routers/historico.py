from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.jwt import get_current_user
from app.models.empresa import HistoricoFaturamento, DasPagamento

router = APIRouter()

@router.get("/historico/{empresa_id}")
def listar_historico(empresa_id: int, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    rows = db.query(HistoricoFaturamento).filter(HistoricoFaturamento.empresa_id == empresa_id).order_by(HistoricoFaturamento.ano, HistoricoFaturamento.mes).all()
    return [{"id": r.id, "empresa_id": r.empresa_id, "ano": r.ano, "mes": r.mes, "valor": r.valor} for r in rows]

@router.get("/das/{empresa_id}")
def listar_das(empresa_id: int, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    rows = db.query(DasPagamento).filter(DasPagamento.empresa_id == empresa_id).order_by(DasPagamento.ano, DasPagamento.mes).all()
    return [{"id": r.id, "empresa_id": r.empresa_id, "ano": r.ano, "mes": r.mes, "valor": r.valor} for r in rows]

from pydantic import BaseModel

class DasInput(BaseModel):
    empresa_id: int
    ano: int
    mes: int
    valor: float

@router.post("/das/{empresa_id}")
def confirmar_das(empresa_id: int, dados: DasInput, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    existing = db.query(DasPagamento).filter(
        DasPagamento.empresa_id == empresa_id,
        DasPagamento.ano == dados.ano,
        DasPagamento.mes == dados.mes
    ).first()
    if existing:
        existing.valor = dados.valor
    else:
        novo = DasPagamento(empresa_id=empresa_id, ano=dados.ano, mes=dados.mes, valor=dados.valor)
        db.add(novo)
    db.commit()
    return {"message": "DAS confirmado"}

class HistoricoUpsertInput(BaseModel):
    empresa_id: int
    ano: int
    mes: int
    valor: float

@router.post("/historico/upsert")
def upsert_historico(dados: HistoricoUpsertInput, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    existing = db.query(HistoricoFaturamento).filter(
        HistoricoFaturamento.empresa_id == dados.empresa_id,
        HistoricoFaturamento.ano == dados.ano,
        HistoricoFaturamento.mes == dados.mes
    ).first()
    if existing:
        existing.valor = dados.valor  # substituir pelo valor recalculado do frontend
    else:
        novo = HistoricoFaturamento(empresa_id=dados.empresa_id, ano=dados.ano, mes=dados.mes, valor=dados.valor)
        db.add(novo)
    db.commit()
    return {"message": "Histórico atualizado"}
