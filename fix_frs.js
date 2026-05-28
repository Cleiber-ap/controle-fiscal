const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');

// Adicionar fetch feriados no Promise.all usando regex para lidar com CRLF
c = c.replace(
  /(\s*fetch\(API \+ `\/funcionarios\/horas\/\$\{mesRef\.ano\}\/\$\{mesRef\.mes\}`[^\n]+\.catch\(\(\) => \(\{\}\)\),)\s*\]\)/,
  "$1\n      fetch(API + '/funcionarios/feriados/', { headers: hdr() }).then(r => r.json()).catch(() => []),\n    ])"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
