const fs = require('fs');
const path = 'C:/projetos/controle-fiscal/backend/app/routers/notas.py';
let c = fs.readFileSync(path, 'utf8');

const old = `        if pagamento_editado_eh_ultimo and (saldo_zerou or len(todos) == 1):
            nota.dt_pagamento = dados.dt_pagamento
            print(f"ðŸ" Atualizando data da nota para: {dados.dt_pagamento}")`;

const novo = `        # Só atualiza data da nota se for o último pagamento
        if pagamento_editado_eh_ultimo:
            nota.dt_pagamento = dados.dt_pagamento`;

if (!c.includes(old)) {
  console.log('TRECHO NAO ENCONTRADO - verificar manualmente');
  process.exit(1);
}

c = c.replace(old, novo);
fs.writeFileSync(path, c, 'utf8');
console.log('OK');
