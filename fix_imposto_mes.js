const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "if (mm === mesAntIdx + 1 && aa === anoAnt && primeiroPagamento > 0) {";
const novo = "const now2 = new Date(); const mesCont = now2.getMonth() + 1; const anoCont = now2.getFullYear(); if (((mm === mesAntIdx + 1 && aa === anoAnt) || (mm === mesCont && aa === anoCont)) && primeiroPagamento > 0) {";
if (c.indexOf(old) === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
