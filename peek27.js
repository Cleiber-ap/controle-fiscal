const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx", "utf8");
const i = c.indexOf("const calcBaseMLcto = (pgtos");
console.log(JSON.stringify(c.substring(i, i+700)));
