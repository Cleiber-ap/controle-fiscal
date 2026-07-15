const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
if (lines[721] && lines[721].includes("textAlign: 'right', color: '#4A5070', fontSize: '11px'") && lines[720] && lines[720].includes("textAlign: 'right', color: '#4A5070', fontSize: '11px'")) {
  lines.splice(721, 1);
  console.log('OK removido linha 722');
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
