const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx";
let c = fs.readFileSync(f, "utf8");

const OLD = `    // Últimos 24 meses com dados
    const ultimos = [...todosMeses].sort((a, b) => a.ano !== b.ano ? a.ano - b.ano : a.mes - b.mes).slice(-24)
    if (!ultimos.length) return

    const W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W; canvas.height = H
    const PAD = { top: 30, right: 20, bottom: 32, left: 60 }
    const cW = W - PAD.left - PAD.right, cH = H - PAD.top - PAD.bottom
    const maxV = Math.max(...ultimos.map(m => m.total), 1)
    const n = ultimos.length

    let prog = 0; const start = performance.now(); const dur = 900
    const draw = (ts: number) => {
      prog = Math.min(1, (ts - start) / dur)
      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i <= 5; i++) {
        const y = PAD.top + cH - cH * i / 5
        ctx.strokeStyle = i === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'
        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + cW, y); ctx.stroke()
        if (i > 0) { ctx.fillStyle = '#7B82A0'; ctx.font = '10px monospace'; ctx.textAlign = 'right'; ctx.fillText(fmtK(maxV * i / 5), PAD.left - 4, y + 4) }
      }

      const vis = Math.floor(prog * n * 1.1)

      // Área preenchida total
      ctx.beginPath()
      ultimos.forEach((m, i) => {
        if (i > vis) return
        const x = PAD.left + (cW / (n - 1)) * i
        const y = PAD.top + cH - m.total / maxV * cH
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      if (vis > 0) {
        const lastX = PAD.left + (cW / (n - 1)) * Math.min(vis, n - 1)
        ctx.lineTo(lastX, PAD.top + cH); ctx.lineTo(PAD.left, PAD.top + cH); ctx.closePath()
        const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + cH)
        grad.addColorStop(0, 'rgba(79,142,247,0.3)'); grad.addColorStop(1, 'rgba(79,142,247,0.02)')
        ctx.fillStyle = grad; ctx.fill()
      }

      // Linha total
      ctx.strokeStyle = '#4F8EF7'; ctx.lineWidth = 2; ctx.setLineDash([])
      ctx.beginPath()
      ultimos.forEach((m, i) => {
        if (i > vis) return
        const x = PAD.left + (cW / (n - 1)) * i; const y = PAD.top + cH - m.total / maxV * cH
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }); ctx.stroke()

      // Linha SIX
      ctx.strokeStyle = '#4F8EF7AA'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3])
      ctx.beginPath()
      ultimos.forEach((m, i) => {
        if (i > vis) return
        const x = PAD.left + (cW / (n - 1)) * i; const y = PAD.top + cH - m.six / maxV * cH
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }); ctx.stroke()

      // Linha ENOVA
      ctx.strokeStyle = '#34D399AA'; ctx.lineWidth = 1.5
      ctx.beginPath()
      ultimos.forEach((m, i) => {
        if (i > vis) return
        const x = PAD.left + (cW / (n - 1)) * i; const y = PAD.top + cH - m.enova / maxV * cH
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }); ctx.stroke()
      ctx.setLineDash([])

      // Labels
      ctx.textAlign = 'center'; ctx.font = '9px monospace'
      const skip = Math.ceil(n / 12)
      ultimos.forEach((m, i) => {
        if (i % skip !== 0 && i !== n - 1) return
        ctx.fillStyle = m.ano === anoAnt && m.mes === mesAntIdx + 1 ? '#FBBF24' : '#7B82A0'
        ctx.fillText(MESES[m.mes - 1] + '/' + String(m.ano).slice(2), PAD.left + (cW / (n - 1)) * i, PAD.top + cH + 18)
      })

      if (prog < 1) animRef2.current = requestAnimationFrame(draw)
    }
    animRef2.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef2.current)
  }, [histSix, histEnova, loading, abaAtiva])`;

const NEW = `    // Ultimos 3 anos, 12 meses cada, total das 3 empresas
    const anos3 = [...new Set([...histSix,...histEnova,...histCm].map((r:any)=>r.ano))].sort((a:number,b:number)=>a-b).slice(-3)
    const meses12 = [1,2,3,4,5,6,7,8,9,10,11,12]
    const NOMES_M2 = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
    const getValM = (ano:number, mes:number) => {
      const s = histSix.find((r:any)=>r.ano===ano&&r.mes===mes)?.valor||0
      const e = histEnova.find((r:any)=>r.ano===ano&&r.mes===mes)?.valor||0
      const cm = histCm.find((r:any)=>r.ano===ano&&r.mes===mes)?.valor||0
      return s+e+cm
    }
    const coresM = ['#4F8EF7','#34D399','#FBBF24']
    const allValsM = anos3.flatMap((ano:number) => meses12.map(m => getValM(ano,m)))
    const maxV = Math.max(...allValsM, 1)
    const W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W; canvas.height = H
    const PAD = { top: 30, right: 20, bottom: 32, left: 60 }
    const cW = W - PAD.left - PAD.right, cH = H - PAD.top - PAD.bottom

    let prog = 0; const start = performance.now(); const dur = 900
    const draw = (ts: number) => {
      prog = Math.min(1, (ts - start) / dur)
      const ease = 1 - Math.pow(1 - prog, 3)
      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i <= 5; i++) {
        const y = PAD.top + cH - cH * i / 5
        ctx.strokeStyle = i === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'
        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + cW, y); ctx.stroke()
        if (i > 0) { ctx.fillStyle = '#7B82A0'; ctx.font = '10px monospace'; ctx.textAlign = 'right'; ctx.fillText(fmtK(maxV * i / 5), PAD.left - 4, y + 4) }
      }

      // Labels meses eixo X
      ctx.fillStyle = '#7B82A0'; ctx.font = '9px monospace'; ctx.textAlign = 'center'
      meses12.forEach((_, mi) => { ctx.fillText(NOMES_M2[mi], PAD.left + cW / 12 * mi + cW / 24, PAD.top + cH + 14) })

      // Uma linha por ano
      anos3.forEach((ano:number, ai:number) => {
        const delay = ai / anos3.length * 0.3
        const lp = Math.max(0, Math.min(1, (ease - delay) / 0.7))
        const vis = Math.floor(lp * 12)
        ctx.strokeStyle = coresM[ai]; ctx.lineWidth = 2; ctx.setLineDash([])
        ctx.beginPath()
        meses12.forEach((mes, mi) => {
          if (mi > vis) return
          const v = getValM(ano, mes)
          const x = PAD.left + cW / 12 * mi + cW / 24
          const y = PAD.top + cH - v / maxV * cH
          mi === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        })
        ctx.stroke()
        // Pontos
        meses12.forEach((mes, mi) => {
          if (mi > vis) return
          const v = getValM(ano, mes); if (!v) return
          const x = PAD.left + cW / 12 * mi + cW / 24
          const y = PAD.top + cH - v / maxV * cH
          ctx.fillStyle = coresM[ai]; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill()
        })
      })

      if (prog < 1) animRef2.current = requestAnimationFrame(draw)
    }
    animRef2.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef2.current)
  }, [histSix, histEnova, histCm, loading, abaAtiva])`;

c = c.replace(OLD, NEW);
fs.writeFileSync(f, c, "utf8");
console.log(c.includes("getValM") && c.includes("anos3") ? "OK" : "FALHOU");
