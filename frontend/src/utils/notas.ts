/**
 * Classificacao de notas fiscais — fonte unica.
 *
 * Decidir se uma nota e receita estava escrito em cinco lugares, e foi por
 * divergirem entre si que o RBT12 da SIX ficou errado: o recalculo do historico
 * somava uma nota de entrada porque a natureza dela dizia "venda". Hoje os
 * cinco pontos usam este modulo.
 *
 * A regra continua lendo o texto da natureza da operacao, porque e o que o
 * sistema guarda. A guarda estrutural (`tipo`, vindo de tpNF no XML) vem antes
 * e e o que impede o erro anterior: entrada nunca e receita, qualquer que seja
 * a redacao. Avaliamos trocar o texto por finNFe e CFOP e concluimos que nao
 * compensa — o reconciliar.py compara as duas leituras e nao acusa divergencia.
 */

export interface NotaClassificavel {
  numero_nf?: string
  nat_operacao?: string | null
  status?: string | null
  tipo?: string | null
}

/** Natureza da operacao em minusculas, com o status como alternativa. */
export function naturezaDe(nota: NotaClassificavel): string {
  return (nota.nat_operacao || nota.status || '').toLowerCase()
}

/** Nota de entrada (tpNF = 0 no XML). Nunca e receita. */
export function ehEntrada(nota: NotaClassificavel): boolean {
  return (nota.tipo || 'saida') === 'entrada'
}

/** Devolucao, pela natureza da operacao. */
export function ehDevolucao(nota: NotaClassificavel): boolean {
  return naturezaDe(nota).includes('devolu')
}

/**
 * A natureza menciona venda — inclusive em "devolucao de venda".
 *
 * Serve para apresentacao, onde interessa saber que a nota fala de venda sem
 * julgar se e receita: a Contabilidade usa isso para distinguir uma venda
 * anulada por entrada de uma venda de fato cancelada.
 */
export function mencionaVenda(nota: NotaClassificavel): boolean {
  return naturezaDe(nota).includes('venda')
}

/** NF-e complementar ou complemento de frete. */
export function ehComplementar(nota: NotaClassificavel): boolean {
  const st = naturezaDe(nota)
  return st.includes('complemento de frete') || st.includes('complementar')
}

/**
 * A nota representa receita: venda, complemento de frete ou NF-e complementar.
 *
 * Nao considera cancelamento — quem sabe quais notas foram canceladas e a tela,
 * que monta esse conjunto de formas diferentes. Use `ehFaturamento` quando
 * tiver esse conjunto em maos.
 */
export function ehReceita(nota: NotaClassificavel): boolean {
  if (ehEntrada(nota)) return false
  return (mencionaVenda(nota) && !ehDevolucao(nota)) || ehComplementar(nota)
}

/** Receita que ainda vale: nao esta na lista de canceladas. */
export function ehFaturamento(
  nota: NotaClassificavel,
  canceladas: Set<string> = new Set(),
): boolean {
  if (nota.numero_nf && canceladas.has(nota.numero_nf)) return false
  return ehReceita(nota)
}
