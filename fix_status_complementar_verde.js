const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "if (sl.includes('venda') || sl.includes('complemento de frete')) return { bg: 'rgba(52,211,153,0.12)', cor: '#34D399' }";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "if (sl.includes('venda') || sl.includes('complemento de frete') || sl.includes('complementar')) return { bg: 'rgba(52,211,153,0.12)', cor: '#34D399' }";
  c = c.replace(anchor, novo);
  console.log("OK - NF-e Complementar agora usa a cor verde (mesma da Venda)");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
