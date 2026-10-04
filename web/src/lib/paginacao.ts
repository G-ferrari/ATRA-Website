/* Paginação de listagem — a conta, sem tela. Nasceu para o blog (D-47, 02/10):
 * a página tinha dois botões decorativos portados do protótipo e só buscava os
 * 100 artigos mais recentes, então os 107 anteriores a maio de 2025 não
 * apareciam nem na lista nem na busca.
 *
 * Fica em `lib/` porque servidor e ilha fazem a mesma conta: o servidor para
 * saber quantas páginas pré-montar e se a página pedida existe, a ilha para
 * fatiar a lista e desenhar a numeração. */

/** 4 fileiras de 3 no computador; no celular, 12 cartões empilhados é o teto do aceitável. */
export const POR_PAGINA = 12

export function totalDePaginas(itens: number, porPagina = POR_PAGINA): number {
  return Math.max(1, Math.ceil(itens / porPagina))
}

/** Os itens da página `pagina` (a primeira é 1). Página fora do intervalo devolve vazio. */
export function fatia<T>(itens: T[], pagina: number, porPagina = POR_PAGINA): T[] {
  if (!Number.isInteger(pagina) || pagina < 1) return []
  return itens.slice((pagina - 1) * porPagina, pagina * porPagina)
}

/** O número da página escrito na URL. Só inteiro positivo, sem zero à esquerda:
 *  `/pagina/02` e `/pagina/2` seriam dois endereços para o mesmo conteúdo. */
export function paginaDaUrl(segmento: string): number | null {
  return /^[1-9]\d*$/.test(segmento) ? Number(segmento) : null
}

export type ItemDaNumeracao = number | 'reticencias'

/**
 * O que a numeração mostra: sempre a primeira e a última, a atual e as vizinhas,
 * e reticências onde pula. Com 18 páginas e a atual em 9: `1 … 8 9 10 … 18`.
 *
 * ⚠️ Reticências só quando escondem **duas ou mais** páginas. Escondendo uma só,
 * o número cabe no mesmo espaço e é um clique a menos — `1 … 3` vira `1 2 3`.
 */
export function numeracao(atual: number, total: number): ItemDaNumeracao[] {
  const visiveis = new Set<number>([1, total, atual - 1, atual, atual + 1])
  const paginas = [...visiveis].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)

  const saida: ItemDaNumeracao[] = []
  let anterior = 0
  for (const n of paginas) {
    if (n - anterior === 2) saida.push(anterior + 1)
    else if (n - anterior > 2) saida.push('reticencias')
    saida.push(n)
    anterior = n
  }
  return saida
}
