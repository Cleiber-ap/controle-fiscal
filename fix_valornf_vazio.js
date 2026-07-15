const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
const start = lines[654].indexOf('}>') + 2;
const end = lines[654].indexOf('</td>');
lines[654] = lines[654].substring(0, start) + lines[654].substring(end);
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
