const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 726; i < 734; i++) {
  if (lines[i] && lines[i].includes("tdSm({ textAlign: 'center' })") && lines[i+1] && lines[i+1].includes('setEditando')) {
    lines[i] = lines[i].replace("tdSm({ textAlign: 'center' })", "tdSm({ textAlign: 'center', whiteSpace: 'nowrap' })");
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
