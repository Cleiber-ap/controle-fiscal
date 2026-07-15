const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 710; i < 725; i++) {
  if (lines[i] && lines[i].includes('lista.length + 1}</span></td>') && lines[i+1] && lines[i+1].includes('Pagamento parcial {lista.length + 1}')) {
    lines.splice(i+1, 0, "                            <td style={tdSm()}></td>");
    console.log('Tipo OK linha', i+2);
    break;
  }
}
// Adicionar celula Ajuste antes dos botoes
for (let i = 718; i < 735; i++) {
  if (lines[i] && lines[i].includes('tdSm()>') && lines[i+1] && lines[i+1].includes('Parcial')) {
    for (let j = i+1; j < i+10; j++) {
      if (lines[j] && lines[j].includes('</td>') && lines[j+1] && lines[j+1].includes("tdSm({ textAlign: 'center' })")) {
        lines.splice(j+1, 0, "                            <td style={tdSm({ textAlign: 'center' })}></td>");
        console.log('Ajuste OK linha', j+2);
        break;
      }
    }
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
