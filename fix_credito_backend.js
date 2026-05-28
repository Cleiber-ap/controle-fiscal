const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/backend/app/routers/notas.py';
let c = fs.readFileSync(p, 'utf8');

const creditos = `
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
`;

c = c + creditos;
fs.writeFileSync(p, c, 'utf8');
console.log('OK');
