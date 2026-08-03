const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx", "utf8");
const i = c.indexOf("todasNotas.filter((n: any) => {");
console.log(JSON.stringify(c.substring(i, i+280)));
