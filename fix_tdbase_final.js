const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 671; i < 680; i++) {
  if (lines[i] && lines[i].includes('tdSm(')) {
    lines[i] = lines[i].replace(/tdSm\(/g, 'tdBase(');
    console.log('OK linha', i+1);
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
