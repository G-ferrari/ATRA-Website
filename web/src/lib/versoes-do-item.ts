import { draftMode } from 'next/headers'
import type { Where } from 'payload'

import { parDeTodosOsIdiomas } from './mappers/idioma'
import { getPayload } from './payload'
import type { SlugsPorIdioma } from './seo'
import { versoesDe } from './sitemap'

/* As versões de idioma de uma página de item, para o `hreflang` (task #209).
 *
 * A rota já tem o documento no idioma dela; falta o slug do outro, e o texto
 * dos dois para saber se o inglês é tradução (`versoesDe`). Uma consulta só:
 * com `locale: 'all'` cada campo localizado vem com os dois idiomas e sem
 * fallback, e o `select` traz só o slug e esse texto — sem ele a consulta a
 * `solutions` ou `segments` faria um JOIN por tipo de bloco do `layout`. */

/**
 * O campo que diz se o inglês é tradução — o `texto` de `temIngles`. O mesmo
 * que o sitemap compara, nas collections que ele lista.
 *
 * Parceiro compara a descrição porque o nome não é traduzido (é marca, e nem é
 * localizado): pelo nome, nenhum parceiro teria inglês.
 */
const TEXTO = {
  posts: 'title',
  cases: 'title',
  jobs: 'title',
  solutions: 'title',
  segments: 'name',
  webinars: 'title',
  resources: 'title',
  partners: 'description',
} as const

export type ColecaoDeItem = keyof typeof TEXTO

/** `partners` não tem rascunho, e filtrar por `_status` lá é erro de consulta. */
const SEM_RASCUNHO: ReadonlySet<ColecaoDeItem> = new Set(['partners'])

/**
 * O slug do item em cada idioma em que ele tem versão, para `metadataDe`.
 *
 * ⚠️ Fora do preview, só publicado: a Local API roda com `overrideAccess: true`
 * e o `access.read` que esconde rascunho não vale aqui. No preview, a última
 * versão, a mesma que a página mostra.
 */
export async function versoesDoItem(collection: ColecaoDeItem, id: number): Promise<SlugsPorIdioma> {
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()
  const campo = TEXTO[collection]

  const doId: Where = { id: { equals: id } }
  const { docs } = await payload.find({
    collection,
    locale: 'all',
    depth: 0,
    limit: 1,
    pagination: false,
    draft: rascunho,
    where: rascunho || SEM_RASCUNHO.has(collection) ? doId : { and: [doId, { _status: { equals: 'published' } }] },
    select: { slug: true, [campo]: true },
  })

  return docs[0] ? versoesDe(parDeTodosOsIdiomas(docs[0], campo)) : {}
}
