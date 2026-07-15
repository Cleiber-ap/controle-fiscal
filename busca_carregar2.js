const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');
let pos = 0, i = 0;
while ((pos = c.indexOf('await carregarTudo()', pos)) !== -1) {
  const start = c.lastIndexOf('\n', pos);
  const end = c.indexOf('\n', c.indexOf('\n', pos) + 1);
  console.log('---', i++, JSON.stringify(c.slice(start, end)));
  pos++;
}
