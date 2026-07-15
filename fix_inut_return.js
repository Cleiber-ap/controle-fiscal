const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// Corrigir o return do bloco INUT - adicionar cnpjEmitente
c = c.replace(
  "        nat_op: 'Inutilizacao',\r\n        status: 'Inutilizacao',\r\n        arquivo,\r\n      }",
  "        nat_op: 'Inutilizacao',\r\n        status: 'Inutilizacao',\r\n        arquivo,\r\n        cnpjEmitente: cnpjEmitInut,\r\n      }"
);

if (!c.includes("cnpjEmitente: cnpjEmitInut")) {
  // Tentar sem \r
  c = c.replace(
    "        nat_op: 'Inutilizacao',\n        status: 'Inutilizacao',\n        arquivo,\n      }",
    "        nat_op: 'Inutilizacao',\n        status: 'Inutilizacao',\n        arquivo,\n        cnpjEmitente: cnpjEmitInut,\n      }"
  );
}

if (c.includes("cnpjEmitente: cnpjEmitInut")) {
  console.log('OK');
} else {
  console.log('FALHOU');
}

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
