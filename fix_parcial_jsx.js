const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
const line = lines[660];
const start = line.indexOf('}>') + 2;
const end = line.indexOf('</td>');
lines[660] = line.substring(0, start) + 'Parcial ' + '{idx + 2}' + line.substring(end);
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK:', lines[660].substring(start, end + 5));
