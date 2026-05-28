const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Remover o bloco truncado (linhas 162-171) e fechar corretamente o forEach de meses
c = c.replace(
`        // Ano label no primeiro mes
        if (mi === 0) {
          ultimos3Anos.forEach((ano, ai) => {
            const x = gx + ai * (barW + 2) + barW / 2
        }

        // Label ano
        ctx.textAlign = 'center'; ctx.fillStyle = isCurr ? '#FBBF24' : '#7B82A0'; ctx.font = isCurr ? 'bold 10px monospace' : '10px monospace'
        ctx.fillText(String(d.ano) + (isCurr ? '*' : ''), x + barW + 2, PAD.top + cH + 18)
      })`,
`      })` // fechar mesesArr.forEach
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("ultimos3Anos") && !c.includes("isCurr ? '#FBBF24'") ? "OK" : "FALHOU");
