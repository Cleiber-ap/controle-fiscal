const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const matches = [...c.matchAll(/fmtCNPJ\(r\.cnpj_dest\)/g)];
console.log("Total ocorrencias de fmtCNPJ(r.cnpj_dest):", matches.length);
matches.forEach(m => {
  console.log(JSON.stringify(c.substring(m.index-120, m.index+20)));
});
