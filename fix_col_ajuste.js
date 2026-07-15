const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("textAlign: 'center', width: '50px', maxWidth: '50px'")) {
    lines[i] = lines[i].replace("width: '50px', maxWidth: '50px'", "width: '30px', maxWidth: '30px', padding: '8px 4px'");
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
