const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.replace(
  /(empSix\.credito_icms \* 100)\.toFixed\(2\)\.replace\('\.', ','\) \+ '%'/,
  "(icmsAproveitavelSix * 100).toFixed(2).replace('.', ',') + '%'"
);

c = c.replace(
  /(empEnova\.credito_icms \* 100)\.toFixed\(2\)\.replace\('\.', ','\) \+ '%'/,
  "(icmsAproveitavelEnova * 100).toFixed(2).replace('.', ',') + '%'"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
