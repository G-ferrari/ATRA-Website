/* A conversão da seção de parceiros da página de Assessoria em Produtos — da
 * vitrine de conteúdo (`contentTeaser`), com que o marketing a montou, para o
 * bloco "Mosaico de parceiros" (`partnerMosaic`), feito para ela (07/10).
 *
 * Regra da migração `20261007_020000_assessoria_com_mosaico_de_parceiros`,
 * separada para ter teste. Nada é reescrito: imagem, nome, texto do link e
 * destino de cada cartão são os que estão na página.
 *
 * Como reconhecer a seção certa: uma vitrine em que **todo** cartão leva a uma
 * página de parceiro (`/parceiros/…`). A vitrine da home, que leva a blog e
 * e-books, não casa — e uma seção que o marketing já tenha refeito também não. */

type Bloco = { blockType: string; id?: string | null; [campo: string]: unknown }
type Cartao = { category?: string | null; title?: string | null; href?: string | null; image?: unknown }

const idDe = (imagem: unknown): number | string | null => {
  if (typeof imagem === 'number' || typeof imagem === 'string') return imagem
  if (imagem && typeof imagem === 'object' && 'id' in imagem) return (imagem as { id: number | string }).id
  return null
}

const ehDeParceiro = (c: Cartao) => typeof c.href === 'string' && c.href.startsWith('/parceiros/')

/** Os cartões da vitrine na ordem em que foram cadastrados, com o destaque por
 *  último — ele era o quinto, posto no campo de destaque para caber. */
function cartoesDe(vitrine: Bloco): Cartao[] {
  const cards = (vitrine.cards as Cartao[] | null | undefined) ?? []
  const destaque = vitrine.featured as Cartao | null | undefined
  return destaque && (destaque.href || destaque.image) ? [...cards, destaque] : cards
}

/** A vitrine que é, na verdade, uma seção de parceiros. */
export function ehVitrineDeParceiros(bloco: Bloco): boolean {
  if (bloco.blockType !== 'contentTeaser') return false
  const cartoes = cartoesDe(bloco)
  return cartoes.length > 0 && cartoes.every((c) => ehDeParceiro(c) && idDe(c.image) !== null && Boolean(c.category?.trim()))
}

/** O mosaico equivalente, no lugar da vitrine. `null` se ela não for de
 *  parceiros ou tiver mais cartões do que o mosaico desenha. */
export function paraMosaico(vitrine: Bloco): Bloco | null {
  if (!ehVitrineDeParceiros(vitrine)) return null
  const cartoes = cartoesDe(vitrine)
  if (cartoes.length > 6) return null
  return {
    blockType: 'partnerMosaic',
    anchor: vitrine.anchor ?? null,
    navLabel: vitrine.navLabel ?? null,
    theme: vitrine.theme,
    borda: vitrine.borda,
    spacing: vitrine.spacing,
    eyebrow: vitrine.eyebrow ?? null,
    title: vitrine.title ?? null,
    description: vitrine.description ?? null,
    items: cartoes.map((c) => ({
      image: idDe(c.image),
      name: c.category!.trim(),
      linkLabel: c.title?.trim() || null,
      href: c.href,
    })),
  }
}

/** O layout com a vitrine de parceiros trocada pelo mosaico, na mesma posição.
 *  `null` quando não há o que converter — ou quando a página já tem o mosaico. */
export function comMosaico(layout: Bloco[]): Bloco[] | null {
  if (layout.some((b) => b.blockType === 'partnerMosaic')) return null
  const i = layout.findIndex(ehVitrineDeParceiros)
  if (i === -1) return null
  const mosaico = paraMosaico(layout[i])
  if (!mosaico) return null
  return layout.map((b, j) => (j === i ? mosaico : b))
}
