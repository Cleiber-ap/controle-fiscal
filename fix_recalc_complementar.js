const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "todasNotas.filter((n: any) => { const st = (n.nat_operacao || n.status || '').toLowerCase(); return (st.includes('venda') && !st.includes('devolu')) || st.includes('complemento de frete') }).forEach((n: any) => {";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "todasNotas.filter((n: any) => { const st = (n.nat_operacao || n.status || '').toLowerCase(); return (st.includes('venda') && !st.includes('devolu')) || st.includes('complemento de frete') || st.includes('complementar') }).forEach((n: any) => {";
  c = c.replace(anchor, novo);
  console.log("OK - recalculo do historico_faturamento agora inclui NF-e Complementar");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
