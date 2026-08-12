const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx", "utf8");
const i = c.indexOf("const notasAguardando = listaFiltrada.filter");
console.log(JSON.stringify(c.substring(i, i+400)));
