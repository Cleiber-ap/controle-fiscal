const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
lines[726] = '                            </td>';
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
