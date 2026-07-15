const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("textAlign: 'right', fontWeight: 600") && lines[i].includes('fmtR(valorNF)')) {
    lines[i] = lines[i].replace("color: '#E8EAF0' })", "color: '#E8EAF0', whiteSpace: 'nowrap', minWidth: '110px' })");
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
