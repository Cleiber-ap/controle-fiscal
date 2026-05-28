from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from app.database import get_db, Base
from app.auth.jwt import get_current_user

# Model
class LogAuditoria(Base):
    __tablename__ = "log_auditoria"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, nullable=False)
    usuario_nome = Column(String(200), nullable=False)
    acao = Column(String(50), nullable=False)       # CRIAR, EDITAR, EXCLUIR, LOGIN, etc
    modulo = Column(String(100), nullable=False)    # usuarios, empresas, notas, das, etc
    descricao = Column(Text, nullable=False)        # descrição legível
    valor_antes = Column(Text, nullable=True)       # JSON com valor anterior
    valor_depois = Column(Text, nullable=True)      # JSON com valor novo
    ip = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

router = APIRouter()

class LogInput(BaseModel):
    acao: str
    modulo: str
    descricao: str
    valor_antes: Optional[str] = None
    valor_depois: Optional[str] = None

@router.post("/")
def registrar_log(dados: LogInput, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    log = LogAuditoria(
        usuario_id=usuario.id,
        usuario_nome=usuario.nome,
        acao=dados.acao,
        modulo=dados.modulo,
        descricao=dados.descricao,
        valor_antes=dados.valor_antes,
        valor_depois=dados.valor_depois,
    )
    db.add(log)
    db.commit()
    return {"message": "Log registrado"}

@router.get("/")
def listar_logs(
    limite: int = 100,
    modulo: Optional[str] = None,
    acao: Optional[str] = None,
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user)
):
    query = db.query(LogAuditoria).order_by(LogAuditoria.created_at.desc())
    if modulo:
        query = query.filter(LogAuditoria.modulo == modulo)
    if acao:
        query = query.filter(LogAuditoria.acao == acao)
    logs = query.limit(limite).all()
    return [{
        "id": l.id,
        "usuario_id": l.usuario_id,
        "usuario_nome": l.usuario_nome,
        "acao": l.acao,
        "modulo": l.modulo,
        "descricao": l.descricao,
        "valor_antes": l.valor_antes,
        "valor_depois": l.valor_depois,
        "created_at": l.created_at.strftime("%d/%m/%Y %H:%M:%S") if l.created_at else None,
    } for l in logs]
