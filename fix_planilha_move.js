const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// Remover o bloco de estados/funções da posição errada
const startMark = '\n\n  // ==================== IMPORTAR PLANILHA ====================\n';
const idxStart = c.indexOf(startMark);
if (idxStart === -1) { console.log('NAO ENCONTRADO: start mark'); process.exit(1); }

// Encontrar o fim do bloco (até o início do 'const notasVenda')
const endMark = '\n  const notasVenda = notas.filter(n => n.status === \'Venda\')';
const idxEnd = c.indexOf(endMark, idxStart);
if (idxEnd === -1) { console.log('NAO ENCONTRADO: end mark'); process.exit(1); }

// Extrair o bloco
const planilhaBlock = c.slice(idxStart, idxEnd);
console.log('Bloco extraído, tamanho:', planilhaBlock.length);

// Remover da posição errada
c = c.slice(0, idxStart) + c.slice(idxEnd);

// Inserir logo após const inputRef (dentro do componente, antes das funções)
const insertAfter = "  const inputRef = useRef<HTMLInputElement>(null)";
const idxInsert = c.indexOf(insertAfter);
if (idxInsert === -1) { console.log('NAO ENCONTRADO: inputRef'); process.exit(1); }
const idxInsertEnd = c.indexOf('\n', idxInsert) + 1;

c = c.slice(0, idxInsertEnd) + planilhaBlock + '\n' + c.slice(idxInsertEnd);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
console.log('OK');
