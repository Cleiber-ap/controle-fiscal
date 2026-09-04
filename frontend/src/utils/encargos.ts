/**
 * Encargos trabalhistas e calendario do mes — logica pura, sem tela.
 *
 * Estava dentro da pagina de Encargos, onde nao dava para testar. Foram seis
 * correcoes aqui em um unico dia, quatro delas mexendo em valores de folha —
 * por isso virou modulo isolado, coberto por testes.
 */
import { calcINSS } from './inss'

/**
 * Parametros do calculo. Eram posicionais, e por isso quatro deles ficavam nos
 * valores padrao sem ninguem notar — inclusive o multiplicador de hora extra,
 * que a tela deixa escolher. Nomeados, fica visivel no call site o que e
 * informado e o que cai no padrao.
 */
export interface OpcoesEncargos {
  /** Domingos e feriados do mes. */
  domingosFeriados?: number
  /** Multiplicador da hora extra: 1.5 = 50%, 2.0 = 100%. */
  multHE?: number
  /** Dias de segunda a sabado do mes. */
  diasSegSab?: number
  /** Dias com direito a vale-transporte. */
  diasVT?: number
  /** Desconto de faltas e atrasos, em reais. */
  faltas?: number
}

export function calcEncargos(func: any, horasExtras: number, opcoes: OpcoesEncargos = {}) {
  const {
    domingosFeriados = 6,
    multHE = 1.5,
    diasSegSab = 25,
    diasVT = 20,
    faltas = 0,
  } = opcoes
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
  const vtDesconto = usaVT ? (sal + heValor) * 0.06 : 0
  const vtValor = usaVT ? Math.max(0, vtUnitario * diasVT * 1.06 - vtDesconto) : 0
  // O DSR reflexo das horas extras integra o salario de contribuicao, junto com
  // as proprias horas extras.
  const inss = calcINSS(sal + heValor + heDsr)
  const vale = sal * 0.40
  const desVT = vtDesconto
  const totalEncargos = ferias13 + fgts + multaFgts + heValor + heDsr + vtValor + va + dinheiro
  const totalDescontos = inss + desVT + faltas + vale
  // O DSR reflexo das HE e pago ao funcionario, entao entra no liquido — antes
  // aparecia so no custo da empresa, e passaria a ser tributado sem ser pago.
  const salLiquido = sal + heValor + heDsr + va - totalDescontos + dinheiro
  const totalEmpresa = sal + totalEncargos
  return { sal, ferias13, fgts, multaFgts, heValor, heDsr, vtValor, va, dinheiro, inss, desVT, faltas, vale, totalEncargos, totalDescontos, salLiquido, totalEmpresa, pctEncargos: totalEncargos / sal }
}

export function calcPascoa(ano: number): Date {
  const a = ano % 19, b = Math.floor(ano/100), cc = ano % 100
  const d = Math.floor(b/4), e = b % 4, ff = Math.floor((b+8)/25)
  const g = Math.floor((b-ff+1)/3), h = (19*a+b-d-g+15) % 30
  const i = Math.floor(cc/4), k = cc % 4, l = (32+2*e+2*i-h-k) % 7
  const m = Math.floor((a+11*h+22*l)/451)
  const mes = Math.floor((h+l-7*m+114)/31)
  const dia = ((h+l-7*m+114) % 31)+1
  return new Date(ano, mes-1, dia)
}

/**
 * Feriados nacionais e estaduais do ano — fonte unica.
 *
 * Esta lista existia duplicada: uma copia aqui, para o calculo do calendario, e
 * outra dentro do componente, para exibir os feriados do mes. Acrescentar um
 * feriado num lugar e esquecer do outro faria a tela e o calculo discordarem.
 */
export function getFeriadosFixos(ano: number) {
  const p = calcPascoa(ano)
  const ad = (d:Date,n:number)=>{const r=new Date(d);r.setDate(r.getDate()+n);return r}
  return [
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
}

/** Feriados fixos do ano mais os cadastrados manualmente. */
export function getTodosOsFeriados(ano: number, custom: any[] = []) {
  return [...getFeriadosFixos(ano), ...custom]
}

export function calcCalendario(mes: number, ano: number, feriadosExtra: Array<{dia: number, mes: number}> = []) {
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
