const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace("Destinat\u00e1rio','Tipo','CNPJ Dest.", "Tipo','Destinat\u00e1rio','CNPJ Dest.");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
