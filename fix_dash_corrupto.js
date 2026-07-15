const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
const start = lines[724].indexOf('}>') + 2;
const end = lines[724].indexOf('</td>');
lines[724] = lines[724].substring(0, start) + '\u2014' + lines[724].substring(end);
console.log('OK:', lines[724].substring(0,80));
fs.writeFileSync(f, lines.join('\n'), 'utf8');
