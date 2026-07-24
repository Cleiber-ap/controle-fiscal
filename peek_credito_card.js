const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx", "utf8");
const i = c.indexOf("filter((cr:any)=>cr.status===\x27pendente\x27).map");
console.log(JSON.stringify(c.substring(i-30, i+350)));
