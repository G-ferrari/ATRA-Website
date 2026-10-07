/* A forma de cada cartão do mosaico de parceiros (07/10), pela quantidade.
 *
 * O mosaico é uma grade de 4 colunas com cartões de três tamanhos: o **grande**
 * (2×2), o **largo** (2×1) e o **pequeno** (1×1). Para cada quantidade há um
 * arranjo que fecha um retângulo, sem buraco e sem cartão sozinho na linha —
 * que era o defeito da vitrine usada antes na página de Assessoria em
 * Produtos: com 5 parceiros, a terceira coluna ficava com um cartão só.
 *
 * A ordem das formas é a ordem dos itens no admin; quem distribui é o
 * `grid-auto-flow` normal da grade. O desenho em 4 colunas:
 *
 *   4 → [G G L L]    5 → [G G p p]    6 → [L L p p]
 *       [G G p p]        [G G p p]        [p p L L]
 *
 * No celular a grade tem 2 colunas e as mesmas formas empilham: o grande e o
 * largo ocupam a linha, os pequenos andam aos pares — por isso todo arranjo
 * tem número par de pequenos seguidos. */
export type FormaDoMosaico = 'grande' | 'largo' | 'pequeno' | 'faixa'

const ARRANJOS: Record<number, FormaDoMosaico[]> = {
  1: ['faixa'],
  2: ['grande', 'grande'],
  3: ['grande', 'largo', 'largo'],
  4: ['grande', 'largo', 'pequeno', 'pequeno'],
  5: ['grande', 'pequeno', 'pequeno', 'pequeno', 'pequeno'],
  6: ['largo', 'pequeno', 'pequeno', 'pequeno', 'pequeno', 'largo'],
}

/** Quantos cartões o mosaico desenha; o campo do admin tem o mesmo teto. */
export const MAXIMO_DO_MOSAICO = 6

export function formasDoMosaico(quantidade: number): FormaDoMosaico[] {
  return ARRANJOS[Math.min(Math.max(quantidade, 0), MAXIMO_DO_MOSAICO)] ?? []
}

/** Quantas das 4 colunas a forma ocupa, e quantas linhas. */
export const CELULAS: Record<FormaDoMosaico, { colunas: number; linhas: number }> = {
  grande: { colunas: 2, linhas: 2 },
  largo: { colunas: 2, linhas: 1 },
  pequeno: { colunas: 1, linhas: 1 },
  faixa: { colunas: 4, linhas: 1 },
}
