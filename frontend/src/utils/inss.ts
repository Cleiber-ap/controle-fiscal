/**
 * INSS — contribuicao do empregado (tabela progressiva).
 *
 * A tabela estava embutida na tela de Encargos com os limites de 2024, presos
 * ao salario minimo daquele ano. Como as faixas sao reajustadas anualmente,
 * ficou aqui, isolada e datada: no proximo reajuste basta trocar VIGENCIA e os
 * limites, sem procurar pelo codigo.
 */

/** Vigencia da tabela abaixo. Atualize junto com as faixas. */
export const VIGENCIA_INSS = '2026'

export interface FaixaINSS {
  /** Limite superior do salario de contribuicao nesta faixa. */
  ate: number
  aliq: number
  /**
   * Parcela a deduzir da tabela oficial. Nao e usada no calculo — que e
   * progressivo, faixa a faixa —, serve como conferencia: as duas formas
   * devem dar o mesmo resultado, e os testes verificam isso.
   */
  deduzir: number
}

export const FAIXAS_INSS: FaixaINSS[] = [
  { ate: 1621.00, aliq: 0.075, deduzir: 0 },
  { ate: 2902.84, aliq: 0.09, deduzir: 24.32 },
  { ate: 4354.27, aliq: 0.12, deduzir: 111.40 },
  { ate: 8475.55, aliq: 0.14, deduzir: 198.49 },
]

/** Teto da contribuicao: salario acima do limite da ultima faixa nao aumenta o desconto. */
export const TETO_INSS = FAIXAS_INSS.reduce((total, f, i) => {
  const base = i === 0 ? 0 : FAIXAS_INSS[i - 1].ate
  return total + (f.ate - base) * f.aliq
}, 0)

/**
 * Contribuicao progressiva: cada parcela do salario paga a aliquota da sua
 * faixa, nao a aliquota cheia sobre o total.
 */
export function calcINSS(salario: number): number {
  let inss = 0
  let base = 0
  for (const f of FAIXAS_INSS) {
    if (salario <= base) break
    inss += (Math.min(salario, f.ate) - base) * f.aliq
    base = f.ate
    if (salario <= f.ate) break
  }
  return inss
}

/**
 * Mesma contribuicao pela formula oficial "aliquota x salario - parcela a
 * deduzir". Existe para conferir o calculo progressivo, nao para uso na tela.
 */
export function calcINSSPorDeducao(salario: number): number {
  const teto = FAIXAS_INSS[FAIXAS_INSS.length - 1]
  if (salario > teto.ate) return teto.ate * teto.aliq - teto.deduzir
  const faixa = FAIXAS_INSS.find(f => salario <= f.ate) || teto
  return salario * faixa.aliq - faixa.deduzir
}
