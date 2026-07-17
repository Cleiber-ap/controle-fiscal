const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i1 = c.indexOf("await api.put(\"/notas/pagamento/contabilizacao/\" + lista[0].id");
console.log("=== ONBLUR ORIGINAL (temHistorico) ===");
console.log(JSON.stringify(c.substring(i1-500, i1+400)));
