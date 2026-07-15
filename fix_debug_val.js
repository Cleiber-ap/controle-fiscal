const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

c = c.replace(
  "      let response\n      if (val === 0) {",
  "      console.log('DEBUG val:', val, 'editPgtoVal:', JSON.stringify(editPgtoVal))\n      let response\n      if (val === 0) {"
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
