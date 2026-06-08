import { useState, useEffect } from 'react'
import { registrarLog } from '../../api/auditoria'
import { temPermissao } from '../../utils/permissoes'

const API = 'https://diligent-integrity-production-3f98.up.railway.app'
const token = () => localStorage.getItem('access_token')
const hdr = () => ({ 'Authorization': 'Bearer ' + token(), 'Content-Type': 'application/json' })
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const fmtR = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function calcINSS(salario: number): number {
  const faixas = [{ ate: 1412, aliq: 0.075 }, { ate: 2666.68, aliq: 0.09 }, { ate: 4000.03, aliq: 0.12 }, { ate: 7786.02, aliq: 0.14 }]
  let inss = 0, base = 0
  for (const f of faixas) {
    if (salario <= base) break
    const trib = Math.min(salario, f.ate) - base
    inss += trib * f.aliq
    base = f.ate
    if (salario <= f.ate) break
  }
  return inss
}

function calcEncargos(func: any, diasUteis: number, horasExtras: number, domingosFeriados = 6, multHE = 1.5, diasSegSab = 25, diasVT = 20) {
  const sal = parseFloat(func.salario_base) || 0
  const va = parseFloat(func.vale_alimentacao) || 0
  const dinheiro = parseFloat(func.salario_dinheiro) || 0
  const usaVT = func.vale_transporte
  const ferias13 = sal * (2 / 12)
  const fgts = sal * 0.08
  const multaFgts = fgts * 0.40
  const horaValor = sal / 220
  const heValor = horasExtras * horaValor * multHE
  const heDsr = horasExtras > 0 ? (heValor / diasSegSab) * domingosFeriados : 0
  const vtUnitario = usaVT ? (parseFloat(func.vale_transporte_valor) || 0) : 0
  const dsrFator = diasSegSab > 0 ? domingosFeriados / diasSegSab : 0
  const vtDesconto = usaVT ? (sal + heValor) * 0.06 : 0
  const vtValor = usaVT ? Math.max(0, vtUnitario * diasVT * 1.06 - vtDesconto) : 0
  const inss = calcINSS(sal + heValor)
  const faltas = 0
  const vale = sal * 0.40
  const desVT = vtDesconto
  const totalEncargos = ferias13 + fgts + multaFgts + heValor + heDsr + vtValor + va + dinheiro
  const totalDescontos = inss + desVT + faltas + vale
  const salLiquido = sal + heValor + va - totalDescontos + dinheiro
  const totalEmpresa = sal + totalEncargos
  return { sal, ferias13, fgts, multaFgts, heValor, heDsr, vtValor, va, dinheiro, inss, desVT, vale, totalEncargos, totalDescontos, salLiquido, totalEmpresa, pctEncargos: totalEncargos / sal }
}

function calcPascoa(ano: number): Date {
  const a = ano % 19, b = Math.floor(ano/100), cc = ano % 100
  const d = Math.floor(b/4), e = b % 4, ff = Math.floor((b+8)/25)
  const g = Math.floor((b-ff+1)/3), h = (19*a+b-d-g+15) % 30
  const i = Math.floor(cc/4), k = cc % 4, l = (32+2*e+2*i-h-k) % 7
  const m = Math.floor((a+11*h+22*l)/451)
  const mes = Math.floor((h+l-7*m+114)/31)
  const dia = ((h+l-7*m+114) % 31)+1
  return new Date(ano, mes-1, dia)
}

