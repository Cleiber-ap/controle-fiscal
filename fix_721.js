const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
const start = lines[721].indexOf('}>') + 2;
const end = lines[721].indexOf('</td>');
lines[721] = lines[721].substring(0, start) + lines[721].substring(end);
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK:', lines[721].substring(0,80));
