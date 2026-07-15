const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// Mostrar as linhas 88-115 onde está o filtro
const lines = c.split('\n');
lines.slice(87, 120).forEach((l, i) => console.log(i+88, l));
