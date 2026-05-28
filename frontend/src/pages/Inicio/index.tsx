import { useEffect, useState } from 'react'
import { historicoAPI, dasAPI, empresasAPI } from '../../api/endpoints'
import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' })
api.interceptors.request.use((c: any) => { const t = localStorage.getItem('access_token'); if (t) c.headers.Authorization = 'Bearer ' + t; return c })
import { registrarLog } from '../../api/auditoria'

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

function fmtR(v: number) {
  return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const FAIXAS_SIMPLES = [
  { min: 0, max: 180000, aliq: 0.04, ded: 0, faixa: '1ª', icms: 0.34 },
  { min: 180000.01, max: 360000, aliq: 0.073, ded: 5940, faixa: '2ª', icms: 0.34 },
  { min: 360000.01, max: 720000, aliq: 0.095, ded: 13860, faixa: '3ª', icms: 0.335 },
  { min: 720000.01, max: 1800000, aliq: 0.107, ded: 22500, faixa: '4ª', icms: 0.335 },
  { min: 1800000.01, max: 3600000, aliq: 0.143, ded: 87300, faixa: '5ª', icms: 0.335 },
  { min: 3600000.01, max: 4800000, aliq: 0.19, ded: 378000, faixa: '6ª', icms: 0 },
]

export default function Inicio() {
  const [histSix, setHistSix] = useState<any[]>([])
  const [histEnova, setHistEnova] = useState<any[]>([])
  const [dasSix, setDasSix] = useState<any[]>([])
  const [dasEnova, setDasEnova] = useState<any[]>([])
  const [empresas, setEmpresas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dasValSix, setDasValSix] = useState('')
  const [dasValEnova, setDasValEnova] = useState('')
  const [salvando, setSalvando] = useState('')
  const [pgtosSix, setPgtosSix] = useState<Record<string, any[]>>({})
  const [pgtosEnova, setPgtosEnova] = useState<Record<string, any[]>>({})
  const [notasSix, setNotasSix] = useState<any[]>([])
  const [notasEnova, setNotasEnova] = useState<any[]>([])
  const [ajustesSix, setAjustesSix] = useState<any[]>([])
  const [ajustesEnova, setAjustesEnova] = useState<any[]>([])
  const [creditosSix, setCreditosSix] = useState<any[]>([])
  const [creditosEnova, setCreditosEnova] = useState<any[]>([])

  const now = new Date()
  const mesAntIdx = now.getMonth() === 0 ? 11 : now.getMonth() - 1
  const anoAnt = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
  const mesAntNome = MESES[mesAntIdx]
  const mesAtualIdx = now.getMonth()
  const anoAtual = now.getFullYear()
  const mesAtualNome = MESES[mesAtualIdx]

  useEffect(() => {
    Promise.all([
      historicoAPI.listar(1).then(r => r.data),
      historicoAPI.listar(2).then(r => r.data),
      dasAPI.listar(1).then(r => r.data),
      dasAPI.listar(2).then(r => r.data),
      empresasAPI.listar().then(r => r.data),
      api.get('/notas/pagamentos/1').then(r => r.data).catch(() => ({})),
      api.get('/notas/pagamentos/2').then(r => r.data).catch(() => ({})),
      api.get('/notas/1').then(r => r.data).catch(() => []),
      api.get('/notas/2').then(r => r.data).catch(() => []),
      api.get('/notas/ajustes/1').then(r => r.data).catch(() => []),
      api.get('/notas/ajustes/2').then(r => r.data).catch(() => []),
      api.get('/notas/creditos/1').then(r => r.data).catch(() => []),
      api.get('/notas/creditos/2').then(r => r.data).catch(() => []),
    ]).then(([h1, h2, d1, d2, emp, pg1, pg2, n1, n2, aj1, aj2, cr1, cr2]) => {
      setPgtosSix(pg1)
      setPgtosEnova(pg2)
      setNotasSix(n1)
      setNotasEnova(n2)
      setAjustesSix(Array.isArray(aj1) ? aj1 : [])
      setAjustesEnova(Array.isArray(aj2) ? aj2 : [])
      setCreditosSix(Array.isArray(cr1) ? cr1 : [])
      setCreditosEnova(Array.isArray(cr2) ? cr2 : [])
      setHistSix(h1)
      setHistEnova(h2)
      setDasSix(d1)
      setDasEnova(d2)
      setEmpresas(emp)
      const empSix = emp.find((e: any) => e.nome === 'SIX') || { aliquota_das: 0.088324 }
      const empEnova = emp.find((e: any) => e.nome === 'ENOVA') || { aliquota_das: 0.093254 }
      const vSix = h1.find((r: any) => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0
      const vEnova = h2.find((r: any) => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0
      
      
    }).finally(() => setLoading(false))
  }, [])

  const empSix = empresas.find(e => e.nome === 'SIX') || { aliquota_das: 0.088324, credito_icms: 0.029614 }
  const empEnova = empresas.find(e => e.nome === 'ENOVA') || { aliquota_das: 0.093254, credito_icms: 0.031256 }

  const vSixMes = histSix.find(r => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0
  const vEnovaMes = histEnova.find(r => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0
  const mesAtualStr = mesAntNome.toLowerCase() + '/' + anoAnt

  const dtNoMesAntCalc = (dtStr: string | undefined) => {
    if (!dtStr) return false
    const parts = dtStr.includes('-') ? dtStr.split('-').reverse() : dtStr.split('/')
    return parseInt(parts[1]) === mesAntIdx + 1 && parseInt(parts[2]) === anoAnt
  }

  const calcBaseMLcto = (pgtos: Record<string, any[]>, notas: any[]) => {
    let base = 0
    // Pagamentos parciais: filtrar por dt_pagamento no mes anterior
    Object.values(pgtos).forEach((lista: any[]) => {
      lista.forEach((p: any) => {
        if (dtNoMesAntCalc(p.dt_pagamento)) {
          base += parseFloat(p.valor_pago) || 0
        }
      })
    })
    // Pagamentos integrais (sem historico em pagamentos_nf): filtrar por dt_pagamento
    notas.forEach((n: any) => {
      const temHistorico = pgtos[n.numero_nf] && pgtos[n.numero_nf].length > 0
      if (!temHistorico) {
        const dtPag = n.dt_pagamento || n.data_pagamento
        if (dtNoMesAntCalc(dtPag)) base += parseFloat(n.valor_pago) || 0
      }
    })
    return base
  }

  const baseSixMLcto = calcBaseMLcto(pgtosSix, notasSix)
  const baseEnovaMLcto = calcBaseMLcto(pgtosEnova, notasEnova)
  const calcRbt12 = (hist: any[], ajustes: any[] = []) => { let sum = 0; for (let i=0;i<12;i++){const d=new Date(now.getFullYear(),now.getMonth()-i-1,1);const m=d.getMonth()+1;const a=d.getFullYear();const fat=(hist.find((r:any)=>r.ano===a&&r.mes===m)?.valor||0);const dev=ajustes.filter((aj:any)=>aj.ano===a&&aj.mes===m).reduce((s:number,aj:any)=>s+aj.valor,0);sum+=fat-dev} return sum }
  const rbt12Six = calcRbt12(histSix, ajustesSix)
  const rbt12Enova = calcRbt12(histEnova, ajustesEnova)
  const faixaSix = FAIXAS_SIMPLES.find(f=>rbt12Six>=f.min&&rbt12Six<=f.max)||FAIXAS_SIMPLES[FAIXAS_SIMPLES.length-1]
  const faixaEnova = FAIXAS_SIMPLES.find(f=>rbt12Enova>=f.min&&rbt12Enova<=f.max)||FAIXAS_SIMPLES[FAIXAS_SIMPLES.length-1]
  const aliqEfetivaSix = rbt12Six>0?(rbt12Six*faixaSix.aliq-faixaSix.ded)/rbt12Six:0
  const aliqEfetivaEnova = rbt12Enova>0?(rbt12Enova*faixaEnova.aliq-faixaEnova.ded)/rbt12Enova:0
  const icmsAproveitavelSix = aliqEfetivaSix*faixaSix.icms
  const icmsAproveitavelEnova = aliqEfetivaEnova*faixaEnova.icms
  const creditoAutSix = creditosSix.filter(cr=>cr.status==='autorizado').reduce((s:number,cr:any)=>s+(cr.valor_nf_original*aliqEfetivaSix),0)
  const creditoAutEnova = creditosEnova.filter(cr=>cr.status==='autorizado').reduce((s:number,cr:any)=>s+(cr.valor_nf_original*aliqEfetivaEnova),0)
  const impSix = baseSixMLcto * aliqEfetivaSix
  const impEnova = baseEnovaMLcto * aliqEfetivaEnova
  const impSixLiq = Math.max(0, impSix - creditoAutSix)
  const impEnovaLiq = Math.max(0, impEnova - creditoAutEnova)
  const impTotal = impSixLiq + impEnovaLiq

  const dasSixConf = dasSix.find(r => r.ano === anoAtual && r.mes === mesAtualIdx + 1)
  const dasEnovaConf = dasEnova.find(r => r.ano === anoAtual && r.mes === mesAtualIdx + 1)

  const mono = { fontFamily: "'JetBrains Mono', monospace" }

  
  if (loading) return <div style={{ padding: '40px', color: '#7B82A0' }}>Carregando...</div>

  return (
    <div>
      {/* ── SEÇÃO DAS ── */}
      <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4A5070', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        Fiscal — DAS / Simples Nacional (base: NFs de Venda {mesAntNome}/{anoAnt})
        <div style={{ flex: 1, height: '1px', background: '#252836' }} />
      </div>

      <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>

        {/* Cabeçalho: total imposto */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #252836', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070', marginBottom: '6px' }}>
              💰 Imposto a Pagar — Total ({mesAtualNome}/{anoAtual})
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, ...mono, color: '#FBBF24' }}>{fmtR(impTotal)}</div>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', ...mono }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: '#4F8EF7', fontWeight: 600, marginBottom: '3px' }}>SIX</div>
              <div style={{ color: '#4F8EF7' }}>{fmtR(impSix)}</div>
            </div>
            <div style={{ color: '#4A5070', alignSelf: 'center' }}>+</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: '#34D399', fontWeight: 600, marginBottom: '3px' }}>ENOVA</div>
              <div style={{ color: '#34D399' }}>{fmtR(impEnova)}</div>
            </div>
          </div>
        </div>

        {/* Grid DAS por empresa */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {[
            { key: 'six', label: 'SIX', imp: impSixLiq, impBruto: impSix, credito: creditoAutSix, conf: dasSixConf, cor: '#4F8EF7', val: dasValSix || impSixLiq.toFixed(2).replace('.', ','), setVal: setDasValSix },
            { key: 'enova', label: 'ENOVA', imp: impEnovaLiq, impBruto: impEnova, credito: creditoAutEnova, conf: dasEnovaConf, cor: '#34D399', val: dasValEnova || impEnovaLiq.toFixed(2).replace('.', ','), setVal: setDasValEnova },
          ].map((e, i) => (
            <div key={e.key} style={{ padding: '14px 20px', borderRight: i === 0 ? '1px solid #252836' : 'none' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#7B82A0', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: e.cor, display: 'inline-block' }} />
                {e.label} — {fmtR(e.imp)}
              </div>
                  {(e.key==='six'?creditosSix:creditosEnova).filter((cr:any)=>cr.status==='pendente').map((cr:any)=>(
                    <div key={cr.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.3)',borderRadius:8,padding:'8px 12px',marginBottom:8}}>
                      <div style={{fontSize:11,color:'#A78BFA'}}>
                        🟢 Crédito Fiscal — NF {cr.nf_referenciada} · R$ {(cr.valor_nf_original*(e.key==='six'?aliqEfetivaSix:aliqEfetivaEnova)).toLocaleString('pt-BR',{minimumFractionDigits:2})}
                      </div>
                      <button onClick={async()=>{
                        await fetch('http://localhost:8000/notas/creditos/'+cr.id,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('access_token')},body:JSON.stringify({status:'autorizado'})})
                        window.location.reload()
                      }} style={{padding:'4px 10px',background:'rgba(167,139,250,0.2)',border:'1px solid #A78BFA',borderRadius:6,color:'#A78BFA',fontSize:11,fontWeight:600,cursor:'pointer'}}>
                        Autorizar
                      </button>
                    </div>
                  ))}
              {e.conf ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px' }}>✅</span>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#34D399' }}>DAS confirmado — {mesAtualNome}/{anoAtual}</div>
                    <div style={{ fontSize: '11px', ...mono, color: '#7B82A0', marginTop: '1px' }}>{fmtR(e.conf.valor)} registrado</div>
                  </div>
                </div>
              ) : (
                <div>
                  {e.credito > 0 && <div style={{fontSize:11,color:'#A78BFA',marginBottom:6,padding:'4px 8px',background:'rgba(167,139,250,0.08)',borderRadius:6}}>✓ Crédito autorizado aplicado: − {fmtR(e.credito)}</div>}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '5px' }}>
                    <input
                      value={e.val}
                      onChange={ev => e.setVal(ev.target.value)}
                      style={{ flex: 1, padding: '6px 10px', background: '#1A1D2A', border: '1px solid #252836', borderRadius: '6px', ...mono, fontSize: '12px', color: '#E8EAF0', outline: 'none' }}
                      onFocus={ev => ev.target.style.borderColor = '#FBBF24'}
                      onBlur={ev => ev.target.style.borderColor = '#252836'}
                    />
                    <button
                      disabled={salvando === e.key}
                      onClick={async () => {
                        setSalvando(e.key)
                        try {
                          const val = parseFloat(e.val.replace(',', '.')) || 0
                          await fetch(`http://localhost:8000/dados/das/${e.key === 'six' ? 1 : 2}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
                            body: JSON.stringify({ empresa_id: e.key === 'six' ? 1 : 2, ano: anoAtual, mes: mesAtualIdx + 1, valor: val }),
                          })
                          await registrarLog({ acao: 'CONFIRMAR', modulo: 'das', descricao: `DAS confirmado: ${e.label} · ${MESES[mesAntIdx]}/${anoAnt} · R$ ${val.toFixed(2).replace('.', ',')}`, valorDepois: { empresa: e.label, ano: anoAtual, mes: mesAtualIdx + 1, valor: val } })
                          // Marcar creditos autorizados como utilizados
                          const crs = e.key==='six'?creditosSix:creditosEnova
                          for (const cr of crs.filter((x:any)=>x.status==='autorizado')) {
                            await fetch('http://localhost:8000/notas/creditos/'+cr.id,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':'Bearer '+localStorage.getItem('access_token')},body:JSON.stringify({status:'utilizado'})})
                          }
                          window.location.reload()
                        } catch { setSalvando('') }
                      }}
                      style={{ padding: '6px 14px', background: '#2E1F06', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '6px', color: '#FBBF24', fontSize: '11px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
                    >
                      ✅ Confirmar
                    </button>
                  </div>
                  <div style={{ fontSize: '10px', color: '#4A5070' }}>Edite se necessário antes de confirmar</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Alíquotas — igual ao protótipo: 2 casas decimais */}
        <div style={{ borderTop: '1px solid #252836', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {[
            { label: '📈 Alíquota DAS ', sixVal: (aliqEfetivaSix * 100).toFixed(2).replace('.', ',') + '%', enovaVal: (aliqEfetivaEnova * 100).toFixed(2).replace('.', ',') + '%' },
            { label: '♻️ Crédito ICMS ', sixVal: (icmsAproveitavelSix * 100).toFixed(2).replace('.', ',') + '%', enovaVal: (icmsAproveitavelEnova * 100).toFixed(2).replace('.', ',') + '%' },
          ].map((row, i) => (
            <div key={i} style={{ padding: '12px 20px', borderRight: i === 0 ? '1px solid #252836' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070' }}>{row.label}</div>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#4F8EF7', fontWeight: 600, marginBottom: '2px' }}>SIX</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, ...mono, color: '#4F8EF7' }}>{row.sixVal}</div>
                </div>
                <div style={{ width: '1px', height: '28px', background: '#252836' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: '#34D399', fontWeight: 600, marginBottom: '2px' }}>ENOVA</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, ...mono, color: '#34D399' }}>{row.enovaVal}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Simples Nacional */}
      <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#4A5070', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
        Simples Nacional — por Empresa
        <div style={{ flex: 1, height: '1px', background: '#252836' }} />
      </div>
      <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', width: 'fit-content' }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #252836' }}><span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070' }}>Tabela Simples Nacional</span></div>
        <table style={{ width: 'auto', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead><tr style={{ borderBottom: '1px solid #252836' }}>{['RB 12 meses (R$)', 'Alíquota', 'Dedução (R$)', 'Faixa', 'ICMS'].map(h => (<th key={h} style={{ padding: '5px 32px', textAlign: h === 'RB 12 meses (R$)' ? 'left' : 'right' as any, fontSize: '10px', fontWeight: 600, color: '#4A5070', textTransform: 'uppercase' as any }}>{h}</th>))}</tr></thead>
          <tbody>{FAIXAS_SIMPLES.map((f, i) => {
            const ativaSix = f.faixa === faixaSix.faixa
            const ativaEnova = f.faixa === faixaEnova.faixa
            const ativa = ativaSix || ativaEnova
            return (<tr key={i} style={{ background: ativa ? 'rgba(79,142,247,0.06)' : 'transparent', borderBottom: '1px solid #1A1D2A' }}>
              <td style={{ padding: '5px 32px', color: ativa ? '#E8EAF0' : '#7B82A0', ...mono, fontSize: '11px' }}>{f.min.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} – {f.max.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ padding: '7px 10px', textAlign: 'right' as any, color: ativa ? '#E8EAF0' : '#7B82A0', ...mono }}>{(f.aliq * 100).toFixed(2).replace('.', ',')}%</td>
              <td style={{ padding: '7px 10px', textAlign: 'right' as any, color: ativa ? '#E8EAF0' : '#7B82A0', ...mono }}>{f.ded.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td style={{ padding: '5px 32px', textAlign: 'right' as any }}>
                <span style={{ fontSize: '10px', color: '#7B82A0' }}>{f.faixa}</span>
                {ativaSix && <span style={{ marginLeft: '4px', background: 'rgba(79,142,247,0.2)', color: '#4F8EF7', fontSize: '10px', fontWeight: 600, padding: '1px 5px', borderRadius: '3px' }}>SIX</span>}
                {ativaEnova && <span style={{ marginLeft: '4px', background: 'rgba(52,211,153,0.2)', color: '#34D399', fontSize: '10px', fontWeight: 600, padding: '1px 5px', borderRadius: '3px' }}>ENOVA</span>}
              </td>
              <td style={{ padding: '7px 10px', textAlign: 'right' as any, color: ativa ? '#E8EAF0' : '#7B82A0', ...mono }}>{f.icms > 0 ? (f.icms * 100).toFixed(2).replace('.', ',') + ' %' : '—'}</td>
            </tr>)
          })}</tbody>
        </table>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {[{label:'SIX',rbt12:rbt12Six,faixa:faixaSix,aliqEfetiva:aliqEfetivaSix,icms:icmsAproveitavelSix,fatMes:vSixMes,cor:'#4F8EF7'},{label:'ENOVA',rbt12:rbt12Enova,faixa:faixaEnova,aliqEfetiva:aliqEfetivaEnova,icms:icmsAproveitavelEnova,fatMes:vEnovaMes,cor:'#34D399'}].map((emp,i)=>(
          <div key={i} style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: emp.cor, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: emp.cor, display: 'inline-block' }} />{emp.label}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {[{l:'Faturamento mês',v:fmtR(emp.fatMes)},{l:'RBT12',v:fmtR(emp.rbt12)}].map((m,j)=>(
                <div key={j} style={{ background: '#0E1017', borderRadius: '6px', padding: '8px 10px' }}>
                  <div style={{ fontSize: '10px', color: '#7B82A0', marginBottom: '3px' }}>{m.l}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0', ...mono }}>{m.v}</div>
                </div>
              ))}
            </div>
            <div style={{ height: '1px', background: '#252836', margin: '8px 0' }} />
            <div style={{ marginBottom: '6px' }}><span style={{ fontSize: '11px', color: '#7B82A0' }}>Faixa atual</span> <span style={{ fontSize: '12px', fontWeight: 600, color: emp.cor }}>{emp.faixa.faixa} Faixa</span></div>
            {[{l:'Alíquota nominal',v:(emp.faixa.aliq*100).toFixed(2).replace('.',',')+' %'},{l:'Dedução',v:'R$ '+emp.faixa.ded.toLocaleString('pt-BR',{minimumFractionDigits:2})}].map((row,j)=>(<div key={j} style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span style={{fontSize:'11px',color:'#7B82A0'}}>{row.l}</span><span style={{fontSize:'11px',fontWeight:600,color:'#E8EAF0',...mono}}>{row.v}</span></div>))}
            <div style={{ height: '1px', background: '#252836', margin: '8px 0' }} />
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span style={{fontSize:'11px',color:'#7B82A0'}}>Alíquota efetiva</span><span style={{fontSize:'14px',fontWeight:700,color:emp.cor,...mono}}>{(emp.aliqEfetiva*100).toFixed(2).replace('.',',')}%</span></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:'11px',color:'#7B82A0'}}>ICMS aproveitável</span><span style={{fontSize:'14px',fontWeight:700,color:emp.cor,...mono}}>{(emp.icms*100).toFixed(2).replace('.',',')}%</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}