const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
const line = lines[659];
const start = line.indexOf('}>') + 2;
const end = line.indexOf('</td>');
lines[659] = line.substring(0, start) + line.substring(end);
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
