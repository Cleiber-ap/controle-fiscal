const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "    const tpNF = get('tpNF')\n    const tipo = tpNF === '0' ? 'entrada' : 'saida'";
const novo = "    const tpNFMatch = texto.match(/<tpNF>(\\d)<\\/tpNF>/)\n    const tipo = tpNFMatch && tpNFMatch[1] === '0' ? 'entrada' : 'saida'";
if (c.indexOf(old) === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
