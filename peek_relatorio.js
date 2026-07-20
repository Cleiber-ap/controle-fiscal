const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx", "utf8");
const i = c.indexOf('const cab = ["N');
const chunk = c.substring(i, i+2400);
chunk.split("\r\n").forEach(l => console.log(JSON.stringify(l)));
