const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 710; i < 720; i++) {
  if (lines[i] && lines[i].includes('r.destinatario') && lines[i].includes('lista.length + 1')) {
    lines[i] = lines[i].replace(/\}>\{r\.destinatario\}[^<]*<\/td>/, "}>Pagamento parcial {lista.length + 1}</td>");
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
