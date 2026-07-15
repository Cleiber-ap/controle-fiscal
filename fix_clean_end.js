const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
// Remove caracteres extras no final
while (c.endsWith('\n."\n') || c.endsWith('.\n') || c.endsWith('"\n')) {
  c = c.replace(/\n\."?\n?$/, '\n').replace(/\."?\n?$/, '\n');
}
fs.writeFileSync(f, c.trimEnd() + '\n', 'utf8');
console.log('OK - ultimas chars:', JSON.stringify(c.slice(-20)));
