const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// 1. Extrair bloco calcRbt12 da posicao atual (antes de if loading)
const blocoMatch = c.match(/  const calcRbt12[\s\S]*?const icmsAproveitavelEnova[^\n]*\n/);
if (!blocoMatch) { console.log('FALHOU - bloco nao encontrado'); process.exit(1); }
const bloco = blocoMatch[0];

// 2. Remover bloco da posicao atual
c = c.replace(bloco, '');

// 3. Inserir bloco ANTES de impSix
c = c.split('  const impSix = ').join(bloco + '  const impSix = ');

// 4. Atualizar calculo do imposto
c = c.split('baseSixMLcto * empSix.aliquota_das').join('baseSixMLcto * aliqEfetivaSix');
c = c.split('baseEnovaMLcto * empEnova.aliquota_das').join('baseEnovaMLcto * aliqEfetivaEnova');

// 5. Atualizar display Aliquota DAS (D17)
c = c.split("(empSix.aliquota_das * 100).toFixed(2).replace('.', ',') + '%'")
     .join("(aliqEfetivaSix * 100).toFixed(2).replace('.', ',') + '%'");
c = c.split("(empEnova.aliquota_das * 100).toFixed(2).replace('.', ',') + '%'")
     .join("(aliqEfetivaEnova * 100).toFixed(2).replace('.', ',') + '%'");

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
