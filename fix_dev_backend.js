const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/backend/app/routers/notas.py';
let c = fs.readFileSync(p, 'utf8');

const novosCodigo = `
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
`;

c = c + novosCodigo;
fs.writeFileSync(p, c, 'utf8');
console.log('Backend OK');
