const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
let count = 0;
for (let i = 649; i < 692; i++) {
  if (lines[i] && lines[i].includes('tdSm(')) {
    lines[i] = lines[i].replace(/tdSm\(/g, 'tdBase(');
    count++;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK -', count);
