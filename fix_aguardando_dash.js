const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
let count = 0;
for (let i = 711; i < 720; i++) {
  if (lines[i] && lines[i].includes('tdBase()></td>')) {
    lines[i] = lines[i].replace('tdBase()></td>', 'tdBase()><span style={{color:"#4A5070"}}>—</span></td>');
    count++;
    console.log('OK linha', i+1);
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('Total:', count);
