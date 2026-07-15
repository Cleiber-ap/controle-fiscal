const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('mes_lancamento') && lines[i].includes('tdBase')) {
    lines.splice(i, 1);
    console.log('Removido L' + (i+1));
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
