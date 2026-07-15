const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('/>Parcial') && lines[i+1] && lines[i+1].trim() === '</span>' && lines[i+2] && lines[i+2].trim() === '</td>' && lines[i+3] && lines[i+3].includes("textAlign: 'center'")) {
    lines.splice(i+3, 0, "                              <td style={tdSm({ textAlign: 'center', width: '30px', maxWidth: '30px' })}></td>");
    console.log('OK linha', i+4);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
