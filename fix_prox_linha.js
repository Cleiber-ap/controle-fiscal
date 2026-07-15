const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

// Substituir tdSm por tdBase nas linhas 715-745
for (let i = 714; i < 745; i++) {
  if (lines[i] && lines[i].includes('tdSm(')) {
    lines[i] = lines[i].replace(/tdSm\(/g, 'tdBase(');
  }
}

// Adicionar celula Tipo vazia apos o numero NF
for (let i = 714; i < 745; i++) {
  if (lines[i] && lines[i].includes('lista.length + 1}</span></td>') && lines[i+1] && lines[i+1].includes('Parcial {lista.length + 1}')) {
    lines.splice(i+1, 0, "                            <td style={tdBase({ width: '20px', minWidth: '20px', maxWidth: '20px', padding: '8px 2px' })}></td>");
    console.log('Tipo OK linha', i+2);
    break;
  }
}

fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
