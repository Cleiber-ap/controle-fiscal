const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx", "utf8");
const i = c.indexOf("resultado.push({");
console.log(JSON.stringify(c.substring(i+400, i+600)));
