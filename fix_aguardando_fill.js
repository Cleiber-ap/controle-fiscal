const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
// CNPJ (linha 715, index 715)
lines[715] = "                            <td style={tdSm({ color: '#4A5070', ...mono, fontSize: '11px' })}>{fmtCNPJ(r.cnpj_dest)}</td>";
// Valor NF (linha 716, index 716)
lines[716] = "                            <td style={tdSm({ textAlign: 'right', color: '#4A5070', ...mono, fontSize: '11px' })}>{r.valor_nf ? fmtR(parseFloat(r.valor_nf)) : '\u2014'}</td>";
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
