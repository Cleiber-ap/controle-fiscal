const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 683; i < 695; i++) {
  if (lines[i] && lines[i].includes("tdBase({ textAlign: 'center' })") && lines[i+1] && lines[i+1].includes('setEditandoPgto')) {
    lines[i] = lines[i].replace("tdBase({ textAlign: 'center' })", "tdBase({ textAlign: 'center', whiteSpace: 'nowrap' })");
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
