import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { avisarIndexNow, indexNowLigado, urlsDoItem, type ColecaoAvisada } from '../lib/indexnow'

/* D-80 — publicar, alterar ou tirar do ar um item avisa o IndexNow.
 *
 * Só o que muda o que o visitante vê: documento publicado, ou que **deixou** de
 * estar (o buscador precisa saber que a página saiu). Salvar rascunho não
 * avisa ninguém.
 *
 * O slug vem de uma consulta com `locale: 'all'` — o `doc` do gancho traz só
 * o idioma que a editora salvou, e o item tem um endereço por idioma (D-07). Ela
 * usa o `req`, para ler dentro da mesma transação da gravação. */

async function avisar(colecao: ColecaoAvisada, id: number | string, req: Parameters<CollectionAfterChangeHook>[0]['req']) {
  const { docs } = await req.payload.find({
    collection: colecao,
    locale: 'all',
    depth: 0,
    limit: 1,
    pagination: false,
    draft: true,
    where: { id: { equals: id } },
    select: colecao === 'resources' ? { slug: true, kind: true } : { slug: true },
    req,
  })
  const doc = docs[0] as { slug?: unknown; kind?: string } | undefined
  /* Material que não é e-book (relatório) não tem página em `/ebooks`. */
  if (!doc || (colecao === 'resources' && doc.kind !== 'ebook')) return
  /* Com `locale: 'all'` o slug (localizado, `fields/slug.ts`) volta como
     objeto por idioma, sem fallback: idioma sem slug gravado fica de fora. */
  const slugs = (typeof doc.slug === 'object' && doc.slug ? doc.slug : {}) as Record<string, string | null>
  avisarIndexNow(urlsDoItem(colecao, slugs), (msg) => req.payload.logger.warn(msg))
}

export function avisarIndexNowAoMudar(colecao: ColecaoAvisada): CollectionAfterChangeHook {
  return async ({ doc, previousDoc, req }) => {
    if (!indexNowLigado()) return doc
    const publicado = doc?._status === 'published'
    const estavaPublicado = previousDoc?._status === 'published'
    if (publicado || estavaPublicado) {
      try {
        await avisar(colecao, doc.id, req)
      } catch (erro) {
        req.payload.logger.warn(`[indexnow] não montou os endereços: ${erro instanceof Error ? erro.message : String(erro)}`)
      }
    }
    return doc
  }
}

/* Apagado: o documento já não existe para consultar, mas o `doc` do gancho
   ainda tem o slug do idioma em que foi apagado — basta para o aviso. */
export function avisarIndexNowAoApagar(colecao: ColecaoAvisada): CollectionAfterDeleteHook {
  return ({ doc, req }) => {
    if (!indexNowLigado() || doc?._status !== 'published' || typeof doc.slug !== 'string') return
    if (colecao === 'resources' && doc.kind !== 'ebook') return
    avisarIndexNow(urlsDoItem(colecao, { [req.locale ?? 'pt']: doc.slug }), (msg) => req.payload.logger.warn(msg))
  }
}
