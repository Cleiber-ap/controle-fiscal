const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx", "utf8");
const i = c.indexOf("Importar XML");
console.log(JSON.stringify(c.substring(i-60, i+30)));
