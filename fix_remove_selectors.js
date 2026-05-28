const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');

// Remove o div completo com os seletores de mes, ano e dias uteis
c = c.replace(
  /<div style=\{\{ display: 'flex', gap: 10, alignItems: 'center' \}\}>[\s\S]*?<\/div>/,
  ''
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
