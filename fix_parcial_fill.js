const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
lines[653] = lines[653].replace('}></td>', '}>{fmtCNPJ(r.cnpj_dest)}</td>');
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK:', lines[653].substring(0,80));
