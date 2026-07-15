const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Usuarios/index.tsx', 'utf8');

const idx = c.indexOf("{ id: 'exp', nome: 'Exportar Excel' }");
if (idx === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }

const end = c.indexOf(']', idx);
c = c.slice(0, end) + "  { id: 'encargos', nome: 'Encargos' },\n" + c.slice(end);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Usuarios/index.tsx', c, 'utf8');
console.log('OK');
