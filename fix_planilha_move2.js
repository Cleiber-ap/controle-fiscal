const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// Localizar pelo indexOf
const idxMark = c.indexOf('// ==================== IMPORTAR PLANILHA ====================');
if (idxMark === -1) { console.log('NAO ENCONTRADO: mark'); process.exit(1); }

// Pegar 2 linhas antes (o \n    \n)
const idxStart = c.lastIndexOf('\n', c.lastIndexOf('\n', idxMark) - 1);

// Encontrar fim do bloco - até 'const notasVenda'
const endMark = "  const notasVenda = notas.filter(n => n.status === 'Venda')";
const idxEnd = c.indexOf(endMark, idxMark);
if (idxEnd === -1) { console.log('NAO ENCONTRADO: end mark'); process.exit(1); }

// Extrair o bloco
const planilhaBlock = c.slice(idxStart, idxEnd);
console.log('Bloco extraído, tamanho:', planilhaBlock.length, 'chars');

// Remover da posição errada
c = c.slice(0, idxStart) + c.slice(idxEnd);

// Inserir logo após const inputRef
const insertAfter = "  const inputRef = useRef<HTMLInputElement>(null)";
const idxInsert = c.indexOf(insertAfter);
if (idxInsert === -1) { console.log('NAO ENCONTRADO: inputRef'); process.exit(1); }
const idxInsertEnd = c.indexOf('\n', idxInsert) + 1;

c = c.slice(0, idxInsertEnd) + planilhaBlock + c.slice(idxInsertEnd);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
console.log('OK');
