const fs = require("fs");

// 1. Criar router de funcionarios
const router = `from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import get_db, Base
from app.auth import get_current_user

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

router = APIRouter(prefix="/funcionarios", tags=["funcionarios"])

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
`;
fs.writeFileSync("C:/projetos/controle-fiscal/backend/app/routers/funcionarios.py", router, "utf8");
console.log("1. Router criado");

// 2. Incluir no main.py
let main = fs.readFileSync("C:/projetos/controle-fiscal/backend/app/main.py", "utf8");
if (!main.includes("funcionarios")) {
  main = main.replace(
    "from app.routers import",
    "from app.routers import funcionarios,"
  );
  main = main.replace(
    "app.include_router(usuarios.router)",
    "app.include_router(usuarios.router)\napp.include_router(funcionarios.router)"
  );
  fs.writeFileSync("C:/projetos/controle-fiscal/backend/app/main.py", main, "utf8");
  console.log("2. main.py atualizado");
} else { console.log("2. main.py ja tem funcionarios"); }
