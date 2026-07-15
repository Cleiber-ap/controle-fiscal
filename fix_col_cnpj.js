const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "<td style={tdBase({ color: '#7B82A0', ...mono, fontSize: '11px' })}>{fmtCNPJ(r.cnpj_dest)}</td>";
const novo = "<td style={tdBase({ color: '#7B82A0', ...mono, fontSize: '11px', width: '120px', maxWidth: '120px' })}>{fmtCNPJ(r.cnpj_dest)}</td>";
if (c.indexOf(old) === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
