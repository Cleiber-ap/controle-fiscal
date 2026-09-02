import { describe, it, expect } from 'vitest'
import {
  FAIXAS_SIMPLES,
  faixaDoRbt12,
  calcRbt12,
  aliquotaEfetiva,
  icmsAproveitavel,
  type LinhaHistorico,
} from './simples'

/** Referencia fixa: 02/09/2026. Janela do RBT12 = ago/2025 .. jul/2026. */
const REF = new Date(2026, 8, 2)

const mes = (ano: number, m: number, valor: number): LinhaHistorico => ({ ano, mes: m, valor })

/** Historico real da SIX conferido em producao em 02/09/2026. */
const HIST_SIX: LinhaHistorico[] = [
  mes(2025, 8, 81396.0),
  mes(2025, 9, 371944.9),
  mes(2025, 10, 61071.06),
  mes(2025, 11, 92950.22),
  mes(2025, 12, 61383.71),
  mes(2026, 1, 30984.3),
  mes(2026, 2, 15691.0),
  mes(2026, 3, 17367.0),
  mes(2026, 4, 109280.3),
  mes(2026, 5, 194981.0),
  mes(2026, 6, 112517.7),
  mes(2026, 7, 129763.65),
]

describe('calcRbt12 — janela de 12 meses', () => {
  it('inclui o mes mais antigo da janela (ago/2025)', () => {
    expect(calcRbt12([mes(2025, 8, 100)], [], REF)).toBe(100)
  })

  it('inclui o mes mais recente da janela (jul/2026)', () => {
    expect(calcRbt12([mes(2026, 7, 100)], [], REF)).toBe(100)
  })

  it('exclui o mes anterior ao atual (ago/2026), que ainda nao entrou', () => {
    expect(calcRbt12([mes(2026, 8, 100)], [], REF)).toBe(0)
  })

  it('exclui o mes atual (set/2026)', () => {
    expect(calcRbt12([mes(2026, 9, 100)], [], REF)).toBe(0)
  })

  it('exclui o mes imediatamente anterior a janela (jul/2025)', () => {
    expect(calcRbt12([mes(2025, 7, 100)], [], REF)).toBe(0)
  })

  it('soma exatamente 12 meses', () => {
    const todos = Array.from({ length: 24 }, (_, i) => {
      const d = new Date(2026, 8 - i, 1)
      return mes(d.getFullYear(), d.getMonth() + 1, 10)
    })
    expect(calcRbt12(todos, [], REF)).toBe(120)
  })

  it('trata mes ausente como zero, sem interromper a soma', () => {
    expect(calcRbt12([mes(2025, 8, 100), mes(2026, 7, 50)], [], REF)).toBe(150)
  })

  it('atravessa a virada de ano corretamente', () => {
    const ref = new Date(2026, 0, 15) // janeiro/2026 -> janela dez/2024..nov/2025
    expect(calcRbt12([mes(2024, 12, 7)], [], ref)).toBe(7)  // borda antiga
    expect(calcRbt12([mes(2025, 11, 7)], [], ref)).toBe(7)  // borda recente
    expect(calcRbt12([mes(2025, 12, 7)], [], ref)).toBe(0)  // ja fora
    expect(calcRbt12([mes(2024, 11, 7)], [], ref)).toBe(0)  // ainda fora
  })
})

describe('calcRbt12 — devolucoes', () => {
  it('subtrai a devolucao do mes em que ela esta lancada', () => {
    expect(calcRbt12([mes(2026, 7, 1000)], [{ ano: 2026, mes: 7, valor: 300 }], REF)).toBe(700)
  })

  it('ignora devolucao lancada fora da janela', () => {
    expect(calcRbt12([mes(2026, 7, 1000)], [{ ano: 2026, mes: 8, valor: 300 }], REF)).toBe(1000)
  })

  it('acumula varias devolucoes no mesmo mes', () => {
    const devs = [
      { ano: 2026, mes: 7, valor: 100 },
      { ano: 2026, mes: 7, valor: 50 },
    ]
    expect(calcRbt12([mes(2026, 7, 1000)], devs, REF)).toBe(850)
  })

  it('sem devolucoes, o resultado e a soma bruta', () => {
    expect(calcRbt12(HIST_SIX, [], REF)).toBeCloseTo(1279330.84, 2)
  })
})

