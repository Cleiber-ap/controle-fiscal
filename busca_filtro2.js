const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');
// Buscar o select do filtro
const idx = c.indexOf('Todos os meses');
const start = c.lastIndexOf('<select', idx);
const end = c.indexOf('</select>', idx) + '</select>'.length;
console.log(JSON.stringify(c.slice(start - 100, end + 50)));
