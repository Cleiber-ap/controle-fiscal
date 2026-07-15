const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 718; i < 724; i++) {
  if (lines[i] && lines[i].includes('tdSm()>') && lines[i+1] && lines[i+1].includes('Aguardando')) {
    lines.splice(i, 0, "                            <td style={tdSm({ textAlign: 'right', color: '#4A5070', fontSize: '11px' })}>—</td>");
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