describe('caso real: SIX em 02/09/2026', () => {
  // A NF 1119 (venda, 31/07/2026) foi devolvida pela NF 1131 (entrada,
  // 05/08/2026). A devolucao reduz a receita do mes em que OCORREU — agosto —
  // que ainda esta fora da janela. Por isso o RBT12 de hoje e o valor bruto.
  const DEV_AGOSTO = [{ ano: 2026, mes: 8, valor: 21531.3 }]

  it('RBT12 e 1.279.330,84 com a devolucao lancada em agosto', () => {
    expect(calcRbt12(HIST_SIX, DEV_AGOSTO, REF)).toBeCloseTo(1279330.84, 2)
  })

  it('regressao: lancada em julho (mes da venda) o RBT12 cai indevidamente', () => {
    // Comportamento ANTIGO, que produzia o numero errado. Se este teste passar
    // a valer como correto, a regra de qual mes recebe a devolucao mudou.
    const devJulho = [{ ano: 2026, mes: 7, valor: 21531.3 }]
    expect(calcRbt12(HIST_SIX, devJulho, REF)).toBeCloseTo(1257799.54, 2)
  })

  it('a devolucao entra na janela no mes seguinte (out/2026)', () => {
    const outubro = new Date(2026, 9, 2) // janela set/2025..ago/2026
    const semDev = calcRbt12(HIST_SIX, [], outubro)
    const comDev = calcRbt12(HIST_SIX, DEV_AGOSTO, outubro)
    expect(semDev - comDev).toBeCloseTo(21531.3, 2)
  })

  it('cai na 4a faixa, com aliquota efetiva de 8,94%', () => {
    const rbt = calcRbt12(HIST_SIX, DEV_AGOSTO, REF)
    const faixa = faixaDoRbt12(rbt)
    expect(faixa.faixa).toBe('4ª')
    expect(aliquotaEfetiva(rbt, faixa) * 100).toBeCloseTo(8.94, 2)
    expect(icmsAproveitavel(aliquotaEfetiva(rbt, faixa), faixa) * 100).toBeCloseTo(3.0, 2)
  })
})

describe('faixaDoRbt12', () => {
  it('escolhe a faixa pelos limites', () => {
    expect(faixaDoRbt12(0).faixa).toBe('1ª')
    expect(faixaDoRbt12(180000).faixa).toBe('1ª')
    expect(faixaDoRbt12(180000.01).faixa).toBe('2ª')
    expect(faixaDoRbt12(360000).faixa).toBe('2ª')
    expect(faixaDoRbt12(360000.01).faixa).toBe('3ª')
    expect(faixaDoRbt12(720000.01).faixa).toBe('4ª')
    expect(faixaDoRbt12(1800000.01).faixa).toBe('5ª')
    expect(faixaDoRbt12(3600000.01).faixa).toBe('6ª')
  })

  it('acima do teto do Simples devolve a ultima faixa', () => {
    expect(faixaDoRbt12(9_000_000).faixa).toBe('6ª')
  })

  it('a tabela cobre a faixa seguinte sem buraco', () => {
    for (let i = 1; i < FAIXAS_SIMPLES.length; i++) {
      expect(FAIXAS_SIMPLES[i].min).toBeCloseTo(FAIXAS_SIMPLES[i - 1].max + 0.01, 2)
    }
  })
})

describe('aliquotaEfetiva', () => {
  it('aplica (RBT12 x aliquota - deducao) / RBT12', () => {
    const faixa = faixaDoRbt12(1_000_000) // 4a: 10,7% com deducao de 22.500
    expect(aliquotaEfetiva(1_000_000, faixa)).toBeCloseTo((1_000_000 * 0.107 - 22500) / 1_000_000, 10)
  })

  it('na 1a faixa, sem deducao, e igual a aliquota nominal', () => {
    const faixa = faixaDoRbt12(100_000)
    expect(aliquotaEfetiva(100_000, faixa)).toBeCloseTo(0.04, 10)
  })

  it('com RBT12 zero usa o fallback (Inicio passa 0)', () => {
    expect(aliquotaEfetiva(0, faixaDoRbt12(0))).toBe(0)
  })

  it('com RBT12 zero usa o fallback informado (Contabilidade passa a aliquota cadastrada)', () => {
    expect(aliquotaEfetiva(0, faixaDoRbt12(0), 0.088324)).toBe(0.088324)
  })

  it('RBT12 negativo tambem cai no fallback', () => {
    expect(aliquotaEfetiva(-100, faixaDoRbt12(0), 0.05)).toBe(0.05)
  })
})

describe('icmsAproveitavel', () => {
  it('e a fracao de ICMS da faixa aplicada sobre a aliquota efetiva', () => {
    const faixa = faixaDoRbt12(1_000_000) // icms 0.335
    expect(icmsAproveitavel(0.1, faixa)).toBeCloseTo(0.0335, 10)
  })

  it('e zero na 6a faixa, que nao tem ICMS', () => {
    expect(icmsAproveitavel(0.15, faixaDoRbt12(4_000_000))).toBe(0)
  })
})
