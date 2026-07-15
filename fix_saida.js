const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('value="saida"') && lines[i].includes('Sa')) {
    lines[i] = '                <option value="saida">Sa\u00EDda</option>';
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
