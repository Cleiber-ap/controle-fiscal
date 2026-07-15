const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "textAlign: 'center', whiteSpace: 'nowrap', fontSize: '10px', padding: '8px 4px'";
const novo = "textAlign: 'center', whiteSpace: 'nowrap', fontSize: '10px', padding: '8px 4px', width: '40px', maxWidth: '40px'";
if (c.indexOf(old) === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
