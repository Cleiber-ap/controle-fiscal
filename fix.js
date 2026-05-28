const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Inserir notasPagas + incluir no merge
const OLD1 = "      const todasNotas = [...new Map([...notasMes, ...notasAguardando].map";
const NEW1 = `      const notasPagas = listaFiltrada.filter((n) => {
        const pgtos = pagamentos[n.numero_nf] || []
        if (pgtos.length === 0) {
          const dtP = n.dt_pagamento || n.data_pagamento
          if (!dtP) return false
          const parts = dtP.includes("-") ? dtP.split("-") : dtP.split("/").reverse()
          return parseInt(parts[1]) === mesAntIdx + 1 && parseInt(parts[0]) === anoAnt
        }
        return pgtos.some((p) => {
          const dt = p.dt_pagamento
          if (!dt) return false
          const parts = dt.includes("-") ? dt.split("-") : dt.split("/").reverse()
          return parseInt(parts[1]) === mesAntIdx + 1 && parseInt(parts[0]) === anoAnt
        })
      })
      const todasNotas = [...new Map([...notasMes, ...notasAguardando, ...notasPagas].map`;
c = c.replace(OLD1, NEW1);

// 2. Adicionar linha vazia e soma
const OLD2 = "      return rows\n    }";
const NEW2 = "      const nRows = rows.length\n      rows.push([])\n      rows.push([\"\", \"\", \"\", \"Total Valor NF\", { f: \"SUM(E2:E\" + (nRows + 1) + \")\" }])\n      return rows\n    }";
c = c.replace(OLD2, NEW2);

fs.writeFileSync(f, c, "utf8");
console.log("notasPagas:", c.includes("notasPagas") ? "OK" : "FALHOU");
console.log("Total Valor NF:", c.includes("Total Valor NF") ? "OK" : "FALHOU");
