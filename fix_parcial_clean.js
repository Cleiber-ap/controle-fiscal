const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

// Linha 452 (idx 651) - substituir destinatario por texto fixo
lines[651] = lines[651].replace(/>\{r\.destinatario\}[^<]*<\/td>/, ">Pagamento parcial {idx + 2}</td>");
// Linha 453 (idx 652) - esvaziar CNPJ
lines[652] = lines[652].replace(/>\{fmtCNPJ\(r\.cnpj_dest\)\}<\/td>/, "></td>");

// Linha 713 (idx 712) - substituir destinatario por texto fixo
lines[712] = lines[712].replace(/>\{r\.destinatario\}[^<]*<\/td>/, ">Pagamento parcial {lista.length + 1}</td>");
// Linha 714 (idx 713) - esvaziar CNPJ
lines[713] = lines[713].replace(/>\{fmtCNPJ\(r\.cnpj_dest\)\}<\/td>/, "></td>");

fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
console.log('651:', lines[651].substring(0,80));
console.log('652:', lines[652].substring(0,80));
console.log('712:', lines[712].substring(0,80));
console.log('713:', lines[713].substring(0,80));
