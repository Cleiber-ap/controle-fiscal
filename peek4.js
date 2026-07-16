const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const idxAjuste = c.indexOf("ajustadosPg[pg.id]");
console.log(JSON.stringify(c.substring(idxAjuste-1500, idxAjuste-900)));
