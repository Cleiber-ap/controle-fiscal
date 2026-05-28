from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import get_db, Base
from app.auth.jwt import get_current_user

class Funcionario(Base):
    __tablename__ = "funcionarios"
    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, nullable=False, default=1)
    nome = Column(String(100), nullable=False)
    cargo = Column(String(100))
    salario_base = Column(Float, default=0)
    vale_alimentacao = Column(Float, default=250)
    vale_transporte = Column(Boolean, default=True)
    salario_dinheiro = Column(Float, default=0)
    vale_transporte_valor = Column(Float, default=0)
    vale_alimentacao_desconto = Column(Float, default=0)
    ativo = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

class HorasExtras(Base):
    __tablename__ = "encargos_horas_extras"
    id = Column(Integer, primary_key=True, index=True)
    funcionario_id = Column(Integer, nullable=False)
    ano = Column(Integer, nullable=False)
    mes = Column(Integer, nullable=False)
    horas = Column(Float, default=0)
    created_at = Column(DateTime, server_default=func.now())


class Feriado(Base):
    __tablename__ = "feriados"
    id = Column(Integer, primary_key=True, index=True)
    dia = Column(Integer, nullable=False)
    mes = Column(Integer, nullable=False)
    descricao = Column(String(100), nullable=False)
    tipo = Column(String(20), default='nacional')
    ativo = Column(Boolean, default=True)

router = APIRouter(tags=["funcionarios"])

@router.get("/")
def listar(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Funcionario).filter(Funcionario.ativo == True).all()

@router.post("/")
def criar(dados: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    f = Funcionario(**{k: v for k, v in dados.items() if k != 'id'})
    db.add(f); db.commit(); db.refresh(f)
    return f

@router.put("/{fid}")
def atualizar(fid: int, dados: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    f = db.query(Funcionario).filter(Funcionario.id == fid).first()
    if not f: raise HTTPException(404, "Não encontrado")
    for k, v in dados.items():
        if k not in ('id', 'created_at'): setattr(f, k, v)
    db.commit(); db.refresh(f)
    return f

@router.delete("/{fid}")
def desativar(fid: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    f = db.query(Funcionario).filter(Funcionario.id == fid).first()
    if not f: raise HTTPException(404, "Não encontrado")
    f.ativo = False; db.commit()
    return {"ok": True}

@router.get("/horas/{ano}/{mes}")
def get_horas(ano: int, mes: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    rows = db.query(HorasExtras).filter(HorasExtras.ano == ano, HorasExtras.mes == mes).all()
    return {r.funcionario_id: r.horas for r in rows}

@router.post("/horas")
def salvar_horas(dados: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    fid = dados["funcionario_id"]; ano = dados["ano"]; mes = dados["mes"]; horas = dados.get("horas", 0)
    ex = db.query(HorasExtras).filter(HorasExtras.funcionario_id == fid, HorasExtras.ano == ano, HorasExtras.mes == mes).first()
    if ex: ex.horas = horas
    else: db.add(HorasExtras(funcionario_id=fid, ano=ano, mes=mes, horas=horas))
    db.commit()
    return {"ok": True}

@router.get("/feriados/")
def listar_feriados(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Feriado).filter(Feriado.ativo == True).all()

@router.post("/feriados/")
def criar_feriado(dados: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    f = Feriado(**{k: v for k, v in dados.items() if k != 'id'})
    db.add(f); db.commit(); db.refresh(f)
    return f

@router.delete("/feriados/{fid}")
def deletar_feriado(fid: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    f = db.query(Feriado).filter(Feriado.id == fid).first()
    if not f: raise HTTPException(404, "Nao encontrado")
    f.ativo = False; db.commit()
    return {"ok": True}

@router.put("/feriados/{fid}")
def atualizar_feriado(fid: int, dados: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    f = db.query(Feriado).filter(Feriado.id == fid).first()
    if not f: raise HTTPException(404, "Nao encontrado")
    for k, v in dados.items():
        if k not in ('id', 'ativo'): setattr(f, k, v)
    db.commit(); db.refresh(f)
    return f
