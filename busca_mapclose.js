const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');
const idx = c.indexOf('</React.Fragment>');
// Pegar as últimas ocorrências
let pos = 0, last = -1;
while ((pos = c.indexOf('</React.Fragment>', pos)) !== -1) { last = pos; pos++; }
const end = c.indexOf('\n', c.indexOf('\n', c.indexOf('\n', last) + 1) + 1);
console.log(JSON.stringify(c.slice(last, end + 50)));
