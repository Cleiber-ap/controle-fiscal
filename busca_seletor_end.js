const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');
const idx = c.indexOf('{/* Seletor de empresa */}');
const end = c.indexOf('{/* Drop zone */}', idx);
console.log(JSON.stringify(c.slice(end-5, end+20)));
