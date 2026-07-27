const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "@keyframes giroLogo { 0% { transform: rotateY(0deg) } 5% { transform: rotateY(360deg) } 100% { transform: rotateY(360deg) } }";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "@keyframes giroLogo { 0% { transform: rotateY(0deg) } 1.5% { transform: rotateY(360deg) } 100% { transform: rotateY(360deg) } }";
  c = c.replace(anchor, novo);
  console.log("OK - giro do logo mais rapido (2.7s), mantendo ciclo de 180s");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
