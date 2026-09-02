/**
 * Regras do Simples Nacional — fonte unica.
 *
 * Antes desta consolidacao a tabela de faixas e o calculo do RBT12 existiam
 * duplicados em Inicio e Contabilidade. Como as faixas mudam por lei, duas
 * copias significam duas telas mostrando impostos diferentes sem erro nenhum.
 * Qualquer tela que precise de faixa, RBT12 ou aliquota importa daqui.
 */

export interface FaixaSimples {
  min: number
  max: number
  /** Aliquota nominal da faixa. */
  aliq: number
  /** Parcela a deduzir, em reais. */
  ded: number
  /** Rotulo exibido ('1ª', '2ª', ...). */
  faixa: string
  /** Fracao da aliquota efetiva que corresponde a ICMS. */
  icms: number
}

export const FAIXAS_SIMPLES: FaixaSimples[] = [
  { min: 0, max: 180000, aliq: 0.04, ded: 0, faixa: '1ª', icms: 0.34 },
  { min: 180000.01, max: 360000, aliq: 0.073, ded: 5940, faixa: '2ª', icms: 0.34 },
  { min: 360000.01, max: 720000, aliq: 0.095, ded: 13860, faixa: '3ª', icms: 0.335 },
  { min: 720000.01, max: 1800000, aliq: 0.107, ded: 22500, faixa: '4ª', icms: 0.335 },
  { min: 1800000.01, max: 3600000, aliq: 0.143, ded: 87300, faixa: '5ª', icms: 0.335 },
  { min: 3600000.01, max: 4800000, aliq: 0.19, ded: 378000, faixa: '6ª', icms: 0 },
]

/** Faixa correspondente ao RBT12. Acima do teto, devolve a ultima faixa. */
export function faixaDoRbt12(rbt12: number): FaixaSimples {
  return FAIXAS_SIMPLES.find(f => rbt12 >= f.min && rbt12 <= f.max)
    || FAIXAS_SIMPLES[FAIXAS_SIMPLES.length - 1]
}

export interface LinhaHistorico { ano: number; mes: number; valor: number }
export interface LinhaAjuste { ano: number; mes: number; valor: number }

/**
 * Receita bruta dos 12 meses anteriores, ja liquida de devolucoes.
 *
 * A janela termina no ANTEPENULTIMO mes: em setembro/2026 ela cobre agosto/2025
 * a julho/2026. Isso porque o DAS apurado agora tem como base o mes anterior, e
 * o RBT12 que define a faixa e o dos 12 meses que antecedem esse mes-base.
 *
 * Mes sem lancamento vale zero — ausencia nao interrompe a soma.
 */
export function calcRbt12(
  hist: LinhaHistorico[],
  ajustes: LinhaAjuste[] = [],
  referencia: Date = new Date(),
): number {
  let soma = 0
  for (let i = 1; i < 13; i++) {
    const d = new Date(referencia.getFullYear(), referencia.getMonth() - i - 1, 1)
    const mes = d.getMonth() + 1
    const ano = d.getFullYear()
    const faturamento = hist.find(r => r.ano === ano && r.mes === mes)?.valor || 0
    const devolucoes = ajustes
      .filter(a => a.ano === ano && a.mes === mes)
      .reduce((s, a) => s + a.valor, 0)
    soma += faturamento - devolucoes
  }
  return soma
}

/**
 * Aliquota efetiva: (RBT12 x aliquota nominal - deducao) / RBT12.
 *
 * `fallback` e usado quando o RBT12 e zero (empresa sem historico). O Inicio
 * usa 0; a Contabilidade usa a aliquota cadastrada da empresa.
 */
export function aliquotaEfetiva(rbt12: number, faixa: FaixaSimples, fallback = 0): number {
  if (rbt12 <= 0) return fallback
  return (rbt12 * faixa.aliq - faixa.ded) / rbt12
}

/** Parcela da aliquota efetiva aproveitavel como credito de ICMS. */
export function icmsAproveitavel(aliqEfetiva: number, faixa: FaixaSimples): number {
  return aliqEfetiva * faixa.icms
}
