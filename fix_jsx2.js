const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');
c = c.split("      {aba === 'feriados'").join("      )}\n      {aba === 'feriados'");
fs.writeFileSync(p, c, 'utf8');
console.log('OK - ocorrencias:', (c.match(/aba === 'feriados'/g)||[]).length);
