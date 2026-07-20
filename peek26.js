const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/backend/app/routers/notas.py", "utf8");
const i = c.indexOf("def criar_ajuste");
console.log(JSON.stringify(c.substring(i-30, i+450)));
