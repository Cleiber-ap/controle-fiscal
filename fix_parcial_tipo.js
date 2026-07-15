const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('r.numero_nf}/{idx + 2}') && lines[i+1] && lines[i+1].trim() === '<td style={tdSm()}></td>') {
    lines[i+1] = "                              <td style={tdSm({ width: '20px', minWidth: '20px', maxWidth: '20px', padding: '8px 2px' })}></td>";
    console.log('OK linha', i+2);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
