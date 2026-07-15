const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Remover o span label + input de Mês Lçto em todos os formulários
// Padrão: <span ...>Mês Lçto:</span>\r\n ... <input ...editMesLct... />
// Vamos usar indexOf para remover cada ocorrência

let count = 0;
while (true) {
  const idx = c.indexOf('Mês Lçto');
  if (idx === -1) break;
  
  // Achar início do span (antes do <span)
  const spanStart = c.lastIndexOf('<span', idx);
  
  // Achar fim do input que vem depois (até />)
  const inputStart = c.indexOf('<input', idx);
  const inputEnd = c.indexOf('/>', inputStart) + '/>'.length;
  
  // Remover todo o trecho span+input
  c = c.slice(0, spanStart) + c.slice(inputEnd);
  count++;
}

console.log('Removidas', count, 'ocorrências');
fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
