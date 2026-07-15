const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

// Achar linha do comentario
let start = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('// Atualizar historico de faturamento se houver notas de venda')) {
    start = i;
    break;
  }
}
if (start === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }

// Achar fim do bloco (linha do setResultado)
let end = -1;
for (let i = start; i < lines.length; i++) {
  if (lines[i].includes('setResultado(')) {
    end = i;
    break;
  }
}
if (end === -1) { console.log('FIM NAO ENCONTRADO'); process.exit(1); }

console.log('Substituindo linhas', start+1, 'ate', end);

const newLines = [
  "      // Atualizar historico de faturamento agrupado por empresa e mes",
  "      const porEmpresaMes: Record<string, number> = {}",
  "      notas.filter(n => n.status === 'Venda').forEach(n => {",
  "        const emp = (n as any).empresaDetectada === 'six' ? 1 : 2",
  "        if (n.data_emissao) {",
  "          const [, m, a] = n.data_emissao.split('/')",
  "          const key = `${emp}-${a}-${m}`",
  "          porEmpresaMes[key] = (porEmpresaMes[key] || 0) + n.valor_nf",
  "        }",
  "      })",
  "      for (const key of Object.keys(porEmpresaMes)) {",
  "        const [emp, a, m] = key.split('-')",
  "        const histAtual = await historicoAPI.listar(+emp).then((r: any) => r.data).catch(() => [])",
  "        const existente = histAtual.find((h: any) => h.ano === +a && h.mes === +m)",
  "        const valorFinal = (existente?.valor || 0) + porEmpresaMes[key]",
  "        await historicoAPI.upsert({ empresa_id: +emp, ano: +a, mes: +m, valor: valorFinal })",
  "      }",
];

lines.splice(start, end - start, ...newLines);
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
