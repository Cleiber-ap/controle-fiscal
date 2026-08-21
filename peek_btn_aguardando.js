const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i = c.indexOf("setEditando(isSaldoEdit ? null : r.numero_nf + '-saldo')");
console.log(JSON.stringify(c.substring(i-100, i+350)));
