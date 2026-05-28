const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx';
let c = fs.readFileSync(p, 'utf8');

// Remove a primeira ocorrencia do bloco Colaboradores (antes de Fiscal)
// Estrategia: remove tudo entre o primeiro {/* Colaboradores */} e {/* Fiscal */}
c = c.replace(/[ \t]*\{\/\* Colaboradores \*\/\}[\s\S]*?\{\/\* Fiscal \*\/\}/, '{/* Fiscal */}');

fs.writeFileSync(p, c, 'utf8');
const count = (c.match(/Colaboradores/g) || []).length;
console.log('OK - ocorrencias Colaboradores:', count);
