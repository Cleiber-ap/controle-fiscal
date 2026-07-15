const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Usuarios/index.tsx', 'utf8');

c = c.replace(
  "  { id: 'exp', nome: 'Exportar Excel' },\n]",
  "  { id: 'exp', nome: 'Exportar Excel' },\n  { id: 'encargos', nome: 'Encargos' },\n]"
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Usuarios/index.tsx', c, 'utf8');
console.log('OK');
