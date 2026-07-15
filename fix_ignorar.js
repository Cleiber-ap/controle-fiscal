const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('setIgnorados(prev =>') && lines[i].includes('localStorage')) {
    lines[i] = lines[i].replace(
      "onClick={() => setIgnorados(prev => { const n = new Set([...prev, aj.id]); localStorage.setItem('ignorados_dev', JSON.stringify([...n])); return n })}",
      "onClick={async () => { await api.post('/notas/creditos', { empresa_id: empId, valor_nf_original: aj.valor, nf_devolucao: aj.nf_devolucao, nf_referenciada: aj.nf_referenciada, mes_orig: aj.mes, ano_orig: aj.ano, status: 'ignorado' }); carregarTudo() }}"
    );
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
