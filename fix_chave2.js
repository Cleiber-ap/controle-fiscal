const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trimEnd() === '      }' && lines[i+1] && lines[i+1].trimEnd() === '      }' && lines[i+2] && lines[i+2].includes('setResultado')) {
    lines.splice(i, 1);
    console.log('Removido na linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
