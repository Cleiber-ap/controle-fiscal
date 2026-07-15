const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace("width: '40px', maxWidth: '40px'", "width: '25px', maxWidth: '25px'");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
