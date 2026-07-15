const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 649; i < 658; i++) {
  if (lines[i] && lines[i].includes('r.numero_nf}/{idx + 2}') && lines[i+1] && lines[i+1].includes('Pagamento parcial {idx + 2}')) {
    // Adiciona Tipo e remove CNPJ vazio substituindo a celula vazia seguinte
    lines.splice(i+1, 0, "                              <td style={tdSm()}></td>");
    // Remove a celula CNPJ vazia (agora em i+3)
    if (lines[i+3] && lines[i+3].includes('tdSm({ color:') && lines[i+3].includes('})}></td>')) {
      lines.splice(i+3, 1);
      console.log('CNPJ removido');
    }
    console.log('OK');
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
