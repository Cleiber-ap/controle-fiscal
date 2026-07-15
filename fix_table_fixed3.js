const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace("width: '100%', borderCollapse: 'collapse', fontSize: '12px'", "width: '100%', borderCollapse: 'collapse', fontSize: '12px', tableLayout: 'fixed'");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
