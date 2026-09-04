import { describe, it, expect } from 'vitest'
import {
  FAIXAS_INSS,
  TETO_INSS,
  calcINSS,
  calcINSSPorDeducao,
} from './inss'

describe('tabela do INSS', () => {
  it('tem as quatro faixas em ordem crescente, sem buraco', () => {
    expect(FAIXAS_INSS).toHaveLength(4)
    for (let i = 1; i < FAIXAS_INSS.length; i++) {
      expect(FAIXAS_INSS[i].ate).toBeGreaterThan(FAIXAS_INSS[i - 1].ate)
      expect(FAIXAS_INSS[i].aliq).toBeGreaterThan(FAIXAS_INSS[i - 1].aliq)
    }
  })

  it('confere com os limites e aliquotas oficiais', () => {
    expect(FAIXAS_INSS.map(f => [f.ate, f.aliq])).toEqual([
      [1621.00, 0.075],
      [2902.84, 0.09],
      [4354.27, 0.12],
      [8475.55, 0.14],
    ])
  })
})

describe('calcINSS — progressivo', () => {
  it('na primeira faixa aplica 7,5% direto', () => {
    expect(calcINSS(1000)).toBeCloseTo(75, 2)
    expect(calcINSS(1621)).toBeCloseTo(121.575, 3)
  })

  it('salario zero nao gera contribuicao', () => {
    expect(calcINSS(0)).toBe(0)
  })

  it('soma faixa a faixa, nao aplica a aliquota cheia sobre o total', () => {
    // 3.500 na 3a faixa: se fosse 12% sobre tudo daria 420
    expect(calcINSS(3500)).toBeCloseTo(308.60, 2)
    expect(calcINSS(3500)).toBeLessThan(3500 * 0.12)
  })

  it('respeita o teto: acima do limite o desconto nao cresce', () => {
    expect(calcINSS(8475.55)).toBeCloseTo(TETO_INSS, 2)
    expect(calcINSS(20000)).toBeCloseTo(TETO_INSS, 2)
    expect(calcINSS(1_000_000)).toBeCloseTo(TETO_INSS, 2)
  })

  it('o teto vale 988,09', () => {
    expect(TETO_INSS).toBeCloseTo(988.09, 2)
  })

  it('cresce de forma monotonica', () => {
    let anterior = -1
    for (let s = 0; s <= 9000; s += 250) {
      const v = calcINSS(s)
      expect(v).toBeGreaterThanOrEqual(anterior)
      anterior = v
    }
  })
})

describe('conferencia cruzada: progressivo x parcela a deduzir', () => {
  // As duas formulas sao equivalentes. Se divergirem, ou os limites ou as
  // parcelas a deduzir foram atualizados pela metade.
  it('bate em toda a extensao da tabela', () => {
    for (let s = 0; s <= 9000; s += 7.13) {
      expect(calcINSS(s)).toBeCloseTo(calcINSSPorDeducao(s), 2)
    }
  })

  it('bate exatamente nos limites de cada faixa', () => {
    for (const f of FAIXAS_INSS) {
      expect(calcINSS(f.ate)).toBeCloseTo(calcINSSPorDeducao(f.ate), 2)
      expect(calcINSS(f.ate - 0.01)).toBeCloseTo(calcINSSPorDeducao(f.ate - 0.01), 2)
    }
  })
})

describe('salarios reais dos funcionarios', () => {
  it.each([
    ['Gabriel', 3500, 308.60],
    ['Henrique', 2500, 200.69],
    ['Kayque', 2400, 191.69],
  ])('%s — salario %d resulta em INSS %f', (_nome, salario, esperado) => {
    expect(calcINSS(salario as number)).toBeCloseTo(esperado as number, 2)
  })
})
