const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
const l = lines[654];
const idx = l.indexOf("tdBase({ textAlign: 'right', fontWeight: 600, color: '#E8EAF0' })>");
if (idx > -1) {
  lines[654] = l.substring(0, idx) + "tdBase({ textAlign: 'right', fontWeight: 600, color: '#E8EAF0' })}>" + l.substring(idx + 68);
  console.log('OK');
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
