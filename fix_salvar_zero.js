const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Localizar o bloco do salvarPagamento
const idxPost = c.indexOf("await api.post('/notas/pagamento', { empresa_id: empId, numero_nf: nf, valor_pago: val, dt_pagamento: dtFinal");
if (idxPost === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }

const idxPostEnd = c.indexOf('\n', idxPost);

const oldPost = c.slice(idxPost, idxPostEnd);

// Substituir para: se val === 0 e tem pagamento existente, deletar
const newPost = `if (val === 0) {
        // Valor zerado: remover pagamento existente
        const lista = pagamentos[nf] || []
        if (lista.length > 0) {
          await api.delete('/notas/pagamento/' + lista[lista.length-1].id + '?empresa_id=' + empId)
        } else {
          await api.delete('/notas/pagamento/nota/' + nf + '?empresa_id=' + empId)
        }
      } else {
        await api.post('/notas/pagamento', { empresa_id: empId, numero_nf: nf, valor_pago: val, dt_pagamento: dtFinal, mes_lancamento: editMesLct })
      }`;

c = c.slice(0, idxPost) + newPost + c.slice(idxPostEnd);

// Também corrigir val para tratar vazio como 0
c = c.replace(
  "      const val = editVPg.trim() === '' ? nf_val : (parseFloat(editVPg.replace(',', '.')) ?? nf_val)",
  "      const val = editVPg.trim() === '' || editVPg.trim() === '0' || editVPg.trim() === '0,00' ? 0 : (parseFloat(editVPg.replace(',', '.')) || nf_val)"
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
