const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");

const antes1 = (c.match(/\.filter\(Boolean\)\.sort\(\)/g) || []).length;
c = c.split(".filter(Boolean).sort()").join(".filter(Boolean).sort().reverse()");

const antes2 = (c.match(/\.filter\(Boolean\)\)\]\.sort\(\)\.reverse\(\)\.reverse\(\)/g) || []).length;
// evitar duplo reverse se o padrao acima ja tiver pego esse caso
if (antes2 === 0) {
  c = c.split(".filter(Boolean))].sort()").join(".filter(Boolean))].sort().reverse()");
}

fs.writeFileSync(f, c, "utf8");
console.log("OK - filtros Pagamento, Contabilizacao e Emissao agora ordenados decrescente");
