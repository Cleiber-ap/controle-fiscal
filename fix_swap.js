const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
const statusLines = lines.splice(673, 5); // remove Status (linhas 673-677)
lines.splice(678, 0, ...statusLines); // insere Status apos Ajuste (linha 678)
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
