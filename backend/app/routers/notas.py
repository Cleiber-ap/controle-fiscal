from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from pydantic import BaseModel
from typing import Optional
from app.database import get_db, Base
from app.auth.jwt import get_current_user

# Model
class NotaFiscal(Base):
    __tablename__ = "notas_fiscais"
    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    numero_nf = Column(String(50), nullable=False)
    razao_dest = Column(String(200))
    cnpj_dest = Column(String(20))
    valor_nf = Column(Float, default=0)
    dt_emissao = Column(String(20))
    valor_pago = Column(Float, nullable=True)
    dt_pagamento = Column(String(20), nullable=True)
    nat_operacao = Column(String(200), nullable=True)
    status = Column(String(50), default='Venda')
    mes_lancamento = Column(String(10), nullable=True)
    ajustado = Column(Boolean, default=False, nullable=True)
    tipo = Column(String(10), default='saida', nullable=True)

router = APIRouter()

class PagamentoNF(Base):
    __tablename__ = "pagamentos_nf"
    id = Column(Integer, primary_key=True, index=True)
    nota_id = Column(Integer, nullable=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    numero_nf = Column(String(50), nullable=False)
    valor_pago = Column(Float, nullable=False)
    dt_pagamento = Column(String(30), nullable=True)
    mes_lancamento = Column(String(10), nullable=True)


class PagamentoInput(BaseModel):
    valor_pago: Optional[float] = None
    data_pagamento: Optional[str] = None
    empresa_id: Optional[int] = None

@router.get("/{empresa_id}")
def listar_notas(empresa_id: int, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    notas = db.query(NotaFiscal).filter(NotaFiscal.empresa_id == empresa_id).order_by(NotaFiscal.numero_nf.desc()).all()
    return [{
        "id": n.id,
        "empresa_id": n.empresa_id,
        "numero_nf": n.numero_nf,
        "destinatario": n.razao_dest,
        "cnpj_dest": n.cnpj_dest,
        "valor_nf": n.valor_nf,
        "data_emissao": n.dt_emissao,
        "valor_pago": n.valor_pago,
        "data_pagamento": n.dt_pagamento,
        "status": n.status,
        "mes_lancamento": n.mes_lancamento,
        "nat_operacao": n.nat_operacao,
        "ajustado": n.ajustado or False,
        "tipo": n.tipo or "saida",
    } for n in notas]

@router.put("/{numero_nf}")
def atualizar_pagamento(numero_nf: str, dados: PagamentoInput, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    nota = db.query(NotaFiscal).filter(
        NotaFiscal.numero_nf == numero_nf,
        NotaFiscal.empresa_id == dados.empresa_id
    ).first()
    if not nota:
        return {"error": "Nota não encontrada"}
    if dados.valor_pago is not None:
        nota.valor_pago = dados.valor_pago
    if dados.data_pagamento is not None:
        nota.dt_pagamento = dados.data_pagamento
    db.commit()
    return {"message": "Pagamento atualizado"}

class NotaImportInput(BaseModel):
    empresa_id: int
    numero_nf: str
    destinatario: Optional[str] = None
    cnpj_dest: Optional[str] = None
    valor_nf: float = 0
    data_emissao: Optional[str] = None
    nat_op: Optional[str] = None
    status: Optional[str] = 'Venda'
    arquivo: Optional[str] = None
    tipo: Optional[str] = 'saida'

@router.post("/importar")
def importar_nota(dados: NotaImportInput, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    existing = db.query(NotaFiscal).filter(
        NotaFiscal.numero_nf == dados.numero_nf,
        NotaFiscal.empresa_id == dados.empresa_id
    ).first()
    if existing:
        existing.razao_dest = dados.destinatario
        existing.cnpj_dest = dados.cnpj_dest
        existing.valor_nf = dados.valor_nf
        existing.dt_emissao = dados.data_emissao
        existing.status = (dados.status or "")[:50]
        existing.nat_operacao = (dados.nat_op or "")[:50]
        existing.tipo = dados.tipo or 'saida'
    else:
        nova = NotaFiscal(
            empresa_id=dados.empresa_id,
            numero_nf=dados.numero_nf,
            razao_dest=dados.destinatario,
            cnpj_dest=dados.cnpj_dest,
            valor_nf=dados.valor_nf,
            dt_emissao=dados.data_emissao,
            status=(dados.status or "")[:50],
            nat_operacao=(dados.nat_op or "")[:50],
            tipo=dados.tipo or 'saida',
        )
        db.add(nova)
    db.commit()
    return {"message": "Nota importada"}

class PgtoInput(BaseModel):
    empresa_id: int
    numero_nf: str
    valor_pago: float
    dt_pagamento: Optional[str] = None
    mes_lancamento: Optional[str] = None

@router.post("/pagamento")
def registrar_pagamento(dados: PgtoInput, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    nota = db.query(NotaFiscal).filter(
        NotaFiscal.numero_nf == dados.numero_nf,
        NotaFiscal.empresa_id == dados.empresa_id
    ).first()
    if not nota:
        return {"error": "Nota nao encontrada"}

    pgtos = db.query(PagamentoNF).filter(
        PagamentoNF.numero_nf == dados.numero_nf,
        PagamentoNF.empresa_id == dados.empresa_id
    ).all()

    total_ja_pago = sum(p.valor_pago for p in pgtos)
    novo_total = min(total_ja_pago + dados.valor_pago, nota.valor_nf)
    restante_apos = nota.valor_nf - novo_total
    e_parcial = restante_apos > 0.01

    if e_parcial or len(pgtos) > 0:
        # Pagamento parcial ou ja tem historico: sempre insere em pagamentos_nf
        pgto = PagamentoNF(nota_id=nota.id, empresa_id=dados.empresa_id, numero_nf=dados.numero_nf, valor_pago=dados.valor_pago, dt_pagamento=dados.dt_pagamento, mes_lancamento=dados.mes_lancamento)
        db.add(pgto)
    # Se pagamento integral e nao tem historico: nao insere em pagamentos_nf

    nota.valor_pago = novo_total
    if dados.mes_lancamento:
        nota.mes_lancamento = dados.mes_lancamento
    
    # REGRA CORRIGIDA:
    # Só atualiza a data da nota (linha original Status Venda) se:
    # O pagamento atual ZEROU o saldo restante (pagamento final)
    # Pagamentos intermediários (que ainda deixam saldo) NÃO devem alterar a data da nota
    if restante_apos <= 0.01:
        # Pagamento final: atualiza a data da nota
        nota.dt_pagamento = dados.dt_pagamento
    # Se restante_apos > 0.01 (pagamento parcial), NÃO altera nota.dt_pagamento
    
    db.commit()

    pgtos_atualizados = db.query(PagamentoNF).filter(
        PagamentoNF.numero_nf == dados.numero_nf,
        PagamentoNF.empresa_id == dados.empresa_id
    ).order_by(PagamentoNF.id.asc()).all()

    return {
        "message": "OK",
        "total_pago": novo_total,
        "restante": restante_apos,
        "pagamentos": [{"id": p.id, "valor_pago": p.valor_pago, "dt_pagamento": p.dt_pagamento} for p in pgtos_atualizados]
    }


@router.get("/pagamentos/{empresa_id}")
def listar_todos_pagamentos(empresa_id: int, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    pgtos = db.query(PagamentoNF).filter(PagamentoNF.empresa_id == empresa_id).order_by(PagamentoNF.id.asc()).all()
    resultado = {}
    for p in pgtos:
        if p.numero_nf not in resultado:
            resultado[p.numero_nf] = []
        resultado[p.numero_nf].append({"id": p.id, "valor_pago": p.valor_pago, "dt_pagamento": p.dt_pagamento, "mes_lancamento": p.mes_lancamento})
    return resultado

@router.get("/pagamentos/{empresa_id}/{numero_nf}")
def listar_pagamentos(empresa_id: int, numero_nf: str, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    pgtos = db.query(PagamentoNF).filter(PagamentoNF.numero_nf == numero_nf, PagamentoNF.empresa_id == empresa_id).order_by(PagamentoNF.id.asc()).all()
    return [{"id": p.id, "valor_pago": p.valor_pago, "dt_pagamento": p.dt_pagamento, "mes_lancamento": p.mes_lancamento} for p in pgtos]

@router.put("/pagamento/{pgto_id}")
def editar_pagamento(pgto_id: int, dados: PgtoInput, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    pgto = db.query(PagamentoNF).filter(PagamentoNF.id == pgto_id).first()
    if not pgto:
        return {"error": "Pagamento nao encontrado"}
    
    print(f"🔍 ANTES: ID={pgto.id}, valor={pgto.valor_pago}, data={pgto.dt_pagamento}")
    print(f"🔍 DADOS: valor={dados.valor_pago}, data={dados.dt_pagamento}")
    
    # Atualizar pagamento
    pgto.valor_pago = dados.valor_pago
    pgto.dt_pagamento = dados.dt_pagamento
    if dados.mes_lancamento:
        pgto.mes_lancamento = dados.mes_lancamento
    
    print(f"🔍 DEPOIS: ID={pgto.id}, valor={pgto.valor_pago}, data={pgto.dt_pagamento}")
    
    nota = db.query(NotaFiscal).filter(
        NotaFiscal.numero_nf == pgto.numero_nf,
        NotaFiscal.empresa_id == pgto.empresa_id
    ).first()
    
    if nota:
        # Buscar todos os pagamentos
        todos = db.query(PagamentoNF).filter(
            PagamentoNF.numero_nf == pgto.numero_nf,
            PagamentoNF.empresa_id == pgto.empresa_id
        ).order_by(PagamentoNF.id.asc()).all()
        
        # Recalcular total pago
        novo_total_pago = sum(p.valor_pago for p in todos)
        nota.valor_pago = novo_total_pago
        
        print(f"🔍 NOTA: ID={nota.id}, valor_nf={nota.valor_nf}, novo_total={novo_total_pago}")
        
        # Verificar se é o último pagamento
        pagamento_editado_eh_ultimo = (todos and todos[-1].id == pgto_id)
        saldo_zerou = (nota.valor_nf - novo_total_pago) <= 0.01
        
        print(f"🔍 eh_ultimo={pagamento_editado_eh_ultimo}, saldo_zerou={saldo_zerou}, len(todos)={len(todos)}")
        
        # Só atualiza data da nota se for o último pagamento
        if pagamento_editado_eh_ultimo:
            nota.dt_pagamento = dados.dt_pagamento
    
    # Forçar commit
    db.commit()
    
    # Verificar se salvou
    pgto_verificado = db.query(PagamentoNF).filter(PagamentoNF.id == pgto_id).first()
    print(f"🔍 VERIFICAÇÃO: ID={pgto_verificado.id}, valor={pgto_verificado.valor_pago}, data={pgto_verificado.dt_pagamento}")
    
    return {"message": "OK", "total_pago": nota.valor_pago if nota else 0}

@router.delete("/pagamento/{pgto_id}")
def excluir_pagamento(pgto_id: int, empresa_id: int, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    pgto = db.query(PagamentoNF).filter(PagamentoNF.id == pgto_id).first()
    if not pgto:
        return {"error": "Pagamento nao encontrado"}
    numero_nf = pgto.numero_nf
    emp_id = pgto.empresa_id
    db.delete(pgto)
    db.flush()
    # Recalcular total na nota
    nota = db.query(NotaFiscal).filter(NotaFiscal.numero_nf == numero_nf, NotaFiscal.empresa_id == emp_id).first()
    if nota:
        restantes = db.query(PagamentoNF).filter(PagamentoNF.numero_nf == numero_nf, PagamentoNF.empresa_id == emp_id).all()
        nota.valor_pago = sum(p.valor_pago for p in restantes) if restantes else None
        nota.dt_pagamento = restantes[-1].dt_pagamento if restantes else None
    db.commit()
    return {"message": "OK"}
@router.delete("/pagamento/nota/{numero_nf}")
def limpar_pagamento_nota(numero_nf: str, empresa_id: int, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    nota = db.query(NotaFiscal).filter(NotaFiscal.numero_nf == numero_nf, NotaFiscal.empresa_id == empresa_id).first()
    if not nota:
        return {"error": "Nota nao encontrada"}
    nota.valor_pago = None
    nota.dt_pagamento = None
    db.commit()
    return {"message": "OK"}

from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func

class AjusteDevolucao(Base):
    __tablename__ = "ajustes_devolucao"
    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, nullable=False)
    ano = Column(Integer, nullable=False)
    mes = Column(Integer, nullable=False)
    valor = Column(Float, nullable=False)
    nf_devolucao = Column(String(50))
    nf_referenciada = Column(String(50))
    chave_ref = Column(String(50))
    created_at = Column(DateTime, server_default=func.now())

@router.get("/ajustes/{empresa_id}")
def listar_ajustes(empresa_id: int, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    return db.query(AjusteDevolucao).filter(AjusteDevolucao.empresa_id == empresa_id).all()

@router.post("/ajustes")
def criar_ajuste(dados: dict, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    aj = AjusteDevolucao(
        empresa_id=dados["empresa_id"],
        ano=dados["ano"],
        mes=dados["mes"],
        valor=dados["valor"],
        nf_devolucao=dados.get("nf_devolucao"),
        nf_referenciada=dados.get("nf_referenciada"),
        chave_ref=dados.get("chave_ref"),
    )
    db.add(aj); db.commit(); db.refresh(aj)
    return aj

@router.delete("/ajustes/{ajuste_id}")
def remover_ajuste(ajuste_id: int, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    aj = db.query(AjusteDevolucao).filter(AjusteDevolucao.id == ajuste_id).first()
    if aj: db.delete(aj); db.commit()
    return {"ok": True}

class CreditoFiscal(Base):
    __tablename__ = "creditos_fiscais"
    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, nullable=False)
    valor_nf_original = Column(Float, nullable=False)
    nf_devolucao = Column(String(50))
    nf_referenciada = Column(String(50))
    mes_orig = Column(Integer, nullable=False)
    ano_orig = Column(Integer, nullable=False)
    status = Column(String(20), default='pendente')
    created_at = Column(DateTime, server_default=func.now())

@router.get("/creditos/{empresa_id}")
def listar_creditos(empresa_id: int, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    return db.query(CreditoFiscal).filter(
        CreditoFiscal.empresa_id == empresa_id,
        CreditoFiscal.status != 'utilizado'
    ).all()

@router.post("/creditos")
def criar_credito(dados: dict, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    cr = CreditoFiscal(
        empresa_id=dados["empresa_id"],
        valor_nf_original=dados["valor_nf_original"],
        nf_devolucao=dados.get("nf_devolucao"),
        nf_referenciada=dados.get("nf_referenciada"),
        mes_orig=dados["mes_orig"],
        ano_orig=dados["ano_orig"],
        status="pendente"
    )
    db.add(cr); db.commit(); db.refresh(cr)
    return cr

@router.put("/creditos/{credito_id}")
def atualizar_credito(credito_id: int, dados: dict, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    cr = db.query(CreditoFiscal).filter(CreditoFiscal.id == credito_id).first()
    if not cr:
        return {"error": "Credito nao encontrado"}
    cr.status = dados["status"]
    db.commit(); db.refresh(cr)
    return cr

@router.put("/ajustado/{nota_id}")
def atualizar_ajustado(nota_id: int, dados: dict, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    nota = db.query(NotaFiscal).filter(NotaFiscal.id == nota_id).first()
    if not nota:
        return {"error": "Nota nao encontrada"}
    nota.ajustado = dados.get("ajustado", False)
    db.commit()
    return {"message": "OK", "ajustado": nota.ajustado}
#   u p d a t e d  
 