const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');
c = c.split("        </div>\n      {aba === 'feriados'").join("        </div>\n      )}\n      {aba === 'feriados'");
fs.writeFileSync(p, c, 'utf8');
console.log('OK');
