const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

// 1. Adicionar celula Ajuste antes do botao editar na linha aguardando
for (let i = 722; i < 732; i++) {
  if (lines[i] && lines[i].includes('Aguardando') && lines[i+1] && lines[i+1].trim() === '</span>') {
    for (let j = i+1; j < i+6; j++) {
      if (lines[j] && lines[j].includes('</td>') && lines[j+1] && lines[j+1].includes("tdSm({ textAlign: 'center' })") && lines[j+2] && lines[j+2].includes('setEditando')) {
        lines.splice(j+1, 0, "                            <td style={tdSm({ textAlign: 'center' })}></td>");
        console.log('Ajuste aguardando OK linha', j+2);
        break;
      }
    }
    break;
  }
}

// 2. Remover borda vermelha da lixeira na linha parcial
for (let i = 0; i < lines.length; i++) {
  if (lines[i] && lines[i].includes("border: '1px solid #F87171'") && lines[i].includes('excluirPagamento')) {
    lines[i] = lines[i].replace("border: '1px solid #F87171'", "border: '1px solid #252836'");
    console.log('Borda lixeira OK linha', i+1);
  }
}

fs.writeFileSync(f, lines.join('\n'), 'utf8');
