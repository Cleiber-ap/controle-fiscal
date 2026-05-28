const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Substituir o bloco do canvas do grafico anual
const OLD = `    const ultimos3 = [...dadosAnuais].slice(-3)
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

const NEW = `    const ultimos3Anos = [...new Set(dadosAnuais.map(d => d.ano))].sort((a,b)=>a-b).slice(-3)
    const cores = ['#4F8EF7CC', '#34D399CC', '#FBBF24CC']
    const coresTxt = ['#4F8EF7', '#34D399', '#FBBF24']
    const mesesArr = [1,2,3,4,5,6,7,8,9,10,11,12]
    const NOMES_M = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
    // Para cada mes/ano pegar total das 3 empresas
    const getVal = (ano: number, mes: number) => {
      const s = histSix.find((r:any)=>r.ano===ano&&r.mes===mes)?.valor||0
      const e = histEnova.find((r:any)=>r.ano===ano&&r.mes===mes)?.valor||0
      const cm = histCm.find((r:any)=>r.ano===ano&&r.mes===mes)?.valor||0
      return s+e+cm
    }
    const allVals = ultimos3Anos.flatMap(ano => mesesArr.map(m => getVal(ano,m)))
    const maxV = Math.max(...allVals, 1)
    const nGrupos = 12
    const groupW = cW / nGrupos
    const nAnos = ultimos3Anos.length
    const barW = Math.max(4, Math.min(18, groupW / nAnos - 2))
    const groupBarW = barW * nAnos + 2 * (nAnos - 1)

    let prog = 0; const start = performance.now(); const dur = 800
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

      mesesArr.forEach((mes, mi) => {
        const gx = PAD.left + groupW * mi + (groupW - groupBarW) / 2
        // Label do mes
        ctx.fillStyle = '#7B82A0'; ctx.font = '9px monospace'; ctx.textAlign = 'center'
        ctx.fillText(NOMES_M[mi], PAD.left + groupW * mi + groupW / 2, PAD.top + cH + 14)

        ultimos3Anos.forEach((ano, ai) => {
          const delay = (mi * nAnos + ai) / (nGrupos * nAnos) * 0.4
          const lp = Math.max(0, Math.min(1, (ease - delay) / 0.6))
          const v = getVal(ano, mes)
          const hT = v / maxV * cH * lp
          const x = gx + ai * (barW + 2)
          ctx.fillStyle = cores[ai]
          ctx.beginPath()
          if (ctx.roundRect) ctx.roundRect(x, PAD.top + cH - hT, barW, Math.max(0, hT), [2,2,0,0])
          else ctx.rect(x, PAD.top + cH - hT, barW, Math.max(0, hT))
          ctx.fill()
        })

        // Ano label no primeiro mes
        if (mi === 0) {
          ultimos3Anos.forEach((ano, ai) => {
            const x = gx + ai * (barW + 2) + barW / 2`;

c = c.replace(OLD, NEW);

// Corrigir o label e legenda
c = c.replace(
  "Faturamento por Ano — Total (SIX + ENOVA + CM)",
  "Comparativo Mensal — Últimos 3 Anos (SIX + ENOVA + CM)"
);

// Substituir legenda
c = c.replace(
  "<span style={{ fontSize: '11px', color: '#4F8EF7' }}>■ Últimos 3 anos</span>",
  "{ultimos3Anos?.map((ano,i)=>(<span key={ano} style={{fontSize:'11px',color:coresTxt[i],marginLeft:8}}>■ {ano}</span>))}"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("ultimos3Anos") && c.includes("getVal") && c.includes("NOMES_M");
console.log(ok ? "OK" : "FALHOU");
