const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "const stStyle = foiCancelada && (r.nat_operacao || r.status || '').toLowerCase().includes('venda')\r\n" +
"                    ? { bg: 'rgba(248,113,113,0.15)', cor: '#FCA5A5' }\r\n" +
"                    : statusStyle(r.nat_operacao || r.status)";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "const stStyle = foiCancelada && (r.nat_operacao || r.status || '').toLowerCase().includes('venda')\r\n" +
"                    ? (nfsCanReal.has(r.numero_nf) ? { bg: 'rgba(248,113,113,0.15)', cor: '#FCA5A5' } : { bg: 'rgba(251,191,36,0.15)', cor: '#FBBF24' })\r\n" +
"                    : statusStyle(r.nat_operacao || r.status)";
  c = c.replace(anchor, novo);
  console.log("OK - Venda/Entrada agora usa amarelo, Venda/Cancelada continua vermelho");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
