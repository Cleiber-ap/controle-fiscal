const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// Fix bloco INUT - adicionar cnpjEmitente no return
const idxInut = c.indexOf("numero_nf: nNF + '-INUT'");
if (idxInut === -1) { console.log('NAO ENCONTRADO: INUT'); process.exit(1); }
const inutRetStart = c.lastIndexOf('return {', idxInut);
const inutRetEnd = c.indexOf('\n      }', idxInut) + '\n      }'.length;
const inutOld = c.slice(inutRetStart, inutRetEnd);

// Adicionar extração CNPJ antes do return INUT
const inutInsertAt = c.lastIndexOf('\n', inutRetStart);
const cnpjExtract = "\n      const cnpjInutMatch = texto.match(/<CNPJ>(\\d+)<\\/CNPJ>/)\n      const cnpjEmitInut = cnpjInutMatch ? cnpjInutMatch[1] : ''";
const inutNewReturn = inutOld.replace('        arquivo,\n      }', '        arquivo,\n        cnpjEmitente: cnpjEmitInut,\n      }');

c = c.slice(0, inutInsertAt) + cnpjExtract + c.slice(inutInsertAt, inutRetStart) + inutNewReturn + c.slice(inutRetEnd);
console.log('OK INUT');

// Fix bloco CCE/CAN - adicionar cnpjEmitente no return
const idxCce = c.indexOf("numero_nf: nNF + (isCCE ? '-CCE' : '-CAN')");
if (idxCce === -1) { console.log('NAO ENCONTRADO: CCE'); process.exit(1); }
const cceRetStart = c.lastIndexOf('return {', idxCce);
const cceRetEnd = c.indexOf('\n      }', idxCce) + '\n      }'.length;
const cceOld = c.slice(cceRetStart, cceRetEnd);

if (!cceOld.includes('cnpjEmitente')) {
  const cceInsertAt = c.lastIndexOf('\n', cceRetStart);
  const cnpjCceExtract = "\n      const cnpjCceMatch = texto.match(/<CNPJ>(\\d+)<\\/CNPJ>/)\n      const cnpjEmitCce = cnpjCceMatch ? cnpjCceMatch[1] : ''";
  const cceNewReturn = cceOld.replace('        arquivo,\n      }', '        arquivo,\n        cnpjEmitente: cnpjEmitCce,\n      }');
  c = c.slice(0, cceInsertAt) + cnpjCceExtract + c.slice(cceInsertAt, cceRetStart) + cceNewReturn + c.slice(cceRetEnd);
  console.log('OK CCE/CAN');
} else {
  console.log('CCE/CAN ja tem cnpjEmitente');
}

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
console.log('OK final');
