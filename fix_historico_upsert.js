const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/backend/app/routers/historico.py', 'utf8');

c = c.replace(
  'existing.valor = existing.valor + dados.valor  # acumular',
  'existing.valor = dados.valor  # substituir pelo valor recalculado do frontend'
);

fs.writeFileSync('C:/projetos/controle-fiscal/backend/app/routers/historico.py', c, 'utf8');
console.log('OK');
