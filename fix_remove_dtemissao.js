const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
if (lines[717] && lines[717].includes('data_emissao')) {
  lines.splice(717, 1);
  console.log('OK removido linha 718');
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
