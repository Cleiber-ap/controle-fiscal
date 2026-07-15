const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
[715, 716].forEach(i => {
  lines[i] = lines[i].replace('<span style={{color:"#4A5070"}}>\u2014</span>', '<span style={{color:"#4A5070"}}>\u2014</span>');
  lines[i] = lines[i].replace(/<span style=\{[^}]+\}>[^<]*<\/span><\/td>/, '></td>');
  console.log('OK linha', i+1, lines[i].substring(0,60));
});
fs.writeFileSync(f, lines.join('\n'), 'utf8');
