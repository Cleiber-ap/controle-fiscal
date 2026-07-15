const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
// Valor NF (linha 654, index 654)
lines[654] = lines[654].replace('}></td>', '}>{r.valor_nf ? fmtR(parseFloat(r.valor_nf)) : "—"}</td>');
console.log('OK 655:', lines[654].substring(0,80));
fs.writeFileSync(f, lines.join('\n'), 'utf8');
