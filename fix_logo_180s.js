const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "animation: 'giroLogo 60s linear infinite'";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  c = c.replace(anchor, "animation: 'giroLogo 180s linear infinite'");
  console.log("OK - giro agora ocorre a cada 3 minutos (180s)");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
