const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Fix editarPagamento - campo vazio = 0
c = c.replace(
  "      const val = parseFloat(editPgtoVal.replace(',', '.'))",
  "      const val = editPgtoVal.trim() === '' ? 0 : (parseFloat(editPgtoVal.replace(',', '.')) || 0)"
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
