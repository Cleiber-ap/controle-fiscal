const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Quando val === 0, excluir o pagamento em vez de salvar com 0
c = c.replace(
  "      const val = editPgtoVal.trim() === '' ? 0 : (parseFloat(editPgtoVal.replace(',', '.')) || 0)\n      console.log('📤 Editando pagamento - ID:', pgtoId, 'NF:', nf, 'VALOR:', val, 'DATA:', editPgtoDt)\n      const dtPgtoFinal = editPgtoDt.trim().split('/').length === 2 ? editPgtoDt.trim() + '/' + new Date().getFullYear() : editPgtoDt.trim()\n      const response = await api.put('/notas/pagamento/' + pgtoId, { empresa_id: empId, numero_nf: nf, valor_pago: val, dt_pagamento: dtPgtoFinal, mes_lancamento: editMesLct })",
  "      const val = editPgtoVal.trim() === '' ? 0 : (parseFloat(editPgtoVal.replace(',', '.')) || 0)\n      console.log('📤 Editando pagamento - ID:', pgtoId, 'NF:', nf, 'VALOR:', val, 'DATA:', editPgtoDt)\n      const dtPgtoFinal = editPgtoDt.trim().split('/').length === 2 ? editPgtoDt.trim() + '/' + new Date().getFullYear() : editPgtoDt.trim()\n      let response\n      if (val === 0) {\n        response = await api.delete('/notas/pagamento/' + pgtoId + '?empresa_id=' + empId)\n      } else {\n        response = await api.put('/notas/pagamento/' + pgtoId, { empresa_id: empId, numero_nf: nf, valor_pago: val, dt_pagamento: dtPgtoFinal, mes_lancamento: editMesLct })\n      }"
);

if (!c.includes("if (val === 0)")) { console.log('NAO ENCONTRADO'); process.exit(1); }
fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
