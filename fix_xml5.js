const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// Adicionar cnpjEmitente no objeto retornado
c = c.replace(
  "      arquivo,\r\n      refNFe: refNFe || undefined,",
  "      arquivo,\r\n      cnpjEmitente,\r\n      refNFe: refNFe || undefined,"
);

// Tentar também sem \r\n
if (!c.includes('cnpjEmitente,')) {
  c = c.replace(
    "      arquivo,\n      refNFe: refNFe || undefined,",
    "      arquivo,\n      cnpjEmitente,\n      refNFe: refNFe || undefined,"
  );
}

if (c.includes('cnpjEmitente,')) {
  console.log('OK - cnpjEmitente adicionado no return');
} else {
  console.log('FALHOU');
}

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
