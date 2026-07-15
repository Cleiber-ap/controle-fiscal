const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

// Extrair blocos dos filtros
const pagamento = lines.slice(434, 441); // linhas 434-440
const emissao = lines.slice(442, 445);   // linhas 442-444 (mas 445 é </select>)
const tipo = lines.slice(446, 450);      // linhas 446-449 (450 é </select>)

// Verificar
console.log('Pagamento inicio:', lines[434].substring(0,50));
console.log('Emissao inicio:', lines[442].substring(0,50));
console.log('Tipo inicio:', lines[446].substring(0,50));

// Reconstruir na ordem: Tipo, Emissao, Pagamento, Status
// Tipo: 446-450, Emissao: 442-445, Pagamento: 434-441, Status: 451-466
const tipoBlock = lines.slice(446, 451);
const emissaoBlock = lines.slice(442, 446);
const pagamentoBlock = lines.slice(434, 442);

// Substituir linhas 434-450
const newLines = [...tipoBlock, ...emissaoBlock, ...pagamentoBlock];
lines.splice(434, 17, ...newLines);

fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
