const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
console.log("=== ORIGINAL ===");
let i = c.indexOf("primeiroPagamento > 0) {");
console.log(JSON.stringify(c.substring(i, i+200)));
console.log("=== PARCIAL ===");
i = c.indexOf("pg.valor_pago > 0) {");
console.log(JSON.stringify(c.substring(i, i+200)));
