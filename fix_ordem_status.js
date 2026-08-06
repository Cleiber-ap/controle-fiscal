const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "['Venda','Simples Remessa','Cancelamento','Carta de Correcao','Complemento de Frete','NF-e COMPLEMENTAR','Devolucao de venda de mercadorias','Devolucao de simples remessa','Inutilizacao']";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "['Venda','NF-e COMPLEMENTAR','Complemento de Frete','Simples Remessa','Cancelamento','Inutilizacao','Carta de Correcao','Devolucao de venda de mercadorias','Devolucao de simples remessa']";
  c = c.replace(anchor, novo);
  console.log("OK - ordem do filtro Status atualizada");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
