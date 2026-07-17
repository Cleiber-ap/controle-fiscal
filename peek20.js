const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i = c.indexOf("<select value={filtroMesPagto}");
console.log(JSON.stringify(c.substring(i+700, i+1200)));
