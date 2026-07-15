const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
let count = 0;
for (let i = 674; i < 685; i++) {
  if (lines[i] && lines[i].includes("tdSm({ textAlign: 'center' })")) {
    lines[i] = lines[i].replace(/tdSm\({ textAlign: 'center' }\)/g, "tdBase({ textAlign: 'center', whiteSpace: 'nowrap' })");
    count++;
    console.log('OK linha', i+1);
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('Total:', count);
