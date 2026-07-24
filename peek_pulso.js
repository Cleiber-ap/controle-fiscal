const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
console.log("=== ONBLUR ORIGINAL ===");
let i = c.indexOf("const contbId = temHistorico");
console.log(JSON.stringify(c.substring(i, i+1900)));
