import { describe, it, expect } from 'vitest'
import { calcEncargos, calcCalendario, getFeriadosFixos, getTodosOsFeriados } from './encargos'
import { calcINSS } from './inss'

/** Funcionario com vale-transporte, espelhando o cadastro real do Henrique. */
const COM_VT = {
  salario_base: 2500,
  vale_alimentacao: 250,
  salario_dinheiro: 0,
  vale_transporte: true,
  vale_transporte_valor: 12.2,
}

/** Sem vale-transporte, com parte do pagamento em dinheiro (caso do Gabriel). */
const SEM_VT = {
  salario_base: 3500,
  vale_alimentacao: 250,
  salario_dinheiro: 562,
  vale_transporte: false,
  vale_transporte_valor: 0,
}

/** Setembro/2026: 21 dias uteis, 25 seg-sab, 5 domingos/feriados. */
const SET26 = { domingosFeriados: 5, diasSegSab: 25, diasVT: 21 }

describe('calcEncargos — provisoes da empresa', () => {
  it('provisiona ferias e 13o como 2/12 do salario', () => {
    expect(calcEncargos(COM_VT, 0).ferias13).toBeCloseTo(2500 * 2 / 12, 2)
  })

  it('FGTS e 8% e a multa rescisoria 40% do FGTS', () => {
    const c = calcEncargos(COM_VT, 0)
    expect(c.fgts).toBeCloseTo(200, 2)
    expect(c.multaFgts).toBeCloseTo(80, 2)
  })

  it('custo total da empresa e salario mais todos os encargos', () => {
    const c = calcEncargos(COM_VT, 0)
    expect(c.totalEmpresa).toBeCloseTo(c.sal + c.totalEncargos, 2)
  })
})

describe('calcEncargos — horas extras', () => {
  it('sem horas extras nao gera valor nem DSR', () => {
    const c = calcEncargos(COM_VT, 0)
    expect(c.heValor).toBe(0)
    expect(c.heDsr).toBe(0)
  })

  it('hora extra vale salario/220 vezes o multiplicador', () => {
    expect(calcEncargos(COM_VT, 10).heValor).toBeCloseTo(10 * (2500 / 220) * 1.5, 2)
  })

  it('respeita o multiplicador escolhido na tela', () => {
    const c50 = calcEncargos(COM_VT, 10, { multHE: 1.5 })
    const c100 = calcEncargos(COM_VT, 10, { multHE: 2.0 })
    expect(c100.heValor / c50.heValor).toBeCloseTo(2 / 1.5, 6)
  })

  it('DSR usa os domingos e dias seg-sab do mes informado', () => {
    const c = calcEncargos(COM_VT, 10, SET26)
    expect(c.heDsr).toBeCloseTo((c.heValor / 25) * 5, 2)
  })

  it('DSR muda quando o calendario do mes muda', () => {
    const set = calcEncargos(COM_VT, 10, SET26)
    const fev = calcEncargos(COM_VT, 10, { domingosFeriados: 6, diasSegSab: 22, diasVT: 18 })
    expect(fev.heDsr).toBeGreaterThan(set.heDsr)
  })
})

describe('calcEncargos — INSS', () => {
  it('a base inclui as horas extras e o DSR reflexo', () => {
    const c = calcEncargos(COM_VT, 10, SET26)
    expect(c.inss).toBeCloseTo(calcINSS(c.sal + c.heValor + c.heDsr), 2)
  })

  it('sem horas extras a base e so o salario', () => {
    expect(calcEncargos(COM_VT, 0).inss).toBeCloseTo(calcINSS(2500), 2)
  })

  it('o pagamento em dinheiro nao entra na base', () => {
    // Decisao do usuario: salario_dinheiro fica fora do salario de contribuicao.
    expect(calcEncargos(SEM_VT, 0).inss).toBeCloseTo(calcINSS(3500), 2)
  })
})

describe('calcEncargos — vale-transporte', () => {
  it('quem nao usa VT nao tem valor nem desconto', () => {
    const c = calcEncargos(SEM_VT, 0)
    expect(c.vtValor).toBe(0)
    expect(c.desVT).toBe(0)
  })

  it('usa os dias de VT do mes informado', () => {
    const c21 = calcEncargos(COM_VT, 0, SET26)
    const c18 = calcEncargos(COM_VT, 0, { domingosFeriados: 6, diasSegSab: 22, diasVT: 18 })
    expect(c21.vtValor).toBeGreaterThan(c18.vtValor)
    expect(c21.vtValor - c18.vtValor).toBeCloseTo(12.2 * 3 * 1.06, 2)
  })

  it('desconta 6% do salario e nunca fica negativo', () => {
    expect(calcEncargos(COM_VT, 0, SET26).desVT).toBeCloseTo(2500 * 0.06, 2)
    // salario alto com VT barato: o desconto superaria o beneficio
    const caro = calcEncargos({ ...COM_VT, salario_base: 8000 }, 0, SET26)
    expect(caro.vtValor).toBe(0)
  })
})

