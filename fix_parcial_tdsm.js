const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
let count = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('r.numero_nf}/{idx + 2}')) {
    // Substituir tdSm por tdBase nas proximas 13 linhas de td
    for (let j = i; j < i + 30; j++) {
      if (lines[j].includes('tdSm(')) {
        lines[j] = lines[j].replace(/tdSm\(/g, 'tdBase(');
        count++;
      }
    }
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK -', count, 'substituicoes');
