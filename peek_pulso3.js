const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i = c.indexOf('setEditandoContb("pgto-" + pg.id); setEditContbVal(pg.data_contabilizacao');
console.log(JSON.stringify(c.substring(i-30, i+400)));
