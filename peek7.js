const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i1 = c.indexOf("contbAtual || ");
console.log("=== BLOCO 1 (linha original) ===");
console.log(JSON.stringify(c.substring(i1-200, i1+150)));
const i2 = c.indexOf("pg.data_contabilizacao || ");
console.log("=== BLOCO 2 (linha parcial) ===");
console.log(JSON.stringify(c.substring(i2-200, i2+150)));
