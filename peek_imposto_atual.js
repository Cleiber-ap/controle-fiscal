const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
console.log("=== ORIGINAL ===");
let i = c.indexOf("const condMesAnt = ");
console.log(JSON.stringify(c.substring(i-20, i+500)));
console.log("=== PARCIAL ===");
i = c.indexOf("const condMesAntPg = ");
console.log(JSON.stringify(c.substring(i-20, i+500)));
