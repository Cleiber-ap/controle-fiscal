const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split(
  "<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>"
).join(
  "<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', tableLayout: 'fixed' }}>\n" +
  "              <colgroup><col style={{ width: '38%' }}/><col style={{ width: '13%' }}/><col style={{ width: '22%' }}/><col style={{ width: '15%' }}/><col style={{ width: '12%' }}/></colgroup>"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
