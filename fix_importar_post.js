const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// Garantir que valor_pago é número e dt_pagamento está correto
c = c.replace(
  "          valor_pago: n.valor_pago,\r\n          dt_pagamento: n.data_pagamento,",
  "          valor_pago: parseFloat(String(n.valor_pago)) || 0,\r\n          dt_pagamento: String(n.data_pagamento).split(' ')[0],"
);

if (!c.includes("parseFloat(String(n.valor_pago))")) {
  c = c.replace(
    "          valor_pago: n.valor_pago,\n          dt_pagamento: n.data_pagamento,",
    "          valor_pago: parseFloat(String(n.valor_pago)) || 0,\n          dt_pagamento: String(n.data_pagamento).split(' ')[0],"
  );
}

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
console.log('OK');
