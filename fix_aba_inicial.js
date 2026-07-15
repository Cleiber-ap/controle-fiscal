const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx', 'utf8');
c = c.replace(
  "useState<'anual' | 'mensal' | 'impostos'>('anual')",
  "useState<'anual' | 'mensal' | 'impostos'>('mensal')"
);
fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx', c, 'utf8');
console.log('OK');
