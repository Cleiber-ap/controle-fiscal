from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.empresa import Empresa
from app.auth.jwt import get_current_user

router = APIRouter()

class EmpresaSchema(BaseModel):
    nome: str
    razao_social: str
    aliquota_das: Optional[float] = 0.0
    credito_icms: Optional[float] = 0.0
    ativo: Optional[bool] = True

@router.get("/")
def listar_empresas(db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    return db.query(Empresa).filter(Empresa.ativo == True).all()

@router.get("/{id}")
def buscar_empresa(id: int, db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    empresa = db.query(Empresa).filter(Empresa.id == id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return empresa

@router.post("/", status_code=201)
def criar_empresa(dados: EmpresaSchema, db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    empresa = Empresa(**dados.model_dump())
    db.add(empresa)
    db.commit()
    db.refresh(empresa)
    return empresa

@router.put("/{id}")
def editar_empresa(id: int, dados: EmpresaSchema, db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    empresa = db.query(Empresa).filter(Empresa.id == id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    for key, value in dados.model_dump().items():
        setattr(empresa, key, value)
    db.commit()
    db.refresh(empresa)
    return empresa

@router.delete("/{id}")
def remover_empresa(id: int, db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    empresa = db.query(Empresa).filter(Empresa.id == id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    empresa.ativo = False
    db.commit()
    return {"message": "Empresa removida com sucesso"}
