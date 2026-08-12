const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx", "utf8");
const i = c.indexOf("// Encontrar a nota de Venda entre as NFs da linha");
console.log(JSON.stringify(c.substring(i, i+750)));
