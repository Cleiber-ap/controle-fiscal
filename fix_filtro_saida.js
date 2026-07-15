const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace('<option value="saida">Sa\u00edda</option>', '<option value="saida">Sa\u00EDda</option>');
c = c.replace(/Sa\?da/g, 'Sa\u00EDda');
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
