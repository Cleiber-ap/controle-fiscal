const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx', 'utf8');
const idx = c.indexOf('temPermissao');
console.log('Ocorrencias temPermissao:', (c.match(/temPermissao/g) || []).length);
// Mostrar todas as ocorrências
let i = 0;
let pos = 0;
while ((pos = c.indexOf('temPermissao', pos)) !== -1) {
  const start = c.lastIndexOf('\n', pos);
  const end = c.indexOf('\n', pos);
  console.log('---', i++, JSON.stringify(c.slice(start, end)));
  pos++;
}
