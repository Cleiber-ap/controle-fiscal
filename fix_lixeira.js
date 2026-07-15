const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 680; i < 688; i++) {
  if (lines[i] && lines[i].includes('excluirPagamento(pg.id)') && lines[i+1] && lines[i+1].includes("border: '1px solid #F87171'")) {
    lines[i+1] = lines[i+1].replace("border: '1px solid #F87171'", "border: '1px solid #252836'");
    console.log('OK linha', i+2);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
