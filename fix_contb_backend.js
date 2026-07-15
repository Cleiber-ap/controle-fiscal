const fs = require("fs");
const f = "C:/projetos/controle-fiscal/backend/app/routers/notas.py";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Adicionar coluna no model
const anchorModel = "ajustado = Column(Boolean, default=False, nullable=True)";
if (c.indexOf(anchorModel) === -1) { console.log("FALHOU: anchorModel"); ok = false; }
else c = c.replace(anchorModel, anchorModel + "\n    data_contabilizacao = Column(String(20), nullable=True)");

// 2. Adicionar no dict de serializacao
const anchorSerial = `"ajustado": n.ajustado or False,`;
if (c.indexOf(anchorSerial) === -1) { console.log("FALHOU: anchorSerial"); ok = false; }
else c = c.replace(anchorSerial, anchorSerial + `\n        "data_contabilizacao": n.data_contabilizacao,`);

// 3. Novo endpoint, logo apos o endpoint de ajustado
const anchorEndpoint = `return {"message": "OK", "ajustado": nota.ajustado}`;
if (c.indexOf(anchorEndpoint) === -1) { console.log("FALHOU: anchorEndpoint"); ok = false; }
else {
  const novoEndpoint = `

@router.put("/contabilizacao/{nota_id}")
def atualizar_contabilizacao(nota_id: int, dados: dict, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    nota = db.query(NotaFiscal).filter(NotaFiscal.id == nota_id).first()
    if not nota:
        return {"error": "Nota nao encontrada"}
    nota.data_contabilizacao = dados.get("data_contabilizacao", "")
    db.commit()
    return {"message": "OK", "data_contabilizacao": nota.data_contabilizacao}`;
  c = c.replace(anchorEndpoint, anchorEndpoint + novoEndpoint);
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("OK - backend atualizado"); }
else console.log("Corrigir ancoras antes de continuar");
