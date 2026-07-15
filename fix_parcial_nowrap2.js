const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
let count = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Pagamento parcial') && lines[i].includes("fontStyle: 'italic'") && !lines[i].includes("whiteSpace")) {
    lines[i] = lines[i].replace("fontStyle: 'italic' })", "fontStyle: 'italic', whiteSpace: 'nowrap' })");
    count++;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK -', count, 'substituicoes');
