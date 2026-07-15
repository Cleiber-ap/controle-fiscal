const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');
// Buscar a td que exibe dt_pagamento na linha original da tabela
const idx = c.indexOf("temHistorico ? (lista[0]?.dt_pagamento");
const start = c.lastIndexOf('\n', idx);
const end = c.indexOf('\n', idx + 100);
console.log(JSON.stringify(c.slice(start, end)));
