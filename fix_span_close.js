const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
// linha 726 (index 726) tem </td> errado, deve ser </span>
// linha 727 tem </td> sobrando
lines[726] = '                              </span>';
lines[727] = '                            </td>';
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
