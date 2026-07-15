const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = `        })
      }
              const histAtual = await historicoAPI.listar(empIdDetectado).then((r: any) => r.data).catch(() => [])
        for (const key of Object.keys(porMes)) {
          const [a, m] = key.split('-')
          const existente = histAtual.find((h: any) => h.ano === +a && h.mes === +m)
          const valorFinal = (existente?.valor || 0) + porMes[key]
          await historicoAPI.upsert({ empresa_id: empIdDetectado, ano: +a, mes: +m, valor: valorFinal })
        }
      }`;
const novo = `        })
        const histAtual = await historicoAPI.listar(empIdDetectado).then((r: any) => r.data).catch(() => [])
        for (const key of Object.keys(porMes)) {
          const [a, m] = key.split('-')
          const existente = histAtual.find((h: any) => h.ano === +a && h.mes === +m)
          const valorFinal = (existente?.valor || 0) + porMes[key]
          await historicoAPI.upsert({ empresa_id: empIdDetectado, ano: +a, mes: +m, valor: valorFinal })
        }
      }`;
if (c.indexOf(old) === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
