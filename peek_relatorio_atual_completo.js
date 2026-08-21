const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx", "utf8");
console.log("=== notasPagas ===");
let i = c.indexOf("const notasPagas = listaFiltrada.filter");
console.log(JSON.stringify(c.substring(i, i+900)));
console.log("=== ROWS BUILD ===");
i = c.indexOf("for(const n of todasNotas)");
console.log(JSON.stringify(c.substring(i, i+900)));
