const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split(
  "val: dasValSix || impSix.toFixed(2).replace('.', ',')"
).join(
  "val: dasValSix || impSixLiq.toFixed(2).replace('.', ',')"
);

c = c.split(
  "val: dasValEnova || impEnova.toFixed(2).replace('.', ',')"
).join(
  "val: dasValEnova || impEnovaLiq.toFixed(2).replace('.', ',')"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
