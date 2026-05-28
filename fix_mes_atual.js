const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /const \[mesRef, setMesRef\] = useState\(\(\) => \{[^}]*\}\)/,
  "const [mesRef, setMesRef] = useState(() => { const d = new Date(); return { mes: d.getMonth() + 1, ano: d.getFullYear() } })"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
