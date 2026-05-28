const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/backend/app/routers/funcionarios.py';
let c = fs.readFileSync(p, 'utf8');
const modelo = `\nclass Feriado(Base):\n    __tablename__ = "feriados"\n    id = Column(Integer, primary_key=True, index=True)\n    dia = Column(Integer, nullable=False)\n    mes = Column(Integer, nullable=False)\n    descricao = Column(String(100), nullable=False)\n    tipo = Column(String(20), default='nacional')\n    ativo = Column(Boolean, default=True)\n`;
const endpoints = `\n@router.get("/feriados/")\ndef listar_feriados(db: Session = Depends(get_db), current_user=Depends(get_current_user)):\n    return db.query(Feriado).filter(Feriado.ativo == True).all()\n\n@router.post("/feriados/")\ndef criar_feriado(dados: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):\n    f = Feriado(**{k: v for k, v in dados.items() if k != 'id'})\n    db.add(f); db.commit(); db.refresh(f)\n    return f\n\n@router.delete("/feriados/{fid}")\ndef deletar_feriado(fid: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):\n    f = db.query(Feriado).filter(Feriado.id == fid).first()\n    if not f: raise HTTPException(404, "Nao encontrado")\n    f.ativo = False; db.commit()\n    return {"ok": True}\n`;
c = c.split('router = APIRouter').join(modelo + '\nrouter = APIRouter');
c = c + endpoints;
fs.writeFileSync(p, c, 'utf8');
console.log('Backend OK');
