const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 720; i < 728; i++) {
  if (lines[i] && lines[i].trim() === '</td>' && lines[i+1] && lines[i+1].includes("tdSm({ textAlign: 'center' })") && lines[i+2] && lines[i+2].includes('setEditando')) {
    lines.splice(i+1, 0, 
      "                            <td style={tdSm({ textAlign: 'right', color: '#4A5070', fontSize: '11px' })}>—</td>",
      "                            <td style={tdSm({ textAlign: 'center' })}></td>"
    );
    console.log('OK linha', i+2);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
