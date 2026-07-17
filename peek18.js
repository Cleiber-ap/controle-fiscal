const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
console.log("aliqEfetivaCont declarations:", (c.match(/const aliqEfetivaCont/g) || []).length);
console.log("rbt12Cont declarations:", (c.match(/const rbt12Cont/g) || []).length);
console.log("tPagoPorDtPagamento declarations:", (c.match(/const tPagoPorDtPagamento/g) || []).length);
console.log("hist usages:", (c.match(/\bhist\b/g) || []).length);
