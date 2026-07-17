const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i2 = c.indexOf("await api.put(\"/notas/pagamento/contabilizacao/\" + pg.id, { data_contabilizacao: val })");
console.log("=== ONBLUR PARCIAL ===");
console.log(JSON.stringify(c.substring(i2-400, i2+250)));
