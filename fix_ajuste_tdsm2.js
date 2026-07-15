const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 675; i < 682; i++) {
  if (lines[i] && lines[i].includes("tdBase({ textAlign: 'center', whiteSpace: 'nowrap' })}{isVenda")) {
    lines[i] = lines[i].replace("tdBase({ textAlign: 'center', whiteSpace: 'nowrap' })", "tdSm({ textAlign: 'center' })");
    console.log('OK linha', i+1);
  }
  if (lines[i] && lines[i].includes("tdBase({ textAlign: 'center', whiteSpace: 'nowrap' })>") && !lines[i].includes('isVenda')) {
    lines[i] = lines[i].replace("tdBase({ textAlign: 'center', whiteSpace: 'nowrap' })", "tdSm({ textAlign: 'center', whiteSpace: 'nowrap' })");
    console.log('OK2 linha', i+1);
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
