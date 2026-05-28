const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Filtrar apenas ultimos 3 anos e usar barra unica (total)
const OLD = `    const maxV = Math.max(...dadosAnuais.map(d => d.total), 1)
    const nBars = dadosAnuais.length
    const groupW = cW / nBars
    const barW = Math.max(20, Math.min(40, groupW * 0.4))

    let prog = 0; const start = performance.now(); const dur = 700
    const draw = (ts: number) => {
      prog = Math.min(1, (ts - start) / dur)
      const ease = 1 - Math.pow(1 - prog, 3)
      ctx.clearRect(0, 0, W, H)

      // Grid
      for (let i = 0; i <= 5; i++) {
        const y = PAD.top + cH - cH * i / 5
        ctx.strokeStyle = i === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'
        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + cW, y); ctx.stroke()
        if (i > 0) { ctx.fillStyle = '#7B82A0'; ctx.font = '10px monospace'; ctx.textAlign = 'right'; ctx.fillText(fmtK(maxV * i / 5), PAD.left - 4, y + 4) }
      }

      dadosAnuais.forEach((d, i) => {
        const delay = i / nBars * 0.3; const lp = Math.max(0, Math.min(1, (ease - delay) / 0.7))
        const x = PAD.left + groupW * i + (groupW - barW * 2 - 4) / 2
        const isCurr = d.ano === anoAtual

        // SIX
        const hS = d.six / maxV * cH * lp
        ctx.fillStyle = '#4F8EF7CC'
        ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, PAD.top + cH - hS, barW, Math.max(0, hS), [3, 3, 0, 0]); else ctx.rect(x, PAD.top + cH - hS, barW, Math.max(0, hS)); ctx.fill()

        // ENOVA
        const hE = d.enova / maxV * cH * lp
        ctx.fillStyle = '#34D399CC'
        ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x + barW + 4, PAD.top + cH - hE, barW, Math.max(0, hE), [3, 3, 0, 0]); else ctx.rect(x + barW + 4, PAD.top + cH - hE, barW, Math.max(0, hE)); ctx.fill()

        // Total acima
        if (lp > 0.8) {
          ctx.textAlign = 'center'; ctx.fillStyle = isCurr ? '#FBBF24' : '#7B82A0'; ctx.font = isCurr ? 'bold 9px monospace' : '9px monospace'
          ctx.fillText(fmtK(d.total * lp), x + barW + 2, PAD.top + cH - Math.max(d.six, d.enova) / maxV * cH * lp - 6)`;

const NEW = `    const ultimos3 = [...dadosAnuais].slice(-3)
    const maxV = Math.max(...ultimos3.map(d => d.total), 1)
    const nBars = ultimos3.length
    const groupW = cW / nBars
    const barW = Math.max(40, Math.min(90, groupW * 0.5))

    let prog = 0; const start = performance.now(); const dur = 700
    const draw = (ts: number) => {
      prog = Math.min(1, (ts - start) / dur)
      const ease = 1 - Math.pow(1 - prog, 3)
      ctx.clearRect(0, 0, W, H)

      // Grid
      for (let i = 0; i <= 5; i++) {
        const y = PAD.top + cH - cH * i / 5
        ctx.strokeStyle = i === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'
        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + cW, y); ctx.stroke()
        if (i > 0) { ctx.fillStyle = '#7B82A0'; ctx.font = '10px monospace'; ctx.textAlign = 'right'; ctx.fillText(fmtK(maxV * i / 5), PAD.left - 4, y + 4) }
      }

      ultimos3.forEach((d, i) => {
        const delay = i / nBars * 0.3; const lp = Math.max(0, Math.min(1, (ease - delay) / 0.7))
        const x = PAD.left + groupW * i + (groupW - barW) / 2
        const isCurr = d.ano === anoAtual

        // Barra unica total (gradiente SIX + ENOVA + CM)
        const hT = d.total / maxV * cH * lp
        const grad = ctx.createLinearGradient(x, PAD.top + cH - hT, x + barW, PAD.top + cH - hT)
        grad.addColorStop(0, isCurr ? '#FBBF24CC' : '#4F8EF7CC')
        grad.addColorStop(1, isCurr ? '#F59E0BCC' : '#34D399CC')
        ctx.fillStyle = grad
        ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, PAD.top + cH - hT, barW, Math.max(0, hT), [4, 4, 0, 0]); else ctx.rect(x, PAD.top + cH - hT, barW, Math.max(0, hT)); ctx.fill()

        // Valor acima
        if (lp > 0.8) {
          ctx.textAlign = 'center'; ctx.fillStyle = isCurr ? '#FBBF24' : '#E8EAF0'; ctx.font = isCurr ? 'bold 11px monospace' : '11px monospace'
          ctx.fillText(fmtK(d.total * lp), x + barW / 2, PAD.top + cH - hT - 8)`;

c = c.replace(OLD, NEW);

// Corrigir label do grafico
c = c.replace(
  "Faturamento por Ano — SIX vs ENOVA",
  "Faturamento por Ano — Total (SIX + ENOVA + CM)"
);

// Corrigir legenda
c = c.replace(
  '<span style={{ fontSize: \'11px\', color: \'#7B82A0\' }}>■ SIX</span>\n              <span style={{ fontSize: \'11px\', color: \'#34D399\' }}>■ ENOVA</span>',
  '<span style={{ fontSize: \'11px\', color: \'#4F8EF7\' }}>■ Últimos 3 anos</span>'
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("ultimos3") && c.includes("Total (SIX + ENOVA + CM)");
console.log(ok ? "OK" : "FALHOU");
