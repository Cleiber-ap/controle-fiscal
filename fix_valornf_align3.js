const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
const l = lines[654];
console.log('linha:', l);
// Reconstruir a linha completa
lines[654] = "                              <td style={tdBase({ textAlign: 'right', fontWeight: 600, color: '#E8EAF0' })}>{r.valor_nf ? fmtR(parseFloat(r.valor_nf)) : '\u2014'}</td>";
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
