import { ABAS_DE_SOLUCOES } from '../../lib/abas-de-solucoes'

/* A coluna "Soluções" do rodapé passa a listar as quatro abas novas (D-52) — a
 * regra da migração `20261002_213100_rodape_com_as_abas_novas`, separada dela
 * para ter teste.
 *
 * A coluna tinha os três nomes das abas antigas, todos levando ao índice
 * `/solucoes`. Com o menu reorganizado, o rodapé ficaria anunciando abas que
 * não existem mais.
 *
 * ⚠️ Trava pelo formato exato: só age na coluna cujos links são **os três
 * nomes antigos** e nada mais. Coluna já editada no admin — nome trocado, link
 * a mais, link a menos — fica como está. */

export const INDICE = '/solucoes'
export const ABAS_ANTIGAS = ['Inovação & IA', 'Dados, BI & Advanced Analytics', 'Governança & Cultura'] as const

type Link = { id?: string | null; label?: string | null; href?: string | null }
type Coluna = { links?: Link[] | null }

const ehAColunaAntiga = (links: Link[]) =>
  links.length === ABAS_ANTIGAS.length &&
  links.every((l) => l.href === INDICE) &&
  ABAS_ANTIGAS.every((nome) => links.some((l) => l.label === nome))

/** Devolve as colunas com as abas novas no lugar das antigas, e se algo mudou.
 *  As três primeiras linhas mantêm o id; a quarta é linha nova. O original não
 *  muda. */
export function comAsAbasNovas<T extends Coluna>(colunas: T[], idioma: 'pt' | 'en' = 'pt'): { colunas: T[]; mudou: boolean } {
  let mudou = false
  const novas = colunas.map((coluna) => {
    const links = coluna.links ?? []
    if (!ehAColunaAntiga(links)) return coluna
    mudou = true
    return {
      ...coluna,
      links: ABAS_DE_SOLUCOES.map((aba, i) => ({ ...(links[i]?.id ? { id: links[i].id } : {}), label: aba[idioma], href: INDICE })),
    }
  })
  return { colunas: novas, mudou }
}

/** O rótulo em inglês das abas, nas linhas que o português acabou de gravar —
 *  achadas pelo nome português da aba, que é o que a coluna tem agora. */
export function abasEmIngles<T extends Coluna>(colunas: T[], idsDasAbas: (string | null | undefined)[]): T[] {
  return colunas.map((coluna) => ({
    ...coluna,
    links: (coluna.links ?? []).map((l) => {
      const i = l.id ? idsDasAbas.indexOf(l.id) : -1
      return i >= 0 ? { ...l, label: ABAS_DE_SOLUCOES[i].en } : l
    }),
  }))
}
