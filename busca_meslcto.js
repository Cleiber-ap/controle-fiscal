const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');
let pos = 0, i = 0;
while ((pos = c.indexOf('Mês Lçto', pos)) !== -1) {
  const start = c.lastIndexOf('\n', pos);
  const end = c.indexOf('\n', pos);
  console.log('---', i++, JSON.stringify(c.slice(start, end)));
  pos++;
}
