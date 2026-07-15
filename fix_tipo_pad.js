const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace("padding: '1px 4px', background:", "padding: '1px 2px', background:");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
