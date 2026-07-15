const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 720; i < 728; i++) {
  if (lines[i] && lines[i].includes('</span>') && lines[i].includes('\u2014</td>')) {
    lines[i] = lines[i].replace(' \u2014</td>', '</td>');
    console.log('OK linha', i+1);
    break;
  }
}
// Limpar celula corrompida
for (let i = 724; i < 728; i++) {
  if (lines[i] && lines[i].includes('\ufffd')) {
    lines[i] = lines[i].replace(/>[^<]*\ufffd[^<]*<\/td>/, '></td>');
    console.log('Corrompido OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
