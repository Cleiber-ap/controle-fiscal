const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /else \{ diasSegSab\+\+; diasUteis\+\+; if \(dow >= 1 && dow <= 5\) diasVT\+\+ \}/,
  "else { diasSegSab++; if (dow >= 1 && dow <= 5) { diasUteis++; diasVT++ } }"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
