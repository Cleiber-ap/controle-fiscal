from sqlalchemy import Column, Integer, String, Boolean, Numeric, DateTime, Float, ForeignKey
from datetime import datetime
from app.database import Base

class Empresa(Base):
    __tablename__ = "empresas"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(50), nullable=False)
    razao_social = Column(String(200), nullable=False)
    aliquota_das = Column(Numeric(8, 6))
    credito_icms = Column(Numeric(8, 6))
    ativo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class HistoricoFaturamento(Base):
    __tablename__ = "historico_faturamento"
    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    ano = Column(Integer, nullable=False)
    mes = Column(Integer, nullable=False)
    valor = Column(Float, default=0)

class DasPagamento(Base):
    __tablename__ = "das_pagamentos"
    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    ano = Column(Integer, nullable=False)
    mes = Column(Integer, nullable=False)
    valor = Column(Float, default=0)
