const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

let start = -1, end = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('// Atualizar historico de faturamento agrupado por empresa e mes')) { start = i; }
  if (start !== -1 && lines[i].includes('await historicoAPI.upsert(') && end === -1) { end = i; break; }
}
if (start === -1 || end === -1) { console.log('NAO ENCONTRADO', start, end); process.exit(1); }
console.log('Substituindo linhas', start+1, 'ate', end+1);

const newLines = [
  "      // Recalcular historico a partir das notas ja salvas no banco",
  "      const empresasImportadas = [...new Set(notas.map(n => (n as any).empresaDetectada === 'six' ? 1 : 2))]",
  "      for (const emp of empresasImportadas) {",
  "        const todasNotas = await api.get('/notas/' + emp).then((r: any) => r.data).catch(() => [])",
  "        const porMesRecalc: Record<string, number> = {}",
  "        todasNotas.filter((n: any) => (n.nat_operacao || n.status || '').toLowerCase().includes('venda') && !(n.nat_operacao || '').toLowerCase().includes('devolu')).forEach((n: any) => {",
  "          if (n.data_emissao) {",
  "            const [, m, a] = n.data_emissao.split('/')",
  "            const key = `${a}-${m}`",
  "            porMesRecalc[key] = (porMesRecalc[key] || 0) + (parseFloat(n.valor_nf) || 0)",
  "          }",
  "        })",
  "        for (const key of Object.keys(porMesRecalc)) {",
  "          const [a, m] = key.split('-')",
  "          await historicoAPI.upsert({ empresa_id: emp, ano: +a, mes: +m, valor: porMesRecalc[key] })",
  "        }",
  "      }",
];

lines.splice(start, end - start + 1, ...newLines);
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
