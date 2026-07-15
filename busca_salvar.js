const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Ver o final do carregarTudo
const idx = c.indexOf('console.log(\'✅ Dados atualizados');
const start = c.lastIndexOf('\n', idx);
const end = c.indexOf('\n', idx + 100);
console.log('carregarTudo end:', JSON.stringify(c.slice(start, end)));

// Ver salvarPagamento após carregarTudo
const idx2 = c.indexOf('await carregarTudo()\n      setEditando');
if (idx2 !== -1) {
  console.log('salvarPagamento:', JSON.stringify(c.slice(idx2, idx2+100)));
}
