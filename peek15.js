const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx", "utf8");
const i = c.indexOf("status:'autorizado'");
const chunk = c.substring(i-100, i+400);
chunk.split("\r\n").forEach(l => console.log(JSON.stringify(l)));
