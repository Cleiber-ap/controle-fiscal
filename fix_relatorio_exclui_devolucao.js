const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "if(!n.data_emissao||!st.includes(\"venda\")||nfsCan.has(n.numero_nf)||!semPag) return false";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "if(!n.data_emissao||!st.includes(\"venda\")||st.includes(\"devolu\")||nfsCan.has(n.numero_nf)||!semPag) return false";
  c = c.replace(anchor, novo);
  console.log("OK - devolucoes excluidas do filtro de notas aguardando pagamento");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
