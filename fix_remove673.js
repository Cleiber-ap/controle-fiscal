const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
console.log('673:', lines[673].substring(0,80));
lines.splice(673, 1);
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
