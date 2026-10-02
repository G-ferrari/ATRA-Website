/* O rodapé passa a ter **um** link para a página de políticas (02/10) — a regra
 * da migração `20261002_180000_rodape_link_unico_de_politicas`, separada dela
 * para ter teste.
 *
 * Até aqui a coluna "Legal" tinha três links — Privacidade, Termos de Uso e
 * Cookies — e os três levavam à mesma página (MIG-094): quem clicava em
 * "Cookies" caía no topo do mesmo documento. Fica um só, com o nome da página.
 *
 * ⚠️ A trava é o **destino repetido**, e não o rótulo: age na coluna que tem
 * mais de um link para a página de políticas, e junta só esses. Link para
 * outro lugar na mesma coluna fica onde está, e rodapé que já foi arrumado no
 * admin (um link só, ou nenhum) não é tocado. */

export const DESTINO = '/politicas-e-termos'

/** O nome da página, que é o `h1` dela. O inglês é a tradução literal, à espera
 *  da revisão de tradução do site (P-08). */
export const ROTULO = { pt: 'Políticas e Termos', en: 'Policies and Terms' } as const

type Link = { id?: string | null; label?: string | null; href?: string | null }
type Coluna = { links?: Link[] | null }

/** Devolve as colunas com os links de políticas juntos num só, e os ids dos
 *  links que ficaram — é por eles que o outro idioma acha o que renomear.
 *  `mantidos` vazio quer dizer que não havia o que juntar. O original não muda. */
export function juntarLinksDePoliticas<T extends Coluna>(colunas: T[], rotulo: string): { colunas: T[]; mantidos: string[] } {
  const mantidos: string[] = []
  const novas = colunas.map((coluna) => {
    const links = coluna.links ?? []
    const repetidos = links.filter((l) => l.href === DESTINO)
    if (repetidos.length < 2) return coluna

    // Fica o primeiro, no lugar dele e com o id dele: é o id que segura o
    // rótulo do outro idioma na mesma linha.
    const [primeiro] = repetidos
    if (primeiro.id) mantidos.push(primeiro.id)
    return {
      ...coluna,
      links: links.flatMap((l) => (l.href !== DESTINO ? [l] : l === primeiro ? [{ ...l, label: rotulo }] : [])),
    }
  })
  return { colunas: novas, mantidos }
}

/** O mesmo rótulo no outro idioma, só nos links que a junção manteve. */
export function renomear<T extends Coluna>(colunas: T[], ids: string[], rotulo: string): T[] {
  return colunas.map((coluna) => ({
    ...coluna,
    links: (coluna.links ?? []).map((l) => (l.id && ids.includes(l.id) ? { ...l, label: rotulo } : l)),
  }))
}