describe('calcEncargos — descontos e liquido', () => {
  it('faltas entram no total de descontos', () => {
    const sem = calcEncargos(COM_VT, 0, SET26)
    const com = calcEncargos(COM_VT, 0, { ...SET26, faltas: 200 })
    expect(com.totalDescontos - sem.totalDescontos).toBeCloseTo(200, 2)
    expect(sem.salLiquido - com.salLiquido).toBeCloseTo(200, 2)
  })

  it('o liquido inclui o DSR das horas extras', () => {
    const c = calcEncargos(COM_VT, 10, SET26)
    expect(c.salLiquido).toBeCloseTo(
      c.sal + c.heValor + c.heDsr + c.va - c.totalDescontos + c.dinheiro, 2)
  })

  it('o adiantamento e 40% do salario', () => {
    expect(calcEncargos(COM_VT, 0).vale).toBeCloseTo(1000, 2)
  })
})

describe('calcCalendario', () => {
  it('separa os dias do mes sem sobra nem falta', () => {
    for (let mes = 1; mes <= 12; mes++) {
      const c = calcCalendario(mes, 2026, getFeriadosFixos(2026))
      const diasNoMes = new Date(2026, mes, 0).getDate()
      expect(c.diasSegSab + c.domingosFeriados).toBe(diasNoMes)
      expect(c.diasUteis).toBeLessThanOrEqual(c.diasSegSab)
    }
  })

  it('fevereiro/2026 tem 18 dias uteis e setembro tem 21', () => {
    expect(calcCalendario(2, 2026, getFeriadosFixos(2026)).diasUteis).toBe(18)
    expect(calcCalendario(9, 2026, getFeriadosFixos(2026)).diasUteis).toBe(21)
  })

  it('feriado cadastrado manualmente reduz os dias uteis', () => {
    const base = calcCalendario(9, 2026, getFeriadosFixos(2026))
    // 15/09/2026 e uma terca-feira
    const comExtra = calcCalendario(9, 2026, getTodosOsFeriados(2026, [{ dia: 15, mes: 9 }]))
    expect(comExtra.diasUteis).toBe(base.diasUteis - 1)
    expect(comExtra.domingosFeriados).toBe(base.domingosFeriados + 1)
  })
})

describe('getFeriadosFixos', () => {
  it('traz os 14 feriados do ano', () => {
    expect(getFeriadosFixos(2026)).toHaveLength(14)
  })

  it('inclui as datas fixas conhecidas', () => {
    const f = getFeriadosFixos(2026)
    expect(f).toContainEqual({ dia: 25, mes: 12, descricao: 'Natal', tipo: 'nacional' })
    expect(f).toContainEqual({ dia: 7, mes: 9, descricao: 'Independência do Brasil', tipo: 'nacional' })
  })

  it('calcula as moveis a partir da Pascoa', () => {
    // Pascoa 2026: 05/04. Sexta-feira Santa em 03/04, Corpus Christi em 04/06.
    const f = getFeriadosFixos(2026)
    expect(f.find(x => x.descricao === 'Sexta-Feira Santa')).toMatchObject({ dia: 3, mes: 4 })
    expect(f.find(x => x.descricao === 'Corpus Christi')).toMatchObject({ dia: 4, mes: 6 })
  })

  it('as moveis acompanham o ano', () => {
    const a = getFeriadosFixos(2026).find(x => x.descricao === 'Carnaval (3ª)')
    const b = getFeriadosFixos(2027).find(x => x.descricao === 'Carnaval (3ª)')
    expect([a!.dia, a!.mes]).not.toEqual([b!.dia, b!.mes])
  })

  it('getTodosOsFeriados acrescenta os cadastrados manualmente', () => {
    const extra = { dia: 20, mes: 11, descricao: 'Consciência Negra', tipo: 'municipal' }
    expect(getTodosOsFeriados(2026, [extra])).toHaveLength(15)
    expect(getTodosOsFeriados(2026, [extra])).toContainEqual(extra)
  })
})
