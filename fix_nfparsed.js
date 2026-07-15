const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('anoEmissao?: number') && lines[i+1] && lines[i+1].trim() === '}') {
    lines.splice(i+1, 0, '  tipo?: string');
    console.log('OK linha', i+2);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
