const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /useState\(\(\) => \{ const d = new Date\(\); return \{ mes: d\.getMonth\(\) === 0 \? 12 : d\.getMonth\(\), ano: d\.getMonth\(\) === 0 \? d\.getFullYear\(\) - 1 : d\.getFullYear\(\) \} \}\)/,
  "useState(() => { const d = new Date(); return { mes: d.getMonth() + 1, ano: d.getFullYear() } })"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
