const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 710; i < 718; i++) {
  if (lines[i] && lines[i].includes('lista.length + 1}</span></td>') && lines[i+1] && lines[i+1].includes('Pagamento parcial {lista.length + 1}')) {
    lines.splice(i+1, 0, "                            <td style={tdSm()}></td>");
    if (lines[i+3] && lines[i+3].includes('tdSm({ color:') && lines[i+3].includes('})}></td>')) {
      lines.splice(i+3, 1);
      console.log('CNPJ removido');
    }
    console.log('OK');
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
