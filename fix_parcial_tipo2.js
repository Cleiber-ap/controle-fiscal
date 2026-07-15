const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 648; i < 658; i++) {
  if (lines[i] && lines[i].includes('r.numero_nf}/{idx + 2}') && lines[i+1] && lines[i+1].includes('Pagamento parcial {idx + 2}')) {
    lines.splice(i+1, 0, "                              <td style={tdSm()}></td>");
    console.log('OK linha', i+2);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
