import React, { useEffect, useRef, useState } from 'react'
import { historicoAPI, empresasAPI } from '../../api/endpoints'
import { temPermissao } from '../../utils/permissoes'
import api from '../../api/endpoints'

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
function fmtR(v: number) { return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function fmtCNPJ(v: string) {
  if (!v) return '—'
  const n = v.replace(/\D/g, '')
  if (n.length === 14) return n.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  if (n.length === 11) return n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  return v
}
const mono = { fontFamily: 'monospace' }
function statusStyle(s: string) {
  const sl = (s || '').toLowerCase()
  if (sl.includes('venda')) return { bg: 'rgba(52,211,153,0.12)', cor: '#34D399' }
  if (sl.includes('cancelamento')) return { bg: 'rgba(248,113,113,0.12)', cor: '#F87171' }
  if (sl.includes('carta') || sl.includes('correcao') || sl.includes('cce')) return { bg: 'rgba(79,142,247,0.12)', cor: '#4F8EF7' }
  if (sl.includes('inutiliz')) return { bg: 'rgba(251,191,36,0.12)', cor: '#FBBF24' }
  return { bg: 'rgba(167,139,250,0.12)', cor: '#A78BFA' }
}

const FAIXAS_CONT = [
  { min: 0, max: 180000, aliq: 0.04, ded: 0, icms: 0.34 },
  { min: 180000.01, max: 360000, aliq: 0.073, ded: 5940, icms: 0.34 },
  { min: 360000.01, max: 720000, aliq: 0.095, ded: 13860, icms: 0.335 },
  { min: 720000.01, max: 1800000, aliq: 0.107, ded: 22500, icms: 0.335 },
  { min: 1800000.01, max: 3600000, aliq: 0.143, ded: 87300, icms: 0.335 },
  { min: 3600000.01, max: 4800000, aliq: 0.19, ded: 378000, icms: 0 },
]

export default function Contabilidade() {
  const [empresa, setEmpresa] = useState<'six' | 'enova'>('six')
  const [notas, setNotas] = useState<any[]>([])
  const [notasOutra, setNotasOutra] = useState<any[]>([])
  const [pagamentos, setPagamentos] = useState<Record<string,any[]>>({})
  const [hist, setHist] = useState<any[]>([])
  const [empresas, setEmpresas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState<string | null>(null)
  const [editVPg, setEditVPg] = useState('')
  const [editDtp, setEditDtp] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [scrollParaAguardando, setScrollParaAguardando] = useState(false)
  const [editandoPgto, setEditandoPgto] = useState<number | null>(null)
  const [editPgtoVal, setEditPgtoVal] = useState('')
  const [editPgtoDt, setEditPgtoDt] = useState('')
  const [editMesLct, setEditMesLct] = useState('')
  const [filtroMesPagto, setFiltroMesPagto] = useState('')
  const [filtroMesEmissao, setFiltroMesEmissao] = useState('')
  const [creditos, setCreditos] = useState<any[]>([])
  const [ajustes, setAjustes] = useState<any[]>([])
  const [ignorados, setIgnorados] = useState<Set<number>>(new Set())

  const now = new Date()
  const mesAtual = now.getMonth()
  const anoAtual = now.getFullYear()
  const mesAntIdx = mesAtual === 0 ? 11 : mesAtual - 1
  const anoAnt = mesAtual === 0 ? anoAtual - 1 : anoAtual
  const mesAntNome = MESES[mesAntIdx]
  const empId = empresa === 'six' ? 1 : 2
  const outraEmpId = empresa === 'six' ? 2 : 1

  const carregarPagamentos = async (_notasList: any[], eid: number) => {
    try {
      const res = await api.get('/notas/pagamentos/' + eid)
      return res.data as Record<string, any[]>
    } catch {
      return {}
    }
  }



  const carregarTudo = async () => {
  setLoading(true)
  try {
    const [n, h, emp, nOutra, creds, ajs] = await Promise.all([
      api.get('/notas/' + empId).then(r => r.data).catch(() => []),
      historicoAPI.listar(empId).then(r => r.data).catch(() => []),
      empresasAPI.listar().then(r => r.data).catch(() => []),
      api.get('/notas/' + outraEmpId).then(r => r.data).catch(() => []),
      api.get('/notas/creditos/' + empId).then(r => r.data).catch(() => []),
      api.get('/notas/ajustes/' + empId).then(r => r.data).catch(() => []),
    ])
    
    // FORÇAR UMA NOVA REFERÊNCIA - cria novos arrays
    setNotas([...n])
    setHist([...h])
    setEmpresas([...emp])
    setNotasOutra([...nOutra])
    setCreditos(Array.isArray(creds) ? creds : [])
    setAjustes(Array.isArray(ajs) ? ajs : [])
    
    const pgtos = await carregarPagamentos(n, empId)
    setPagamentos({...pgtos})  // Força nova referência do objeto
    
    console.log('✅ Dados atualizados com novas referências')
  } finally { 
    setLoading(false) 
  }
}

  useEffect(() => { carregarTudo() }, [empresa])

  useEffect(() => {
    if (scrollParaAguardando && !loading) {
      setTimeout(() => {
        const els = Array.from(document.querySelectorAll('[data-tipo="aguardando"]'))
        console.log('Aguardando encontrados:', els.length)
        const el = els[els.length - 1] as HTMLElement
        if (el) {
          const tr = el.tagName === 'TR' ? el : el.closest('tr') as HTMLElement
          if (tr) {
            tr.scrollIntoView({ behavior: 'smooth', block: 'center' })
            tr.style.outline = '2px solid #FBBF24'
            setTimeout(() => { tr.style.outline = '' }, 2000)
          }
        }
        setScrollParaAguardando(false)
      }, 800)
    }
  }, [scrollParaAguardando, loading])

  const empDados = empresas.find(e => e.nome === (empresa === 'six' ? 'SIX' : 'ENOVA')) || { aliquota_das: empresa === 'six' ? 0.088324 : 0.093254, credito_icms: empresa === 'six' ? 0.029614 : 0.031256 }
  const rbt12Cont = (() => {
    let sum = 0
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i - 1, 1)
      const m = d.getMonth() + 1; const a = d.getFullYear()
      sum += (hist.find((r:any) => r.ano === a && r.mes === m)?.valor || 0)
    }
    return sum
  })()
  const faixaCont = FAIXAS_CONT.find(f => rbt12Cont >= f.min && rbt12Cont <= f.max) || FAIXAS_CONT[FAIXAS_CONT.length - 1]
  const aliqEfetivaCont = rbt12Cont > 0 ? (rbt12Cont * faixaCont.aliq - faixaCont.ded) / rbt12Cont : empDados.aliquota_das
  const icmsAproveitavelCont = aliqEfetivaCont * (faixaCont as any).icms
  const devElegiveis = ajustes.filter((aj: any) => {
    if (ignorados.has(aj.id)) return false
    const jaTemCredito = creditos.some((cr: any) => cr.nf_devolucao === aj.nf_devolucao)
    if (jaTemCredito) return false
    const nfDev = notas.find((n: any) => n.numero_nf === aj.nf_devolucao)
    if (!nfDev?.data_emissao) return false
    const [, mDev, aDev] = nfDev.data_emissao.split('/').map(Number)
    const mesSegOrig = aj.mes === 12 ? 1 : aj.mes + 1
    const anoSegOrig = aj.mes === 12 ? aj.ano + 1 : aj.ano
    return mDev === mesSegOrig && aDev === anoSegOrig
  })
  const creditosAtivos = creditos.filter(cr => cr.status === 'pendente' || cr.status === 'autorizado')
  const totalCredito = creditosAtivos.reduce((s: number, cr: any) => s + cr.valor_nf_original * aliqEfetivaCont, 0)
  const nfsCanceladas = new Set(notas.filter(r => r.numero_nf?.endsWith('-CAN')).map(r => r.numero_nf.replace('-CAN', '')))

  const parseDate = (d: string) => {
    if (!d) return null
    const parts = d.includes('-') ? d.split('-').reverse() : d.split('/')
    return new Date(+parts[2], +parts[1] - 1, +parts[0])
  }

  const ultimos4 = notas.filter(r => {
    const dt = parseDate(r.data_emissao)
    if (!dt) return false
    const diff = (anoAtual - dt.getFullYear()) * 12 + (mesAtual - dt.getMonth())
    return diff < 7
  })

  const notasFiltradas = filtroMesPagto
    ? ultimos4.filter(r => {
        const lista = pagamentos[r.numero_nf] || []
        const dtPgto = r.dt_pagamento || r.data_pagamento
        if (lista.length > 0) {
          return lista.some((p: any) => {
            const dt = p.dt_pagamento || ''
            const parts = dt.includes('-') ? dt.split('-').reverse() : dt.split('/')
            const mm = parts[1]?.padStart(2,'0')
            const aa = parts[2]
            return (mm + '/' + aa) === filtroMesPagto
          })
        }
        if (!dtPgto) return false
        const parts = dtPgto.includes('-') ? dtPgto.split('-').reverse() : dtPgto.split('/')
        const mm = parts[1]?.padStart(2,'0')
        const aa = parts[2]
        return (mm + '/' + aa) === filtroMesPagto
      })
    : ultimos4

  const notasFiltradas2 = filtroMesEmissao
    ? notasFiltradas.filter(r => {
        const dt = r.data_emissao || ''
        const parts = dt.includes('-') ? dt.split('-').reverse() : dt.split('/')
        const mm = parts[1]?.padStart(2, '0')
        const aa = parts[2]
        return (mm + '/' + aa) === filtroMesEmissao
      })
    : notasFiltradas

  const dtNoMesFiltro = (dtStr: string | undefined) => {
    if (!filtroMesPagto || !dtStr) return !filtroMesPagto
    const parts = dtStr.includes('-') ? dtStr.split('-').reverse() : dtStr.split('/')
    const mm = parts[1]?.padStart(2, '0')
    const aa = parts[2]
    return (mm + '/' + aa) === filtroMesPagto
  }

  const isVendaOuParcial = (r: any) => {
    const st = (r.nat_operacao || r.status || '').toLowerCase()
    return st.includes('venda') || st.includes('parcial')
  }

  // tNF e tPago: notas Venda ou Parcial do mes anterior
  const notasVendaParMesAnt = notas.filter(r => {
    const dt = parseDate(r.data_emissao)
    return dt && dt.getMonth() === mesAntIdx && dt.getFullYear() === anoAnt &&
      !nfsCanceladas.has(r.numero_nf) && isVendaOuParcial(r)
  })
  const tNF = notasVendaParMesAnt.reduce((s, r) => s + (parseFloat(r.valor_nf) || 0), 0)
  // tPago: soma pagamentos realizados no mes anterior
  // Para notas com historico (pagamentos_nf): soma apenas registros do mes anterior
  // Para notas sem historico: usa nota.valor_pago se dt_pagamento no mes anterior
  const dtNoMesAnt = (dtStr: string) => {
    if (!dtStr) return false
    const parts = dtStr.includes('-') ? dtStr.split('-').reverse() : dtStr.split('/')
    const dt = new Date(+parts[2], +parts[1] - 1, +parts[0])
    return dt.getMonth() === mesAntIdx && dt.getFullYear() === anoAnt
  }
  // tPago final: pagamentos_nf do mes OU nota.valor_pago se sem historico
  const tPago = notas.filter(r => isVendaOuParcial(r) && !nfsCanceladas.has(r.numero_nf)).reduce((s, r) => {
    const lista = pagamentos[r.numero_nf] || []
    const dtPgto = r.dt_pagamento || r.data_pagamento
    if (lista.length > 0) {
      const somaParciais = lista.filter((p) => dtNoMesAnt(p.dt_pagamento)).reduce((a, p) => a + (parseFloat(p.valor_pago) || 0), 0)
      const originalPago = (dtNoMesAnt(dtPgto) && !dtNoMesAnt(lista[0].dt_pagamento)) ? (parseFloat(lista[0].valor_pago) || 0) : 0
      const totalParciais = lista.reduce((a, p) => a + (parseFloat(p.valor_pago) || 0), 0)
      const notaPago = parseFloat(r.valor_pago) || 0
      const extra = (notaPago > totalParciais && dtNoMesAnt(dtPgto)) ? (notaPago - totalParciais) : 0
      return s + somaParciais
    }
    if (r.valor_pago && dtNoMesAnt(dtPgto)) return s + (parseFloat(r.valor_pago) || 0)
    return s
  }, 0)
  // tPago por Mes Lancamento
  const tPagoMLcto = notas.filter(r => isVendaOuParcial(r) && !nfsCanceladas.has(r.numero_nf)).reduce((s, r) => {
    const lista = pagamentos[r.numero_nf] || []
    if (lista.length > 0) {
      const soma = lista.filter((p: any) => { const dt = p.dt_pagamento||''; const parts = dt.includes('-')?dt.split('-').reverse():dt.split('/'); return parseInt(parts[1])===mesAntIdx+1&&parseInt(parts[2])===anoAnt }).reduce((a: number, p: any) => a + (parseFloat(p.valor_pago) || 0), 0)
      return s + soma
    }
    const dtP = r.dt_pagamento||r.data_pagamento||''; const partsP = dtP.includes('-')?dtP.split('-').reverse():dtP.split('/'); if(parseInt(partsP[1])===mesAntIdx+1&&parseInt(partsP[2])===anoAnt) return s + (parseFloat(r.valor_pago) || 0)
    return s
  }, 0)

  // valAberto: notas Venda sem pagamento + parcialmente pagas (restante)
  const nfsAberto = notas.filter(r => (r.nat_operacao || r.status || '').toLowerCase().includes('venda') && !nfsCanceladas.has(r.numero_nf))
  const valAberto = nfsAberto.reduce((s, r) => {
    const rest = (parseFloat(r.valor_nf) || 0) - (parseFloat(r.valor_pago) || 0)
    return s + (rest > 0.01 ? rest : 0)
  }, 0)

  // Total combinado SIX + ENOVA
  const notasSix = empresa === 'six' ? notas : notasOutra
  const notasEnova = empresa === 'six' ? notasOutra : notas
  const canSix = new Set(notasSix.filter(x => x.numero_nf?.endsWith('-CAN')).map(x => x.numero_nf.replace('-CAN', '')))
  const canEnova = new Set(notasEnova.filter(x => x.numero_nf?.endsWith('-CAN')).map(x => x.numero_nf.replace('-CAN', '')))
  const abrSix = notasSix.filter(r => r.status === 'Venda' && (!r.valor_pago || r.valor_pago === '') && !canSix.has(r.numero_nf))
  const abrEnova = notasEnova.filter(r => r.status === 'Venda' && (!r.valor_pago || r.valor_pago === '') && !canEnova.has(r.numero_nf))
  const valTotalCombinado = abrSix.reduce((s, r) => s + (parseFloat(r.valor_nf) || 0), 0) + abrEnova.reduce((s, r) => s + (parseFloat(r.valor_nf) || 0), 0)

  const base = notasVendaParMesAnt.reduce((s, r) => s + (parseFloat(r.valor_nf) || 0), 0)

  async function salvarPagamento(nf: string) {
    setSalvando(true)
    try {
      const nota = notas.find(n => n.numero_nf === nf)
      const nf_val = parseFloat(nota?.valor_nf || '0') || 0
      const val = parseFloat(editVPg.replace(',', '.')) || nf_val
      const dtFinal = editDtp.trim().split('/').length === 2 ? editDtp.trim() + '/' + new Date().getFullYear() : editDtp.trim()
      await api.post('/notas/pagamento', { empresa_id: empId, numero_nf: nf, valor_pago: val, dt_pagamento: dtFinal, mes_lancamento: editMesLct })
      await carregarTudo()
      setScrollParaAguardando(true)
      setEditando(null); setEditVPg(''); setEditDtp(''); setEditMesLct('')
    } catch(e) { console.error(e) } finally { setSalvando(false) }
  }

  async function salvarPagamentoSaldo(nf: string) {
    setSalvando(true)
    try {
      const nota = notas.find(n => n.numero_nf === nf)
      const nf_val = parseFloat(nota?.valor_nf || '0') || 0
      const lista = pagamentos[nf] || []
      const pago = lista.reduce((s: number, p: any) => s + (parseFloat(p.valor_pago) || 0), 0)
      const restante = nf_val - pago
      const novoVal = parseFloat(editVPg.replace(',', '.')) || (nf_val - pago)
      await api.post('/notas/pagamento', { empresa_id: empId, numero_nf: nf, valor_pago: novoVal, dt_pagamento: editDtp })
      await carregarTudo()
      setScrollParaAguardando(true)
      setEditando(null); setEditVPg(''); setEditDtp('')
    } catch(e) { console.error(e) } finally { setSalvando(false) }
  }

  const editandoRef = useRef(false)
  async function editarPagamento(pgtoId: number, nf: string) {
    if (editandoRef.current) return; editandoRef.current = true; setSalvando(true)
    try {
      const val = parseFloat(editPgtoVal.replace(',', '.'))
      console.log('📤 Editando pagamento - ID:', pgtoId, 'NF:', nf, 'VALOR:', val, 'DATA:', editPgtoDt)
      const dtPgtoFinal = editPgtoDt.trim().split('/').length === 2 ? editPgtoDt.trim() + '/' + new Date().getFullYear() : editPgtoDt.trim()
      const response = await api.put('/notas/pagamento/' + pgtoId, { empresa_id: empId, numero_nf: nf, valor_pago: val, dt_pagamento: dtPgtoFinal, mes_lancamento: editMesLct })
      console.log('✅ Resposta:', response.data)
      console.log('🔄 Recarregando...')
      await carregarTudo()
      setScrollParaAguardando(true)
      console.log('✅ Recarregado')
      setEditandoPgto(null)
      setEditPgtoVal('')
      setEditPgtoDt('')
    } catch(e) { 
      console.error('❌ Erro:', e) 
    } finally { 
      editandoRef.current = false; setSalvando(false) 
    }
  }

  async function excluirPagamento(pgtoId: number) {
    if (!confirm('Excluir este pagamento?')) return
    setSalvando(true)
    try {
      await api.delete('/notas/pagamento/' + pgtoId + '?empresa_id=' + empId)
      await carregarTudo()
    } catch(e) { console.error(e) } finally { setSalvando(false) }
  }

  async function limparPagamento(nf: string) {
    if (!confirm('Remover pagamento da NF ' + nf + '?')) return
    setSalvando(true)
    try {
      await api.delete('/notas/pagamento/nota/' + nf + '?empresa_id=' + empId)
      await carregarTudo()
    } catch(e) { console.error(e) } finally { setSalvando(false) }
  }
  const isSix = empresa === 'six'
  const corEmp = isSix ? '#4F8EF7' : '#34D399'
  const bgEmp = isSix ? '#1A2A4A' : '#1A3A2A'
  const st = { fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '1.2px', color: '#7B82A0', marginBottom: '8px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }
  const tdBase = (extra?: any) => ({ padding: '8px 12px', borderBottom: '1px solid #252836', ...extra })
  const tdSm = (extra?: any) => ({ padding: '5px 12px', borderBottom: '1px solid #1A1D2A', ...extra })

  return (
    <div style={{ padding: '16px 24px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#7B82A0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Empresa Ativa</span>
        {(['six','enova'] as const).map(e => (
          <button key={e} onClick={() => setEmpresa(e)}
            style={{ padding: '5px 14px', borderRadius: '20px', border: empresa === e ? 'none' : '1px solid #252836', background: empresa === e ? (e === 'six' ? '#1A3A6A' : '#1A4A2A') : 'transparent', color: empresa === e ? (e === 'six' ? '#4F8EF7' : '#34D399') : '#7B82A0', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: empresa === e ? (e === 'six' ? '#4F8EF7' : '#34D399') : '#4A5070', display: 'inline-block' }} />
            {e === 'six' ? 'SIX Comercial' : 'ENOVA Comercial'}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', background: '#13161F', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '10px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#A78BFA' }}>SIX + ENOVA Aguardando</span>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace' }}>{fmtR(valTotalCombinado)}</span>
        </div>
      </div>

      <div style={st}>Resumo Geral das Notas — {MESES[mesAntIdx]}/{anoAnt}<div style={{ flex: 1, height: '1px', background: '#252836' }} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Total em NFs', valor: fmtR(tNF), sub: 'Notas Venda/Parcial de ' + mesAntNome + '/' + anoAnt, cor: '#4F8EF7' },
          { label: 'Total Recebido', valor: fmtR(tPago), sub: 'Pago em ' + mesAntNome + '/' + anoAnt, cor: '#34D399' },
          { label: 'Aguardando Pagamento', valor: fmtR(valAberto), sub: nfsAberto.filter(r => (parseFloat(r.valor_nf)||0)-(parseFloat(r.valor_pago)||0) > 0.01).length + ' em aberto · status Venda', cor: '#FBBF24' },
        ].map((k, i) => (
          <div key={i} style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: k.cor, borderRadius: '14px 14px 0 0' }} />
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070', marginBottom: '6px' }}>{k.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, ...mono, color: k.cor }}>{k.valor}</div>
            <div style={{ fontSize: '11px', color: '#7B82A0' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={st}>Imposto e Alíquotas — DAS Simples Nacional<div style={{ flex: 1, height: '1px', background: '#252836' }} /></div>
      <div style={{ background: '#13161F', border: '1px solid #252836', borderLeft: '3px solid #FBBF24', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' as const }}>
        {[
          { label: 'Alíquota DAS ', valor: (aliqEfetivaCont * 100).toFixed(2).replace('.', ',') + '%', cor: '#4F8EF7' },
          { label: 'Crédito ICMS', valor: (icmsAproveitavelCont * 100).toFixed(2).replace('.', ',') + '%', cor: '#22D3EE' },
          { label: 'Base Cálculo ' + mesAntNome + '/' + anoAnt, valor: fmtR(base), cor: '#7B82A0' },
          { label: '💰 Imposto a Pagar (Regime de Competência)', valor: fmtR(base * aliqEfetivaCont), cor: '#7B82A0' },
          { label: '💰 Imposto a Pagar (Regime de Caixa)', valor: fmtR(tPagoMLcto * aliqEfetivaCont), cor: '#34D399' },
          ...(totalCredito > 0 ? [{ label: '🟢 Crédito Fiscal NF de entrada', valor: '− ' + fmtR(totalCredito), cor: '#A78BFA' }] : []),
        ].map((x, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <div style={{ width: '1px', background: '#252836', alignSelf: 'stretch', margin: '2px 0' }} />}
            <div style={{ padding: '0 ' + (i === 0 ? '20px 0 4px' : '20px'), display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070' }}>{x.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, ...mono, color: x.cor }}>{x.valor}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={st}>Notas Fiscais — <div style={{ flex: 1, height: '1px', background: '#252836' }} /></div>
      <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', background: '#1A1D2A', borderBottom: '1px solid #252836', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#E8EAF0' }}>{notasFiltradas2.length} notas · {isSix ? 'SIX' : 'ENOVA'} · últimos 6 meses</span>
              <select value={filtroMesPagto} onChange={e=>setFiltroMesPagto(e.target.value)} style={{ background:'#1A1D2A', color:'#E8EAF0', border:'1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer' }}>
                <option value="">Pagamento: todos</option>
                {[...new Set(notas.flatMap((r:any)=>{
                  const lista=pagamentos[r.numero_nf]||[]
                  if(lista.length>0) return lista.map((p:any)=>{ const dt=p.dt_pagamento||''; if(!dt) return null; const parts=dt.includes('-')?dt.split('-').reverse():dt.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? mm.padStart(2,'0')+'/'+aa : null }).filter(Boolean)
                  const dtP=r.dt_pagamento||r.data_pagamento||''; if(!dtP) return []; const parts=dtP.includes('-')?dtP.split('-').reverse():dtP.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? [mm.padStart(2,'0')+'/'+aa] : []
                }))].filter(Boolean).sort().map((m:any)=>(<option key={m} value={m}>{m}</option>))}
              </select>
              <select value={filtroMesEmissao} onChange={e=>setFiltroMesEmissao(e.target.value)} style={{ background:'#1A1D2A', color:'#E8EAF0', border:'1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer' }}>
                <option value="">Emissão: todos</option>
                {[...new Set(notas.map((r:any)=>{ const dt=r.data_emissao||''; if(!dt) return null; const parts=dt.includes('-')?dt.split('-').reverse():dt.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? mm.padStart(2,'0')+'/'+aa : null }).filter(Boolean))].sort().map((m:any)=>(<option key={m} value={m}>{m}</option>))}
              </select>
            </div>
        </div>
        {devElegiveis.length > 0 && (
        <div style={{ background: '#13161F', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 14, padding: '14px 18px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#A78BFA', marginBottom: 10 }}>🟢 Devoluções com Crédito Fiscal Elegível</div>
          {devElegiveis.map((aj: any) => (
            <div key={aj.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #252836' }}>
              <div>
                <div style={{ fontSize: 13, color: '#E8EAF0', fontWeight: 500 }}>NF {aj.nf_devolucao} — devolução da NF {aj.nf_referenciada}</div>
                <div style={{ fontSize: 11, color: '#7B82A0', marginTop: 2 }}>Valor original: {fmtR(aj.valor)} · Crédito estimado: {fmtR(aj.valor * aliqEfetivaCont)}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {temPermissao('contab', 'incluir') && <button onClick={async () => {
                  await api.post('/notas/creditos', { empresa_id: empId, valor_nf_original: aj.valor, nf_devolucao: aj.nf_devolucao, nf_referenciada: aj.nf_referenciada, mes_orig: aj.mes, ano_orig: aj.ano })
                  carregarTudo()
                }} style={{ padding: '5px 12px', background: 'rgba(167,139,250,0.15)', border: '1px solid #A78BFA', borderRadius: 6, color: '#A78BFA', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                  Criar Crédito
                </button>}
                <button onClick={() => setIgnorados(prev => new Set([...prev, aj.id]))} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #2A2D3E', borderRadius: 6, color: '#7B82A0', fontSize: 11, cursor: 'pointer' }}>
                  Ignorar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {loading ? <div style={{ padding: 24, textAlign: 'center', color: '#7B82A0' }}>Carregando...</div> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#1A1D2A' }}>
                  {['Nº NF','Destinatário','CNPJ Dest.','Valor NF','Dt. Emissão','Valor Pago','Restante','Dt. Pagto','Imposto','Status',''].map((h, i) => (
                    <th key={i} style={{ padding: '8px 12px', textAlign: i >= 3 && i <= 7 ? 'right' : i === 9 ? 'center' : 'left', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#7B82A0', borderBottom: '1px solid #252836', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {notasFiltradas2.map(r => {
                  const valorNF = parseFloat(r.valor_nf || '0')
                  const valorPagoDB = parseFloat(r.valor_pago || '0')
                  const lista = pagamentos[r.numero_nf] || []
                  const temHistorico = lista.length > 0
                  // Valor pago: se tem historico usa soma, senao usa nota.valor_pago
                  const primeiroPagamento = temHistorico ? parseFloat(lista[0].valor_pago || '0') : valorPagoDB
                  const totalPago = temHistorico ? lista.reduce((s: number, p: any) => s + (parseFloat(p.valor_pago) || 0), 0) : valorPagoDB
                  const isPaga = totalPago > 0
                  const restante = valorNF - primeiroPagamento  // exibido na coluna Restante da linha original
                  const saldoTotal = valorNF - totalPago        // saldo real considerando todos os pagamentos
                  const temSaldo = isPaga && restante > 0.01    // para exibir Restante na linha original
                  const temSaldoReal = isPaga && saldoTotal > 0.01  // para criar proxima linha vazia
                  const mostrarHistorico = lista.length >= 2
                  const mostrarProxima = lista.length >= 1 && temSaldoReal
                  // Data exibida na linha original para comparar com filtro
                  const dtLinhaOriginal = temHistorico ? (lista[0]?.dt_pagamento || '') : (r.dt_pagamento || r.data_pagamento || '')
                  const linhaOriginalNoFiltro = !filtroMesPagto || dtNoMesFiltro(dtLinhaOriginal)

                  const isCancelada = r.numero_nf?.endsWith('-CAN')
                  const isInut = r.numero_nf?.endsWith('-INUT')
                  const isCCE = r.numero_nf?.endsWith('-CCE')
                  const foiCancelada = nfsCanceladas.has(r.numero_nf)
                  const nat = (r.nat_operacao || r.status || '').toLowerCase()
                  const isVenda = nat.includes('venda') && !nat.includes('devolu') && !foiCancelada
                  const stStyle = foiCancelada && (r.nat_operacao || r.status || '').toLowerCase().includes('venda')
                    ? { bg: 'rgba(248,113,113,0.15)', cor: '#FCA5A5' }
                    : statusStyle(r.nat_operacao || r.status)
                  const isEdit = editando === r.numero_nf
                  const isSaldoEdit = editando === r.numero_nf + '-saldo'
                  const mesEmit = r.data_emissao ? parseInt((r.data_emissao.includes('-') ? r.data_emissao.split('-')[1] : r.data_emissao.split('/')[1])) : 0
                  const nfCor = mesEmit % 2 === 1 ? corEmp : '#A78BFA'
                  const nfBg = mesEmit % 2 === 1 ? bgEmp : '#2A1A52'
                  const rowStyle = isCancelada ? { background: 'rgba(248,113,113,0.08)', borderLeft: '3px solid #F87171' } : isInut ? { background: 'rgba(251,191,36,0.08)', borderLeft: '3px solid #FBBF24' } : isCCE ? { background: 'rgba(79,142,247,0.08)', borderLeft: '3px solid #4F8EF7' } : {}

                  return (
                    <React.Fragment key={r.numero_nf}>
                      {/* LINHA ORIGINAL */}
                      {linhaOriginalNoFiltro && (<>
                      <tr style={rowStyle}>
                        <td style={tdBase()}><span style={{ background: nfBg, color: nfCor, borderRadius: '5px', padding: '2px 8px', fontWeight: 700, fontSize: '12px', ...mono }}>{r.numero_nf}</span></td>
                        <td style={tdBase({ color: '#E8EAF0', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>{r.destinatario}</td>
                        <td style={tdBase({ color: '#7B82A0', ...mono, fontSize: '11px' })}>{fmtCNPJ(r.cnpj_dest)}</td>
                        <td style={tdBase({ textAlign: 'right', fontWeight: 600, ...mono, color: '#E8EAF0' })}>{r.valor_nf ? fmtR(valorNF) : '—'}</td>
                        <td style={tdBase({ textAlign: 'right', color: '#7B82A0', ...mono, fontSize: '11px' })}>{r.data_emissao || '—'}</td>
                        <td style={tdBase({ textAlign: 'right', ...mono, fontSize: '11px' })}>
                          {isPaga ? <span style={{ color: '#34D399', fontWeight: 600 }}>{fmtR(primeiroPagamento)}</span> : isVenda ? <span style={{ color: '#4A5070', fontStyle: 'italic' }}>aguardando</span> : null}
                        </td>
                        <td style={tdBase({ textAlign: 'right', ...mono, fontSize: '11px' })}>
                          {temSaldoReal ? <span style={{ color: '#F87171', fontWeight: 600 }}>{fmtR(saldoTotal)}</span> : (isPaga && restante > 0.01 ? <span style={{ color: '#F87171', fontWeight: 600 }}>{fmtR(restante)}</span> : null)}
                        </td>
                        <td style={tdBase({ textAlign: 'right', color: '#7B82A0', ...mono, fontSize: '11px' })}>{temHistorico ? (lista[0]?.dt_pagamento || '—') : (r.dt_pagamento || r.data_pagamento || '—')}</td>
                        <td style={tdBase({ textAlign: 'right', ...mono, fontSize: '11px' })}>
                          {(() => {
                            const dtPg = temHistorico ? (lista[0]?.dt_pagamento || '') : (r.dt_pagamento || r.data_pagamento || '')
                            const parts = dtPg.includes('-') ? dtPg.split('-').reverse() : dtPg.split('/')
                            const mm = parseInt(parts[1])
                            const aa = parseInt(parts[2])
                            if (mm === mesAntIdx + 1 && aa === anoAnt && primeiroPagamento > 0) {
                              return <span style={{ color: '#FBBF24', fontWeight: 600 }}>{fmtR(primeiroPagamento * aliqEfetivaCont)}</span>
                            }
                            return <span style={{ color: '#4A5070' }}>—</span>
                          })()}
                        </td>
                        <td style={tdBase()}>
                          <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: stStyle.bg, color: stStyle.cor, display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: stStyle.cor }} />
                            {foiCancelada ? (r.nat_operacao || r.status || 'Sem status') + '/Cancelada' : (r.nat_operacao || r.status || 'Sem status')}
                          </span>
                        </td>
                        <td style={tdBase({ textAlign: 'center' })}>
  {isVenda && temPermissao('contab', 'editar') && <button onClick={() => {
  if (lista.length > 0) {
    // Ja tem pagamento: editar o pagamento existente
    setEditando(null)
    setEditVPg('')
    setEditDtp('')
    console.log('LISTA:', lista.length, 'IDS:', lista.map(p=>p.id)); setEditandoPgto(editandoPgto === lista[0].id ? null : lista[0].id)
    setEditPgtoVal(saldoTotal > 0.01 ? String(saldoTotal).replace('.', ',') : String(lista[0].valor_pago).replace('.', ','))
    setEditPgtoDt(lista[0].dt_pagamento || '')
    setEditMesLct(lista[0].mes_lancamento || (new Date().toLocaleString('pt-BR',{month:'short'}).replace('.','') + '/' + new Date().getFullYear()))
  } else {
    // Sem pagamento: novo lancamento
    setEditandoPgto(null)
    setEditPgtoVal('')
    setEditPgtoDt('')
    setEditMesLct('')
    setEditando(isEdit ? null : r.numero_nf)
    setEditVPg(String(valorNF).replace('.', ','))
    setEditDtp(r.dt_pagamento || r.data_pagamento || '')
    setEditMesLct(new Date().toLocaleString('pt-BR',{month:'short'}).replace('.','') + '/' + new Date().getFullYear())
  }
}} style={{ padding: "2px 7px", background: "transparent", border: "none", borderRadius: "4px", color: "#7B82A0", fontSize: "11px", cursor: "pointer" }}>✏️</button>}
  {isVenda && isPaga && !temHistorico && temPermissao('contab', 'apagar') && <button onClick={() => limparPagamento(r.numero_nf)} style={{ padding: "2px 7px", background: "transparent", border: "none", borderRadius: "4px", color: "#F87171", fontSize: "11px", cursor: "pointer" }}>🗑️</button>}
</td>
                      </tr>

                      {/* FORM EDITAR LINHA ORIGINAL */}
                      {editandoPgto === (lista[0]?.id) && (
                        <tr key={r.numero_nf + '-edit-p0'} style={{ background: '#1A1D2A' }}>
                          <td colSpan={10} style={{ padding: '10px 16px', borderBottom: '1px solid #252836' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', color: '#7B82A0' }}>Valor Pago:</span>
                              <input value={editPgtoVal} onChange={e => setEditPgtoVal(e.target.value)} placeholder="0,00"
                                style={{ width: '120px', padding: '4px 8px', background: '#252836', border: '1px solid #333750', borderRadius: '5px', color: '#E8EAF0', fontSize: '12px', outline: 'none' }} />
                              <span style={{ fontSize: '11px', color: '#7B82A0' }}>Data Pagto:</span>
                              <input value={editPgtoDt} onChange={e => setEditPgtoDt(e.target.value)} placeholder="DD/MM/AAAA"
                                style={{ width: '120px', padding: '4px 8px', background: '#252836', border: '1px solid #333750', borderRadius: '5px', color: '#E8EAF0', fontSize: '12px', outline: 'none' }} />
                              
                              <button onClick={() => editarPagamento(lista[0].id, r.numero_nf)} disabled={salvando}
                                style={{ padding: '4px 14px', background: '#4F8EF7', border: 'none', borderRadius: '5px', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{salvando ? '...' : 'Salvar'}</button>
                              <button onClick={() => { setEditandoPgto(null); setEditPgtoVal(''); setEditPgtoDt(''); setEditMesLct('') }}
                                style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #333750', borderRadius: '5px', color: '#7B82A0', fontSize: '11px', cursor: 'pointer' }}>Cancelar</button>
                            </div>
                          </td>
                        </tr>
                      )}
                      {isEdit && (
                        <tr key={r.numero_nf + '-edit'} style={{ background: '#1A1D2A' }}>
                          <td colSpan={10} style={{ padding: '10px 16px', borderBottom: '1px solid #252836' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', color: '#7B82A0' }}>Valor Pago:</span>
                              <input value={editVPg} onChange={e => setEditVPg(e.target.value)} placeholder="0,00"
                                style={{ width: '120px', padding: '4px 8px', background: '#252836', border: '1px solid #333750', borderRadius: '5px', color: '#E8EAF0', fontSize: '12px', outline: 'none' }} />
                              <span style={{ fontSize: '11px', color: '#7B82A0' }}>Data Pagto:</span>
                              <input value={editDtp} onChange={e => setEditDtp(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { const v = editDtp.trim(); const pts = v.split('/'); if (pts.length === 2) { setEditDtp(pts[0].padStart(2,'0') + '/' + pts[1].padStart(2,'0') + '/' + new Date().getFullYear()) } else { salvarPagamento(r.numero_nf) } } }}
                                placeholder="DD/MM/AAAA"
                                style={{ width: '120px', padding: '4px 8px', background: '#252836', border: '1px solid #333750', borderRadius: '5px', color: '#E8EAF0', fontSize: '12px', outline: 'none' }} />
                              
                              <button onClick={() => salvarPagamento(r.numero_nf)} disabled={salvando}
                                style={{ padding: '4px 14px', background: '#4F8EF7', border: 'none', borderRadius: '5px', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                                {salvando ? '...' : 'Salvar'}
                              </button>
                              <button onClick={() => { setEditando(null); setEditVPg(''); setEditDtp('') }}
                                style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #333750', borderRadius: '5px', color: '#7B82A0', fontSize: '11px', cursor: 'pointer' }}>Cancelar</button>
                            </div>
                          </td>
                        </tr>
                      )}

                      </>)}
                      {/* LINHAS PAGAMENTOS PARCIAIS — so quando 2+ pagamentos com saldo */}
                      {mostrarHistorico && lista.slice(1).filter((pg: any) => !filtroMesPagto || dtNoMesFiltro(pg.dt_pagamento)).map((pg: any, idx: number) => {
                        const somaAteEsta = lista.slice(0, idx + 2).reduce((s: number, p: any) => s + (parseFloat(p.valor_pago) || 0), 0)
                        const restanteParcela = valorNF - somaAteEsta
                        const isEditPg = editandoPgto === pg.id
                        return (
                          <>
                            <tr key={r.numero_nf + '-pg-' + idx} style={{ background: 'rgba(79,142,247,0.04)', borderLeft: '3px solid #4F8EF7' }}>
                              <td style={tdSm()}><span style={{ background: 'rgba(79,142,247,0.15)', color: '#4F8EF7', borderRadius: '5px', padding: '2px 8px', fontWeight: 700, fontSize: '11px', ...mono }}>{r.numero_nf}/{idx + 2}</span></td>
                              <td style={tdSm({ color: '#7B82A0', fontSize: '11px', fontStyle: 'italic' })}>{r.destinatario} — Pagamento parcial {idx + 2}</td>
                              <td style={tdSm({ color: '#7B82A0', ...mono, fontSize: '11px' })}>{fmtCNPJ(r.cnpj_dest)}</td>
                              <td style={tdSm()}></td>
                              <td style={tdSm()}></td>
                              <td style={tdSm({ textAlign: 'right' })}><span style={{ color: '#4F8EF7', fontWeight: 600, ...mono, fontSize: '11px' }}>{fmtR(pg.valor_pago)}</span></td>
                              <td style={tdSm({ textAlign: 'right' })}>
                                {restanteParcela > 0.01 ? <span style={{ color: '#F87171', fontWeight: 600, ...mono, fontSize: '11px' }}>{fmtR(restanteParcela)}</span> : <span style={{ color: '#34D399', fontSize: '11px' }}>✓ Quitado</span>}
                              </td>
                              <td style={tdSm({ textAlign: 'right', color: '#7B82A0', ...mono, fontSize: '11px' })}>{pg.dt_pagamento || '—'}</td>
                              <td style={tdSm({ textAlign: 'right', ...mono, fontSize: '11px' })}>
                                {(() => {
                                  const dtPg = pg.dt_pagamento || ''
                                  const parts = dtPg.includes('-') ? dtPg.split('-').reverse() : dtPg.split('/')
                                  const mm = parseInt(parts[1])
                                  const aa = parseInt(parts[2])
                                  if (mm === mesAntIdx + 1 && aa === anoAnt && pg.valor_pago > 0) {
                                    return <span style={{ color: '#FBBF24', fontWeight: 600 }}>{fmtR(parseFloat(pg.valor_pago) * aliqEfetivaCont)}</span>
                                  }
                                  return <span style={{ color: '#4A5070' }}>—</span>
                                })()}
                              </td>
                              <td style={tdSm()}>
                                <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: 'rgba(79,142,247,0.12)', color: '#4F8EF7', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4F8EF7' }} />Parcial
                                </span>
                              </td>
                              <td style={tdSm({ textAlign: 'center' })}>
                                <button onClick={() => { setEditandoPgto(isEditPg ? null : pg.id); setEditPgtoVal(String(pg.valor_pago).replace('.', ',')); setEditPgtoDt(pg.dt_pagamento || ''); setEditMesLct(pg.mes_lancamento || (MESES[new Date().getMonth()].toLowerCase() + '/' + new Date().getFullYear())) }}
                                  style={{ padding: '2px 7px', background: '#1A1D2A', border: '1px solid #252836', borderRadius: '4px', color: '#7B82A0', fontSize: '11px', cursor: 'pointer', marginRight: '4px' }}>✏️</button>
                                <button onClick={() => excluirPagamento(pg.id)}
                                  style={{ padding: '2px 7px', background: '#1A1D2A', border: '1px solid #F87171', borderRadius: '4px', color: '#F87171', fontSize: '11px', cursor: 'pointer' }}>🗑️</button>
                              </td>
                            </tr>
                            {isEditPg && (
                              <tr key={'edit-pg-' + pg.id} style={{ background: '#1A1D2A' }}>
                                <td colSpan={10} style={{ padding: '10px 16px', borderBottom: '1px solid #252836' }}>
                                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '11px', color: '#4F8EF7', fontWeight: 600 }}>Editar {r.numero_nf}/{idx + 2}:</span>
                                    <input value={editPgtoVal} onChange={e => setEditPgtoVal(e.target.value)} placeholder="0,00"
                                      style={{ width: '120px', padding: '4px 8px', background: '#252836', border: '1px solid #333750', borderRadius: '5px', color: '#E8EAF0', fontSize: '12px', outline: 'none' }} />
                                    <input value={editPgtoDt} onChange={e => setEditPgtoDt(e.target.value)} placeholder="DD/MM/AAAA"
                                      style={{ width: '120px', padding: '4px 8px', background: '#252836', border: '1px solid #333750', borderRadius: '5px', color: '#E8EAF0', fontSize: '12px', outline: 'none' }} />
                                    
                                    <button onClick={() => editarPagamento(pg.id, r.numero_nf)} disabled={salvando}
                                      style={{ padding: '4px 14px', background: '#4F8EF7', border: 'none', borderRadius: '5px', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{salvando ? '...' : 'Salvar'}</button>
                                    <button onClick={() => { setEditandoPgto(null); setEditPgtoVal(''); setEditPgtoDt('') }}
                                      style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #333750', borderRadius: '5px', color: '#7B82A0', fontSize: '11px', cursor: 'pointer' }}>Cancelar</button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        )
                      })}

                      {/* PROXIMA LINHA VAZIA */}
                      {mostrarProxima && !filtroMesPagto && (
                        <>
                          <tr key={r.numero_nf + '-prox'} data-tipo="aguardando" style={{ background: 'rgba(248,113,113,0.03)', borderLeft: '3px solid #F87171' }}>
                            <td style={tdSm()}><span style={{ background: 'rgba(248,113,113,0.15)', color: '#F87171', borderRadius: '5px', padding: '2px 8px', fontWeight: 700, fontSize: '11px', ...mono }}>{r.numero_nf}/{lista.length + 1}</span></td>
                            <td style={tdSm({ color: '#7B82A0', fontSize: '11px', fontStyle: 'italic' })}>{r.destinatario} — Pagamento parcial {lista.length + 1}</td>
                            <td style={tdSm({ color: '#7B82A0', ...mono, fontSize: '11px' })}>{fmtCNPJ(r.cnpj_dest)}</td>
                            <td style={tdSm()}></td>
                            <td style={tdSm()}></td>
                            <td style={tdSm({ textAlign: 'right', color: '#4A5070', fontSize: '11px' })}>—</td>
                            <td style={tdSm({ textAlign: 'right', color: '#4A5070', fontSize: '11px' })}>—</td>
                            <td style={tdSm({ textAlign: 'right', color: '#4A5070', fontSize: '11px' })}>—</td>
                            <td style={tdSm({ textAlign: 'right', color: '#4A5070', fontSize: '11px' })}>—</td>
                            <td style={tdSm()}>
                              <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: 'rgba(248,113,113,0.12)', color: '#F87171', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F87171' }} />Aguardando
                              </span>
                            </td>
                            <td style={tdSm({ textAlign: 'center' })}>
                              <button onClick={() => { setEditando(isSaldoEdit ? null : r.numero_nf + '-saldo'); setEditVPg(''); setEditDtp('') }}
                                style={{ padding: '3px 9px', background: '#1A1D2A', border: '1px solid #252836', borderRadius: '5px', color: '#7B82A0', fontSize: '11px', cursor: 'pointer' }}>✏️</button>
                            </td>
                          </tr>
                          {isSaldoEdit && (
                            <tr key={r.numero_nf + '-saldo-edit'} style={{ background: '#1A1D2A' }}>
                              <td colSpan={10} style={{ padding: '10px 16px', borderBottom: '1px solid #252836' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                  <span style={{ fontSize: '11px', color: '#F87171', fontWeight: 600 }}>Pagamento parcial {lista.length + 1}:</span>
                                  <input value={editVPg} onChange={e => setEditVPg(e.target.value)} placeholder={String(saldoTotal.toFixed(2)).replace('.', ',')}
                                    style={{ width: '120px', padding: '4px 8px', background: '#252836', border: '1px solid #333750', borderRadius: '5px', color: '#E8EAF0', fontSize: '12px', outline: 'none' }} />
                                  <span style={{ fontSize: '11px', color: '#7B82A0' }}>Data Pagto:</span>
                                  <input value={editDtp} onChange={e => setEditDtp(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { const v = editDtp.trim(); const pts = v.split('/'); if (pts.length === 2) { setEditDtp(pts[0].padStart(2,'0') + '/' + pts[1].padStart(2,'0') + '/' + new Date().getFullYear()) } else { salvarPagamentoSaldo(r.numero_nf) } } }}
                                    placeholder="DD/MM/AAAA"
                                    style={{ width: '120px', padding: '4px 8px', background: '#252836', border: '1px solid #333750', borderRadius: '5px', color: '#E8EAF0', fontSize: '12px', outline: 'none' }} />
                                  <button onClick={() => salvarPagamentoSaldo(r.numero_nf)} disabled={salvando}
                                    style={{ padding: '4px 14px', background: '#4F8EF7', border: 'none', borderRadius: '5px', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{salvando ? '...' : 'Salvar'}</button>
                                  <button onClick={() => { setEditando(null); setEditVPg(''); setEditDtp('') }}
                                    style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #333750', borderRadius: '5px', color: '#7B82A0', fontSize: '11px', cursor: 'pointer' }}>Cancelar</button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
              <tfoot>
                <tr style={{ background: '#1A1D2A', borderTop: '2px solid #252836' }}>
                  <td colSpan={3} style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 700, color: '#7B82A0' }}>TOTAIS</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, ...mono, color: corEmp }}>{fmtR(tNF)}</td>
                  <td></td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, ...mono, color: '#34D399' }}>{fmtR(tPago)}</td>
                  <td></td><td></td><td></td><td></td><td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
