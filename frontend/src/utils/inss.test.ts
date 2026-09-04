import { describe, it, expect } from 'vitest'
import {
  TABELAS_INSS,
  VIGENCIA_INSS,
  faixasINSS,
  tabelaINSS,
  tetoINSS,
  calcINSS,
  calcINSSPorDeducao,
} from './inss'

describe('tabelas do INSS', () => {
  it('tem uma tabela por ano, em ordem crescente', () => {
    for (let i = 1; i < TABELAS_INSS.length; i++) {
      expect(TABELAS_INSS[i].ano).toBeGreaterThan(TABELAS_INSS[i - 1].ano)
    }
  })

  it.each(TABELAS_INSS.map(t => [t.ano]))('%d: quatro faixas crescentes, sem buraco', (ano) => {
    const faixas = faixasINSS(ano as number)
    expect(faixas).toHaveLength(4)
    for (let i = 1; i < faixas.length; i++) {
      expect(faixas[i].ate).toBeGreaterThan(faixas[i - 1].ate)
      expect(faixas[i].aliq).toBeGreaterThan(faixas[i - 1].aliq)
    }
  })

  it('confere os limites oficiais de cada ano', () => {
    expect(faixasINSS(2024).map(f => f.ate)).toEqual([1412.00, 2666.68, 4000.03, 7786.02])
    expect(faixasINSS(2025).map(f => f.ate)).toEqual([1518.00, 2793.88, 4190.83, 8157.41])
    expect(faixasINSS(2026).map(f => f.ate)).toEqual([1621.00, 2902.84, 4354.27, 8475.55])
  })

  it('VIGENCIA_INSS acompanha a tabela mais recente', () => {
    expect(VIGENCIA_INSS).toBe(String(TABELAS_INSS[TABELAS_INSS.length - 1].ano))
  })
})

describe('tabelaINSS — escolha por ano', () => {
  it('usa a tabela do proprio ano', () => {
    expect(tabelaINSS(2024).ano).toBe(2024)
    expect(tabelaINSS(2025).ano).toBe(2025)
    expect(tabelaINSS(2026).ano).toBe(2026)
  })

  it('ano sem tabela propria usa a ultima anterior', () => {
    expect(tabelaINSS(2027).ano).toBe(2026)
  })

  it('antes da primeira tabela usa a mais antiga', () => {
    expect(tabelaINSS(2020).ano).toBe(2024)
  })
})

describe('calcINSS — progressivo', () => {
  it('na primeira faixa aplica 7,5% direto', () => {
    expect(calcINSS(1000, 2024)).toBeCloseTo(75, 2)
    expect(calcINSS(1412, 2024)).toBeCloseTo(105.90, 2)
    expect(calcINSS(1518, 2025)).toBeCloseTo(113.85, 2)
  })

  it('salario zero nao gera contribuicao', () => {
    for (const t of TABELAS_INSS) expect(calcINSS(0, t.ano)).toBe(0)
  })

  it('soma faixa a faixa, nao a aliquota cheia sobre o total', () => {
    expect(calcINSS(3500, 2026)).toBeCloseTo(308.60, 2)
    expect(calcINSS(3500, 2026)).toBeLessThan(3500 * 0.12)
  })

  it('o mesmo salario paga menos a cada ano, porque as faixas sobem', () => {
    const s = 3000
    expect(calcINSS(s, 2024)).toBeGreaterThan(calcINSS(s, 2025))
    expect(calcINSS(s, 2025)).toBeGreaterThan(calcINSS(s, 2026))
  })

  it('respeita o teto de cada ano', () => {
    for (const t of TABELAS_INSS) {
      expect(calcINSS(1_000_000, t.ano)).toBeCloseTo(tetoINSS(t.ano), 2)
    }
  })

  it('os tetos sao 908,86 / 951,63 / 988,09', () => {
    expect(tetoINSS(2024)).toBeCloseTo(908.86, 2)
    expect(tetoINSS(2025)).toBeCloseTo(951.63, 2)
    expect(tetoINSS(2026)).toBeCloseTo(988.09, 2)
  })

  it('cresce de forma monotonica em todos os anos', () => {
    for (const t of TABELAS_INSS) {
      let anterior = -1
      for (let s = 0; s <= 9000; s += 250) {
        const v = calcINSS(s, t.ano)
        expect(v).toBeGreaterThanOrEqual(anterior)
        anterior = v
      }
    }
  })
})

describe('conferencia cruzada: progressivo x parcela a deduzir', () => {
  // As duas formulas sao equivalentes. Divergir significa que os limites ou as
  // parcelas foram atualizados pela metade.
  it.each(TABELAS_INSS.map(t => [t.ano]))('%d bate em toda a extensao da tabela', (ano) => {
    for (let s = 0; s <= 9000; s += 7.13) {
      expect(calcINSS(s, ano as number)).toBeCloseTo(calcINSSPorDeducao(s, ano as number), 2)
    }
  })

  it.each(TABELAS_INSS.map(t => [t.ano]))('%d bate nos limites de cada faixa', (ano) => {
    for (const f of faixasINSS(ano as number)) {
      expect(calcINSS(f.ate, ano as number)).toBeCloseTo(calcINSSPorDeducao(f.ate, ano as number), 2)
      expect(calcINSS(f.ate - 0.01, ano as number)).toBeCloseTo(calcINSSPorDeducao(f.ate - 0.01, ano as number), 2)
    }
  })
})

describe('salarios reais dos funcionarios', () => {
  it.each([
    ['Gabriel em 2024', 1950, 2024, 154.32],
    ['Gabriel em 2025', 2810, 2025, 230.61],
    ['Gabriel em 2026', 3500, 2026, 308.60],
    ['Henrique em 2025', 2100, 2025, 166.23],
    ['Henrique em 2026', 2500, 2026, 200.69],
  ])('%s', (_nome, salario, ano, esperado) => {
    expect(calcINSS(salario as number, ano as number)).toBeCloseTo(esperado as number, 2)
  })
})
