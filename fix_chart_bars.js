const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Engrossar barras: aumentar min/max e padding lateral
c = c.replace(
  "    const barW = Math.max(4, Math.min(18, groupW / nAnos - 2))\n    const groupBarW = barW * nAnos + 2 * (nAnos - 1)",
  "    const barW = Math.max(8, Math.min(28, groupW / nAnos - 3))\n    const groupBarW = barW * nAnos + 3 * (nAnos - 1)"
);

// 2. Aumentar padding lateral do grafico para acomodar labels
c = c.replace(
  "    const PAD = { top: 30, right: 20, bottom: 32, left: 60 }",
  "    const PAD = { top: 36, right: 20, bottom: 32, left: 60 }"
);

// 3. Adicionar valor no topo de cada barra (quando animacao > 90%)
c = c.replace(
  "          ctx.fillStyle = cores[ai]\n          ctx.beginPath()\n          if (ctx.roundRect) ctx.roundRect(x, PAD.top + cH - hT, barW, Math.max(0, hT), [2,2,0,0])\n          else ctx.rect(x, PAD.top + cH - hT, barW, Math.max(0, hT))\n          ctx.fill()\n        })",
  `          ctx.fillStyle = cores[ai]
          ctx.beginPath()
          if (ctx.roundRect) ctx.roundRect(x, PAD.top + cH - hT, barW, Math.max(0, hT), [2,2,0,0])
          else ctx.rect(x, PAD.top + cH - hT, barW, Math.max(0, hT))
          ctx.fill()
          // Valor no topo
          if (lp > 0.92 && v > 0) {
            ctx.save()
            ctx.translate(x + barW / 2, PAD.top + cH - hT - 4)
            ctx.rotate(-Math.PI / 2)
            ctx.fillStyle = coresTxt[ai]
            ctx.font = '7px monospace'
            ctx.textAlign = 'left'
            ctx.fillText(fmtK(v), 0, 0)
            ctx.restore()
          }
        })`
);

// 4. Ajustar espacamento entre barras de 2 para 3
c = c.replace(
  "          const x = gx + ai * (barW + 2)",
  "          const x = gx + ai * (barW + 3)"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("Math.min(28,") && c.includes("ctx.rotate(-Math.PI / 2)");
console.log(ok ? "OK" : "FALHOU");
