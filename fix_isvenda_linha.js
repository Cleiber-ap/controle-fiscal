const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "const isVenda = ((nat.includes('venda') && !nat.includes('devolu')) || nat.includes('complemento de frete')) && !foiCancelada";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "const isVenda = ((nat.includes('venda') && !nat.includes('devolu')) || nat.includes('complemento de frete') || nat.includes('complementar')) && !foiCancelada";
  c = c.replace(anchor, novo);
  console.log("OK - isVenda da linha agora inclui NF-e Complementar");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
