const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "  if (sl.includes('devolu')) return { bg: 'rgba(248,113,113,0.12)', cor: '#F87171' }";
const novo = "  if (sl.includes('devolu')) return { bg: 'rgba(79,142,247,0.12)', cor: '#4F8EF7' }";
if (c.indexOf(old) === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
