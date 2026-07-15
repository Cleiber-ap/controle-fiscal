const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace("width: '30px', minWidth: '30px'", "width: '20px', minWidth: '20px', padding: '8px 2px'");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
