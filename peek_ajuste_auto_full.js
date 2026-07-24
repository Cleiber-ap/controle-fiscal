const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i = c.indexOf("const dtPgtoRef1 = temHistorico");
console.log(JSON.stringify(c.substring(i, i+700)));
