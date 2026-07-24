const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "<div style={{ overflowX: 'auto' }}>";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "<style>{`@keyframes fadeInTabela { from { opacity: 0.2 } to { opacity: 1 } }`}</style>\r\n" +
"          <div key={empresa} style={{ overflowX: 'auto', animation: 'fadeInTabela 0.35s ease' }}>";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - fade ao trocar de empresa implementado");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
