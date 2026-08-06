const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
console.log("=== notasFiltradas5 ===");
let i = c.indexOf("const notasFiltradas5 = filtroMesContb");
console.log(JSON.stringify(c.substring(i, i+1100)));
console.log("=== SELECT ===");
i = c.indexOf("<select value={filtroMesContb}");
console.log(JSON.stringify(c.substring(i, i+1150)));
