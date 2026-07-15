const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
// Remover celula extra linha 727
if (lines[726] && lines[726].includes("textAlign: 'right', color: '#4A5070'") && lines[726].includes('})}></td>')) {
  lines.splice(726, 1);
  console.log('Extra removida');
}
// Mover Ajuste (agora linha 727) para antes do Status (linha 721)
const ajuste = lines.splice(726, 1)[0];
lines.splice(721, 0, ajuste);
console.log('OK');
fs.writeFileSync(f, lines.join('\n'), 'utf8');
