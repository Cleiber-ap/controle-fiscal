import { useEffect, useRef, useState } from 'react'
import { historicoAPI, dasAPI, empresasAPI } from '../../api/endpoints'

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

function fmtR(v: number) {
  return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function fmtK(v: number) {
  if (v >= 1000000) return 'R$' + (v / 1000000).toFixed(2) + 'M'
  if (v >= 1000) return 'R$' + (v / 1000).toFixed(1) + 'K'
  return 'R$' + v.toFixed(0)
}
function pct(a: number, b: number) {
  if (!b) return '—'
  const p = ((a - b) / b) * 100
  return (p > 0 ? '+' : '') + p.toFixed(1) + '%'
}
function pctCor(a: number, b: number) {
  if (!b) return '#7B82A0'
  return a >= b ? '#34D399' : '#F87171'
}

export default function Relatorios() {
  const canvasAnualRef = useRef<HTMLCanvasElement>(null)
  const canvasMensalRef = useRef<HTMLCanvasElement>(null)
  const animRef1 = useRef<number>(0)
  const animRef2 = useRef<number>(0)

  const [histSix, setHistSix] = useState<any[]>([])
  const [histCm, setHistCm] = useState<any[]>([])
  const [histEnova, setHistEnova] = useState<any[]>([])
  const [dasSix, setDasSix] = useState<any[]>([])
  const [dasCm, setDasCm] = useState<any[]>([])
  const [dasEnova, setDasEnova] = useState<any[]>([])
  const [empresas, setEmpresas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState<'anual' | 'mensal' | 'impostos'>('anual')

  const now = new Date()
  const mesAntIdx = now.getMonth() === 0 ? 11 : now.getMonth() - 1
  const anoAnt = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
  const anoAtual = now.getFullYear()

  useEffect(() => {
    Promise.all([
      historicoAPI.listar(1).then(r => r.data).catch(() => []),
      historicoAPI.listar(2).then(r => r.data).catch(() => []),
      historicoAPI.listar(3).then(r => r.data).catch(() => []),
      dasAPI.listar(1).then(r => r.data).catch(() => []),
      dasAPI.listar(2).then(r => r.data).catch(() => []),
      dasAPI.listar(3).then(r => r.data).catch(() => []),
      empresasAPI.listar().then(r => r.data).catch(() => []),
    ]).then(([h1, h2, h3, d1, d2, d3, emp]) => {
      setHistSix(h1); setHistEnova(h2); setHistCm(h3||[])
      setDasSix(d1); setDasEnova(d2); setDasCm(d3||[])
      setEmpresas(emp)
    }).finally(() => setLoading(false))
  }, [])

  const empSix = empresas.find(e => e.nome === 'SIX') || { aliquota_das: 0.088324 }
  const empEnova = empresas.find(e => e.nome === 'ENOVA') || { aliquota_das: 0.093254 }

  // Dados anuais
  const todosAnos = [...new Set([...histSix, ...histEnova, ...histCm].map(r => r.ano))].sort((a, b) => a - b)
  const ultimos3Anos = todosAnos.slice(-3)
  const dadosAnuais = todosAnos.map(ano => ({
    ano,
    six: histSix.filter(r => r.ano === ano).reduce((s, r) => s + r.valor, 0),
    enova: histEnova.filter(r => r.ano === ano).reduce((s, r) => s + r.valor, 0),
    cm: (histCm||[]).filter(r => r.ano === ano).reduce((s, r) => s + r.valor, 0),
    get total() { return this.six + this.enova + this.cm },
    dasSix: dasSix.filter(r => r.ano === ano).reduce((s, r) => s + r.valor, 0),
    dasEnova: dasEnova.filter(r => r.ano === ano).reduce((s, r) => s + r.valor, 0),
    get dasTotal() { return this.dasSix + this.dasEnova },
  }))

  // Top 5 meses
  const todosMeses = [...new Set([...histSix, ...histEnova, ...histCm].map(r => `${r.ano}-${r.mes}`))]
    .map(k => { const [a, m] = k.split('-'); return { ano: +a, mes: +m } })
    .map(p => ({
      ...p,
      label: `${MESES[p.mes - 1]}/${p.ano}`,
      six: histSix.find(r => r.ano === p.ano && r.mes === p.mes)?.valor || 0,
      enova: histEnova.find(r => r.ano === p.ano && r.mes === p.mes)?.valor || 0,
      get total() { return this.six + this.enova },
    }))
    .sort((a, b) => b.total - a.total)

  const top5 = todosMeses.slice(0, 5)
  const bottom5 = [...todosMeses].filter(m => m.total > 0).sort((a, b) => a.total - b.total).slice(0, 5)

  // Médias
  const mediaAnual = dadosAnuais.length ? dadosAnuais.reduce((s, d) => s + d.total, 0) / dadosAnuais.length : 0
  const mediaMensal = todosMeses.length ? todosMeses.reduce((s, m) => s + m.total, 0) / todosMeses.length : 0

  // Gráfico anual (barras comparativas)
  useEffect(() => {
    if (abaAtiva !== 'anual') return
    const canvas = canvasAnualRef.current
    if (!canvas || loading || dadosAnuais.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    cancelAnimationFrame(animRef1.current)

    const W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W; canvas.height = H
    const PAD = { top: 36, right: 20, bottom: 32, left: 60 }
    const cW = W - PAD.left - PAD.right, cH = H - PAD.top - PAD.bottom
    const ultimos3Anos = [...new Set(dadosAnuais.map(d => d.ano))].sort((a,b)=>a-b).slice(-3)
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
    const barW = Math.max(8, Math.min(28, groupW / nAnos - 3))
    const groupBarW = barW * nAnos + 3 * (nAnos - 1)

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
          const x = gx + ai * (barW + 3)
          ctx.fillStyle = cores[ai]
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
        })

      })

      if (prog < 1) animRef1.current = requestAnimationFrame(draw)
    }
    animRef1.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef1.current)
  }, [histSix, histEnova, loading, abaAtiva])

  // Gráfico mensal (linha 12 meses)
  useEffect(() => {
    if (abaAtiva !== 'mensal') return
    const canvas = canvasMensalRef.current
    if (!canvas || loading) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    cancelAnimationFrame(animRef2.current)

    // Ultimos 3 anos, 12 meses cada, total das 3 empresas
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
  }, [histSix, histEnova, histCm, loading, abaAtiva])

  const mono = { fontFamily: 'monospace' }
  const card = { background: '#13161F', border: '1px solid #252836', borderRadius: '14px', overflow: 'hidden', marginBottom: '12px' }
  const st = { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.2px', color: '#4A5070', marginBottom: '10px', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }

  if (loading) return <div style={{ padding: '40px', color: '#7B82A0' }}>Carregando...</div>

  const anoAntDados = dadosAnuais.find(d => d.ano === anoAnt - 1)
  const anoAtualDados = dadosAnuais.find(d => d.ano === anoAtual)

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4A5070', marginBottom: '16px' }}>
        <span>Início</span><span style={{ margin: '0 4px' }}>›</span>
        <span style={{ color: '#A78BFA' }}>Relatórios</span>
      </div>

      {/* KPIs gerais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Histórico', valor: fmtR(dadosAnuais.reduce((s, d) => s + d.total, 0)), sub: `${todosAnos.length} anos · ${todosMeses.filter(m => m.total > 0).length} meses`, cor: '#4F8EF7' },
          { label: 'Média Anual', valor: fmtR(mediaAnual), sub: 'Média por ano consolidado', cor: '#34D399' },
          { label: 'Média Mensal', valor: fmtR(mediaMensal), sub: 'Média por mês lançado', cor: '#A78BFA' },
          { label: 'DAS Total Pago', valor: fmtR(dasSix.reduce((s, r) => s + r.valor, 0) + dasEnova.reduce((s, r) => s + r.valor, 0) + dasCm.reduce((s, r) => s + r.valor, 0)), sub: `${dasSix.length + dasEnova.length + dasCm.length} pagamentos confirmados`, cor: '#FBBF24' },
        ].map((k, i) => (
          <div key={i} style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: k.cor }} />
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070', marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '18px', fontWeight: 700, ...mono, color: k.cor, marginBottom: '4px' }}>{k.valor}</div>
            <div style={{ fontSize: '11px', color: '#7B82A0' }}>{k.sub}</div>
          </div>
        ))}
      </div>
      {/* Abas */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '4px', background: '#13161F', border: '1px solid #252836', borderRadius: '10px', padding: '4px' }}>
          {[
            { key: 'anual', label: '📅 Comparativo Anual' },
            { key: 'mensal', label: '📈 Evolução Mensal' },
            { key: 'impostos', label: '💰 Impostos' },
          ].map(a => (
            <button key={a.key} onClick={() => setAbaAtiva(a.key as any)}
              style={{ padding: '7px 16px', borderRadius: '7px', border: 'none', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: abaAtiva === a.key ? '#252836' : 'transparent', color: abaAtiva === a.key ? '#E8EAF0' : '#7B82A0', transition: 'all .15s' }}>
              {a.label}
            </button>
          ))}
        </div>
        <button onClick={() => window.location.href='/exportar'} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid #252836', background: '#13161F', color: '#7B82A0', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }} onMouseEnter={e=>(e.currentTarget.style.color='#E8EAF0')} onMouseLeave={e=>(e.currentTarget.style.color='#7B82A0')}>
          📊 Exportar Excel
        </button>
      </div>
      {/* ABA: Anual */}
      {abaAtiva === 'anual' && (
        <>
          {/* Gráfico anual */}
          <div style={{ ...card, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0' }}>Comparativo Mensal — Últimos 3 Anos (SIX + ENOVA + CM)</div>
              <div style={{ display: 'flex', gap: '14px', fontSize: '11px' }}>
                {ultimos3Anos.map((ano, i) => ({ cor: ['#4F8EF7','#34D399','#FBBF24'][i], l: String(ano) })).map(e => (
                  <span key={e.l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: e.cor, display: 'inline-block' }} />
                    <span style={{ color: '#7B82A0' }}>{e.l}</span>
                  </span>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative', width: '100%', height: '280px' }}>
              <canvas ref={canvasAnualRef} style={{ width: '100%', height: '100%', display: 'block' }} />
            </div>
          </div>

          {/* Tabela comparativa anual */}
          <div style={card}>
            <div style={{ padding: '10px 16px', background: '#1A1D2A', borderBottom: '1px solid #252836', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#E8EAF0' }}>Comparativo Anual Detalhado</span>
              {anoAntDados && anoAtualDados && (
                <span style={{ fontSize: '11px', color: '#7B82A0' }}>
                  {anoAtual} vs {anoAtual - 1}: <span style={{ color: pctCor(anoAtualDados.total, anoAntDados.total), fontWeight: 600 }}>{pct(anoAtualDados.total, anoAntDados.total)}</span>
                </span>
              )}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#1A1D2A' }}>
                  {['Ano', 'SIX', 'ENOVA', 'Total', 'Var. Anual', 'DAS Pago', '% DAS/Fat'].map((h, i) => (
                    <th key={h} style={{ padding: '8px 14px', textAlign: i === 0 ? 'left' : 'right', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: '#4A5070', borderBottom: '1px solid #252836' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...dadosAnuais].reverse().map((d, i, arr) => {
                  const prev = arr[i + 1]
                  const isCurr = d.ano === anoAtual
                  const varAnual = prev ? pct(d.total, prev.total) : '—'
                  const varCor = prev ? pctCor(d.total, prev.total) : '#7B82A0'
                  const pcDAS = d.total > 0 ? ((d.dasTotal / d.total) * 100).toFixed(2) + '%' : '—'
                  return (
                    <tr key={d.ano} style={{ background: isCurr ? 'rgba(251,191,36,0.04)' : 'transparent' }}>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid #252836', ...mono, fontWeight: isCurr ? 700 : 600, color: isCurr ? '#FBBF24' : '#E8EAF0' }}>
                        {d.ano}{isCurr && <span style={{ fontSize: '9px', background: '#2E1F06', color: '#FBBF24', padding: '1px 5px', borderRadius: '999px', marginLeft: '6px' }}>atual</span>}
                      </td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#4F8EF7' }}>{d.six > 0 ? fmtR(d.six) : '—'}</td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#34D399' }}>{d.enova > 0 ? fmtR(d.enova) : '—'}</td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', fontWeight: 700, color: '#E8EAF0' }}>{fmtR(d.total)}</td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: varCor, fontWeight: 600 }}>{varAnual}</td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#FBBF24' }}>{d.dasTotal > 0 ? fmtR(d.dasTotal) : '—'}</td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#A78BFA' }}>{pcDAS}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ABA: Mensal */}
      {abaAtiva === 'mensal' && (
        <>
          <div style={{ ...card, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0' }}>Evolução Mensal — Últimos 3 Anos (SIX + ENOVA + CM)</div>
              <div style={{ display: 'flex', gap: '14px', fontSize: '11px' }}>
                {ultimos3Anos.map((ano, i) => ({ cor: ['#4F8EF7','#34D399','#FBBF24'][i], l: String(ano), dash: false })).map(e => (
                  <span key={e.l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '16px', height: '2px', background: e.cor, display: 'inline-block', borderTop: e.dash ? '2px dashed' : '2px solid', borderColor: e.cor }} />
                    <span style={{ color: '#7B82A0' }}>{e.l}</span>
                  </span>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative', width: '100%', height: '280px' }}>
              <canvas ref={canvasMensalRef} style={{ width: '100%', height: '100%', display: 'block' }} />
            </div>
          </div>

          {/* Top e Bottom meses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { titulo: '🏆 Top 5 — Maiores Faturamentos', dados: top5, cor: '#34D399' },
              { titulo: '📉 Bottom 5 — Menores Faturamentos', dados: bottom5, cor: '#F87171' },
            ].map(({ titulo, dados, cor }) => (
              <div key={titulo} style={card}>
                <div style={{ padding: '10px 16px', background: '#1A1D2A', borderBottom: '1px solid #252836' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#E8EAF0' }}>{titulo}</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#1A1D2A' }}>
                      <th style={{ padding: '7px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: '#4A5070', borderBottom: '1px solid #252836' }}>Mês/Ano</th>
                      <th style={{ padding: '7px 14px', textAlign: 'right', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: '#4F8EF7', borderBottom: '1px solid #252836' }}>SIX</th>
                      <th style={{ padding: '7px 14px', textAlign: 'right', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: '#34D399', borderBottom: '1px solid #252836' }}>ENOVA</th>
                      <th style={{ padding: '7px 14px', textAlign: 'right', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: cor, borderBottom: '1px solid #252836' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados.map((m, i) => (
                      <tr key={m.label}>
                        <td style={{ padding: '8px 14px', borderBottom: '1px solid #252836', color: '#7B82A0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ ...mono, fontSize: '10px', fontWeight: 700, color: cor, background: cor + '22', padding: '1px 6px', borderRadius: '4px' }}>#{i + 1}</span>
                          {m.label}
                        </td>
                        <td style={{ padding: '8px 14px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#4F8EF7' }}>{m.six > 0 ? fmtR(m.six) : '—'}</td>
                        <td style={{ padding: '8px 14px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#34D399' }}>{m.enova > 0 ? fmtR(m.enova) : '—'}</td>
                        <td style={{ padding: '8px 14px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', fontWeight: 700, color: cor }}>{fmtR(m.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ABA: Impostos */}
      {abaAtiva === 'impostos' && (
        <>
          {/* Alíquotas */}
          <div style={{ ...card, padding: '16px 20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0', marginBottom: '14px' }}>Alíquotas e Parâmetros Fiscais</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
              {[
                { label: 'Alíquota DAS — SIX', valor: (empSix.aliquota_das * 100).toFixed(4).replace('.', ',') + '%', cor: '#4F8EF7' },
                { label: 'Alíquota DAS — ENOVA', valor: (empEnova.aliquota_das * 100).toFixed(4).replace('.', ',') + '%', cor: '#34D399' },
                { label: 'Crédito ICMS — SIX', valor: ((empSix.credito_icms || 0) * 100).toFixed(4).replace('.', ',') + '%', cor: '#22D3EE' },
                { label: 'Crédito ICMS — ENOVA', valor: ((empEnova.credito_icms || 0) * 100).toFixed(4).replace('.', ',') + '%', cor: '#22D3EE' },
              ].map((k, i) => (
                <div key={i} style={{ background: '#1A1D2A', borderRadius: '10px', padding: '14px', border: '1px solid #252836' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070', marginBottom: '8px' }}>{k.label}</div>
                  <div style={{ fontSize: '22px', fontWeight: 700, ...mono, color: k.cor }}>{k.valor}</div>
                </div>
              ))}
            </div>
          </div>

          {/* DAS anual detalhado */}
          <div style={card}>
            <div style={{ padding: '10px 16px', background: '#1A1D2A', borderBottom: '1px solid #252836' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#E8EAF0' }}>DAS x Faturamento por Ano</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#1A1D2A' }}>
                  {['Ano', 'Faturamento', 'DAS SIX', 'DAS ENOVA', 'DAS Total', 'Ef. Tributária'].map((h, i) => (
                    <th key={h} style={{ padding: '8px 14px', textAlign: i === 0 ? 'left' : 'right', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: '#4A5070', borderBottom: '1px solid #252836' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...dadosAnuais].reverse().map(d => {
                  const ef = d.total > 0 ? ((d.dasTotal / d.total) * 100).toFixed(2) + '%' : '—'
                  const isCurr = d.ano === anoAtual
                  return (
                    <tr key={d.ano} style={{ background: isCurr ? 'rgba(251,191,36,0.04)' : 'transparent' }}>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid #252836', ...mono, fontWeight: isCurr ? 700 : 600, color: isCurr ? '#FBBF24' : '#E8EAF0' }}>
                        {d.ano}{isCurr && <span style={{ fontSize: '9px', background: '#2E1F06', color: '#FBBF24', padding: '1px 5px', borderRadius: '999px', marginLeft: '6px' }}>atual</span>}
                      </td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#E8EAF0' }}>{fmtR(d.total)}</td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#4F8EF7' }}>{d.dasSix > 0 ? fmtR(d.dasSix) : '—'}</td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#34D399' }}>{d.dasEnova > 0 ? fmtR(d.dasEnova) : '—'}</td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', fontWeight: 700, color: '#FBBF24' }}>{d.dasTotal > 0 ? fmtR(d.dasTotal) : '—'}</td>
                      <td style={{ padding: '9px 14px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#A78BFA' }}>{ef}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
