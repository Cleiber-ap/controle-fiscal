import { useEffect, useRef, useState } from 'react'
import { historicoAPI, dasAPI, empresasAPI } from '../../api/endpoints'

interface HistoricoItem { id: number; empresa_id: number; ano: number; mes: number; valor: number }
interface DasItem { id: number; empresa_id: number; ano: number; mes: number; valor: number }

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const MESES_FULL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const PAL = ['#4F8EF7','#A78BFA','#FBBF24','#34D399','#FB923C','#F87171']

function fmtK(v: number) {
  if (v >= 1000000) return 'R$' + (v / 1000000).toFixed(1) + 'M'
  if (v >= 1000) return 'R$' + (v / 1000).toFixed(0) + 'K'
  return 'R$' + v.toFixed(0)
}
function fmtR(v: number) {
  return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

export default function Dashboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  const [historico, setHistorico] = useState<HistoricoItem[]>([])
  const [das, setDas] = useState<DasItem[]>([])
  const [empresas, setEmpresas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [periodo, setPeriodo] = useState<'6m' | '12m' | '24m' | 'tudo'>('12m')
  const [comparar, setComparar] = useState<number[]>([])
  const [customA, setCustomA] = useState({ mesIni: 1, anoIni: 2025, mesFim: 12, anoFim: 2025 })
  const [customB, setCustomB] = useState({ mesIni: 1, anoIni: 2024, mesFim: 12, anoFim: 2024 })
  const [customC, setCustomC] = useState({ mesIni: '', anoIni: '', mesFim: '', anoFim: '' })
  const [customAtivo, setCustomAtivo] = useState(false)
  const [customLabel, setCustomLabel] = useState('')

  const now = new Date()
  const mesAntIdx = now.getMonth() === 0 ? 11 : now.getMonth() - 1
  const anoAnt = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
  const anoAtual = now.getFullYear()

  useEffect(() => {
    Promise.all([
      historicoAPI.listar(1).then(r => r.data),
      historicoAPI.listar(2).then(r => r.data),
      historicoAPI.listar(3).then(r => r.data),
      dasAPI.listar(1).then(r => r.data),
      dasAPI.listar(2).then(r => r.data),
      empresasAPI.listar().then(r => r.data),
    ]).then(([h1, h2, h3, d1, d2, emp]) => {
      setHistorico([...h1, ...h2, ...h3])
      setDas([...d1, ...d2])
      setEmpresas(emp)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  // Calcular KPIs
  const histSix = historico.filter(r => r.empresa_id === 1)
  const histEnova = historico.filter(r => r.empresa_id === 2)
  const histCm = historico.filter(r => r.empresa_id === 3)
  const empSix = empresas.find(e => e.nome === 'SIX') || { aliquota_das: 0.088324 }
  const empEnova = empresas.find(e => e.nome === 'ENOVA') || { aliquota_das: 0.093254 }

  const vSixMes = histSix.find(r => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0
  const vEnovaMes = histEnova.find(r => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0
  const totalMes = vSixMes + vEnovaMes
  const vSixAno = histSix.filter(r => r.ano === anoAtual).reduce((s, r) => s + r.valor, 0)
  const vEnovaAno = histEnova.filter(r => r.ano === anoAtual).reduce((s, r) => s + r.valor, 0)
  const totalAno = vSixAno + vEnovaAno
  const impTotal = vSixMes * empSix.aliquota_das + vEnovaMes * empEnova.aliquota_das

  // Preparar anos disponíveis
  const anosDisp = [...new Set(historico.map(r => r.ano))].sort((a, b) => b - a)
  const anosAsc = [...anosDisp].sort((a, b) => a - b)

  // Preparar dados do gráfico
  function getTotais(ano: number, mes: number) {
    const s = histSix.find(r => r.ano === ano && r.mes === mes)?.valor || 0
    const e = histEnova.find(r => r.ano === ano && r.mes === mes)?.valor || 0
    const c = histCm.find(r => r.ano === ano && r.mes === mes)?.valor || 0
    return { six: s, enova: e, cm: c, total: s + e + c }
  }

  function getTotal(ano: number, mes: number) {
    return getTotais(ano, mes).total
  }

  function getPeriodos() {
    const cutoff = new Date(now.getFullYear(), now.getMonth() - (periodo === '6m' ? 6 : periodo === '12m' ? 12 : periodo === '24m' ? 24 : 120), 1)
    const res = []
    for (let ano of anosAsc) {
      for (let mes = 1; mes <= 12; mes++) {
        const d = new Date(ano, mes - 1, 1)
        if (d >= cutoff && d <= now) {
          if (historico.some(r => r.ano === ano && r.mes === mes)) {
            res.push({ ano, mes, label: MESES[mes - 1] + '/' + String(ano).slice(2) })
          }
        }
      }
    }
    return res
  }

  function getRangeMonths(mesIni: number, anoIni: number, mesFim: number, anoFim: number) {
    const res = []
    for (let ano = anoIni; ano <= anoFim; ano++) {
      const mStart = ano === anoIni ? mesIni : 1
      const mEnd = ano === anoFim ? mesFim : 12
      for (let mes = mStart; mes <= mEnd; mes++) {
        res.push({ ano, mes, label: MESES[mes - 1] + '/' + String(ano).slice(2) })
      }
    }
    return res
  }

  // Desenhar gráfico no canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || loading) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    cancelAnimationFrame(animRef.current)

    const PAD = { top: 28, right: 16, bottom: 28, left: 52 }
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H
    const cW = W - PAD.left - PAD.right
    const cH = H - PAD.top - PAD.bottom

    let series: { label: string; color: string; data: number[]; labels: string[] }[] = []

    if (customAtivo) {
      const pA = getRangeMonths(customA.mesIni, customA.anoIni, customA.mesFim, customA.anoFim)
      const pB = getRangeMonths(customB.mesIni, customB.anoIni, customB.mesFim, customB.anoFim)
      const maxLen = Math.max(pA.length, pB.length)
      const pos = Array.from({ length: maxLen }, (_, i) => i).filter(i => {
        const vA = pA[i] ? getTotal(pA[i].ano, pA[i].mes) : 0
        const vB = pB[i] ? getTotal(pB[i].ano, pB[i].mes) : 0
        return vA > 0 || vB > 0
      })
      series = [
        { label: 'A: ' + customLabel.split(' | ')[0]?.replace('A: ', ''), color: '#4F8EF7', data: pos.map(i => pA[i] ? getTotal(pA[i].ano, pA[i].mes) : 0), labels: pos.map(i => pA[i]?.label || '') },
        { label: 'B: ' + customLabel.split(' | ')[1]?.replace('B: ', ''), color: '#A78BFA', data: pos.map(i => pB[i] ? getTotal(pB[i].ano, pB[i].mes) : 0), labels: pos.map(i => pB[i]?.label || '') },
      ]
      if (customC.anoIni && customC.anoFim) {
        const pC = getRangeMonths(parseInt(customC.mesIni), parseInt(customC.anoIni), parseInt(customC.mesFim), parseInt(customC.anoFim))
        const posC = Array.from({ length: Math.max(maxLen, pC.length) }, (_, i) => i).filter(i => pC[i] ? getTotal(pC[i].ano, pC[i].mes) > 0 : false)
        series.push({ label: 'C', color: '#FBBF24', data: posC.map(i => pC[i] ? getTotal(pC[i].ano, pC[i].mes) : 0), labels: posC.map(i => pC[i]?.label || '') })
      }
    } else {
      const periods = getPeriodos()
      const mainData = periods.map(p => getTotal(p.ano, p.mes))
      const stackData = periods.map(p => getTotais(p.ano, p.mes))
      series = [{ label: 'SIX+ENOVA', color: '#4F8EF7', data: mainData, labels: periods.map(p => p.label), stack: stackData } as any]
      comparar.forEach((yr, ci) => {
        series.push({ label: String(yr), color: PAL[(ci + 1) % PAL.length], data: periods.map(p => getTotal(yr, p.mes)), labels: periods.map(p => p.label) })
      })
    }

    const nBars = series[0]?.data.length || 0
    if (!nBars) return

    const allVals = series.flatMap(s => s.data)
    const maxV = Math.max(...allVals, 1)
    const gridSteps = 8
    const groupW = cW / nBars
    const barSeries = series.filter((_, i) => i === 0)
    const lineSeries = series.filter((_, i) => i > 0)
    const barW = Math.max(4, Math.min(28, (groupW * 0.8) / Math.max(barSeries.length, 1)))
    const groupOffset = -(barSeries.length - 1) * barW / 2

    function fmtK2(v: number) {
      if (v >= 1000000) return 'R$' + (v / 1000000).toFixed(1) + 'M'
      if (v >= 1000) return 'R$' + (v / 1000).toFixed(0) + 'K'
      return 'R$' + v.toFixed(0)
    }

    let progress = 0
    const start = performance.now()
    const dur = 800

    function draw(ts: number) {
      progress = Math.min(1, (ts - start) / dur)
      const ease = 1 - Math.pow(1 - progress, 3)

      ctx.clearRect(0, 0, W, H)

      // Grid
      ctx.font = '11px monospace'
      ctx.textAlign = 'right'
      for (let i = 0; i <= gridSteps; i++) {
        const v = maxV * i / gridSteps
        const y = PAD.top + cH - (cH * i / gridSteps)
        ctx.strokeStyle = i === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + cW, y); ctx.stroke()
        if (i > 0) { ctx.fillStyle = '#7B82A0'; ctx.fillText(fmtK2(v), PAD.left - 4, y + 4) }
      }

      // Barras animadas
      if (customAtivo) {
        const nS = series.length
        const bW2 = Math.max(4, Math.min(22, (groupW * 0.85) / nS))
        const gOff = -(nS - 1) * bW2 / 2
        series.forEach((s, si) => {
          ctx.fillStyle = s.color
          s.data.forEach((v, i) => {
            const delay = i / nBars * 0.5
            const lp = Math.max(0, Math.min(1, (ease - delay) / (1 - 0.5)))
            const bH = v / maxV * cH * lp
            const x = PAD.left + groupW * i + groupW / 2 + gOff + si * bW2
            const y = PAD.top + cH - bH
            ctx.globalAlpha = 0.85
            ctx.beginPath()
            if (ctx.roundRect) ctx.roundRect(x, y, bW2 - 1, Math.max(0, bH), 2)
            else ctx.rect(x, y, bW2 - 1, Math.max(0, bH))
            ctx.fill()
          })
          ctx.globalAlpha = 1
        })
        // Labels X
        ctx.textAlign = 'center'; ctx.fillStyle = '#7B82A0'; ctx.font = '10px monospace'
        series[0].labels.forEach((lbl, i) => {
          ctx.fillText(lbl, PAD.left + groupW * i + groupW / 2, PAD.top + cH + 16)
        })
        // Legenda
        let lx = PAD.left; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'
        series.forEach((s) => {
          ctx.fillStyle = s.color; ctx.fillRect(lx, 8, 10, 10)
          ctx.fillStyle = '#7B82A0'; ctx.fillText(s.label || '', lx + 14, 18)
          lx += ctx.measureText(s.label || '').width + 34
        })
      } else {
        // Barras empilhadas: SIX (azul base) + ENOVA (verde topo)
        const mainSerie = barSeries[0] as any
        const stack = mainSerie?.stack
        if (stack) {
          stack.forEach((t: any, i: number) => {
            if (t.total === 0) return
            const delay = i / nBars * 0.4
            const lp = Math.max(0, Math.min(1, (ease - delay) / 0.6))
            const hTotal = t.total / maxV * cH * lp
            const hSix   = t.total > 0 ? t.six   / t.total * hTotal : 0
            const hEnova = t.total > 0 ? t.enova / t.total * hTotal : 0
            const hCm    = t.total > 0 ? t.cm    / t.total * hTotal : 0
            const x = PAD.left + groupW * i + groupW / 2 - barW / 2
            const baseY = PAD.top + cH
            // SIX — base (azul)
            if (hSix > 0) {
              ctx.fillStyle = '#4F8EF7'
              ctx.beginPath()
              if (ctx.roundRect) ctx.roundRect(x, baseY - hSix, barW - 1, Math.max(1, hSix), hEnova === 0 && hCm === 0 ? [2,2,0,0] : [0,0,0,0])
              else ctx.rect(x, baseY - hSix, barW - 1, Math.max(1, hSix))
              ctx.fill()
            }
            // ENOVA — meio (verde)
            if (hEnova > 0) {
              ctx.fillStyle = '#34D399'
              ctx.beginPath()
              if (ctx.roundRect) ctx.roundRect(x, baseY - hSix - hEnova, barW - 1, Math.max(1, hEnova), hCm === 0 ? [2,2,0,0] : [0,0,0,0])
              else ctx.rect(x, baseY - hSix - hEnova, barW - 1, Math.max(1, hEnova))
              ctx.fill()
            }
            // CM — topo (rosa)
            if (hCm > 0) {
              ctx.fillStyle = '#F472B6'
              ctx.beginPath()
              if (ctx.roundRect) ctx.roundRect(x, baseY - hSix - hEnova - hCm, barW - 1, Math.max(1, hCm), [2,2,0,0])
              else ctx.rect(x, baseY - hSix - hEnova - hCm, barW - 1, Math.max(1, hCm))
              ctx.fill()
            }
          })
        } else {
          barSeries.forEach((s, si) => {
            s.data.forEach((v, i) => {
              const delay = i / nBars * 0.4
              const lp = Math.max(0, Math.min(1, (ease - delay) / 0.6))
              const bH = v / maxV * cH * lp
              const x = PAD.left + groupW * i + groupW / 2 + groupOffset + si * barW
              ctx.fillStyle = s.color + 'CC'
              ctx.beginPath()
              if (ctx.roundRect) ctx.roundRect(x, PAD.top + cH - bH, barW - 1, Math.max(0, bH), 2)
              else ctx.rect(x, PAD.top + cH - bH, barW - 1, Math.max(0, bH))
              ctx.fill()
            })
          })
        }
        // Linhas de comparação
        lineSeries.forEach((s) => {
          ctx.strokeStyle = s.color
          ctx.lineWidth = 2
          ctx.setLineDash([4, 3])
          ctx.globalAlpha = 0.8 * ease
          ctx.beginPath()
          s.data.forEach((v, i) => {
            const x = PAD.left + groupW * i + groupW / 2
            const y = PAD.top + cH - (v / maxV * cH)
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
          })
          ctx.stroke()
          ctx.setLineDash([])
          ctx.globalAlpha = 1
        })
        // Labels X
        ctx.textAlign = 'center'; ctx.fillStyle = '#7B82A0'; ctx.font = '10px monospace'
        const skip = Math.ceil(nBars / 20)
        series[0].labels.forEach((lbl, i) => {
          if (i % skip !== 0 && i !== nBars - 1) return
          ctx.fillText(lbl, PAD.left + groupW * i + groupW / 2, PAD.top + cH + 16)
        })
        // Legenda linhas
        if (lineSeries.length > 0) {
          let lx = PAD.left; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'
          lineSeries.forEach(s => {
            ctx.fillStyle = s.color; ctx.fillRect(lx, 8, 20, 3)
            ctx.fillStyle = '#7B82A0'; ctx.fillText(s.label, lx + 24, 18)
            lx += ctx.measureText(s.label).width + 48
          })
        }
      }

      if (progress < 1) animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [historico, periodo, comparar, customAtivo, customLabel])

  function toggleComparar(ano: number) {
    setComparar(prev => prev.includes(ano) ? prev.filter(a => a !== ano) : [...prev, ano])
    setCustomAtivo(false)
  }

  function setPeriodoClick(p: '6m' | '12m' | '24m' | 'tudo') {
    setPeriodo(p)
    setCustomAtivo(false)
    setComparar([])
  }

  function aplicarCustom() {
    const labelA = `${MESES[customA.mesIni - 1]}/${customA.anoIni} > ${MESES[customA.mesFim - 1]}/${customA.anoFim}`
    const labelB = `${MESES[customB.mesIni - 1]}/${customB.anoIni} > ${MESES[customB.mesFim - 1]}/${customB.anoFim}`
    setCustomLabel(`A: ${labelA} | B: ${labelB}`)
    setCustomAtivo(true)
  }

  function limparCustom() {
    setCustomAtivo(false)
    setCustomLabel('')
  }

  const btnStyle = (ativo: boolean, color = '#4F8EF7', bg = '#1C2E52') => ({
    padding: '4px 10px', borderRadius: '5px', fontSize: '11px', fontWeight: 600,
    cursor: 'pointer', border: `1px solid ${ativo ? color + '55' : '#252836'}`,
    background: ativo ? bg : '#1A1D2A', color: ativo ? color : '#7B82A0',
    fontFamily: 'inherit',
  } as React.CSSProperties)

  const selectStyle = {
    padding: '3px 6px', background: '#13161F', border: '1px solid #252836',
    borderRadius: '4px', fontSize: '11px', color: '#E8EAF0', outline: 'none',
    fontFamily: 'inherit',
  } as React.CSSProperties

  if (loading) return <div style={{ padding: '40px', color: '#7B82A0' }}>Carregando...</div>

  return (
    <div>
      {/* Breadcrumb + data */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4A5070' }}>
          <span>Dashboard</span>
          <span style={{ margin: '0 4px' }}>›</span>
          <span style={{ color: '#7B82A0' }}>Painel</span>
        </div>
        <div style={{ fontSize: '12px', color: '#7B82A0' }}>
          {['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'][now.getDay()]}, {now.getDate()} de {MESES_FULL[now.getMonth()]} de {now.getFullYear()}
        </div>
      </div>



      {/* Gráfico */}
      <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4A5070', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        Faturamento — Comparativo por Período
        <div style={{ flex: 1, height: '1px', background: '#252836' }} />
      </div>

      <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', padding: '16px 16px 12px', marginBottom: '16px' }}>
        {/* Controles período */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '14px', fontSize: '11px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#4F8EF7', opacity: 0.7, display: 'inline-block' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#4F8EF7', display: 'inline-block' }} />
                <span style={{ color: '#7B82A0' }}>SIX</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#34D399', display: 'inline-block' }} />
                <span style={{ color: '#7B82A0' }}>ENOVA</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#F472B6', display: 'inline-block' }} />
                <span style={{ color: '#7B82A0' }}>CM</span>
              </span>
            </span>
            <span style={{ color: '#7B82A0', fontSize: '10px' }}>· linhas = anos comparados</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070' }}>Período</span>
            {(['6m', '12m', '24m', 'tudo'] as const).map(p => (
              <button key={p} onClick={() => setPeriodoClick(p)} style={btnStyle(!customAtivo && periodo === p)}>
                {p === '6m' ? '6 meses' : p === '12m' ? '12 meses' : p === '24m' ? '24 meses' : 'Tudo'}
              </button>
            ))}
            <div style={{ width: '1px', height: '20px', background: '#252836' }} />
            <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070' }}>Comparar com</span>
            {anosDisp.map(ano => (
              <button key={ano} onClick={() => toggleComparar(ano)} style={btnStyle(comparar.includes(ano), PAL[anosDisp.indexOf(ano) % PAL.length], PAL[anosDisp.indexOf(ano) % PAL.length] + '22')}>
                {ano}
              </button>
            ))}
          </div>

          {/* Comparativo personalizado */}
          <div style={{ width: '100%', padding: '12px 16px', background: '#1A1D2A', border: '1px solid #252836', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070', marginBottom: '10px' }}>Comparativo personalizado</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Período A */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.25)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#4F8EF7', minWidth: '14px' }}>A</span>
                  <select style={selectStyle} value={customA.mesIni} onChange={e => setCustomA(p => ({ ...p, mesIni: +e.target.value }))}>
                    {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                  <select style={selectStyle} value={customA.anoIni} onChange={e => setCustomA(p => ({ ...p, anoIni: +e.target.value }))}>
                    {anosAsc.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <span style={{ fontSize: '10px', color: '#4A5070' }}>até</span>
                  <select style={selectStyle} value={customA.mesFim} onChange={e => setCustomA(p => ({ ...p, mesFim: +e.target.value }))}>
                    {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                  <select style={selectStyle} value={customA.anoFim} onChange={e => setCustomA(p => ({ ...p, anoFim: +e.target.value }))}>
                    {anosAsc.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#4A5070', paddingLeft: '4px' }}>comparado com</span>
              </div>
              {/* Período B */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#A78BFA', minWidth: '14px' }}>B</span>
                  <select style={selectStyle} value={customB.mesIni} onChange={e => setCustomB(p => ({ ...p, mesIni: +e.target.value }))}>
                    {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                  <select style={selectStyle} value={customB.anoIni} onChange={e => setCustomB(p => ({ ...p, anoIni: +e.target.value }))}>
                    {anosAsc.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <span style={{ fontSize: '10px', color: '#4A5070' }}>até</span>
                  <select style={selectStyle} value={customB.mesFim} onChange={e => setCustomB(p => ({ ...p, mesFim: +e.target.value }))}>
                    {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                  <select style={selectStyle} value={customB.anoFim} onChange={e => setCustomB(p => ({ ...p, anoFim: +e.target.value }))}>
                    {anosAsc.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#4A5070', paddingLeft: '4px' }}>comparado com</span>
              </div>
              {/* Período C — opcional */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#FBBF24', minWidth: '14px' }}>C</span>
                  <span style={{ fontSize: '10px', color: '#4A5070', fontStyle: 'italic' }}>opcional —</span>
                  <select style={selectStyle} value={customC.mesIni} onChange={e => setCustomC(p => ({ ...p, mesIni: e.target.value }))}>
                    <option value="">—</option>
                    {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                  <select style={selectStyle} value={customC.anoIni} onChange={e => setCustomC(p => ({ ...p, anoIni: e.target.value }))}>
                    <option value="">—</option>
                    {anosAsc.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <span style={{ fontSize: '10px', color: '#4A5070' }}>até</span>
                  <select style={selectStyle} value={customC.mesFim} onChange={e => setCustomC(p => ({ ...p, mesFim: e.target.value }))}>
                    <option value="">—</option>
                    {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                  <select style={selectStyle} value={customC.anoFim} onChange={e => setCustomC(p => ({ ...p, anoFim: e.target.value }))}>
                    <option value="">—</option>
                    {anosAsc.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <button onClick={aplicarCustom} style={{ padding: '5px 16px', background: '#1C2E52', border: '1px solid rgba(79,142,247,0.3)', borderRadius: '5px', color: '#4F8EF7', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Comparar</button>
                <button onClick={limparCustom} style={{ padding: '5px 10px', background: '#13161F', border: '1px solid #252836', borderRadius: '5px', color: '#7B82A0', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>Limpar</button>
                {customLabel && <span style={{ fontSize: '10px', color: '#34D399' }}>{customLabel}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Canvas do gráfico */}
        <div style={{ position: 'relative', width: '100%', height: '460px' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>
      </div>
    </div>
  )
}
