const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split(
  "{ background: '#13161F', border: '1px solid #252836', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }"
).join(
  "{ background: '#13161F', border: '1px solid #252836', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', width: 'fit-content' }"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
