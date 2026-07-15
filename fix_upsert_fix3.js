const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

// Encontrar linha do }) que fecha o forEach (linha 412 = index 411)
// e remover o } extra e reorganizar o bloco
const newBlock = [
  "        })",
  "        const histAtual = await historicoAPI.listar(empIdDetectado).then((r: any) => r.data).catch(() => [])",
  "        for (const key of Object.keys(porMes)) {",
  "          const [a, m] = key.split('-')",
  "          const existente = histAtual.find((h: any) => h.ano === +a && h.mes === +m)",
  "          const valorFinal = (existente?.valor || 0) + porMes[key]",
  "          await historicoAPI.upsert({ empresa_id: empIdDetectado, ano: +a, mes: +m, valor: valorFinal })",
  "        }",
  "      }"
];

// Achar index da linha com "        })"
let startIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trimEnd() === '        })' && lines[i+1] && lines[i+1].trimEnd() === '      }' && lines[i+2] && lines[i+2].includes('histAtual')) {
    startIdx = i;
    break;
  }
}
if (startIdx === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }

// Substituir linhas startIdx ate startIdx+8 (9 linhas)
lines.splice(startIdx, 9, ...newBlock);
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
