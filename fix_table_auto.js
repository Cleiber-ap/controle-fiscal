const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split(
  "<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', tableLayout: 'fixed' }}>"
).join(
  "<table style={{ width: 'auto', borderCollapse: 'collapse', fontSize: '11px' }}>"
);

// Remover colgroup que nao estava funcionando
c = c.replace(
  /\s*<colgroup>.*?<\/colgroup>/,
  ''
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
