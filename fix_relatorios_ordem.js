const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx', 'utf8');

c = c.replace(
  "            { key: 'anual', label: '📅 Comparativo Anual' },\r\n            { key: 'mensal', label: '📈 Evolução Mensal' },\r\n            { key: 'impostos', label: '💰 Impostos' },",
  "            { key: 'mensal', label: '📈 Evolução Mensal' },\r\n            { key: 'anual', label: '📅 Comparativo Anual' },\r\n            { key: 'impostos', label: '💰 Impostos' },"
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx', c, 'utf8');
console.log('OK');
