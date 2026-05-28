const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');
c = c.split(
  "    showNotif('Feriado salvo!')\n    carregar()\n  }\n  const excluirFeriado"
).join(
  "    showNotif('Feriado salvo!')\n    await carregar()\n  }\n  const excluirFeriado"
);
fs.writeFileSync(p, c, 'utf8');
console.log('OK');