function getTodosOsFeriados(ano: number, custom: any[] = []) {
  const p = calcPascoa(ano)
  const ad = (d:Date,n:number)=>{const r=new Date(d);r.setDate(r.getDate()+n);return r}
  const fixos = [
    {dia:1,mes:1,descricao:'Confraternização Universal',tipo:'nacional'},
    {dia:25,mes:1,descricao:'Aniversário de São Paulo',tipo:'estadual'},
    {dia:21,mes:4,descricao:'Tiradentes',tipo:'nacional'},
    {dia:1,mes:5,descricao:'Dia do Trabalho',tipo:'nacional'},
    {dia:9,mes:7,descricao:'Revolução Constitucionalista',tipo:'estadual'},
    {dia:7,mes:9,descricao:'Independência do Brasil',tipo:'nacional'},
    {dia:12,mes:10,descricao:'Nossa Sra. Aparecida',tipo:'nacional'},
    {dia:2,mes:11,descricao:'Finados',tipo:'nacional'},
    {dia:15,mes:11,descricao:'Proclamação da República',tipo:'nacional'},
    {dia:25,mes:12,descricao:'Natal',tipo:'nacional'},
    {dia:ad(p,-48).getDate(),mes:ad(p,-48).getMonth()+1,descricao:'Carnaval (2ª)',tipo:'nacional'},
    {dia:ad(p,-47).getDate(),mes:ad(p,-47).getMonth()+1,descricao:'Carnaval (3ª)',tipo:'nacional'},
    {dia:ad(p,-2).getDate(),mes:ad(p,-2).getMonth()+1,descricao:'Sexta-Feira Santa',tipo:'nacional'},
    {dia:ad(p,60).getDate(),mes:ad(p,60).getMonth()+1,descricao:'Corpus Christi',tipo:'nacional'},
  ]
  return [...fixos, ...custom]
}

function calcCalendario(mes: number, ano: number, feriadosExtra: Array<{dia: number, mes: number}> = []) {
  const diasMes = new Date(ano, mes, 0).getDate()
  let diasUteis=0, diasSegSab=0, domingosFeriados=0, diasVT=0
  for (let d=1; d<=diasMes; d++) {
    const dt = new Date(ano, mes-1, d)
    const dow = dt.getDay()
    const feriado = feriadosExtra.some(f => f.dia === d && f.mes === mes)
    if (dow === 0) { domingosFeriados++ }
    else if (feriado) { domingosFeriados++ }
    else { diasSegSab++; if (dow >= 1 && dow <= 5) { diasUteis++; diasVT++ } }
  }
  return { diasUteis, diasSegSab, domingosFeriados, diasVT }
}

