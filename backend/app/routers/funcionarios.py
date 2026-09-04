from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import get_db, Base
from app.auth.jwt import get_current_user
from datetime import datetime

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
    """
    Lancamentos manuais do mes, por funcionario.

    Guardava so a quantidade de horas. O multiplicador (50% ou 100%) e o valor
    de faltas viviam apenas na memoria da tela e se perdiam ao recarregar — o
    que passou a alterar o resultado quando esses campos foram ligados ao
    calculo.
    """
    __tablename__ = "encargos_horas_extras"
    id = Column(Integer, primary_key=True, index=True)
    funcionario_id = Column(Integer, nullable=False)
    ano = Column(Integer, nullable=False)
    mes = Column(Integer, nullable=False)
    horas = Column(Float, default=0)
    #  1.5 = 50% · 2.0 = 100%
    mult_he = Column(Float, default=1.5, nullable=True)
    #  Desconto de faltas e atrasos, em reais.
    faltas = Column(Float, default=0, nullable=True)
    created_at = Column(DateTime, server_default=func.now())


class FechamentoEncargos(Base):
    """
    Fechamento mensal da folha: congela os totais do mes.

    Os totais sao recalculados a cada abertura da tela, a partir do cadastro
    atual. Se um salario for reajustado ou a tabela do INSS mudar, meses
    passados passariam a exibir outro valor. O fechamento guarda o que valeu
    de fato naquele mes.
    """
    __tablename__ = "encargos_fechamento"
    id = Column(Integer, primary_key=True, index=True)
    ano = Column(Integer, nullable=False)
    mes = Column(Integer, nullable=False)
    total_salarios = Column(Float, default=0)
    total_encargos = Column(Float, default=0)
    total_empresa = Column(Float, default=0)
    total_deposito = Column(Float, default=0)
    fechado_por = Column(String(100))
    fechado_em = Column(DateTime, server_default=func.now())


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
    """Lancamentos do mes por funcionario: horas, multiplicador e faltas."""
    rows = db.query(HorasExtras).filter(HorasExtras.ano == ano, HorasExtras.mes == mes).all()
    return {
        r.funcionario_id: {
            "horas": r.horas or 0,
            "mult_he": r.mult_he if r.mult_he is not None else 1.5,
            "faltas": r.faltas or 0,
        }
        for r in rows
    }

@router.post("/horas")
def salvar_horas(dados: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Grava um lancamento. Campo omitido mantem o valor que ja estava gravado."""
    fid = dados["funcionario_id"]; ano = dados["ano"]; mes = dados["mes"]
    ex = db.query(HorasExtras).filter(HorasExtras.funcionario_id == fid, HorasExtras.ano == ano, HorasExtras.mes == mes).first()
    if not ex:
        ex = HorasExtras(funcionario_id=fid, ano=ano, mes=mes, horas=0, mult_he=1.5, faltas=0)
        db.add(ex)
    if "horas" in dados: ex.horas = dados["horas"]
    if "mult_he" in dados: ex.mult_he = dados["mult_he"]
    if "faltas" in dados: ex.faltas = dados["faltas"]
    db.commit()
    return {"ok": True}

def _fechamento_json(f):
    if not f:
        return None
    return {
        "ano": f.ano, "mes": f.mes,
        "total_salarios": f.total_salarios or 0,
        "total_encargos": f.total_encargos or 0,
        "total_empresa": f.total_empresa or 0,
        "total_deposito": f.total_deposito or 0,
        "fechado_por": f.fechado_por,
        "fechado_em": f.fechado_em.isoformat() if f.fechado_em else None,
    }


@router.get("/fechamento/{ano}/{mes}")
def get_fechamento(ano: int, mes: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Fechamento do mes, ou null se ainda estiver aberto."""
    f = db.query(FechamentoEncargos).filter(
        FechamentoEncargos.ano == ano, FechamentoEncargos.mes == mes).first()
    return _fechamento_json(f)


@router.post("/fechamento")
def fechar_mes(dados: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Congela os totais do mes. Refechar sobrescreve os valores."""
    ano = dados["ano"]; mes = dados["mes"]
    f = db.query(FechamentoEncargos).filter(
        FechamentoEncargos.ano == ano, FechamentoEncargos.mes == mes).first()
    if not f:
        f = FechamentoEncargos(ano=ano, mes=mes)
        db.add(f)
    f.total_salarios = dados.get("total_salarios", 0)
    f.total_encargos = dados.get("total_encargos", 0)
    f.total_empresa = dados.get("total_empresa", 0)
    f.total_deposito = dados.get("total_deposito", 0)
    f.fechado_por = dados.get("fechado_por")
    f.fechado_em = datetime.utcnow()
    db.commit(); db.refresh(f)
    return _fechamento_json(f)


@router.delete("/fechamento/{ano}/{mes}")
def reabrir_mes(ano: int, mes: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Reabre o mes para edicao, descartando o snapshot."""
    f = db.query(FechamentoEncargos).filter(
        FechamentoEncargos.ano == ano, FechamentoEncargos.mes == mes).first()
    if f:
        db.delete(f); db.commit()
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
