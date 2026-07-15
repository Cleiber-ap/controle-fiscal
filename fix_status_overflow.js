const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 570; i < 580; i++) {
  if (lines[i] && lines[i].includes("tdBase()") && lines[i+1] && lines[i+1].includes("stStyle.bg")) {
    lines[i] = lines[i].replace("tdBase()", "tdBase({ overflow: 'hidden' })");
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
