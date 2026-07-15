const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace("const tdSm = (extra?: any) => ({ padding: '5px 12px'", "const tdSm = (extra?: any) => ({ padding: '6px 12px'");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
