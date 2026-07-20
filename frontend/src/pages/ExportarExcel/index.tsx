import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import * as XLSXStyle from 'xlsx-js-style'
import { historicoAPI, dasAPI, empresasAPI } from '../../api/endpoints'
import axios from 'axios'
import { registrarLog } from '../../api/auditoria'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://diligent-integrity-production-3f98.up.railway.app' })
api.interceptors.request.use(c => { const t = localStorage.getItem('access_token'); if (t) c.headers.Authorization = `Bearer ${t}`; return c })

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

function fmtR(v: number) {
  return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function ExportarExcel() {
  const [histSix, setHistSix] = useState<any[]>([])
  const [histEnova, setHistEnova] = useState<any[]>([])
  const [dasSix, setDasSix] = useState<any[]>([])
  const [dasEnova, setDasEnova] = useState<any[]>([])
  const [notas, setNotas] = useState<{ six: any[]; enova: any[] }>({ six: [], enova: [] })
  const [pagamentos, setPagamentos] = useState<Record<string, any[]>>({})
  const [empresas, setEmpresas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [gerando, setGerando] = useState<string | null>(null)
  const [notif, setNotif] = useState<string | null>(null)

  const now = new Date()
  const mesAntIdx = now.getMonth() === 0 ? 11 : now.getMonth() - 1
  const anoAnt = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
  const anoAtual = now.getFullYear()
  const mesAntNome = MESES[mesAntIdx]

  useEffect(() => {
    Promise.all([
      historicoAPI.listar(1).then(r => r.data).catch(() => []),
      historicoAPI.listar(2).then(r => r.data).catch(() => []),
      dasAPI.listar(1).then(r => r.data).catch(() => []),
      dasAPI.listar(2).then(r => r.data).catch(() => []),
      empresasAPI.listar().then(r => r.data).catch(() => []),
      api.get('/notas/1').then(r => r.data).catch(() => []),
      api.get('/notas/2').then(r => r.data).catch(() => []),
    ]).then(([h1, h2, d1, d2, emp, n1, n2]) => {
      setHistSix(h1); setHistEnova(h2)
      setDasSix(d1); setDasEnova(d2)
      setEmpresas(emp)
      setNotas({ six: n1, enova: n2 })
      // Carregar todos os pagamentos de uma vez
      Promise.all([
        api.get('/notas/pagamentos/1').then((r: any) => r.data).catch(() => ({})),
        api.get('/notas/pagamentos/2').then((r: any) => r.data).catch(() => ({})),
      ]).then(([pg1, pg2]) => {
        setPagamentos({ ...pg1, ...pg2 })
      })
    }).finally(() => setLoading(false))
  }, [])

  const empSix = empresas.find(e => e.nome === 'SIX') || { aliquota_das: 0.088324, credito_icms: 0.029614 }
  const empEnova = empresas.find(e => e.nome === 'ENOVA') || { aliquota_das: 0.093254, credito_icms: 0.031256 }

  function showNotif(msg: string) {
    setNotif(msg)
    setTimeout(() => setNotif(null), 3500)
  }

  // Gerar CSV simples que abre no Excel
  function gerarCSV(dados: any[][], nome: string) {
    const bom = '\uFEFF' // BOM para UTF-8 no Excel
    const csv = bom + dados.map(row =>
      row.map(cell => {
        const s = String(cell ?? '')
        return s.includes(',') || s.includes('"') || s.includes('\n')
          ? `"${s.replace(/"/g, '""')}"`
          : s
      }).join(';')
    ).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nome
    a.click()
    URL.revokeObjectURL(url)
  }

  async function exportarFaturamentos() {
    setGerando('fat')
    const dados: any[][] = [
      ['FATURAMENTO MENSAL — SIX + ENOVA', '', '', '', ''],
      ['Gerado em:', new Date().toLocaleDateString('pt-BR'), '', '', ''],
      [''],
      ['Mês/Ano', 'SIX Comercial', 'ENOVA Comercial', 'Total Consolidado', ''],
    ]

    const periodos = [...new Set([
      ...histSix.map(r => `${r.ano}-${String(r.mes).padStart(2,'0')}`),
      ...histEnova.map(r => `${r.ano}-${String(r.mes).padStart(2,'0')}`),
    ])].sort((a, b) => b.localeCompare(a))

    for (const p of periodos) {
      const [ano, mes] = p.split('-').map(Number)
      const vS = histSix.find(r => r.ano === ano && r.mes === mes)?.valor || 0
      const vE = histEnova.find(r => r.ano === ano && r.mes === mes)?.valor || 0
      dados.push([`${MESES[mes-1]}/${ano}`, vS.toFixed(2).replace('.', ','), vE.toFixed(2).replace('.', ','), (vS+vE).toFixed(2).replace('.', ','), ''])
    }

    // Totais
    const totS = histSix.reduce((s, r) => s + r.valor, 0)
    const totE = histEnova.reduce((s, r) => s + r.valor, 0)
    dados.push([''])
    dados.push(['TOTAL GERAL', totS.toFixed(2).replace('.', ','), totE.toFixed(2).replace('.', ','), (totS+totE).toFixed(2).replace('.', ','), ''])

    gerarCSV(dados, `faturamento_${anoAtual}.csv`)
    await registrarLog({ acao: 'EXPORTAR', modulo: 'excel', descricao: `Faturamento mensal histórico exportado · ${histSix.length + histEnova.length} registros` })
    showNotif('✅ Faturamentos exportados!')
    setGerando(null)
  }

  async function exportarDAS() {
    setGerando('das')
    const dados: any[][] = [
      ['DAS — SIMPLES NACIONAL', '', '', ''],
      ['Gerado em:', new Date().toLocaleDateString('pt-BR'), '', ''],
      [''],
      ['Mês/Ano', 'SIX (R$)', 'ENOVA (R$)', 'Total (R$)'],
    ]

    const todosAnos = [...new Set([...dasSix, ...dasEnova].map(r => r.ano))].sort((a, b) => b - a)
    for (const ano of todosAnos) {
      dados.push([`--- ${ano} ---`, '', '', ''])
      const meses = [...new Set([
        ...dasSix.filter(r => r.ano === ano).map(r => r.mes),
        ...dasEnova.filter(r => r.ano === ano).map(r => r.mes),
      ])].sort((a, b) => b - a)
      for (const mes of meses) {
        const vS = dasSix.find(r => r.ano === ano && r.mes === mes)?.valor || 0
        const vE = dasEnova.find(r => r.ano === ano && r.mes === mes)?.valor || 0
        dados.push([`${MESES[mes-1]}/${ano}`, vS.toFixed(2).replace('.', ','), vE.toFixed(2).replace('.', ','), (vS+vE).toFixed(2).replace('.', ',')])
      }
      const totAnoS = dasSix.filter(r => r.ano === ano).reduce((s, r) => s + r.valor, 0)
      const totAnoE = dasEnova.filter(r => r.ano === ano).reduce((s, r) => s + r.valor, 0)
      dados.push([`Total ${ano}`, totAnoS.toFixed(2).replace('.', ','), totAnoE.toFixed(2).replace('.', ','), (totAnoS+totAnoE).toFixed(2).replace('.', ',')])
      dados.push([''])
    }

    gerarCSV(dados, `das_pagamentos.csv`)
    await registrarLog({ acao: 'EXPORTAR', modulo: 'excel', descricao: `DAS histórico exportado · SIX (${dasSix.length}) + ENOVA (${dasEnova.length}) meses` })
    showNotif('✅ DAS exportado!')
    setGerando(null)
  }

  async function exportarMesAnterior() {
    setGerando("mes")
    try {
    const parseDate = (dtStr: any): Date | null => {
      if (!dtStr) return null
      if (dtStr instanceof Date) return dtStr
      const s = String(dtStr)
      const parts = s.includes("-") ? s.split("-").reverse() : s.split("/")
      const d = new Date(+parts[2], +parts[1] - 1, +parts[0], 12, 0, 0)
      return isNaN(d.getTime()) ? null : d
    }
    const border = { top:{style:"thin",color:{rgb:"000000"}}, bottom:{style:"thin",color:{rgb:"000000"}}, left:{style:"thin",color:{rgb:"000000"}}, right:{style:"thin",color:{rgb:"000000"}} }
    const hStyle = { font:{bold:true,name:"Calibri",sz:11}, fill:{patternType:"solid",fgColor:{rgb:"FFC000"}}, alignment:{horizontal:"center",vertical:"center"}, border }
    const aligns = ["center","center","center","left","left","center","center","center","center"]
    const cab = ["Nº NF","RzEmit","CnpjDest","RzDest","Valor NF","DtEmissao","Valor Pago","Data Contabilização","Status Nota Fiscal"]
    const colWidths = [11,43,17,52,18,13,17,17,17]
    const buildSheet = (lista: any[], emp: string) => {
      const nfsCan = new Set(lista.filter((n:any)=>n.numero_nf?.endsWith("-CAN")).map((n:any)=>n.numero_nf.replace("-CAN","")))
      const listaFiltrada = lista.filter((n:any)=>{ const st=(n.nat_operacao||n.status||"").toLowerCase(); return !st.includes("cancelamento")&&!st.includes("cce")&&!st.includes("carta") })
      const notasMes = listaFiltrada.filter((n:any)=>{
        if(!n.data_emissao) return false
        const parts=n.data_emissao.includes("-")?n.data_emissao.split("-"):n.data_emissao.split("/").reverse()
        return parseInt(parts[1])===mesAntIdx+1&&parseInt(parts[0])===anoAnt
      })
      const notasAguardando = listaFiltrada.filter((n:any)=>{
        const st=(n.nat_operacao||n.status||"").toLowerCase()
        const semPag=!n.valor_pago||parseFloat(n.valor_pago)===0
        if(!n.data_emissao||!st.includes("venda")||nfsCan.has(n.numero_nf)||!semPag) return false
        const parts=n.data_emissao.includes("-")?n.data_emissao.split("-"):n.data_emissao.split("/").reverse()
        return !(parseInt(parts[1])===mesAntIdx+1&&parseInt(parts[0])===anoAnt)
      })
      const mesAtualIdx2 = now.getMonth()
      const anoAtual2 = now.getFullYear()
      const notasPagas = listaFiltrada.filter((n:any)=>{
        const pgtos=pagamentos[n.numero_nf]||[]
        const isPagoRef = (mes: number, ano: number) =>
          (mes===mesAntIdx+1&&ano===anoAnt) || (mes===mesAtualIdx2+1&&ano===anoAtual2)
        if(pgtos.length===0){
          const dtP=n.data_contabilizacao; if(!dtP) return false
          const parts=dtP.includes("-")?dtP.split("-"):dtP.split("/").reverse()
          return isPagoRef(parseInt(parts[1]), parseInt(parts[0]))
        }
        return pgtos.some((p:any)=>{ const dt=p.data_contabilizacao; if(!dt) return false; const parts=dt.includes("-")?dt.split("-"):dt.split("/").reverse(); return isPagoRef(parseInt(parts[1]), parseInt(parts[0])) })
      })
      const todasNotas = [...new Map([...notasMes,...notasAguardando,...notasPagas].map((n:any)=>[n.numero_nf,n])).values()].sort((a:any,b:any)=>(parseFloat(a.numero_nf)||0)-(parseFloat(b.numero_nf)||0))
      const rows: any[][] = []
      for(const n of todasNotas){
        const pgtos=pagamentos[n.numero_nf]||[]
        const dtEm=parseDate(n.data_emissao)
        const pgtosMes = pgtos.filter((p:any)=>{ const dt=p.data_contabilizacao; if(!dt) return false; const parts=dt.includes("-")?dt.split("-"):dt.split("/").reverse(); const m=parseInt(parts[1]); const a=parseInt(parts[0]); return (m===mesAntIdx+1&&a===anoAnt)||(m===mesAtualIdx2+1&&a===anoAtual2) })
        if(pgtosMes.length>0){
          pgtosMes.forEach((p:any)=>rows.push([n.numero_nf||"",emp,n.cnpj_dest||"",n.destinatario||"",parseFloat(n.valor_nf)||0,dtEm,parseFloat(p.valor_pago)||0,parseDate(p.data_contabilizacao),(n.nat_operacao||n.status||"")+(nfsCan.has(n.numero_nf)?"/Cancelada":"")]))
        } else {
          rows.push([n.numero_nf||"",emp,n.cnpj_dest||"",n.destinatario||"",parseFloat(n.valor_nf)||0,dtEm,n.valor_pago?parseFloat(n.valor_pago):null,parseDate(n.data_contabilizacao),(n.nat_operacao||n.status||"")+(nfsCan.has(n.numero_nf)?"/Cancelada":"")])
        }
      }
      const nRows = rows.length
      const sumMes = mesAntIdx + 1
      const wsData: any[][] = [cab, ...rows, [], ["","","","",{f:"SUM(E2:E"+(nRows+1)+")"},"","","",""]]
      const ws = XLSXStyle.utils.aoa_to_sheet(wsData)
      ws["!cols"] = colWidths.map(w=>({wch:w}))
      cab.forEach((_:any, ci:number) => {
        const addr = XLSXStyle.utils.encode_cell({r:0,c:ci})
        if(!ws[addr]) ws[addr]={t:"s",v:cab[ci]}
        ws[addr].s = hStyle
      })
      rows.forEach((row:any[], ri:number) => {
        const bg = ri%2===0 ? "FFFFFF" : "ECECEC"
        for(let ci=0;ci<9;ci++){
          const addr = XLSXStyle.utils.encode_cell({r:ri+1,c:ci})
          const cellVal = row[ci] ?? ""
          const cellType = cellVal instanceof Date ? "d" : typeof cellVal === "number" ? "n" : "s"
          if(!ws[addr]) ws[addr] = {t:cellType, v:cellVal}
          else { ws[addr].t = cellType; ws[addr].v = cellVal }
          const isDate = (ci===5||ci===7) && row[ci] instanceof Date
          ws[addr].s = { font:{name:"Calibri",sz:11}, fill:{patternType:"solid",fgColor:{rgb:bg}}, alignment:{horizontal:aligns[ci]||"left",vertical:"center"}, border }
          if(isDate) ws[addr].z = "dd/mm/yyyy"
          if(ci===4||ci===6) ws[addr].z = "_(R$* #,##0.00_);_(R$* (#,##0.00);_(R$* \"-\"??_);_(@_)"
        }
      })
      const sumRowIdx = nRows + 2
      const somaVlPago = rows.reduce((s:number, row:any[]) => {
        const dtH = row[7]
        if(!(dtH instanceof Date)) return s
        if(dtH.getMonth()===mesAntIdx && dtH.getFullYear()===anoAnt) return s + (parseFloat(row[6])||0)
        return s
      }, 0)
      const gAddr = XLSXStyle.utils.encode_cell({r:sumRowIdx,c:6})
      ws[gAddr] = {t:"n",v:somaVlPago}
      for(let ci=0;ci<9;ci++){
        const addr = XLSXStyle.utils.encode_cell({r:sumRowIdx,c:ci})
        if(!ws[addr]) ws[addr]={t:"z",v:""}
        const isSum = ci===4 || ci===6
        ws[addr].s = { font:{name:"Calibri",sz:11,bold:isSum}, fill:{patternType:"solid",fgColor:{rgb:isSum?"FFFFFF":"000000"}}, border }
        if(isSum) ws[addr].z = "_(R$* #,##0.00_);_(R$* (#,##0.00);_(R$* \"-\"??_);_(@_)"
      }
      return ws
    }
    const wb = XLSXStyle.utils.book_new()
    XLSXStyle.utils.book_append_sheet(wb, buildSheet(notas.six,"SIX COMERCIAL ARTIGOS PROMOCIONAIS"), "SIX")
    XLSXStyle.utils.book_append_sheet(wb, buildSheet(notas.enova,"ENOVA COMERCIAL ARTIGOS PROMOCIONAIS"), "ENOVA")
    const wbout = XLSXStyle.write(wb, { bookType: "xlsx", type: "array" })
    console.log("WBOUT_SIZE:", wbout?.byteLength)
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "Relatorio_Saidas_SIX_e_ENOVA " + mesAntNome + anoAnt + ".xlsx"; document.body.appendChild(a); a.click()
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 2000)
    registrarLog({ acao: "EXPORTAR", modulo: "excel", descricao: "Relatorio completo exportado" }).catch(()=>{})
    showNotif("Relatorio gerado!")
    } catch(err: any) { console.error("EXPORT_ERR:", err?.message, err); showNotif("Erro: " + err?.message) }
    setGerando(null)
  }


  async function exportarNotas(empKey: 'six' | 'enova') {
    setGerando('notas_' + empKey)
    const lista = notas[empKey]
    const empNome = empKey === 'six' ? 'SIX' : 'ENOVA'

    const dados: any[][] = [
      [`NOTAS FISCAIS — ${empNome}`, '', '', '', '', '', '', ''],
      ['Gerado em:', new Date().toLocaleDateString('pt-BR'), '', '', '', '', '', ''],
      [''],
      ['Nº NF', 'Destinatário', 'CNPJ', 'Valor NF (R$)', 'Dt. Emissão', 'Status', 'Valor Pago (R$)', 'Dt. Pagamento'],
    ]

    for (const n of lista) {
      dados.push([
        n.numero_nf,
        n.destinatario || '',
        n.cnpj_dest || '',
        (parseFloat(n.valor_nf) || 0).toFixed(2).replace('.', ','),
        n.data_emissao || '',
        n.status || '',
        (parseFloat(n.valor_pago) || 0).toFixed(2).replace('.', ','),
        n.data_pagamento || '',
      ])
    }

    const totNF = lista.reduce((s, n) => s + (parseFloat(n.valor_nf) || 0), 0)
    const totPg = lista.reduce((s, n) => s + (parseFloat(n.valor_pago) || 0), 0)
    dados.push([''])
    dados.push(['TOTAL', '', '', totNF.toFixed(2).replace('.', ','), '', '', totPg.toFixed(2).replace('.', ','), ''])

    gerarCSV(dados, `notas_fiscais_${empKey}.csv`)
    showNotif(`✅ Notas ${empNome} exportadas!`)
    setGerando(null)
  }

  const card = { background: '#13161F', border: '1px solid #252836', borderRadius: '14px', overflow: 'hidden', marginBottom: '12px' }
  const st = { fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1.2px', color: '#4A5070', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }

  const btnExport = (onClick: () => void, label: string, sub: string, cor: string, bg: string, loading: boolean) => (
    <div style={card}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#E8EAF0', marginBottom: '4px' }}>{label}</div>
          <div style={{ fontSize: '11px', color: '#7B82A0' }}>{sub}</div>
        </div>
        <button
          onClick={onClick}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 18px', background: bg, border: `1px solid ${cor}44`, borderRadius: '8px', color: cor, fontSize: '12px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
        >
          {loading ? '⏳ Gerando...' : '⬇️ Exportar CSV'}
        </button>
      </div>
    </div>
  )

  if (loading) return <div style={{ padding: '40px', color: '#7B82A0' }}>Carregando...</div>

  const vSixMesAnt = histSix.find(r => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0
  const vEnovaMesAnt = histEnova.find(r => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4A5070', marginBottom: '16px' }}>
        <span>Início</span><span style={{ margin: '0 4px' }}>›</span>
        <span style={{ color: '#7B82A0' }}>Exportar Excel</span>
      </div>

      {/* Notificação */}
      {notif && (
        <div style={{ background: '#0D3326', border: '1px solid rgba(52,211,153,0.3)', borderLeft: '3px solid #34D399', borderRadius: '14px', padding: '12px 16px', marginBottom: '16px', fontSize: '12px', fontWeight: 600, color: '#34D399' }}>
          {notif}
        </div>
      )}

      {/* Preview do mês anterior */}
      <div style={{ background: '#13161F', border: '1px solid #252836', borderLeft: '3px solid #FBBF24', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070', marginBottom: '8px' }}>
          📊 Mês de referência — {mesAntNome}/{anoAnt}
        </div>
        <div style={{ display: 'flex', gap: '32px', fontFamily: 'monospace' }}>
          <div>
            <div style={{ fontSize: '9px', color: '#4F8EF7', fontWeight: 600, marginBottom: '2px' }}>SIX</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#4F8EF7' }}>{fmtR(vSixMesAnt)}</div>
          </div>
          <div>
            <div style={{ fontSize: '9px', color: '#34D399', fontWeight: 600, marginBottom: '2px' }}>ENOVA</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#34D399' }}>{fmtR(vEnovaMesAnt)}</div>
          </div>
          <div>
            <div style={{ fontSize: '9px', color: '#E8EAF0', fontWeight: 600, marginBottom: '2px' }}>TOTAL</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#E8EAF0' }}>{fmtR(vSixMesAnt + vEnovaMesAnt)}</div>
          </div>
        </div>
      </div>

      {/* Relatório do Mês */}
      <div style={st}>
        Relatório Mensal
        <div style={{ flex: 1, height: '1px', background: '#252836' }} />
      </div>
      {btnExport(exportarMesAnterior, `📋 Relatório Saídas SIX e ENOVA — ${mesAntNome}/${anoAnt}`, `Faturamento, DAS e Notas Fiscais de ${mesAntNome}/${anoAnt} · SIX + ENOVA`, '#FBBF24', '#2E1F06', gerando === 'mes')}

      {/* Faturamentos */}
      <div style={{ ...st, marginTop: '20px' }}>
        Faturamento
        <div style={{ flex: 1, height: '1px', background: '#252836' }} />
      </div>
      {btnExport(exportarFaturamentos, '📈 Faturamento Mensal Histórico', `Todos os meses lançados · SIX + ENOVA · ${histSix.length + histEnova.length} registros`, '#4F8EF7', '#1C2E52', gerando === 'fat')}

      {/* DAS */}
      <div style={{ ...st, marginTop: '20px' }}>
        DAS — Simples Nacional
        <div style={{ flex: 1, height: '1px', background: '#252836' }} />
      </div>
      {btnExport(exportarDAS, '💰 DAS Pagamentos Histórico', `Todos os pagamentos confirmados · SIX (${dasSix.length}) + ENOVA (${dasEnova.length}) meses`, '#A78BFA', '#2A1A52', gerando === 'das')}

      {/* Notas Fiscais */}
      <div style={{ ...st, marginTop: '20px' }}>
        Notas Fiscais
        <div style={{ flex: 1, height: '1px', background: '#252836' }} />
      </div>
      {btnExport(() => exportarNotas('six'), '🔵 Notas Fiscais — SIX Comercial', `${notas.six.length} notas registradas`, '#4F8EF7', '#1C2E52', gerando === 'notas_six')}
      {btnExport(() => exportarNotas('enova'), '🟢 Notas Fiscais — ENOVA Comercial', `${notas.enova.length} notas registradas`, '#34D399', '#0D3326', gerando === 'notas_enova')}

      {/* Info formato */}
      <div style={{ background: '#1A1D2A', border: '1px solid #252836', borderRadius: '14px', padding: '14px 20px', marginTop: '8px' }}>
        <div style={{ fontSize: '11px', color: '#4A5070', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>ℹ️</span>
          <span>Os arquivos são gerados no formato <strong style={{ color: '#7B82A0' }}>CSV (separado por ponto e vírgula)</strong> — compatível com Microsoft Excel, Google Sheets e LibreOffice. Abra diretamente ou importe usando <strong style={{ color: '#7B82A0' }}>Dados → De Texto/CSV</strong>.</span>
        </div>
      </div>
    </div>
  )
}
