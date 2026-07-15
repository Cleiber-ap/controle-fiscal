const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace("tableLayout: 'fixed', ", "");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
