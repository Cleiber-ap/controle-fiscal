const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
lines[653] = "                              <td style={tdBase({ color: '#4A5070', ...mono, fontSize: '11px' })}>{fmtCNPJ(r.cnpj_dest)}</td>";
lines[654] = "                              <td style={tdBase({ textAlign: 'right', fontWeight: 400, color: '#4A5070', ...mono, fontSize: '11px' })}>{r.valor_nf ? fmtR(parseFloat(r.valor_nf)) : '\u2014'}</td>";
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
