const fs = require('fs');
const path = 'C:/projetos/controle-fiscal/backend/app/routers/notas.py';
let c = fs.readFileSync(path, 'utf8');

// Localiza a linha problemática
const idx = c.indexOf('pagamento_editado_eh_ultimo and (saldo_zerou or len(todos) == 1)');
if (idx === -1) {
  console.log('Linha nao encontrada');
  process.exit(1);
}

// Pega início da linha (volta até \n)
let start = c.lastIndexOf('\n', idx) + 1;
// Pega fim do bloco (próximas 3 linhas)
let end = idx;
for (let i = 0; i < 3; i++) {
  end = c.indexOf('\n', end + 1);
}
end = end + 1;

console.log('TRECHO ENCONTRADO:');
console.log(JSON.stringify(c.slice(start, end)));

const novo = `        # Só atualiza data da nota se for o último pagamento\n        if pagamento_editado_eh_ultimo:\n            nota.dt_pagamento = dados.dt_pagamento\n`;

c = c.slice(0, start) + novo + c.slice(end);
fs.writeFileSync(path, c, 'utf8');
console.log('OK');
