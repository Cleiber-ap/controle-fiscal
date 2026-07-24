const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
console.log("=== BOTAO COPIAR ORIGINAL ===");
let i = c.indexOf("Copiar data de pagamento");
console.log(JSON.stringify(c.substring(i-350, i+700)));
