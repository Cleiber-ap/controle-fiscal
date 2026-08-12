const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
console.log("=== LISTA CHECKBOX ===");
let i = c.indexOf("['Venda','NF-e COMPLEMENTAR'");
console.log(JSON.stringify(c.substring(i, i+250)));
console.log("=== notasFiltradas4 ===");
i = c.indexOf("const notasFiltradas4 = filtroStatus.length");
console.log(JSON.stringify(c.substring(i, i+400)));
