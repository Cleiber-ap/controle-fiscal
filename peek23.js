const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
console.log("=== SELECT CONTB ===");
let i = c.indexOf("value={filtroMesContb} onChange");
console.log(JSON.stringify(c.substring(i-20, i+300)));
console.log("=== notasFiltradas5 ===");
i = c.indexOf("const notasFiltradas5 = filtroMesContb");
console.log(JSON.stringify(c.substring(i, i+900)));
