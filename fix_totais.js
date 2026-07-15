const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "<td colSpan={3} style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 700, color: '#7B82A0' }}>TOTAIS</td>";
const novo = "<td colSpan={4} style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 700, color: '#7B82A0' }}>TOTAIS</td>";
if (c.indexOf(old) === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
