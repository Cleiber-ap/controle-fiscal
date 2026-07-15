const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

const idxVal = c.indexOf("const val = editPgtoVal.trim()");
if (idxVal === -1) { console.log('NAO ENCONTRADO: val'); process.exit(1); }

// Localizar a linha do api.put
const idxPut = c.indexOf("const response = await api.put('/notas/pagamento/' + pgtoId", idxVal);
if (idxPut === -1) { console.log('NAO ENCONTRADO: put'); process.exit(1); }

// Fim da linha do put
const idxPutEnd = c.indexOf('\n', idxPut);

const oldPut = c.slice(idxPut, idxPutEnd);

const newPut = `let response\n      if (val === 0) {\n        response = await api.delete('/notas/pagamento/' + pgtoId + '?empresa_id=' + empId)\n      } else {\n        response = await api.put('/notas/pagamento/' + pgtoId, { empresa_id: empId, numero_nf: nf, valor_pago: val, dt_pagamento: dtPgtoFinal, mes_lancamento: editMesLct })\n      }`;

c = c.slice(0, idxPut) + newPut + c.slice(idxPutEnd);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
