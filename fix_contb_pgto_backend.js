const fs = require("fs");
const f = "C:/projetos/controle-fiscal/backend/app/routers/notas.py";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Coluna no model PagamentoNF
const anchorModel = "dt_pagamento = Column(String(30), nullable=True)\n    mes_lancamento = Column(String(10), nullable=True)";
if (c.indexOf(anchorModel) === -1) { console.log("FALHOU: anchorModel"); ok = false; }
else c = c.replace(anchorModel, anchorModel + "\n    data_contabilizacao = Column(String(20), nullable=True)");

// 2. Incluir no dict do endpoint listar_todos_pagamentos (append)
const anchorDict1 = `"mes_lancamento": p.mes_lancamento})`;
if (c.indexOf(anchorDict1) === -1) { console.log("FALHOU: anchorDict1"); ok = false; }
else c = c.replace(anchorDict1, `"mes_lancamento": p.mes_lancamento, "data_contabilizacao": p.data_contabilizacao})`);

// 3. Incluir no dict do endpoint listar_pagamentos (list comprehension)
const anchorDict2 = `"mes_lancamento": p.mes_lancamento} for p in pgtos]`;
if (c.indexOf(anchorDict2) === -1) { console.log("FALHOU: anchorDict2"); ok = false; }
else c = c.replace(anchorDict2, `"mes_lancamento": p.mes_lancamento, "data_contabilizacao": p.data_contabilizacao} for p in pgtos]`);

// 4. Novo endpoint, apos o endpoint de contabilizacao da nota
const anchorEndpoint = `return {"message": "OK", "data_contabilizacao": nota.data_contabilizacao}`;
if (c.indexOf(anchorEndpoint) === -1) { console.log("FALHOU: anchorEndpoint"); ok = false; }
else {
  const novoEndpoint = `

@router.put("/pagamento/contabilizacao/{pgto_id}")
def atualizar_contabilizacao_pagamento(pgto_id: int, dados: dict, db: Session = Depends(get_db), usuario=Depends(get_current_user)):
    pgto = db.query(PagamentoNF).filter(PagamentoNF.id == pgto_id).first()
    if not pgto:
        return {"error": "Pagamento nao encontrado"}
    pgto.data_contabilizacao = dados.get("data_contabilizacao", "")
    db.commit()
    return {"message": "OK", "data_contabilizacao": pgto.data_contabilizacao}`;
  c = c.replace(anchorEndpoint, anchorEndpoint + novoEndpoint);
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("OK - backend atualizado"); }
else console.log("Corrigir ancoras antes de continuar");
