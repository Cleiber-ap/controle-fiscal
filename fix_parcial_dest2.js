const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 649; i < 660; i++) {
  if (lines[i] && lines[i].includes('r.destinatario') && lines[i].includes('Pagamento parcial')) {
    lines[i] = lines[i].replace(/\}>\{r\.destinatario\}[^<]*<\/td>/, "}>Pagamento parcial {idx + 2}</td>");
    console.log('OK linha', i+1);
    break;
  }
}
// Esvaziar celula CNPJ
for (let i = 649; i < 662; i++) {
  if (lines[i] && lines[i].includes('fmtCNPJ(r.cnpj_dest)')) {
    lines[i] = lines[i].replace('>{fmtCNPJ(r.cnpj_dest)}</td>', '></td>');
    console.log('CNPJ OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