export default function Encargos() {
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [horas, setHoras] = useState<Record<number, number>>({})
  const [pctHE, setPctHE] = useState<Record<number, number>>({})
  const [faltasAtrasos, setFaltasAtrasos] = useState<Record<number, number>>({})
  const [aba, setAba] = useState<'resumo' | 'funcionarios' | 'feriados'>('resumo')
  const [mesRef, setMesRef] = useState(() => { const d = new Date(); return { mes: d.getMonth() + 1, ano: d.getFullYear() } })
  const [diasUteis, setDiasUteis] = useState(22)
  const [domingosFeriados, setDomingosFeriados] = useState(6)
  const [diasSegSab, setDiasSegSab] = useState(25)
  const [diasVT, setDiasVT] = useState(20)
  const [diasUteisProx, setDiasUteisProx] = useState(0)
  const [editando, setEditando] = useState<any | null>(null)
  const [form, setForm] = useState<any>({})
  const [feriadosCustom, setFeriadosCustom] = useState<any[]>([])
  const [formFeriado, setFormFeriado] = useState({dia:'1',mes:'1',descricao:'',tipo:'nacional'})
  const [editandoFeriado, setEditandoFeriado] = useState<number|null>(null)
  const [salvando, setSalvando] = useState(false)
  const [notif, setNotif] = useState<{ msg: string, ok: boolean } | null>(null)
  const showNotif = (msg: string, ok = true) => { setNotif({ msg, ok }); setTimeout(() => setNotif(null), 3500) }
  const carregar = async () => {
    const [fs2, hs, frs] = await Promise.all([
      fetch(API + '/funcionarios/', { headers: hdr() }).then(r => r.json()).catch(() => []),
      fetch(API + `/funcionarios/horas/${mesRef.ano}/${mesRef.mes}`, { headers: hdr() }).then(r => r.json()).catch(() => ({})),
      fetch(API + '/funcionarios/feriados/', { headers: hdr() }).then(r => r.json()).catch(() => []),
    ])
    setFuncionarios(Array.isArray(fs2) ? fs2 : [])
    setHoras(hs || {})
    const feriadosLista = Array.isArray(frs) ? frs : []
    setFeriadosCustom(feriadosLista)
    const cal = calcCalendario(mesRef.mes, mesRef.ano, getTodosOsFeriados(mesRef.ano, feriadosLista))
    setDiasUteis(cal.diasUteis)
    setDomingosFeriados(cal.domingosFeriados)
    setDiasSegSab(cal.diasSegSab)
    setDiasVT(cal.diasVT)
    const proxMes = mesRef.mes === 12 ? 1 : mesRef.mes + 1
    const proxAno = mesRef.mes === 12 ? mesRef.ano + 1 : mesRef.ano
    const calProx = calcCalendario(proxMes, proxAno, getTodosOsFeriados(proxAno, feriadosLista))
    setDiasUteisProx(calProx.diasUteis)
  }
  useEffect(() => { carregar() }, [mesRef])
  const salvarHoras = async (fid: number, h: number) => {
    setHoras(p => ({ ...p, [fid]: h }))
    await fetch(API + '/funcionarios/horas', { method: 'POST', headers: hdr(), body: JSON.stringify({ funcionario_id: fid, ano: mesRef.ano, mes: mesRef.mes, horas: h }) })
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
  const salvarFeriado = async () => {
    if (!formFeriado.descricao.trim()) return
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
  const _pasc = calcPascoa(mesRef.ano)
  const _add = (d:Date,n:number)=>{const r=new Date(d);r.setDate(r.getDate()+n);return r}
  const feriadosFixosMes = [
    {dia:1,mes:1,descricao:'Confraternização Universal',tipo:'nacional'},
    {dia:25,mes:1,descricao:'Aniversário de São Paulo',tipo:'estadual'},
    {dia:21,mes:4,descricao:'Tiradentes',tipo:'nacional'},
    {dia:1,mes:5,descricao:'Dia do Trabalho',tipo:'nacional'},
    {dia:9,mes:7,descricao:'Revolução Constitucionalista',tipo:'estadual'},
    {dia:7,mes:9,descricao:'Independência do Brasil',tipo:'nacional'},
    {dia:12,mes:10,descricao:'Nossa Sra. Aparecida',tipo:'nacional'},
    {dia:2,mes:11,descricao:'Finados',tipo:'nacional'},
    {dia:15,mes:11,descricao:'Proclamação da República',tipo:'nacional'},
    {dia:25,mes:12,descricao:'Natal',tipo:'nacional'},
    {dia:_add(_pasc,-48).getDate(),mes:_add(_pasc,-48).getMonth()+1,descricao:'Carnaval (2ª)',tipo:'nacional'},
    {dia:_add(_pasc,-47).getDate(),mes:_add(_pasc,-47).getMonth()+1,descricao:'Carnaval (3ª)',tipo:'nacional'},
    {dia:_add(_pasc,-2).getDate(),mes:_add(_pasc,-2).getMonth()+1,descricao:'Sexta-Feira Santa',tipo:'nacional'},
    {dia:_add(_pasc,60).getDate(),mes:_add(_pasc,60).getMonth()+1,descricao:'Corpus Christi',tipo:'nacional'},
  ].filter((f:any)=>f.mes===mesRef.mes).sort((a:any,b:any)=>a.dia-b.dia)
  const calculos = funcionarios.map(f => ({ ...f, calc: calcEncargos(f, diasUteis, horas[f.id] || 0) }))
  const totalGeral = calculos.reduce((s, f) => s + f.calc.totalEmpresa, 0)
  const totalDeposito = calculos.reduce((s, f) => s + f.calc.ferias13 + f.calc.fgts + f.calc.multaFgts, 0)
  const totalEncargosGeral = calculos.reduce((s, f) => s + f.calc.totalEncargos, 0)
  const totalSalarios = calculos.reduce((s, f) => s + f.calc.sal, 0)
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
          <span style={{ fontSize: 13, color: '#E8EAF0', fontWeight: 600 }}>{MESES[mesRef.mes - 1]} {mesRef.ano}</span>
          <span style={{ fontSize: 12, color: '#7B82A0', marginLeft: 8 }}>Dias Úteis: <b style={{ color: '#E8EAF0' }}>{diasUteis}</b></span>
          <span style={{ fontSize: 12, color: '#7B82A0', marginLeft: 16, borderLeft: '1px solid #252836', paddingLeft: 16 }}>
            {MESES[(mesRef.mes === 12 ? 0 : mesRef.mes)]} {mesRef.mes === 12 ? mesRef.ano + 1 : mesRef.ano}
            <span style={{ marginLeft: 6 }}>Dias Úteis: <b style={{ color: '#E8EAF0' }}>{diasUteisProx}</b></span>
          </span>
        </div>
      </div>
      {notif && <div style={{ background: notif.ok ? '#0D3326' : '#2D1B1B', border: '1px solid ' + (notif.ok ? '#34D399' : '#F87171'), borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: notif.ok ? '#34D399' : '#F87171', fontSize: 13 }}>{notif.msg}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[{ label: 'Total Salários', valor: totalSalarios, cor: '#4F8EF7' }, { label: 'Total Encargos', valor: totalEncargosGeral, cor: '#FBBF24' }, { label: 'Custo Total Empresa', valor: totalGeral, cor: '#34D399' }, { label: 'Depósito (Fér+13ª+FGTS+Multa)', valor: totalDeposito, cor: '#A78BFA' }].map(c => (
          <div key={c.label} style={{ ...st.card, borderColor: c.cor + '44' }}>
            <div style={st.label}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.cor, fontFamily: 'monospace' }}>{fmtR(c.valor)}</div>
            <div style={{ fontSize: 11, color: '#7B82A0', marginTop: 4 }}>{MESES[mesRef.mes - 1]}/{mesRef.ano} — {funcionarios.length} funcionário(s)</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['resumo', '📊 Resumo Mensal'], ['funcionarios', '👥 Funcionários'], ['feriados', '📅 Feriados']].map(([k, l]) => (
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
                      <input type="number" min="0" step="0.5" value={horas[f.id]||0} onChange={e=>salvarHoras(f.id,+e.target.value)} style={{...st.input,width:55,padding:'4px 6px',fontSize:12,textAlign:'center' as any}} />
                    </td>
                    <td style={{...st.td,padding:'6px 8px'}}>
                      <select value={pctHE[f.id]||1.5} onChange={e=>setPctHE(p=>({...p,[f.id]:+e.target.value}))} style={{...st.input,width:70,padding:'4px 6px',fontSize:11}}>
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
                        onChange={e=>setFaltasAtrasos(p=>({...p,[f.id]:parseFloat(e.target.value.replace(",","."))||0}))}
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
                  <td style={{...st.td,color:'#F87171'}}>{fmtR(Object.values(faltasAtrasos).reduce((s,v)=>s+v,0))}</td>
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
                {[{k:'nome',l:'Nome',t:'text'},{k:'cargo',l:'Cargo',t:'text'},{k:'salario_base',l:'Salário Base (R$)',t:'text'},{k:'vale_alimentacao',l:'Vale Alimentação (R$)',t:'text'},{k:'salario_dinheiro',l:'Sal. em Dinheiro (R$)',t:'text'},{k:'empresa_id',l:'Empresa (1=SIX, 2=ENOVA)',t:'text'},{k:'vale_transporte_valor',l:'Valor Unitário VT (R$/dia)',t:'text'}].map(({k,l,t})=>(
                  <div key={k}><div style={st.label}>{l}</div><input type={t} value={form[k]||''} onChange={e=>setForm((p:any)=>({...p,[k]:t==='number'?+e.target.value:e.target.value}))} style={st.input}/></div>
                ))}
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
                    <td style={{...st.td,color:f.empresa_id===1?'#4F8EF7':'#34D399'}}>{f.empresa_id===1?'SIX':'ENOVA'}</td>
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
        </div>
      )}
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