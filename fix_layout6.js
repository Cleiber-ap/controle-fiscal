const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /(\s*)\{\/\* Colaboradores \*\/\}/,
  "\n        <div style={{ height: '1px', background: '#252836', margin: '6px 14px' }} />\n\n        {/* Colaboradores */}"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
