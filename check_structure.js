const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');
const lines = c.split('\n');

// Encontrar onde começa o componente
const idxComp = lines.findIndex(l => l.includes('export default function ImportarXML'));
// Encontrar onde estão os estados planilha
const idxPlan = lines.findIndex(l => l.includes('IMPORTAR PLANILHA'));
// Encontrar onde está o return
const idxReturn = lines.findIndex(l => l.trim() === 'return (');

console.log('Componente linha:', idxComp+1);
console.log('Planilha estados linha:', idxPlan+1);
console.log('Return linha:', idxReturn+1);

// Ver contexto ao redor dos estados planilha
lines.slice(idxPlan-3, idxPlan+3).forEach((l,i) => console.log(idxPlan-2+i, l));
