const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

// 1. Limpar caractere corrompido na linha 725 (index 724)
const start724 = lines[724].indexOf('}>') + 2;
const end724 = lines[724].indexOf('</td>');
lines[724] = lines[724].substring(0, start724) + lines[724].substring(end724);
console.log('Fix 1 OK:', lines[724].substring(0,60));

// 2. Contar celulas linha 451/2 e verificar quantas tem
let count = 0;
for (let i = 649; i < 690; i++) {
  if (lines[i] && lines[i].includes('<td ')) count++;
}
console.log('Celulas 451/2:', count);

fs.writeFileSync(f, lines.join('\n'), 'utf8');
