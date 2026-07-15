const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 670; i < 680; i++) {
  if (lines[i] && lines[i].includes('tdBase()>') && lines[i+1] && lines[i+1].includes('rgba(79,142,247,0.12)')) {
    // Status esta em i..i+3, Ajuste em i+4
    const statusLines = lines.splice(i, 4);
    // Agora Ajuste esta em i
    // Inserir Status apos Ajuste
    const ajusteEnd = lines.indexOf(lines.find((l,j) => j >= i && l.includes('}</button>}</td>'))) + 1;
    for (let k = i; k < i+5; k++) {
      if (lines[k] && lines[k].includes('}</button>}</td>')) {
        lines.splice(k+1, 0, ...statusLines);
        console.log('OK');
        break;
      }
    }
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
