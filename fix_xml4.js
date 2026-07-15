const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// Substituir a extração de cnpjEmitente para usar regex no texto XML
// em vez de getElementsByTagName que falha com namespace
c = c.replace(
  "    const emitEl2 = doc.getElementsByTagName('emit')[0]\n    const cnpjEmitente = emitEl2?.getElementsByTagName('CNPJ')[0]?.textContent?.trim() || ''\n    console.log('DEBUG emitente:', cnpjEmitente, 'emitEl2:', emitEl2)",
  "    // Extrair CNPJ do emitente via regex (getElementsByTagName falha com namespace XML)\n    const cnpjEmitMatch = texto.match(/<emit>.*?<CNPJ>(\\d+)<\\/CNPJ>/s) || texto.match(/<emit[^>]*>.*?<CNPJ>(\\d+)<\\/CNPJ>/s)\n    const cnpjEmitente = cnpjEmitMatch ? cnpjEmitMatch[1] : ''"
);

// Se o console.log já foi removido em versão anterior, tentar sem o console.log
if (!c.includes('cnpjEmitMatch')) {
  c = c.replace(
    "    const emitEl2 = doc.getElementsByTagName('emit')[0]\n    const cnpjEmitente = emitEl2?.getElementsByTagName('CNPJ')[0]?.textContent?.trim() || ''",
    "    // Extrair CNPJ do emitente via regex (getElementsByTagName falha com namespace XML)\n    const cnpjEmitMatch = texto.match(/<emit>.*?<CNPJ>(\\d+)<\\/CNPJ>/s) || texto.match(/<emit[^>]*>.*?<CNPJ>(\\d+)<\\/CNPJ>/s)\n    const cnpjEmitente = cnpjEmitMatch ? cnpjEmitMatch[1] : ''"
  );
}

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
console.log('OK');
