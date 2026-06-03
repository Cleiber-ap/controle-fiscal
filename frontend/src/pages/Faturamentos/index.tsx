import { useEffect, useState } from 'react'
import { historicoAPI } from '../../api/endpoints'

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

function fmtR(v: number) {
  return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function fmtM(v: number) {
  if (v >= 1000000) return 'R$' + (v / 1000000).toFixed(1) + 'M'
  if (v >= 1000) return 'R$' + (v / 1000).toFixed(0) + 'K'
  return 'R$' + v.toFixed(0)
}

export default function Faturamentos() {
  const [histSix, setHistSix] = useState<any[]>([])
  const [histEnova, setHistEnova] = useState<any[]>([])
  const [histCm, setHistCm] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const mesAntIdx = now.getMonth() === 0 ? 11 : now.getMonth() - 1
  const anoAnt = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
  const anoAtual = now.getFullYear()
  const mesAntNome = MESES[mesAntIdx]

  useEffect(() => {
    Promise.all([
      historicoAPI.listar(1).then(r => r.data),
      historicoAPI.listar(2).then(r => r.data),
      historicoAPI.listar(3).then(r => r.data),
    ]).then(([h1, h2, h3]) => {
      setHistSix(h1); setHistEnova(h2); setHistCm(h3)
    }).finally(() => setLoading(false))
  }, [])

  const acumSixAno = histSix.filter(r => r.ano === anoAtual).reduce((s: number, r: any) => s + r.valor, 0)
  const acumEnovaAno = histEnova.filter(r => r.ano === anoAtual).reduce((s: number, r: any) => s + r.valor, 0)
  const acumTotal = acumSixAno + acumEnovaAno
  const vSixMesAnt = histSix.find(r => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0
  const vEnovaMesAnt = histEnova.find(r => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0

  const periodos = [...new Set([
    ...histSix.filter(r => r.valor != null).map(r => `${r.ano}-${r.mes}`),
    ...histEnova.filter(r => r.valor != null).map(r => `${r.ano}-${r.mes}`),
    ...histCm.filter(r => r.valor != null).map(r => `${r.ano}-${r.mes}`),
  ])].map(s => { const [a, m] = s.split('-'); return { ano: +a, mes: +m } })
    .sort((a, b) => b.ano !== a.ano ? b.ano - a.ano : b.mes - a.mes)

  const todosAnos = [...new Set([
    ...histSix.filter(r => r.valor != null).map(r => r.ano),
    ...histEnova.filter(r => r.valor != null).map(r => r.ano),
    ...histCm.filter(r => r.valor != null).map(r => r.ano),
  ])].sort((a, b) => b - a)

  const totAnuais = todosAnos.map(ano => ({
    ano,
    six: histSix.filter(r => r.ano === ano && r.valor != null).reduce((s, r) => s + r.valor, 0),
    enova: histEnova.filter(r => r.ano === ano && r.valor != null).reduce((s, r) => s + r.valor, 0),
    cm: histCm.filter(r => r.ano === ano && r.valor != null).reduce((s, r) => s + r.valor, 0),
    get total() { return this.six + this.enova + this.cm },
  }))

  const grandSix = histSix.filter(r => r.valor != null).reduce((s, r) => s + r.valor, 0)
  const grandEnova = histEnova.filter(r => r.valor != null).reduce((s, r) => s + r.valor, 0)
  const grandCm = histCm.filter(r => r.valor != null).reduce((s, r) => s + r.valor, 0)

  // ── GRÁFICO — lógica EXATA do protótipo ──────────────────────────────────────
  const dadosGrafico = [...totAnuais].reverse()  // ordem cronológica
  const maxTotal = Math.max(...dadosGrafico.map(d => d.total), 1)
  const n = dadosGrafico.length
  // Fórmula EXATA do protótipo:
  const barW = Math.max(32, Math.min(56, Math.floor(560 / n) - 10))
  const gap  = Math.max(8,  Math.floor(560 / n) - barW)
  const chartH = 220
  const labelH = 22
  const totalH = chartH + labelH
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(p => ({
    pct: p, val: maxTotal * p, y: Math.round(chartH - chartH * p)
  }))

  const mono = { fontFamily: "'JetBrains Mono', monospace" }
  const card = { background: '#13161F', border: '1px solid #252836', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }
  const thStyle = (cor = '#4A5070', align: 'left' | 'right' = 'left') => ({
    padding: '7px 12px', textAlign: align, fontSize: '10px', fontWeight: 600,
    textTransform: 'uppercase' as const, letterSpacing: '.8px', color: cor,
    borderBottom: '1px solid #252836',
  })

  if (loading) return <div style={{ padding: '40px', color: '#7B82A0' }}>Carregando...</div>

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4A5070', marginBottom: '16px' }}>
        <span>Início</span><span style={{ margin: '0 4px' }}>›</span>
        <span style={{ color: '#7B82A0' }}>Faturamentos</span>
      </div>

      {/* ── ACUMULADO DO ANO ── */}
      <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4A5070', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        Acumulado do Ano ({anoAtual})
        <div style={{ flex: 1, height: '1px', background: '#252836' }} />
      </div>
      <div style={card}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #252836', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070', marginBottom: '6px' }}>Total Consolidado — SIX + ENOVA</div>
            <div style={{ fontSize: '30px', fontWeight: 700, ...mono, color: '#E8EAF0' }}>{fmtR(acumTotal)}</div>
          </div>
          <div style={{ fontSize: '11px', color: '#7B82A0' }}>{anoAtual}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {[
            { label: 'SIX Comercial', cor: '#4F8EF7', acum: acumSixAno, meses: histSix.filter(r => r.ano === anoAtual).length, mesAnt: vSixMesAnt },
            { label: 'ENOVA Comercial', cor: '#34D399', acum: acumEnovaAno, meses: histEnova.filter(r => r.ano === anoAtual).length, mesAnt: vEnovaMesAnt },
          ].map((e, i) => (
            <div key={i} style={{ padding: '14px 22px', borderRight: i === 0 ? '1px solid #252836' : 'none', borderTop: `2px solid ${e.cor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: e.cor, display: 'inline-block' }} />{e.label}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, ...mono, color: e.cor }}>{fmtR(e.acum)}</div>
                <div style={{ fontSize: '10px', color: '#7B82A0', marginTop: '3px' }}>{e.meses} meses lançados</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#4A5070', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Mês ant. ({mesAntNome})</div>
                <div style={{ fontSize: '14px', fontWeight: 700, ...mono, color: e.cor }}>{fmtR(e.mesAnt)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LANÇAMENTOS ── */}
      <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4A5070', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        Lançamentos <div style={{ flex: 1, height: '1px', background: '#252836' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', alignItems: 'start' }}>
        {/* Tabela mensal */}
        <div style={{ ...card, display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
          <div style={{ padding: '10px 16px', background: '#1A1D2A', borderBottom: '1px solid #252836', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#E8EAF0' }}>Faturamento Mensal</span>
            <div style={{ display: 'flex', gap: '10px', fontSize: '10px' }}>
              {[{ cor: '#4F8EF7', l: 'SIX' }, { cor: '#34D399', l: 'ENOVA' }, { cor: '#F472B6', l: 'CM' }].map(e => (
                <span key={e.l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '1px', background: e.cor, display: 'inline-block' }} />
                  <span style={{ color: '#7B82A0' }}>{e.l}</span>
                </span>
              ))}
            </div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '340px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead><tr style={{ background: '#1A1D2A', position: 'sticky', top: 0, zIndex: 1 }}>
                <th style={thStyle()}>Mês/Ano</th>
                <th style={thStyle('#4F8EF7', 'right')}>SIX</th>
                <th style={thStyle('#34D399', 'right')}>ENOVA</th>
                <th style={thStyle('#F472B6', 'right')}>CM</th>
                <th style={thStyle('#4A5070', 'right')}>Total</th>
              </tr></thead>
              <tbody>
                {periodos.map(p => {
                  const vS = histSix.find(r => r.ano === p.ano && r.mes === p.mes)?.valor || 0
                  const vE = histEnova.find(r => r.ano === p.ano && r.mes === p.mes)?.valor || 0
                  const vC = histCm.find(r => r.ano === p.ano && r.mes === p.mes)?.valor || 0
                  const tot = vS + vE + vC
                  const isAnt = p.ano === anoAnt && p.mes === mesAntIdx + 1
                  return (
                    <tr key={`${p.ano}-${p.mes}`} style={{ background: isAnt ? 'rgba(251,191,36,0.06)' : 'transparent' }}>
                      <td style={{ padding: '7px 12px', borderBottom: '1px solid #252836', color: isAnt ? '#FBBF24' : '#7B82A0', fontWeight: isAnt ? 700 : 400 }}>
                        {MESES[p.mes - 1]}/{p.ano}
                        {isAnt && <span style={{ fontSize: '9px', background: '#2E1F06', color: '#FBBF24', padding: '1px 5px', borderRadius: '999px', marginLeft: '5px' }}>ant.</span>}
                      </td>
                      <td style={{ padding: '7px 12px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#4F8EF7' }}>{vS > 0 ? fmtR(vS) : '—'}</td>
                      <td style={{ padding: '7px 12px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#34D399' }}>{vE > 0 ? fmtR(vE) : '—'}</td>
                      <td style={{ padding: '7px 12px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#F472B6' }}>{vC > 0 ? fmtR(vC) : '—'}</td>
                      <td style={{ padding: '7px 12px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', fontWeight: 700, color: '#E8EAF0' }}>{fmtR(tot)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabela anual */}
        <div style={{ ...card, display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
          <div style={{ padding: '10px 16px', background: '#1A1D2A', borderBottom: '1px solid #252836', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#E8EAF0' }}>Faturamento Anual</span>
            <div style={{ display: 'flex', gap: '10px', fontSize: '10px' }}>
              {[{ cor: '#4F8EF7', l: 'SIX' }, { cor: '#34D399', l: 'ENOVA' }].map(e => (
                <span key={e.l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '1px', background: e.cor, display: 'inline-block' }} />
                  <span style={{ color: '#7B82A0' }}>{e.l}</span>
                </span>
              ))}
            </div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '340px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead><tr style={{ background: '#1A1D2A', position: 'sticky', top: 0, zIndex: 1 }}>
                <th style={thStyle()}>Ano</th>
                <th style={thStyle('#4F8EF7', 'right')}>SIX</th>
                <th style={thStyle('#34D399', 'right')}>ENOVA</th>
                <th style={thStyle('#F472B6', 'right')}>CM</th>
                <th style={thStyle('#4A5070', 'right')}>Total</th>
              </tr></thead>
              <tbody>
                {totAnuais.map(d => {
                  const isCurr = d.ano === anoAtual
                  return (
                    <tr key={d.ano} style={{ background: isCurr ? 'rgba(251,191,36,0.04)' : 'transparent' }}>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #252836', ...mono, fontSize: '12px', fontWeight: isCurr ? 700 : 600, color: isCurr ? '#FBBF24' : '#E8EAF0' }}>
                        {d.ano}{isCurr && <span style={{ fontSize: '9px', background: '#2E1F06', color: '#FBBF24', padding: '1px 5px', borderRadius: '999px', marginLeft: '6px' }}>atual</span>}
                      </td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#4F8EF7' }}>{d.six > 0 ? fmtR(d.six) : '—'}</td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#34D399' }}>{d.enova > 0 ? fmtR(d.enova) : '—'}</td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', color: '#F472B6' }}>{d.cm > 0 ? fmtR(d.cm) : '—'}</td>
                      <td style={{ padding: '8px 12px', borderBottom: '1px solid #252836', textAlign: 'right', ...mono, fontSize: '11px', fontWeight: 700, color: '#E8EAF0' }}>{fmtR(d.total)}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: '#1A1D2A' }}>
                  <td style={{ padding: '9px 12px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#7B82A0', borderTop: '2px solid #333750' }}>Total Geral</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', ...mono, fontSize: '11px', fontWeight: 700, color: '#4F8EF7', borderTop: '2px solid #333750' }}>{fmtR(grandSix)}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', ...mono, fontSize: '11px', fontWeight: 700, color: '#34D399', borderTop: '2px solid #333750' }}>{fmtR(grandEnova)}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', ...mono, fontSize: '11px', fontWeight: 700, color: '#F472B6', borderTop: '2px solid #333750' }}>{grandCm > 0 ? fmtR(grandCm) : '—'}</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', ...mono, fontSize: '12px', fontWeight: 700, color: '#E8EAF0', borderTop: '2px solid #333750' }}>{fmtR(grandSix + grandEnova + grandCm)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* ── GRÁFICO ANUAL — HTML PURO IDÊNTICO AO PROTÓTIPO ── */}
      <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4A5070', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        Faturamento Anual Consolidado — SIX + ENOVA
        <div style={{ flex: 1, height: '1px', background: '#252836' }} />
      </div>
      <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', padding: '20px 24px 16px' }}>
        {/* Cabeçalho com legenda */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', color: '#7B82A0' }}>Total anual consolidado (SIX + ENOVA)</div>
          <div style={{ display: 'flex', gap: '14px', fontSize: '11px' }}>
            {[{ cor: '#4F8EF7', l: 'SIX' }, { cor: '#34D399', l: 'ENOVA' }, { cor: '#F472B6', l: 'CM' }].map(e => (
              <span key={e.l} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: e.cor, display: 'inline-block' }} />
                <span style={{ color: '#7B82A0' }}>{e.l}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Gráfico — estrutura IDÊNTICA ao protótipo */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <div style={{ minWidth: `${n * (barW + gap) + 60}px`, paddingBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              {/* Eixo Y — width:52px fixo */}
              <div style={{ width: '52px', flexShrink: 0, position: 'relative', height: `${totalH}px` }}>
                {gridLines.map(g => g.val > 0 && (
                  <div key={g.pct} style={{ position: 'absolute', right: '8px', top: `${labelH + g.y - 6}px` }}>
                    <span style={{ fontSize: '9px', color: '#4A5070', ...mono, whiteSpace: 'nowrap' }}>{fmtM(g.val)}</span>
                  </div>
                ))}
              </div>
              {/* Área das barras — flex:1 expande até min-width */}
              <div style={{ flex: 1, position: 'relative', height: `${totalH}px` }}>
                {/* Grid lines horizontais */}
                {gridLines.map(g => (
                  <div key={g.pct} style={{ position: 'absolute', left: 0, right: 0, top: `${labelH + g.y}px`, height: '1px', background: g.pct === 0 ? '#333750' : '#252836' }} />
                ))}
                {/* Barras com gap — position:absolute bottom:0 top:labelH */}
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: `${labelH}px`, display: 'flex', alignItems: 'flex-end', gap: `${gap}px` }}>
                  {dadosGrafico.map(d => {
                    const hTotal = maxTotal > 0 ? Math.round(d.total / maxTotal * chartH) : 0
                    const hSix   = d.total > 0 ? Math.round(d.six / d.total * hTotal) : 0
                    const hCm    = d.total > 0 ? Math.round(d.cm / d.total * hTotal) : 0
                    const hEnova = hTotal - hSix - hCm
                    const isCurr = d.ano === anoAtual
                    return (
                      <div key={d.ano} style={{ width: `${barW}px`, flexShrink: 0, position: 'relative', height: `${chartH}px` }}>
                        {d.total > 0 && (
                          <>
                            <div style={{ position: 'absolute', bottom: `${hTotal + 4}px`, left: 0, right: 0, textAlign: 'center', fontSize: '9px', ...mono, color: isCurr ? '#FBBF24' : '#7B82A0', whiteSpace: 'nowrap' }}>
                              {fmtM(d.total)}
                            </div>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${hTotal}px`, borderRadius: '3px 3px 0 0', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                              {hCm   > 0 && <div style={{ width: '100%', height: `${hCm}px`,   background: '#F472B6' }} />}
                              {hEnova > 0 && <div style={{ width: '100%', height: `${hEnova}px`, background: '#34D399' }} />}
                              {hSix  > 0 && <div style={{ width: '100%', height: `${hSix}px`,  background: '#4F8EF7' }} />}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            {/* Labels X dos anos */}
            <div style={{ display: 'flex', marginLeft: '52px', marginTop: '5px', gap: `${gap}px` }}>
              {dadosGrafico.map(d => {
                const isCurr = d.ano === anoAtual
                return (
                  <div key={d.ano} style={{ width: `${barW}px`, flexShrink: 0, textAlign: 'center', fontSize: '10px', fontWeight: isCurr ? 700 : 500, ...mono, color: isCurr ? '#FBBF24' : '#7B82A0' }}>
                    {d.ano}{isCurr ? '*' : ''}
                  </div>
                )
              })}
            </div>
            {dadosGrafico.some(d => d.ano === anoAtual) && (
              <div style={{ marginLeft: '52px', marginTop: '3px', fontSize: '9px', color: '#4A5070' }}>* ano em andamento</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
