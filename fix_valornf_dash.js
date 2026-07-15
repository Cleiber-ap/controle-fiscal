const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
lines[654] = lines[654].replace('}></td>', '}><span style={{color:"#4A5070"}}>—</span></td>');
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
