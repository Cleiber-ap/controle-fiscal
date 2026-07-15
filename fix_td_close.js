const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 681; i < 690; i++) {
  if (lines[i].includes('/>Parcial') && lines[i+1] && lines[i+1].includes('</span>') && lines[i+2] && lines[i+2].includes('<td style={tdBase({ textAlign:')) {
    lines.splice(i+2, 0, '                              </td>');
    console.log('OK linha', i+3);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
