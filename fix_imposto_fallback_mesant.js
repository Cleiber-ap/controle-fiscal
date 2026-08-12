const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Linha original
const a1 = "const condMesAnt = !!(dtContb && mmC === mesAntIdx + 1 && aaC === anoAnt)";
const i1 = c.indexOf(a1);
if (i1 === -1) { console.log("FALHOU: 1 original"); ok = false; }
else {
  const n1 = "const condMesAnt = dtContb ? (mmC === mesAntIdx + 1 && aaC === anoAnt) : (mmP === mesAntIdx + 1 && aaP === anoAnt)";
  c = c.replace(a1, n1);
  console.log("OK 1: linha original com fallback no mes anterior");
}

// 2. Linha parcial
const a2 = "const condMesAntPg = !!(dtContbPg && mmCPg === mesAntIdx + 1 && aaCPg === anoAnt)";
const i2 = c.indexOf(a2);
if (i2 === -1) { console.log("FALHOU: 2 parcial"); ok = false; }
else {
  const n2 = "const condMesAntPg = dtContbPg ? (mmCPg === mesAntIdx + 1 && aaCPg === anoAnt) : (mmPPg === mesAntIdx + 1 && aaPPg === anoAnt)";
  c = c.replace(a2, n2);
  console.log("OK 2: linha parcial com fallback no mes anterior");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar");
