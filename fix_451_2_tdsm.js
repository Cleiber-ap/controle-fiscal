const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
let count = 0;
for (let i = 670; i < 688; i++) {
  if (lines[i] && lines[i].includes('tdBase(')) {
    lines[i] = lines[i].replace(/tdBase\(/g, 'tdSm(');
    count++;
    console.log('OK linha', i+1);
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('Total:', count);
