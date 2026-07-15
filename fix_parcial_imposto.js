const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 668; i < 676; i++) {
  if (lines[i] && lines[i].trim() === '</td>' && lines[i+1] && lines[i+1].includes("tdSm()>") && lines[i+2] && lines[i+2].includes('rgba(79,142,247,0.12)')) {
    lines.splice(i+1, 0, "                              <td style={tdSm({ textAlign: 'right', color: '#4A5070', fontSize: '11px' })}>—</td>");
    console.log('OK linha', i+2);
    break;
  }
}
// Remover borda vermelha da lixeira
for (let i = 678; i < 688; i++) {
  if (lines[i] && lines[i].includes('excluirPagamento') && lines[i+1] && lines[i+1].includes("border: '1px solid #F87171'")) {
    lines[i+1] = lines[i+1].replace("border: '1px solid #F87171'", "border: '1px solid #252836'");
    console.log('Lixeira OK linha', i+2);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
