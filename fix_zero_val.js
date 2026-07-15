const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Fix 1: salvarPagamento - val não deve usar nf_val quando é 0
c = c.replace(
  "      const val = parseFloat(editVPg.replace(',', '.')) || nf_val",
  "      const val = editVPg.trim() === '' ? nf_val : (parseFloat(editVPg.replace(',', '.')) ?? nf_val)"
);

// Fix 2: salvarPagamentoSaldo - novoVal não deve usar restante quando é 0
c = c.replace(
  "      const novoVal = parseFloat(editVPg.replace(',', '.')) || (nf_val - pago)",
  "      const novoVal = editVPg.trim() === '' ? (nf_val - pago) : (parseFloat(editVPg.replace(',', '.')) ?? (nf_val - pago))"
);

// Fix 3: editarPagamento - val já está correto mas verificar
// linha: const val = parseFloat(editPgtoVal.replace(',', '.'))
// Esse já permite 0, não precisa alterar

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
