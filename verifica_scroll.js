const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

console.log('1. scrollParaAguardando state:', c.includes('scrollParaAguardando'));
console.log('2. useEffect scroll:', c.includes('scrollParaAguardando && !loading'));
console.log('3. setScrollParaAguardando(true) count:', (c.match(/setScrollParaAguardando\(true\)/g) || []).length);
console.log('4. data-aguardando tr:', c.includes('data-aguardando="true"'));
console.log('5. querySelector:', c.includes('data-aguardando'));
