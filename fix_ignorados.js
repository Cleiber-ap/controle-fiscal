const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');

const old = "  const [ignorados, setIgnorados] = useState<Set<number>>(new Set())";
const novo = "  const [ignorados, setIgnorados] = useState<Set<number>>(() => {\n    try { const s = localStorage.getItem('ignorados_dev'); return s ? new Set(JSON.parse(s)) : new Set() } catch { return new Set() }\n  })";
if (c.indexOf(old) === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);

const old2 = "setIgnorados(prev => new Set([...prev, aj.id]))";
const novo2 = "setIgnorados(prev => { const n = new Set([...prev, aj.id]); localStorage.setItem('ignorados_dev', JSON.stringify([...n])); return n })";
if (c.indexOf(old2) === -1) { console.log('TRECHO 2 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old2, novo2);

fs.writeFileSync(f, c, 'utf8');
console.log('OK');
