const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace("minWidth: '1200px'", "minWidth: '1400px'");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
