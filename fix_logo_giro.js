const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "<img src={ENOVA_LOGO} alt=\"💳\" style={{ width: '72px', height: 'auto', objectFit: 'contain' }} />";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "<style>{`@keyframes giroLogo { 0% { transform: rotate(0deg) } 5% { transform: rotate(360deg) } 100% { transform: rotate(360deg) } }`}</style>\r\n" +
"          <img src={ENOVA_LOGO} alt=\"💳\" style={{ width: '72px', height: 'auto', objectFit: 'contain', animation: 'giroLogo 20s linear infinite' }} />";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - logo gira a cada 20 segundos");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
