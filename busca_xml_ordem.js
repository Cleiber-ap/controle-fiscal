const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// Mostrar contexto do filtro
const idx = c.indexOf('cnpjEsperado');
const start = c.lastIndexOf('\n', c.lastIndexOf('\n', c.lastIndexOf('\n', idx) - 1) - 1);
const end = c.indexOf('\n', c.indexOf('\n', c.indexOf('\n', c.indexOf('\n', idx) + 1) + 1) + 1);
console.log(JSON.stringify(c.slice(start, end)));

// Verificar se processarArquivos usa 'empresa' diretamente
console.log('\n--- empresa usado no filtro? ---');
console.log(c.includes("CNPJ_EMPRESAS[empresa]"));
