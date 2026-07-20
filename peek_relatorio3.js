const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx", "utf8");
const i = c.indexOf("} else {\r\n          rows.push([n.numero_nf");
console.log(JSON.stringify(c.substring(i, i+250)));
