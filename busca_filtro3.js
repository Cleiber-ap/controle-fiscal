const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');
const idx = c.indexOf('Todos os meses');
const endSelect = c.indexOf('</select>', idx) + '</select>'.length;
// Pegar 200 chars depois do </select>
console.log(JSON.stringify(c.slice(endSelect, endSelect + 200)));
