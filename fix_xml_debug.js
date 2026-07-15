const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// Adicionar console.log após extrair cnpjEmitente
c = c.replace(
  "    const cnpjEmitente = emitEl2?.getElementsByTagName('CNPJ')[0]?.textContent?.trim() || ''",
  "    const cnpjEmitente = emitEl2?.getElementsByTagName('CNPJ')[0]?.textContent?.trim() || ''\n    console.log('DEBUG emitente:', cnpjEmitente, 'emitEl2:', emitEl2)"
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
console.log('OK');
