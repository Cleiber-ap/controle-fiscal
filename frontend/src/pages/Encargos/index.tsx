import { useState, useEffect, useRef, useMemo } from 'react'
import { registrarLog } from '../../api/auditoria'
import { temPermissao } from '../../utils/permissoes'
import ContadorAnimado from '../../components/ContadorAnimado'
import { MESES_FULL as MESES } from '../../utils/meses'
import { fmtR } from '../../utils/formato'
import { calcEncargos, calcCalendario, getFeriadosFixos, getTodosOsFeriados } from '../../utils/encargos'
import { tabelaINSS } from '../../utils/inss'

const API = 'https://diligent-integrity-production-3f98.up.railway.app'
const token = () => localStorage.getItem('access_token')
const hdr = () => ({ 'Authorization': 'Bearer ' + token(), 'Content-Type': 'application/json' })

export default function Encargos() {
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [horas, setHoras] = useState<Record<number, number>>({})
  const [pctHE, setPctHE] = useState<Record<number, number>>({})
  const [faltasAtrasos, setFaltasAtrasos] = useState<Record<number, number>>({})
  const [aba, setAba] = useState<'resumo' | 'funcionarios' | 'feriados' | 'comparativo'>('resumo')
  const [mesRef, setMesRef] = useState(() => { const d = new Date(); return { mes: d.getMonth() + 1, ano: d.getFullYear() } })
  const [diasUteis, setDiasUteis] = useState(22)
  const [domingosFeriados, setDomingosFeriados] = useState(6)
  const [diasSegSab, setDiasSegSab] = useState(25)
  const [diasVT, setDiasVT] = useState(20)
  // Cabecalho: dias uteis do mes corrente e do seguinte. Ficam presos a data de
  // hoje de proposito — nao acompanham o mes que estiver sendo consultado.
  const HOJE = useMemo(() => { const d = new Date(); return { mes: d.getMonth() + 1, ano: d.getFullYear() } }, [])
  const PROX = HOJE.mes === 12 ? { mes: 1, ano: HOJE.ano + 1 } : { mes: HOJE.mes + 1, ano: HOJE.ano }
  const [diasUteisAtual, setDiasUteisAtual] = useState(0)
  const [diasUteisProx, setDiasUteisProx] = useState(0)
  const [editando, setEditando] = useState<any | null>(null)
  const [form, setForm] = useState<any>({})
  const [feriadosCustom, setFeriadosCustom] = useState<any[]>([])
  const [formFeriado, setFormFeriado] = useState({dia:'1',mes:'1',descricao:'',tipo:'nacional'})
  const [editandoFeriado, setEditandoFeriado] = useState<number|null>(null)
  const [salvando, setSalvando] = useState(false)
  const [notif, setNotif] = useState<{ msg: string, ok: boolean } | null>(null)
  const [empresas, setEmpresas] = useState<any[]>([])
  const [salarios, setSalarios] = useState<any[]>([])
  const [fechamento, setFechamento] = useState<any | null>(null)
  const [fechando, setFechando] = useState(false)
  const [fechamentos, setFechamentos] = useState<any[]>([])
  // Intervalo do comparativo. Comeca no ano corrente inteiro; o usuario ajusta.
  const [periodo, setPeriodo] = useState(() => {
    const d = new Date()
    return { deMes: 1, deAno: d.getFullYear(), ateMes: d.getMonth() + 1, ateAno: d.getFullYear() }
  })
  const showNotif = (msg: string, ok = true) => { setNotif({ msg, ok }); setTimeout(() => setNotif(null), 3500) }
  const carregar = async () => {
    const [fs2, hs, frs, fech, sals, emps, fechs] = await Promise.all([
      fetch(API + '/funcionarios/', { headers: hdr() }).then(r => r.json()).catch(() => []),
      fetch(API + `/funcionarios/horas/${mesRef.ano}/${mesRef.mes}`, { headers: hdr() }).then(r => r.json()).catch(() => ({})),
      fetch(API + '/funcionarios/feriados/', { headers: hdr() }).then(r => r.json()).catch(() => []),
      fetch(API + `/funcionarios/fechamento/${mesRef.ano}/${mesRef.mes}`, { headers: hdr() }).then(r => r.json()).catch(() => null),
      fetch(API + '/funcionarios/salarios', { headers: hdr() }).then(r => r.json()).catch(() => []),
      fetch(API + '/empresas/', { headers: hdr() }).then(r => r.json()).catch(() => []),
      fetch(API + '/funcionarios/fechamentos', { headers: hdr() }).then(r => r.json()).catch(() => []),
    ])
    setFechamentos(Array.isArray(fechs) ? fechs : [])
    setEmpresas(Array.isArray(emps) ? emps : [])
    setSalarios(Array.isArray(sals) ? sals : [])
    setFechamento(fech && fech.ano ? fech : null)
    setFuncionarios(Array.isArray(fs2) ? fs2 : [])
    // O endpoint devolvia so a quantidade de horas por funcionario e passou a
    // devolver tambem multiplicador e faltas. Aceitar as duas formas permite
    // publicar o frontend antes do backend sem quebrar a tela.
    const lanc: Record<number, any> = hs && typeof hs === 'object' ? hs : {}
    const h: Record<number, number> = {}
    const mult: Record<number, number> = {}
    const flt: Record<number, number> = {}
    for (const [fid, v] of Object.entries(lanc)) {
      const id = Number(fid)
      if (v !== null && typeof v === 'object') {
        h[id] = (v as any).horas || 0
        mult[id] = (v as any).mult_he ?? 1.5
        flt[id] = (v as any).faltas || 0
      } else {
        h[id] = Number(v) || 0
      }
    }
    // Mes fechado exibe os lancamentos que foram congelados.
    const snap = fech && fech.detalhe && Array.isArray(fech.detalhe.funcionarios) ? fech.detalhe.funcionarios : null
    if (snap) {
      const hS: Record<number, number> = {}, mS: Record<number, number> = {}, fS: Record<number, number> = {}
      for (const x of snap) {
        hS[x.funcionario_id] = x.horas || 0
        mS[x.funcionario_id] = x.mult_he ?? 1.5
        fS[x.funcionario_id] = x.faltas || 0
      }
      setHoras(hS); setPctHE(mS); setFaltasAtrasos(fS)
    } else {
      setHoras(h); setPctHE(mult); setFaltasAtrasos(flt)
    }
    const feriadosLista = Array.isArray(frs) ? frs : []
    setFeriadosCustom(feriadosLista)
    const cal = calcCalendario(mesRef.mes, mesRef.ano, getTodosOsFeriados(mesRef.ano, feriadosLista))
    setDiasUteis(cal.diasUteis)
    setDomingosFeriados(cal.domingosFeriados)
    setDiasSegSab(cal.diasSegSab)
    setDiasVT(cal.diasVT)
    // Independentes do mes consultado.
    setDiasUteisAtual(calcCalendario(HOJE.mes, HOJE.ano, getTodosOsFeriados(HOJE.ano, feriadosLista)).diasUteis)
    setDiasUteisProx(calcCalendario(PROX.mes, PROX.ano, getTodosOsFeriados(PROX.ano, feriadosLista)).diasUteis)
  }
  useEffect(() => { carregar() }, [mesRef])
  /** Grava um lancamento do mes. Campo omitido mantem o valor ja gravado. */
  const salvarLancamento = async (fid: number, campos: Record<string, number>) => {
    try {
      const r = await fetch(API + '/funcionarios/horas', {
        method: 'POST', headers: hdr(),
        body: JSON.stringify({ funcionario_id: fid, ano: mesRef.ano, mes: mesRef.mes, ...campos }),
      })
      if (!r.ok) throw new Error('HTTP ' + r.status)
    } catch (e: any) {
      showNotif('Nao foi possivel gravar o lancamento: ' + (e?.message || 'erro'), false)
    }
  }
  const salvarHoras = async (fid: number, h: number) => {
    setHoras(p => ({ ...p, [fid]: h }))
    await salvarLancamento(fid, { horas: h })
  }
  const salvarMultHE = async (fid: number, m: number) => {
    setPctHE(p => ({ ...p, [fid]: m }))
    await salvarLancamento(fid, { mult_he: m })
  }
  const salvarFaltas = async (fid: number, v: number) => {
    setFaltasAtrasos(p => ({ ...p, [fid]: v }))
    await salvarLancamento(fid, { faltas: v })
  }
  const salvarFuncionario = async () => {
    setSalvando(true)
    try {
      const method = form.id ? 'PUT' : 'POST'
      const url = form.id ? API + '/funcionarios/' + form.id : API + '/funcionarios/'
      const numFields = ['salario_base','vale_alimentacao','salario_dinheiro','empresa_id','vale_transporte_valor','vale_alimentacao_desconto']
      const payload = {...form}
      numFields.forEach(k => { if(payload[k] !== undefined) payload[k] = parseFloat(String(payload[k]).replace(',','.')) || 0 })
      await fetch(url, { method, headers: hdr(), body: JSON.stringify(payload) })
      await registrarLog({ acao: form.id ? 'EDITAR' : 'INCLUIR', modulo: 'encargos', descricao: (form.id ? 'Funcionário atualizado: ' : 'Funcionário criado: ') + form.nome })
      showNotif('Funcionário salvo!')
      setEditando(null); setForm({}); carregar()
    } catch { showNotif('Erro ao salvar', false) }
    setSalvando(false)
  }
  const excluir = async (fid: number, nome: string) => {
    if (!confirm('Desativar ' + nome + '?')) return
    await fetch(API + '/funcionarios/' + fid, { method: 'DELETE', headers: hdr() })
    showNotif(nome + ' desativado'); carregar()
  }
  /**
   * O cadastro guarda so dia e mes, sem ano, entao vale para todos os anos.
   * Cadastrar um feriado movel — que muda de data a cada ano — cria feriado
   * fantasma nos demais. Ja aconteceu: "Sexta feira Santa 18/04" e "Corpus
   * Christi 04/06" tiravam um dia util de abril e junho de 2025.
   *
   * Confere a data digitada contra os moveis dos anos vizinhos e devolve o
   * aviso, ou string vazia.
   */
  const avisoFeriadoMovel = (() => {
    const dia = parseInt(formFeriado.dia), m = parseInt(formFeriado.mes)
    if (!dia || !m) return ''
    const MOVEIS = ['Carnaval (2ª)', 'Carnaval (3ª)', 'Sexta-Feira Santa', 'Corpus Christi']
    const anos: number[] = []
    for (let a = HOJE.ano - 2; a <= HOJE.ano + 2; a++) anos.push(a)
    const coincide = anos.flatMap(a => getFeriadosFixos(a)
      .filter(f => MOVEIS.includes(f.descricao) && f.dia === dia && f.mes === m)
      .map(f => ({ ano: a, nome: f.descricao })))
    if (!coincide.length) return ''
    const nomes = [...new Set(coincide.map(c => c.nome))].join(' / ')
    const anosCoincide = coincide.map(c => c.ano).join(', ')
    const outros = anos.filter(a => !coincide.some(c => c.ano === a))
    return `${dia}/${m} é ${nomes} em ${anosCoincide}, e o sistema já calcula isso sozinho. `
      + `Como o cadastro não guarda o ano, esta data viraria feriado também em ${outros.join(', ')}, `
      + `onde não é — tirando um dia útil do vale-transporte.`
  })()

  const salvarFeriado = async () => {
    if (!formFeriado.descricao.trim()) return
    if (avisoFeriadoMovel && !window.confirm(avisoFeriadoMovel + '\n\nCadastrar mesmo assim?')) return
    const payload = { dia: parseInt(formFeriado.dia), mes: parseInt(formFeriado.mes), descricao: formFeriado.descricao, tipo: formFeriado.tipo }
    if (editandoFeriado) {
      await fetch(API + '/funcionarios/feriados/' + editandoFeriado, { method: 'PUT', headers: hdr(), body: JSON.stringify(payload) })
    } else {
      await fetch(API + '/funcionarios/feriados/', { method: 'POST', headers: hdr(), body: JSON.stringify(payload) })
    }
    setFormFeriado({ dia: '1', mes: '1', descricao: '', tipo: 'nacional' })
    setEditandoFeriado(null)
    showNotif(editandoFeriado ? 'Feriado atualizado!' : 'Feriado salvo!')
    await carregar()
  }
  const excluirFeriado = async (fid: number) => {
    await fetch(API + '/funcionarios/feriados/' + fid, { method: 'DELETE', headers: hdr() })
    showNotif('Feriado removido')
    await carregar()
  }
  const feriadosFixosMes = getFeriadosFixos(mesRef.ano)
    .filter(f => f.mes === mesRef.mes)
    .sort((a, b) => a.dia - b.dia)
  /**
   * Remuneracao que valia para o funcionario no mes consultado: a vigencia mais
   * recente que comecou ate o fim do mes. Sem historico, usa o cadastro atual.
   */
  const remuneracaoNoMes = (f: any) => {
    const fim = `${mesRef.ano}-${String(mesRef.mes).padStart(2, '0')}-31`
    const vig = salarios
      .filter(v => v.funcionario_id === f.id && v.vigencia <= fim)
      .sort((a, b) => a.vigencia < b.vigencia ? -1 : 1)
      .pop()
    return vig ? { ...f, ...vig, id: f.id, nome: f.nome, cargo: vig.cargo || f.cargo } : f
  }

  /** Funcionario estava na empresa no mes de referencia? */
  const estavaNaEmpresa = (f: any) => {
    const inicio = `${mesRef.ano}-${String(mesRef.mes).padStart(2, '0')}-01`
    const fim = `${mesRef.ano}-${String(mesRef.mes).padStart(2, '0')}-31`
    if (f.data_admissao && f.data_admissao > fim) return false   // contratado depois
    if (f.data_demissao && f.data_demissao < inicio) return false // saiu antes
    if (!f.data_admissao && !f.ativo) return false
    return true
  }

  // Mes fechado monta a folha a partir do que foi congelado, nao do cadastro de
  // hoje: quem entrou depois nao pode aparecer, e reajuste posterior nao pode
  // mexer no que ja foi conferido.
  // Mes fechado exibe o que foi congelado, nao o recalculo de agora: reajuste de
  // salario ou mudanca na tabela do INSS nao devem alterar um mes ja conferido.
  const mesFechado = !!fechamento
  const snapshot = mesFechado ? fechamento.detalhe?.funcionarios : null
  const folhaDoMes = snapshot
    ? snapshot.map((x: any) => ({
        id: x.funcionario_id, nome: x.nome,
        cargo: x.cargo || funcionarios.find(f => f.id === x.funcionario_id)?.cargo || '',
        salario_base: x.salario_base, vale_alimentacao: x.vale_alimentacao,
        salario_dinheiro: x.salario_dinheiro, vale_transporte: x.vale_transporte,
        vale_transporte_valor: x.vale_transporte_valor,
      }))
    : funcionarios.filter(estavaNaEmpresa).map(remuneracaoNoMes)

  // Calendario: do snapshot quando fechado, senao o do mes consultado.
  const calDoMes = (snapshot && fechamento.detalhe?.calendario) || { domingosFeriados, diasSegSab, diasVT }

  const calculos = folhaDoMes.map((f: any) => ({
    ...f,
    calc: calcEncargos(f, horas[f.id] || 0, {
      // Valores reais do mes, vindos de calcCalendario. Antes ficavam nos
      // padroes fixos 6/25/20, que em 2026 divergem em 11 dos 12 meses.
      domingosFeriados: calDoMes.domingosFeriados,
      diasSegSab: calDoMes.diasSegSab,
      diasVT: calDoMes.diasVT,
      multHE: pctHE[f.id] || 1.5,
      faltas: faltasAtrasos[f.id] || 0,
      ano: mesRef.ano,
    }),
  }))
  const calcGeral = calculos.reduce((s, f) => s + f.calc.totalEmpresa, 0)
  const calcDeposito = calculos.reduce((s, f) => s + f.calc.ferias13 + f.calc.fgts + f.calc.multaFgts, 0)
  const calcEncargosGeral = calculos.reduce((s, f) => s + f.calc.totalEncargos, 0)
  const calcSalarios = calculos.reduce((s, f) => s + f.calc.sal, 0)

  const totalSalarios = mesFechado ? fechamento.total_salarios : calcSalarios
  const totalEncargosGeral = mesFechado ? fechamento.total_encargos : calcEncargosGeral
  const totalGeral = mesFechado ? fechamento.total_empresa : calcGeral
  const totalDeposito = mesFechado ? fechamento.total_deposito : calcDeposito
  const podeEditar = temPermissao('encargos', 'editar') && !mesFechado

  const irParaMes = (delta: number) => setMesRef(r => {
    const m = r.mes + delta
    if (m < 1) return { mes: 12, ano: r.ano - 1 }
    if (m > 12) return { mes: 1, ano: r.ano + 1 }
    return { mes: m, ano: r.ano }
  })
  const noMesAtual = mesRef.mes === HOJE.mes && mesRef.ano === HOJE.ano

  const fecharMes = async () => {
    if (!window.confirm(`Fechar ${MESES[mesRef.mes - 1]}/${mesRef.ano}? Os totais ficam congelados e os lancamentos travados ate voce reabrir.`)) return
    setFechando(true)
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')
      const r = await fetch(API + '/funcionarios/fechamento', {
        method: 'POST', headers: hdr(),
        body: JSON.stringify({
          ano: mesRef.ano, mes: mesRef.mes,
          total_salarios: calcSalarios, total_encargos: calcEncargosGeral,
          total_empresa: calcGeral, total_deposito: calcDeposito,
          fechado_por: usuario?.nome || usuario?.email || null,
          // Guarda o que produziu esses totais. Assim da para conferir depois se
          // algo mudou sob um mes fechado, comparando dados — sem reimplementar
          // o calculo fora daqui.
          detalhe: {
            inss_vigencia: String(tabelaINSS(mesRef.ano).ano),
            calendario: { diasUteis, diasSegSab, domingosFeriados, diasVT },
            funcionarios: funcionarios.filter(estavaNaEmpresa).map(remuneracaoNoMes).map((f: any) => ({
              funcionario_id: f.id,
              nome: f.nome,
              cargo: f.cargo || '',   // ja e o cargo vigente no mes
              data_admissao: f.data_admissao || null,
              data_demissao: f.data_demissao || null,
              salario_base: parseFloat(f.salario_base) || 0,
              vale_alimentacao: parseFloat(f.vale_alimentacao) || 0,
              salario_dinheiro: parseFloat(f.salario_dinheiro) || 0,
              vale_transporte: !!f.vale_transporte,
              vale_transporte_valor: parseFloat(f.vale_transporte_valor) || 0,
              horas: horas[f.id] || 0,
              mult_he: pctHE[f.id] || 1.5,
              faltas: faltasAtrasos[f.id] || 0,
            })),
          },
        }),
      })
      if (!r.ok) throw new Error('HTTP ' + r.status)
      await registrarLog({ acao: 'CONFIRMAR', modulo: 'encargos', descricao: `Folha fechada: ${MESES[mesRef.mes - 1]}/${mesRef.ano} · custo total ${fmtR(calcGeral)}`, valorDepois: { ano: mesRef.ano, mes: mesRef.mes, total_empresa: calcGeral } })
      showNotif('Mes fechado!')
      await carregar()
    } catch (e: any) {
      showNotif('Nao foi possivel fechar o mes: ' + (e?.message || 'erro'), false)
    }
    setFechando(false)
  }

  const reabrirMes = async () => {
    if (!window.confirm(`Reabrir ${MESES[mesRef.mes - 1]}/${mesRef.ano}? Os totais congelados serao descartados e a tela volta a calcular ao vivo.`)) return
    setFechando(true)
    try {
      const r = await fetch(API + `/funcionarios/fechamento/${mesRef.ano}/${mesRef.mes}`, { method: 'DELETE', headers: hdr() })
      if (!r.ok) throw new Error('HTTP ' + r.status)
      await registrarLog({ acao: 'EDITAR', modulo: 'encargos', descricao: `Folha reaberta: ${MESES[mesRef.mes - 1]}/${mesRef.ano}` })
      showNotif('Mes reaberto para edicao')
      await carregar()
    } catch (e: any) {
      showNotif('Nao foi possivel reabrir o mes: ' + (e?.message || 'erro'), false)
    }
    setFechando(false)
  }
  const st = {
    card: { background: '#13151F', border: '1px solid #252836', borderRadius: 10, padding: 20, marginBottom: 16 } as any,
    label: { fontSize: 11, fontWeight: 600, color: '#7B82A0', textTransform: 'uppercase' as any, letterSpacing: '0.08em', marginBottom: 6 },
    input: { background: '#0E1017', border: '1px solid #2A2D3E', borderRadius: 6, color: '#E8EAF0', padding: '7px 10px', fontSize: 13, width: '100%', outline: 'none' } as any,
    btn: (c = '#4F8EF7') => ({ background: c, color: c === '#1A1D2A' ? '#7B82A0' : '#fff', border: '1px solid ' + (c === '#1A1D2A' ? '#2A2D3E' : c), borderRadius: 6, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }) as any,
    th: { fontSize: 10, fontWeight: 600, color: '#7B82A0', textTransform: 'uppercase' as any, padding: '5px 7px', textAlign: 'left' as any, borderBottom: '1px solid #252836' },
    td: { fontSize: 11, color: '#E8EAF0', padding: '6px 8px', borderBottom: '1px solid #1A1D2A', fontFamily: 'monospace' },
  }
  return (
    <div style={{ padding: '24px 32px', color: '#E8EAF0', maxWidth: 1200 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>⚙️ Encargos Trabalhistas</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#E8EAF0', fontWeight: 600 }}>{MESES[HOJE.mes - 1]} {HOJE.ano}</span>
          <span style={{ fontSize: 12, color: '#7B82A0', marginLeft: 8 }}>Dias Úteis: <b style={{ color: '#E8EAF0' }}>{diasUteisAtual}</b></span>
          <span style={{ fontSize: 12, color: '#7B82A0', marginLeft: 16, borderLeft: '1px solid #252836', paddingLeft: 16 }}>
            {MESES[PROX.mes - 1]} {PROX.ano}
            <span style={{ marginLeft: 6 }}>Dias Úteis: <b style={{ color: '#E8EAF0' }}>{diasUteisProx}</b></span>
          </span>
        </div>
      </div>
      {notif && <div style={{ background: notif.ok ? '#0D3326' : '#2D1B1B', border: '1px solid ' + (notif.ok ? '#34D399' : '#F87171'), borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: notif.ok ? '#34D399' : '#F87171', fontSize: 13 }}>{notif.msg}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: mesFechado ? 'rgba(52,211,153,0.08)' : 'rgba(251,191,36,0.06)', border: '1px solid ' + (mesFechado ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.25)'), borderRadius: 8, padding: '10px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button onClick={() => irParaMes(-1)} title="Mês anterior"
            style={{ background: 'transparent', border: '1px solid #2A2D3E', borderRadius: 6, color: '#7B82A0', cursor: 'pointer', padding: '3px 8px', fontSize: 13, lineHeight: 1 }}>‹</button>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#E8EAF0', minWidth: 108, textAlign: 'center' }}>
            {MESES[mesRef.mes - 1]} {mesRef.ano}
          </span>
          <button onClick={() => irParaMes(1)} title="Próximo mês"
            style={{ background: 'transparent', border: '1px solid #2A2D3E', borderRadius: 6, color: '#7B82A0', cursor: 'pointer', padding: '3px 8px', fontSize: 13, lineHeight: 1 }}>›</button>
          {!noMesAtual && (
            <button onClick={() => setMesRef(HOJE)} title="Voltar ao mês atual"
              style={{ marginLeft: 6, background: 'transparent', border: '1px solid #2A2D3E', borderRadius: 6, color: '#7B82A0', cursor: 'pointer', padding: '3px 10px', fontSize: 11 }}>hoje</button>
          )}
        </div>
        <span style={{ fontSize: 15 }}>{mesFechado ? '🔒' : '✏️'}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: mesFechado ? '#34D399' : '#FBBF24' }}>
            {mesFechado
              ? `${MESES[mesRef.mes - 1]}/${mesRef.ano} fechado — totais congelados`
              : `${MESES[mesRef.mes - 1]}/${mesRef.ano} aberto — os totais mudam conforme voce lanca`}
          </div>
          <div style={{ fontSize: 11, color: '#7B82A0', marginTop: 2 }}>
            {mesFechado
              ? `Fechado${fechamento.fechado_por ? ' por ' + fechamento.fechado_por : ''}${fechamento.fechado_em ? ' em ' + new Date(fechamento.fechado_em).toLocaleString('pt-BR') : ''}. Reabra para editar horas extras ou faltas.`
              : 'Lance as horas extras e faltas do mes; ao terminar, feche para congelar os valores.'}
          </div>
        </div>
        {temPermissao('encargos', 'editar') && (
          <button
            disabled={fechando}
            onClick={mesFechado ? reabrirMes : fecharMes}
            style={{ ...st.btn(mesFechado ? '#1A1D2A' : '#34D399'), whiteSpace: 'nowrap', opacity: fechando ? 0.6 : 1 }}>
            {fechando ? 'Aguarde…' : mesFechado ? '🔓 Reabrir mês' : '🔒 Fechar mês'}
          </button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[{ label: 'Total Salários', valor: totalSalarios, cor: '#4F8EF7' }, { label: 'Total Encargos', valor: totalEncargosGeral, cor: '#FBBF24' }, { label: 'Custo Total Empresa', valor: totalGeral, cor: '#34D399' }, { label: 'Depósito (Fér+13ª+FGTS+Multa)', valor: totalDeposito, cor: '#A78BFA' }].map(c => (
          <div key={c.label} style={{ ...st.card, borderColor: c.cor + '44' }}>
            <div style={st.label}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace' }}><ContadorAnimado valor={c.valor} cor={c.cor} formatador={fmtR} /></div>
            <div style={{ fontSize: 11, color: '#7B82A0', marginTop: 4 }}>{MESES[mesRef.mes - 1]}/{mesRef.ano} — {folhaDoMes.length} funcionário(s)</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['resumo', '📊 Resumo Mensal'], ['comparativo', '📈 Comparativo'], ['funcionarios', '👥 Funcionários'], ['feriados', '📅 Feriados']].map(([k, l]) => (
          <button key={k} style={st.btn(aba === k ? '#4F8EF7' : '#1A1D2A')} onClick={() => setAba(k as any)}>{l as string}</button>
        ))}
      </div>
      {aba === 'resumo' && (
        <div>
          <div style={{...st.card, borderColor:'#4F8EF744', overflowX:'auto'}}>
            <div style={{fontSize:13,fontWeight:700,color:'#4F8EF7',marginBottom:12}}>📋 Encargos</div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr>{['Funcionário','Salário','Fér+13ª','FGTS','Multa40%','VT','VA','Sal.Din','HE(h)','%HE','H.Ext','DSR','Total Enc','%Enc','Custo'].map(h=><th key={h} style={st.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {calculos.map(f=>(
                  <tr key={f.id} onMouseEnter={e=>(e.currentTarget.style.background='#1A1D2A')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                    <td style={st.td}><b>{f.nome.split(' ')[0]}</b></td>
                    <td style={st.td}>{fmtR(f.calc.sal)}</td>
                    <td style={st.td}>{fmtR(f.calc.ferias13)}</td>
                    <td style={st.td}>{fmtR(f.calc.fgts)}</td>
                    <td style={st.td}>{fmtR(f.calc.multaFgts)}</td>
                    <td style={st.td}>{fmtR(f.calc.vtValor)}</td>
                    <td style={st.td}>{fmtR(f.calc.va)}</td>
                    <td style={st.td}>{f.calc.dinheiro>0?fmtR(f.calc.dinheiro):'—'}</td>
                    <td style={{...st.td,padding:'6px 8px'}}>
                      <input type="number" min="0" step="0.5" value={horas[f.id]||0} onChange={e=>podeEditar&&salvarHoras(f.id,+e.target.value)} disabled={!podeEditar} style={{...st.input,width:55,padding:'4px 6px',fontSize:12,textAlign:'center' as any}} />
                    </td>
                    <td style={{...st.td,padding:'6px 8px'}}>
                      <select value={pctHE[f.id]||1.5} onChange={e=>podeEditar&&salvarMultHE(f.id,+e.target.value)} disabled={!podeEditar} style={{...st.input,width:70,padding:'4px 6px',fontSize:11}}>
                        <option value={1.5}>50%</option>
                        <option value={2.0}>100%</option>
                      </select>
                    </td>
                    <td style={st.td}>{f.calc.heValor>0?fmtR(f.calc.heValor):'—'}</td>
                    <td style={st.td}>{f.calc.heDsr>0?fmtR(f.calc.heDsr):'—'}</td>
                    <td style={{...st.td,color:'#FBBF24',fontWeight:700}}>{fmtR(f.calc.totalEncargos)}</td>
                    <td style={{...st.td,color:'#7B82A0'}}>{(f.calc.pctEncargos*100).toFixed(1)}%</td>
                    <td style={{...st.td,color:'#34D399',fontWeight:700}}>{fmtR(f.calc.totalEmpresa)}</td>
                  </tr>
                ))}
                <tr style={{background:'#1A1D2A'}}>
                  <td style={{...st.td,fontWeight:700}}>TOTAL</td>
                  <td style={st.td}>{fmtR(totalSalarios)}</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.ferias13,0))}</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.fgts,0))}</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.multaFgts,0))}</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.vtValor,0))}</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.va,0))}</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.dinheiro,0))}</td>
                  <td style={st.td}>—</td>
                  <td style={st.td}>—</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heDsr,0))}</td>
                  <td style={{...st.td,color:'#FBBF24',fontWeight:700}}>{fmtR(totalEncargosGeral)}</td>
                  <td style={{...st.td,color:'#7B82A0'}}>{totalSalarios>0?(totalEncargosGeral/totalSalarios*100).toFixed(1)+'%':'—'}</td>
                  <td style={{...st.td,color:'#34D399',fontWeight:700}}>{fmtR(totalGeral)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{...st.card, borderColor:'#F8717144'}}>
            <div style={{fontSize:13,fontWeight:700,color:'#F87171',marginBottom:12}}>💸 Descontos</div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr>{['Funcionário','Cargo','INSS','Desc. VT','Faltas/Atr.','Vale 40%','Total Desc.'].map(h=><th key={h} style={st.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {calculos.map(f=>(
                  <tr key={f.id} onMouseEnter={e=>(e.currentTarget.style.background='#1A1D2A')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                    <td style={st.td}><b>{f.nome.split(' ').slice(0,2).join(' ')}</b></td>
                    <td style={{...st.td,color:'#7B82A0',fontSize:11}}>{f.cargo}</td>
                    <td style={{...st.td,color:'#F87171'}}>{fmtR(f.calc.inss)}</td>
                    <td style={{...st.td,color:'#F87171'}}>{f.calc.desVT>0?fmtR(f.calc.desVT):'—'}</td>
                    <td style={{...st.td,padding:'6px 8px'}}>
                      <input type="text" value={faltasAtrasos[f.id]||0}
                        onChange={e=>podeEditar&&setFaltasAtrasos(p=>({...p,[f.id]:parseFloat(e.target.value.replace(",","."))||0}))}
                        onBlur={e=>podeEditar&&salvarFaltas(f.id,parseFloat(e.target.value.replace(",","."))||0)}
                        disabled={!podeEditar}
                        style={{...st.input,width:80,padding:'4px 6px',fontSize:12,textAlign:'center' as any}} />
                    </td>
                    <td style={{...st.td,color:'#F87171'}}>{fmtR(f.calc.vale)}</td>
                    <td style={{...st.td,color:'#F87171',fontWeight:700}}>{fmtR(f.calc.totalDescontos)}</td>
                  </tr>
                ))}
                <tr style={{background:'#1A1D2A'}}>
                  <td style={{...st.td,fontWeight:700}} colSpan={2}>TOTAL</td>
                  <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.inss,0))}</td>
                  <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.desVT,0))}</td>
                  <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.faltas,0))}</td>
                  <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.vale,0))}</td>
                  <td style={{...st.td,color:'#F87171',fontWeight:700}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.totalDescontos,0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      {aba === 'funcionarios' && (
        <div>
          <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}>
            {temPermissao('encargos', 'incluir') && <button style={st.btn('#34D399')} onClick={()=>{setEditando('novo');setForm({empresa_id:1,vale_alimentacao:250,vale_transporte:true,salario_dinheiro:0})}}>+ Novo Funcionário</button>}
          </div>
          {editando && (
            <div style={{...st.card,borderColor:'#4F8EF7',marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>{form.id?'Editar':'Novo'} Funcionário</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}}>
                {[{k:'nome',l:'Nome',t:'text'},{k:'cargo',l:'Cargo',t:'text'},{k:'salario_base',l:'Salário Base (R$)',t:'text'},{k:'vale_alimentacao',l:'Vale Alimentação (R$)',t:'text'},{k:'salario_dinheiro',l:'Sal. em Dinheiro (R$)',t:'text'},{k:'vale_transporte_valor',l:'Valor Unitário VT (R$/dia)',t:'text'},{k:'data_admissao',l:'Admissão',t:'date'},{k:'data_demissao',l:'Demissão (vazio = ativo)',t:'date'},{k:'vigencia',l:'Vigência do reajuste (vazio = mês atual)',t:'date'}].map(({k,l,t})=>(
                  <div key={k}><div style={st.label}>{l}</div><input type={t} value={form[k]||''} onChange={e=>setForm((p:any)=>({...p,[k]:t==='number'?+e.target.value:e.target.value}))} style={st.input}/></div>
                ))}
                <div><div style={st.label}>Empresa</div>
                  <select value={form.empresa_id || ''} onChange={e=>setForm((p:any)=>({...p,empresa_id:+e.target.value}))} style={st.input}>
                    {!form.empresa_id && <option value=''>Selecione…</option>}
                    {empresas.map((emp:any) => <option key={emp.id} value={emp.id}>{emp.nome}</option>)}
                  </select>
                </div>
                <div><div style={st.label}>Vale Transporte</div>
                  <select value={form.vale_transporte?'sim':'nao'} onChange={e=>setForm((p:any)=>({...p,vale_transporte:e.target.value==='sim'}))} style={st.input}>
                    <option value="sim">Sim (desconta 6%)</option><option value="nao">Não</option>
                  </select>
                </div>
              </div>
              <div style={{display:'flex',gap:10}}>
                {temPermissao('encargos', 'editar') && <button style={st.btn('#4F8EF7')} onClick={salvarFuncionario} disabled={salvando}>{salvando?'Salvando...':'💾 Salvar'}</button>}
                <button style={st.btn('#1A1D2A')} onClick={()=>{setEditando(null);setForm({})}}>Cancelar</button>
              </div>
            </div>
          )}
          <div style={st.card}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr>{['Nome','Cargo','Empresa','Salário Base','V.Alimentação','V.Transporte','Sal.Dinheiro','Ações'].map(h=><th key={h} style={st.th}>{h}</th>)}</tr></thead>
              <tbody>
                {funcionarios.map(f=>(
                  <tr key={f.id} onMouseEnter={e=>(e.currentTarget.style.background='#1A1D2A')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                    <td style={st.td}><b>{f.nome}</b></td>
                    <td style={{...st.td,color:'#7B82A0'}}>{f.cargo}</td>
                    <td style={{...st.td,color:f.empresa_id===1?'#4F8EF7':'#34D399'}}>{empresas.find((e:any)=>e.id===f.empresa_id)?.nome || '—'}</td>
                    <td style={st.td}>{fmtR(f.salario_base)}</td>
                    <td style={st.td}>{fmtR(f.vale_alimentacao)}</td>
                    <td style={{...st.td,color:f.vale_transporte?'#34D399':'#7B82A0'}}>{f.vale_transporte?'Sim':'Não'}</td>
                    <td style={st.td}>{f.salario_dinheiro>0?fmtR(f.salario_dinheiro):'—'}</td>
                    <td style={st.td}><div style={{display:'flex',gap:6}}>
                      {temPermissao('encargos', 'editar') && <button style={st.btn('#4F8EF7')} onClick={()=>{setEditando(f.id);setForm({...f})}}>✏️</button>}
                      {temPermissao('encargos', 'apagar') && <button style={st.btn('#F87171')} onClick={()=>excluir(f.id,f.nome)}>🗑️</button>}
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ ...st.card, marginTop: 16, marginBottom: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#A78BFA', marginBottom: 4 }}>💰 Histórico de remuneração</div>
            <div style={{ fontSize: 11, color: '#7B82A0', marginBottom: 12 }}>
              Cada mês é calculado com a vigência que valia nele. Ao editar um funcionário, informe a data em que o novo valor passa a valer.
            </div>
            {salarios.length === 0 ? (
              <div style={{ fontSize: 12, color: '#7B82A0' }}>Nenhuma vigência registrada.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead><tr>
                  {['Funcionário', 'A partir de', 'Cargo', 'Salário', 'V. Alim.', 'Dinheiro', 'VT/dia'].map((h, i) => (
                    <th key={h} style={{ ...st.th, textAlign: i <= 2 ? 'left' as any : 'right' as any }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {[...salarios].sort((a, b) => a.funcionario_id - b.funcionario_id || (a.vigencia < b.vigencia ? -1 : 1)).map(v => {
                    const f = funcionarios.find(x => x.id === v.funcionario_id)
                    return (
                      <tr key={v.id}>
                        <td style={st.td}>{f?.nome || 'id ' + v.funcionario_id}</td>
                        <td style={st.td}>{v.vigencia.split('-').reverse().join('/')}</td>
                        <td style={{ ...st.td, color: '#7B82A0' }}>{v.cargo || '—'}</td>
                        <td style={{ ...st.td, textAlign: 'right' as any }}>{fmtR(v.salario_base)}</td>
                        <td style={{ ...st.td, textAlign: 'right' as any }}>{fmtR(v.vale_alimentacao)}</td>
                        <td style={{ ...st.td, textAlign: 'right' as any }}>{v.salario_dinheiro ? fmtR(v.salario_dinheiro) : '—'}</td>
                        <td style={{ ...st.td, textAlign: 'right' as any }}>{v.vale_transporte ? fmtR(v.vale_transporte_valor) : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      {aba === 'comparativo' && (() => {
        const chave = (ano: number, mes: number) => ano * 12 + mes
        const de = chave(periodo.deAno, periodo.deMes)
        const ate = chave(periodo.ateAno, periodo.ateMes)
        const linhas = fechamentos
          .filter(f => { const k = chave(f.ano, f.mes); return k >= de && k <= ate })
          .sort((a, b) => chave(a.ano, a.mes) - chave(b.ano, b.mes))
        const soma = (c: string) => linhas.reduce((t, l) => t + (l[c] || 0), 0)
        const anos = [...new Set(fechamentos.map(f => f.ano))].sort()
        const selMes = (v: number, set: (n: number) => void) => (
          <select value={v} onChange={e => set(+e.target.value)} style={{ ...st.input, width: 'auto', padding: '5px 8px', fontSize: 12 }}>
            {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
        )
        const selAno = (v: number, set: (n: number) => void) => (
          <select value={v} onChange={e => set(+e.target.value)} style={{ ...st.input, width: 'auto', padding: '5px 8px', fontSize: 12 }}>
            {anos.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        )
        const invertido = de > ate
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16, flexWrap: 'wrap' as const }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>📈 Comparativo mensal</div>
                <div style={{ fontSize: 11, color: '#7B82A0', marginTop: 2 }}>
                  Apenas meses fechados. {fechamentos.length} disponíveis, de {fechamentos.length ? `${MESES[fechamentos[0].mes - 1]}/${fechamentos[0].ano}` : '—'} a {fechamentos.length ? `${MESES[fechamentos[fechamentos.length - 1].mes - 1]}/${fechamentos[fechamentos.length - 1].ano}` : '—'}.
                </div>
              </div>
              <div style={{ ...st.card, padding: '12px 14px', marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
                <span style={{ fontSize: 11, color: '#7B82A0', textTransform: 'uppercase' as const, letterSpacing: '.08em' }}>De</span>
                {selMes(periodo.deMes, n => setPeriodo(p => ({ ...p, deMes: n })))}
                {selAno(periodo.deAno, n => setPeriodo(p => ({ ...p, deAno: n })))}
                <span style={{ fontSize: 11, color: '#7B82A0', textTransform: 'uppercase' as const, letterSpacing: '.08em' }}>até</span>
                {selMes(periodo.ateMes, n => setPeriodo(p => ({ ...p, ateMes: n })))}
                {selAno(periodo.ateAno, n => setPeriodo(p => ({ ...p, ateAno: n })))}
                <button
                  onClick={() => { const p = fechamentos[0], u = fechamentos[fechamentos.length - 1]
                    if (p && u) setPeriodo({ deMes: p.mes, deAno: p.ano, ateMes: u.mes, ateAno: u.ano }) }}
                  style={{ ...st.btn('#1A1D2A'), padding: '5px 12px', fontSize: 11 }}>Tudo</button>
              </div>
            </div>
            {invertido ? (
              <div style={{ ...st.card, color: '#FBBF24', fontSize: 12 }}>
                O mês inicial é posterior ao final. Inverta o intervalo para ver os dados.
              </div>
            ) : linhas.length === 0 ? (
              <div style={{ ...st.card, color: '#7B82A0', fontSize: 12 }}>
                Nenhum mês fechado neste intervalo.
              </div>
            ) : (
              <div style={{ ...st.card, padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead><tr>
                    <th style={{ ...st.th }}>Mês</th>
                    {['Funcionários', 'Total Salários', 'Total Encargos', 'Custo Total Empresa', 'Depósito'].map(h => (
                      <th key={h} style={{ ...st.th, textAlign: 'right' as const }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {linhas.map(l => (
                      <tr key={`${l.ano}-${l.mes}`}>
                        <td style={{ ...st.td, fontFamily: 'inherit' }}>{MESES[l.mes - 1]}/{l.ano}</td>
                        <td style={{ ...st.td, textAlign: 'right' as const }}>{l.funcionarios ?? '—'}</td>
                        <td style={{ ...st.td, textAlign: 'right' as const, color: '#4F8EF7' }}>{fmtR(l.total_salarios)}</td>
                        <td style={{ ...st.td, textAlign: 'right' as const, color: '#FBBF24' }}>{fmtR(l.total_encargos)}</td>
                        <td style={{ ...st.td, textAlign: 'right' as const, color: '#34D399', fontWeight: 700 }}>{fmtR(l.total_empresa)}</td>
                        <td style={{ ...st.td, textAlign: 'right' as const, color: '#A78BFA' }}>{fmtR(l.total_deposito)}</td>
                      </tr>
                    ))}
                    <tr style={{ background: '#1A1D2A' }}>
                      <td style={{ ...st.td, fontFamily: 'inherit', fontWeight: 700 }}>Total ({linhas.length} {linhas.length === 1 ? 'mês' : 'meses'})</td>
                      <td style={{ ...st.td, textAlign: 'right' as const, color: '#7B82A0' }}>—</td>
                      <td style={{ ...st.td, textAlign: 'right' as const, color: '#4F8EF7', fontWeight: 700 }}>{fmtR(soma('total_salarios'))}</td>
                      <td style={{ ...st.td, textAlign: 'right' as const, color: '#FBBF24', fontWeight: 700 }}>{fmtR(soma('total_encargos'))}</td>
                      <td style={{ ...st.td, textAlign: 'right' as const, color: '#34D399', fontWeight: 700 }}>{fmtR(soma('total_empresa'))}</td>
                      <td style={{ ...st.td, textAlign: 'right' as const, color: '#A78BFA', fontWeight: 700 }}>{fmtR(soma('total_deposito'))}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })()}
      {aba === 'feriados' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div style={{background:'#13151F',border:'1px solid #4F8EF744',borderRadius:10,padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:'#4F8EF7',marginBottom:16}}>{editandoFeriado ? '✏️ Editando Feriado' : '➕ Adicionar Feriado'}</div>
            <div style={{display:'grid',gridTemplateColumns:'80px 1fr',gap:10,marginBottom:10}}>
              <div><div style={{fontSize:11,fontWeight:600,color:'#7B82A0',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Dia</div>
                <input type='text' value={formFeriado.dia} onChange={e=>setFormFeriado(p=>({...p,dia:e.target.value}))} style={{background:'#0E1017',border:'1px solid #2A2D3E',borderRadius:6,color:'#E8EAF0',padding:'7px 10px',fontSize:13,width:'100%',outline:'none'}}/></div>
              <div><div style={{fontSize:11,fontWeight:600,color:'#7B82A0',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Mês</div>
                <select value={formFeriado.mes} onChange={e=>setFormFeriado(p=>({...p,mes:e.target.value}))} style={{background:'#0E1017',border:'1px solid #2A2D3E',borderRadius:6,color:'#E8EAF0',padding:'7px 10px',fontSize:13,width:'100%',outline:'none'}}>
                  {['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'].map((m,i)=><option key={i} value={i+1}>{m}</option>)}
                </select></div>
            </div>
            <div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:'#7B82A0',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Descrição</div>
              <input type='text' placeholder='Ex: Aniversário de São Paulo' value={formFeriado.descricao} onChange={e=>setFormFeriado(p=>({...p,descricao:e.target.value}))} style={{background:'#0E1017',border:'1px solid #2A2D3E',borderRadius:6,color:'#E8EAF0',padding:'7px 10px',fontSize:13,width:'100%',outline:'none'}}/>
            </div>
            <div style={{marginBottom:16}}><div style={{fontSize:11,fontWeight:600,color:'#7B82A0',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Tipo</div>
              <select value={formFeriado.tipo} onChange={e=>setFormFeriado(p=>({...p,tipo:e.target.value}))} style={{background:'#0E1017',border:'1px solid #2A2D3E',borderRadius:6,color:'#E8EAF0',padding:'7px 10px',fontSize:13,width:'100%',outline:'none'}}>
                <option value='nacional'>🇧🇷 Nacional</option>
                <option value='estadual'>🗺️ Estadual (SP)</option>
                <option value='municipal'>🏙️ Municipal (São Paulo)</option>
              </select>
            </div>
            {avisoFeriadoMovel && (
              <div style={{display:'flex',gap:8,background:'rgba(251,191,36,0.08)',border:'1px solid rgba(251,191,36,0.35)',borderRadius:8,padding:'10px 12px',marginBottom:12}}>
                <span style={{fontSize:14}}>⚠️</span>
                <span style={{fontSize:11,color:'#FBBF24',lineHeight:1.5}}>{avisoFeriadoMovel}</span>
              </div>
            )}
            <button onClick={salvarFeriado} style={{background:'#4F8EF7',color:'#fff',border:'1px solid #4F8EF7',borderRadius:6,padding:'8px 20px',fontSize:13,fontWeight:600,cursor:'pointer',width:'100%'}}>{editandoFeriado ? '💾 Salvar Alterações' : '💾 Salvar Feriado'}</button>
            <div style={{marginTop:16,padding:'10px 12px',background:'#0E1017',borderRadius:6,border:'1px solid #2A2D3E'}}>
              <div style={{fontSize:11,color:'#7B82A0',lineHeight:1.6}}>ℹ️ Somados aos feriados fixos já incluídos automaticamente (Carnaval, Páscoa, Corpus Christi, etc).</div>
            </div>
          </div>
          <div style={{background:'#13151F',border:'1px solid #252836',borderRadius:10,padding:20}}>
            <div style={{fontSize:13,fontWeight:700,color:'#E8EAF0',marginBottom:16}}>📅 Feriados Cadastrados <span style={{fontSize:11,color:'#7B82A0',fontWeight:400}}>({feriadosFixosMes.length + feriadosCustom.length} no mês, {feriadosCustom.length} personalizados)</span></div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {[...feriadosFixosMes.map((f:any)=>({...f,fixo:true})),...feriadosCustom.map((f:any)=>({...f,fixo:false}))]
                .sort((a:any,b:any)=> a.mes !== b.mes ? a.mes - b.mes : a.dia - b.dia)
                .map((f:any,i:number)=> f.fixo ? (
                <div key={'fx'+i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#0E101780',borderRadius:6,padding:'8px 12px',border:'1px solid #2A2D3E88',opacity:0.85}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:14}}>{f.tipo==='nacional'?'🇧🇷':'🗺️'}</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:'#A0A8C0'}}>{f.descricao}</div>
                      <div style={{fontSize:11,color:'#5A6080'}}>{String(f.dia).padStart(2,'0')}/{String(f.mes).padStart(2,'0')} — <span style={{color:'#5A6080'}}>{f.tipo} — fixo automático</span></div>
                    </div>
                  </div>
                  <span style={{fontSize:10,color:'#5A6080',border:'1px solid #2A2D3E',borderRadius:4,padding:'2px 6px'}}>🔒 fixo</span>
                </div>
              ) : (
                  <div key={f.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#0E1017',borderRadius:6,padding:'8px 12px',border:'1px solid #2A2D3E'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <span style={{fontSize:16}}>{f.tipo==='nacional'?'🇧🇷':f.tipo==='estadual'?'🗺️':'🏙️'}</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:'#E8EAF0'}}>{f.descricao}</div>
                        <div style={{fontSize:11,color:'#7B82A0'}}>{String(f.dia).padStart(2,'0')}/{String(f.mes).padStart(2,'0')} — <span style={{color:f.tipo==='nacional'?'#4F8EF7':f.tipo==='estadual'?'#FBBF24':'#34D399'}}>{f.tipo}</span></div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:4}}><button onClick={()=>{setEditandoFeriado(f.id);setFormFeriado({dia:String(f.dia),mes:String(f.mes),descricao:f.descricao,tipo:f.tipo})}} style={{background:'transparent',border:'none',padding:'4px',fontSize:15,cursor:'pointer'}}>✏️</button><button onClick={()=>excluirFeriado(f.id)} style={{background:'transparent',border:'none',padding:'4px',fontSize:15,cursor:'pointer'}}>🗑️</button></div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}