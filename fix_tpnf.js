const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "    const refNFe = get('refNFe') || ''";
const novo = "    const refNFe = get('refNFe') || ''\n    const tpNF = get('tpNF')\n    const tipo = tpNF === '0' ? 'entrada' : 'saida'";
if (c.indexOf(old) === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);

const old2 = "      refNFe: refNFe || undefined,";
const novo2 = "      refNFe: refNFe || undefined,\n      tipo,";
if (c.indexOf(old2) === -1) { console.log('TRECHO 2 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old2, novo2);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
