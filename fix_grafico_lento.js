const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "dur = 900";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  c = c.replace(anchor, "dur = 2200");
  console.log("OK - animacao do grafico Evolucao Mensal desacelerada (900ms -> 2200ms)");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
