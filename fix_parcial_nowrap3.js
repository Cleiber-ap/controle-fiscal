const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
[651, 712].forEach(i => {
  lines[i] = lines[i].replace("fontStyle: 'italic' })", "fontStyle: 'italic', whiteSpace: 'nowrap' })");
  console.log('OK linha', i+1);
});
fs.writeFileSync(f, lines.join('\n'), 'utf8');
