const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');
const idx = c.indexOf('carregarTudo');
const start = c.lastIndexOf('\n', idx);
const end = c.indexOf('\n', idx + 50);
console.log(JSON.stringify(c.slice(start, end)));

// Ver se há algum useRef
const refIdx = c.indexOf('useRef');
if (refIdx !== -1) {
  const s = c.lastIndexOf('\n', refIdx);
  const e = c.indexOf('\n', refIdx + 100);
  console.log('useRef:', JSON.stringify(c.slice(s, e)));
}
