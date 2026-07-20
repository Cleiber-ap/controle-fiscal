const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx", "utf8");
const i = c.indexOf("for(const n of todasNotas)");
console.log(JSON.stringify(c.substring(i, i+800)));
