const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i = c.indexOf("<select value={filtroMesContb}");
console.log(JSON.stringify(c.substring(i+1150, i+1350)));
