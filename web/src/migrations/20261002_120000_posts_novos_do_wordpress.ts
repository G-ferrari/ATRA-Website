import { readFileSync } from 'node:fs'
import path from 'node:path'

import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import type { ImagemExportada, PostExportado } from './arquivos/posts-wp/tipos'

/* Migração de **dados**: cria os 6 artigos que o WordPress publicou depois da
 * carga de 17/08 (de 03/09 a 25/09) e que o site novo não tinha — os endereços
 * deles respondiam 404, e depois da virada seriam 6 redirects para lugar nenhum.
 *
 * O texto já convertido e as capas vêm de `arquivos/posts-wp/`, escritos por
 * `scripts/wp-import/exportar-posts.ts` com o mesmo conversor do importador. É
 * o caminho das soluções e dos segmentos: conteúdo que precisa chegar a um
 * ambiente que já existe vem por migração, porque o deploy não roda importador.
 *
 * Travas:
 * - **Só onde a carga do WordPress está.** Banco novo (CI, dev) não tem os 207
 *   artigos, e ali quem traz conteúdo real é o importador — criar 6 artigos de
 *   verdade no meio das fixtures do e2e mudaria o que a suíte mede. A prova da
 *   carga é o último artigo dela.
 * - **Só cria.** Artigo cujo slug já existe — publicado, rascunho, trazido pelo
 *   importador com `--so-novos` — fica como está.
 * - A mídia é achada pelo prefixo `wp-<id>-`, o mesmo do importador: rodar um
 *   depois do outro não duplica imagem. */

const PASTA = path.resolve(process.cwd(), 'src/migrations/arquivos/posts-wp')
const ULTIMO_DA_CARGA = 'atra-no-rio-preto-tech-summit-2026-dados-cloud-e-ia'

type Ctx = Pick<MigrateUpArgs, 'payload' | 'req'>
type No = { type?: string; children?: No[]; pending?: { arquivo?: string }; [campo: string]: unknown }

export const lerPostsExportados = (): PostExportado[] => JSON.parse(readFileSync(path.join(PASTA, 'posts.json'), 'utf8'))

async function midia({ payload, req }: Ctx, img: ImagemExportada): Promise<number> {
  const { docs } = await payload.find({ collection: 'media', where: { filename: { contains: img.chave } }, limit: 1, depth: 0, req })
  if (docs[0]) return docs[0].id

  const data = readFileSync(path.join(PASTA, img.arquivo))
  const doc = await payload.create({
    collection: 'media',
    locale: 'pt',
    data: { alt: img.alt, ...(img.legenda ? { caption: img.legenda } : {}) },
    file: { data, mimetype: img.mime, name: img.arquivo, size: data.length },
    req,
  })
  return doc.id
}

/** Troca cada `pending: { arquivo }` pela relação com a mídia — o passo que o importador faz com a URL. */
function resolverImagens(no: No, ids: Map<string, number>): void {
  if (no.type === 'upload' && no.pending?.arquivo) {
    const id = ids.get(no.pending.arquivo)
    if (!id) throw new Error(`[posts-wp] imagem sem arquivo exportado: ${no.pending.arquivo}`)
    no.value = id
    no.relationTo = 'media'
    no.fields ??= {}
    delete no.pending
  }
  for (const filho of no.children ?? []) resolverImagens(filho, ids)
}

export async function criarPostsNovos(ctx: Ctx, { exigirCarga }: { exigirCarga: boolean }): Promise<void> {
  const { payload, req } = ctx

  if (exigirCarga) {
    const { totalDocs } = await payload.count({ collection: 'posts', where: { slug: { equals: ULTIMO_DA_CARGA } }, locale: 'pt', req })
    if (totalDocs === 0) {
      payload.logger.warn('[posts-wp] este banco não tem a carga do WordPress — pulado (os artigos entram pelo importador)')
      return
    }
  }

  for (const post of lerPostsExportados()) {
    const { totalDocs } = await payload.count({ collection: 'posts', where: { slug: { equals: post.slug } }, locale: 'pt', req })
    if (totalDocs > 0) {
      payload.logger.warn(`[posts-wp] "${post.slug}" já existe — mantido`)
      continue
    }

    const ids = new Map<string, number>()
    for (const img of post.imagens) ids.set(img.arquivo, await midia(ctx, img))
    const corpo = structuredClone(post.corpo) as No
    resolverImagens(corpo, ids)

    const criado = await payload.create({
      collection: 'posts',
      locale: 'pt',
      data: {
        title: post.titulo,
        slug: post.slug,
        description: post.resumo,
        coverImage: ids.get(post.capa)!,
        body: { root: corpo } as never,
        publishedAt: post.publicadoEm,
        _status: 'published',
      },
      req,
    })

    /* O slug precisa existir nos dois idiomas, mesmo com o artigo só em
       português: o fallback resolve a leitura, não a consulta, e sem isto
       `/en/blog/<slug>` dá 404 (a mesma nota do importador). O corpo fica de
       fora de propósito — aí o fallback funciona. */
    await payload.update({
      collection: 'posts',
      id: criado.id,
      locale: 'en',
      data: { title: post.titulo, slug: post.slug, description: post.resumo },
      req,
    })
    payload.logger.info(`[posts-wp] "${post.slug}" criado (${post.publicadoEm.slice(0, 10)})`)
  }
}

export async function up(ctx: MigrateUpArgs): Promise<void> {
  await criarPostsNovos(ctx, { exigirCarga: true })
}

/* Sem volta automática: apagar artigo publicado derruba link e redirect. Quem
 * quiser tirar um do ar despublica pelo admin. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[posts-wp] sem desfazer automático: despublicar pelo admin, se for o caso')
}
