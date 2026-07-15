const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// Verificar onde está o return() - encontrar o último </div> antes de )\n}
const idxReturn = c.lastIndexOf('  )\n}');
if (idxReturn === -1) { console.log('NAO ENCONTRADO: return end'); process.exit(1); }

// Encontrar o </div> que fecha o return - antes do )\n}
const idxLastDiv = c.lastIndexOf('    </div>', idxReturn);
console.log('idxReturn:', idxReturn, 'idxLastDiv:', idxLastDiv);

// Verificar se a seção planilha está dentro ou fora
const idxPlanilhaUI = c.indexOf('IMPORTAR PLANILHA');
console.log('idxPlanilhaUI:', idxPlanilhaUI, 'dentro do return?', idxPlanilhaUI < idxReturn);
