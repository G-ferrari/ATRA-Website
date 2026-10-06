import type { Bloco, ConteudoDaSecao } from '@/types/content'

/* Regras puras das páginas-mestras que o resolvedor e os componentes dividem
 * (feature paginas-mestras, D-55). Sem React e sem Payload: o resolvedor usa
 * para saber quem abre a página, e o bloco "Destaques da seção" para saber o que
 * mostrar — a mesma conta nos dois lados. */

/** Quantos itens o carrossel do topo mostra em cada seção — os números que as
 *  rotas tinham escritos (`DESTAQUES`). Seção ausente não tem carrossel. */
const LIMITE: Partial<Record<ConteudoDaSecao['secao'], number>> = {
  /* Todos: no legado o carrossel de webinars e o de e-books passam por tudo. */
  webinars: Infinity,
  ebooks: Infinity,
  cases: 3,
  blog: 3,
  /* Mais que 4 e a régua de miniaturas ganha barra de rolagem. */
  midia: 4,
}

/** Os itens do carrossel do topo. No blog, só a primeira página tem destaque:
 *  quem foi à página 5 já passou por ele e quer a lista. */
export function itensEmDestaque(conteudo: ConteudoDaSecao | null): number {
  if (!conteudo) return 0
  const limite = LIMITE[conteudo.secao] ?? 0
  switch (conteudo.secao) {
    case 'webinars':
      return Math.min(limite, conteudo.webinars.length)
    case 'ebooks':
      return Math.min(limite, conteudo.materiais.length)
    case 'cases':
      return Math.min(limite, conteudo.cases.length)
    case 'midia':
      return Math.min(limite, conteudo.materias.length)
    case 'blog':
      return conteudo.pagina === 1 ? Math.min(limite, conteudo.posts.length) : 0
    default:
      return 0
  }
}

/* Seções cuja lista é uma faixa aberta sobre o fundo da página, e não um cartão.
 * Quando abrem a página, elas mesmas dão o respiro sob o cabeçalho fixo — os
 * `pt-28/36/44` do carrossel do topo. As outras (Soluções, Segmentos,
 * Consultores) contam com o respiro da `<main>`, como o herói de página. */
const LISTAS_ABERTAS = new Set<ConteudoDaSecao['secao']>(['webinars', 'midia', 'ebooks', 'cases', 'blog'])

export function listaAberta(conteudo: ConteudoDaSecao | null): boolean {
  return conteudo !== null && LISTAS_ABERTAS.has(conteudo.secao)
}

/** O bloco desenha alguma coisa? Destaques e lista sem conteúdo somem inteiros. */
function visivel(b: Bloco): boolean {
  if (b.tipo === 'sectionFeatured') return itensEmDestaque(b.conteudo) > 0
  if (b.tipo === 'sectionListing') return b.conteudo !== null
  return true
}

/**
 * Marca o bloco de seção que abre a página — a lista ou o carrossel, que
 * desenham `h1` só nesse caso — e diz se a página cuida do próprio respiro
 * sob o cabeçalho fixo. Muta `abertura` nos blocos de seção.
 *
 * ⚠️ É o que deixa a página inteira ser montada por blocos sem a rota saber o
 * que vem primeiro: com o carrossel no topo, a `<main>` não pode ter respiro
 * (ele já tem o seu); com um herói de página no topo, precisa ter.
 */
export function marcarAbertura(blocos: Bloco[]): { topoProprio: boolean } {
  const primeiro = blocos.find(visivel)
  for (const b of blocos) if (b.tipo === 'sectionListing' || b.tipo === 'sectionFeatured') b.abertura = b === primeiro
  const topoProprio =
    primeiro?.tipo === 'sectionFeatured' || (primeiro?.tipo === 'sectionListing' && listaAberta(primeiro.conteudo))
  return { topoProprio }
}
