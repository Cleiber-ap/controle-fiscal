/**
 * INSS — contribuicao do empregado (tabela progressiva), por ano de vigencia.
 *
 * As faixas sao reajustadas todo ano junto com o salario minimo. Guardar so a
 * tabela corrente fazia meses antigos serem calculados com faixas que ainda nao
 * existiam — o mesmo problema do salario sem historico.
 *
 * Para acrescentar um ano: inclua a tabela em TABELAS_INSS. Os testes conferem
 * cada faixa contra a parcela a deduzir oficial e acusam atualizacao pela metade.
 */

export interface FaixaINSS {
  /** Limite superior do salario de contribuicao nesta faixa. */
  ate: number
  aliq: number
  /**
   * Parcela a deduzir da tabela oficial. Nao entra no calculo — que e
   * progressivo, faixa a faixa — e existe para conferencia: as duas formas
   * precisam dar o mesmo resultado.
   */
  deduzir: number
}

export interface TabelaINSS {
  /** Ano a partir do qual esta tabela vale. */
  ano: number
  faixas: FaixaINSS[]
}

export const TABELAS_INSS: TabelaINSS[] = [
  {
    ano: 2024,
    faixas: [
      { ate: 1412.00, aliq: 0.075, deduzir: 0 },
      { ate: 2666.68, aliq: 0.09, deduzir: 21.18 },
      { ate: 4000.03, aliq: 0.12, deduzir: 101.18 },
      { ate: 7786.02, aliq: 0.14, deduzir: 181.18 },
    ],
  },
  {
    ano: 2025,
    faixas: [
      { ate: 1518.00, aliq: 0.075, deduzir: 0 },
      //  As parcelas informadas pela fonte do usuario (11,39 / 95,21 / 179,02)
      //  estavam todas 11,38 abaixo do que as proprias faixas produzem. Como o
      //  calculo e progressivo, o INSS nao muda; ficaram as derivadas, que sao
      //  as unicas coerentes com os limites acima.
      { ate: 2793.88, aliq: 0.09, deduzir: 22.77 },
      { ate: 4190.83, aliq: 0.12, deduzir: 106.59 },
      { ate: 8157.41, aliq: 0.14, deduzir: 190.40 },
    ],
  },
  {
    ano: 2026,
    faixas: [
      { ate: 1621.00, aliq: 0.075, deduzir: 0 },
      { ate: 2902.84, aliq: 0.09, deduzir: 24.32 },
      { ate: 4354.27, aliq: 0.12, deduzir: 111.40 },
      { ate: 8475.55, aliq: 0.14, deduzir: 198.49 },
    ],
  },
]

/** Ano mais recente com tabela cadastrada. */
export const VIGENCIA_INSS = String(TABELAS_INSS[TABELAS_INSS.length - 1].ano)

/**
 * Tabela que vale no ano informado. Antes da primeira tabela cadastrada, devolve
 * a mais antiga — melhor aproximar do que nao calcular.
 */
export function tabelaINSS(ano?: number): TabelaINSS {
  const alvo = ano ?? new Date().getFullYear()
  const validas = TABELAS_INSS.filter(t => t.ano <= alvo)
  return validas.length ? validas[validas.length - 1] : TABELAS_INSS[0]
}

/** Faixas do ano informado. */
export function faixasINSS(ano?: number): FaixaINSS[] {
  return tabelaINSS(ano).faixas
}

/** Teto da contribuicao no ano: salario acima do limite nao aumenta o desconto. */
export function tetoINSS(ano?: number): number {
  const faixas = faixasINSS(ano)
  return faixas.reduce((total, f, i) => {
    const base = i === 0 ? 0 : faixas[i - 1].ate
    return total + (f.ate - base) * f.aliq
  }, 0)
}

/**
 * Contribuicao progressiva: cada parcela do salario paga a aliquota da sua
 * faixa, nao a aliquota cheia sobre o total.
 */
export function calcINSS(salario: number, ano?: number): number {
  let inss = 0
  let base = 0
  for (const f of faixasINSS(ano)) {
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
export function calcINSSPorDeducao(salario: number, ano?: number): number {
  const faixas = faixasINSS(ano)
  const teto = faixas[faixas.length - 1]
  if (salario > teto.ate) return teto.ate * teto.aliq - teto.deduzir
  const faixa = faixas.find(f => salario <= f.ate) || teto
  return salario * faixa.aliq - faixa.deduzir
}
