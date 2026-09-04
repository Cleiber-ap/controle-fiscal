import { describe, it, expect } from 'vitest'
import { ehReceita, ehFaturamento, ehEntrada, ehDevolucao, naturezaDe } from './notas'

const nota = (nat: string, tipo = 'saida', numero_nf = '1') =>
  ({ numero_nf, nat_operacao: nat, tipo })

describe('ehReceita — naturezas reais do sistema', () => {
  // As 11 naturezas encontradas nas 303 notas do banco, com o veredicto esperado.
  it.each([
    ['Venda', 'saida', true],
    ['NF-e COMPLEMENTAR', 'saida', true],
    ['Complemento de Frete', 'saida', true],
    ['Simples Remessa', 'saida', false],
    ['Remessa de amostra gratis', 'saida', false],
    ['Remessa em bonificacao, doacao ou brinde', 'saida', false],
    ['Remessa para demonstracao', 'saida', false],
    ['Cancelamento', 'saida', false],
    ['Carta de Correcao', 'saida', false],
    ['Inutilizacao', 'saida', false],
    ['Devolucao de simples remessa', 'saida', false],
    ['Devolucao de venda de mercadorias', 'entrada', false],
  ])('%s (%s) -> receita: %s', (nat, tipo, esperado) => {
    expect(ehReceita(nota(nat as string, tipo as string))).toBe(esperado)
  })
})

describe('ehReceita — a guarda de tipo', () => {
  // Este e o caso que quebrou o RBT12 da SIX: nota de ENTRADA cuja natureza
  // contem "venda" e nao contem "devolucao". Sem a guarda de tipo ela entraria
  // como faturamento.
  it('entrada com "venda" na natureza nao e receita', () => {
    expect(ehReceita(nota('Venda', 'entrada'))).toBe(false)
    expect(ehReceita(nota('Retorno de venda de mercadoria', 'entrada'))).toBe(false)
  })

  it('a mesma natureza em saida e receita', () => {
    expect(ehReceita(nota('Venda', 'saida'))).toBe(true)
  })

  it('tipo ausente e tratado como saida', () => {
    expect(ehReceita({ nat_operacao: 'Venda' })).toBe(true)
    expect(ehReceita({ nat_operacao: 'Venda', tipo: null })).toBe(true)
  })
})

describe('ehReceita — devolucao', () => {
  it('devolucao de venda nunca e receita, em qualquer tipo', () => {
    expect(ehReceita(nota('Devolucao de venda de mercadorias', 'entrada'))).toBe(false)
    expect(ehReceita(nota('Devolucao de venda de mercadorias', 'saida'))).toBe(false)
  })

  it('reconhece a palavra com e sem acento e em qualquer caixa', () => {
    for (const n of ['DEVOLUCAO DE VENDA', 'Devolução de Venda', 'devolucao de venda']) {
      expect(ehReceita(nota(n))).toBe(false)
    }
  })
})

describe('ehReceita — casos de borda', () => {
  it('sem natureza nem status nao e receita', () => {
    expect(ehReceita({})).toBe(false)
    expect(ehReceita({ nat_operacao: '', status: '' })).toBe(false)
    expect(ehReceita({ nat_operacao: null, status: null })).toBe(false)
  })

  it('usa o status quando a natureza esta vazia', () => {
    expect(ehReceita({ nat_operacao: '', status: 'Venda' })).toBe(true)
    expect(naturezaDe({ nat_operacao: null, status: 'Venda' })).toBe('venda')
  })

  it('a natureza tem precedencia sobre o status', () => {
    expect(ehReceita({ nat_operacao: 'Simples Remessa', status: 'Venda' })).toBe(false)
  })
})

describe('ehFaturamento — canceladas', () => {
  const canceladas = new Set(['100'])

  it('nota cancelada nao e faturamento mesmo sendo venda', () => {
    expect(ehFaturamento(nota('Venda', 'saida', '100'), canceladas)).toBe(false)
  })

  it('nota nao cancelada segue a regra de receita', () => {
    expect(ehFaturamento(nota('Venda', 'saida', '101'), canceladas)).toBe(true)
    expect(ehFaturamento(nota('Simples Remessa', 'saida', '101'), canceladas)).toBe(false)
  })

  it('sem conjunto de canceladas equivale a ehReceita', () => {
    for (const n of ['Venda', 'Simples Remessa', 'Devolucao de venda de mercadorias']) {
      expect(ehFaturamento(nota(n))).toBe(ehReceita(nota(n)))
    }
  })
})

describe('ehEntrada e ehDevolucao', () => {
  it('identificam entrada pelo tipo, nao pelo texto', () => {
    expect(ehEntrada(nota('Venda', 'entrada'))).toBe(true)
    expect(ehEntrada(nota('Devolucao de venda de mercadorias', 'saida'))).toBe(false)
  })

  it('identificam devolucao pelo texto', () => {
    expect(ehDevolucao(nota('Devolucao de venda de mercadorias', 'entrada'))).toBe(true)
    expect(ehDevolucao(nota('Venda'))).toBe(false)
  })
})

describe('caso real: NF 1119 e NF 1131', () => {
  // A venda de 31/07/2026 e a devolucao que a anulou, emitida em 05/08/2026.
  const venda = { numero_nf: '1119', nat_operacao: 'Venda', tipo: 'saida' }
  const devolucao = { numero_nf: '1131', nat_operacao: 'Devolucao de venda de mercadorias', tipo: 'entrada' }

  it('a venda soma no faturamento', () => {
    expect(ehFaturamento(venda)).toBe(true)
  })

  it('a devolucao nao soma — nem como receita, nem invertida', () => {
    expect(ehFaturamento(devolucao)).toBe(false)
  })

  it('a venda continua somando mesmo tendo sido devolvida', () => {
    // A anulacao fiscal acontece via ajuste no RBT12, nao removendo a venda do
    // faturamento — a NF 1119 nao foi cancelada.
    expect(ehFaturamento(venda, new Set(['1131']))).toBe(true)
  })
})
