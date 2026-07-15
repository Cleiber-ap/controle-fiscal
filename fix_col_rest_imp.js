const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
let fixed = 0;
for (let i = 0; i < lines.length; i++) {
  // Coluna Restante (linha 526)
  if (lines[i].includes("tdBase({ textAlign: 'right', ...mono, fontSize: '11px' })") && lines[i].includes('temSaldoReal') === false && fixed === 0) {
    lines[i] = lines[i].replace("tdBase({ textAlign: 'right', ...mono, fontSize: '11px' })", "tdBase({ textAlign: 'right', ...mono, fontSize: '11px', whiteSpace: 'nowrap', minWidth: '100px' })");
    console.log('Restante OK linha', i+1);
    fixed++;
  }
  // Coluna Imposto
  if (lines[i].includes("tdBase({ textAlign: 'right', ...mono, fontSize: '11px' })") && fixed === 1) {
    lines[i] = lines[i].replace("tdBase({ textAlign: 'right', ...mono, fontSize: '11px' })", "tdBase({ textAlign: 'right', ...mono, fontSize: '11px', whiteSpace: 'nowrap', minWidth: '100px' })");
    console.log('Imposto OK linha', i+1);
    fixed++;
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('Done', fixed, 'fixes');
