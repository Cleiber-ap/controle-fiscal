const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split(
  "{ background: '#13161F', border: '1px solid #252836', borderRadius: '12px', overflow: 'hidden' }"
).join(
  "{ background: '#13161F', border: '1px solid #252836', borderRadius: '12px', overflow: 'hidden', width: 'fit-content' }"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK - trocas:', (c.match(/fit-content/g)||[]).length);
