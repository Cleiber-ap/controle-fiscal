const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c
  .replace("{k:'salario_base',l:'Sal\u00E1rio Base (R$)',t:'number'}", "{k:'salario_base',l:'Sal\u00E1rio Base (R$)',t:'text'}")
  .replace("{k:'salario_dinheiro',l:'Sal. em Dinheiro (R$)',t:'number'}", "{k:'salario_dinheiro',l:'Sal. em Dinheiro (R$)',t:'text'}")
  .replace("{k:'empresa_id',l:'Empresa (1=SIX, 2=ENOVA)',t:'number'}", "{k:'empresa_id',l:'Empresa (1=SIX, 2=ENOVA)',t:'text'}");

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
