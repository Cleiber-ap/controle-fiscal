const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/backend/app/routers/notas.py';
let c = fs.readFileSync(f, 'utf8');

// Adicionar campo tipo no NotaImportInput
const old1 = "    arquivo: Optional[str] = None";
const novo1 = "    arquivo: Optional[str] = None\n    tipo: Optional[str] = 'saida'";
if (c.indexOf(old1) === -1) { console.log('TRECHO 1 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old1, novo1);

// Adicionar tipo no update do existing
const old2 = "        existing.nat_operacao = (dados.nat_op or \"\")[:50]";
const novo2 = "        existing.nat_operacao = (dados.nat_op or \"\")[:50]\n        existing.tipo = dados.tipo or 'saida'";
if (c.indexOf(old2) === -1) { console.log('TRECHO 2 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old2, novo2);

// Adicionar tipo no insert
const old3 = "            nat_operacao=(dados.nat_op or \"\")[:50],";
const novo3 = "            nat_operacao=(dados.nat_op or \"\")[:50],\n            tipo=dados.tipo or 'saida',";
if (c.indexOf(old3) === -1) { console.log('TRECHO 3 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old3, novo3);

fs.writeFileSync(f, c, 'utf8');
console.log('OK');
