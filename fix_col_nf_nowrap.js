const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("width: '70px', maxWidth: '70px'") && lines[i].includes('nfBg')) {
    lines[i] = lines[i].replace("width: '70px', maxWidth: '70px'", "width: '70px', maxWidth: '70px', whiteSpace: 'nowrap'");
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
