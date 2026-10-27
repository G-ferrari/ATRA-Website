import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import type { CollectionSlug } from 'payload'

import { CAMPO_DA_TRAVA, COLECOES_TRADUZIDAS_SOZINHAS } from '../lib/traducao-automatica'

/* Migração de **dados**: a carga inicial do inglês (D-74). A tradução
 * automática só age no que for publicado depois dela; o que já estava no ar
 * fica com o português pelo fallback até alguém republicar, um por um. Pedido
 * do Leonardo, 27/10, que não tem acesso ao servidor: por isso é migração, e
 * não script.
 *
 * Só **enfileira**: quem traduz é a fila do plugin, um documento por minuto
 * (`autoRun` em `payload.config.ts`), e ela só começa quando alguém abre o
 * admin depois do deploy. ~330 documentos em produção, umas 6 horas.
 *
 * - **A ordem é a da fila** (`createdAt`, o padrão do Payload): páginas
 *   primeiro, o Blog por último — pedido do Leonardo, os 213 artigos levam mais
 *   da metade do tempo. No Blog, do mais novo para o mais antigo.
 * - **Só o publicado**: rascunho que nunca foi ao ar não ganha inglês no ar.
 * - **A trava vale**: documento com "Inglês revisado à mão" fica como está.
 * - **Sem o interruptor**: a tradução pedida não passa pelo gancho que o lê,
 *   como o botão de traduzir do admin. A chave do Gemini, sim — sem ela cada
 *   pedido falha nas 4 tentativas e fica registrado em `payload-jobs`.
 * - **Não duplica**: documento que já tem tradução na fila fica com a dele.
 *
 * Em banco novo (CI) roda antes de existir conteúdo e não enfileira nada.
 *
 * ⚠️ `overwrite`: o inglês copiado do português (as 18 soluções da D-52) é
 * trocado pela tradução. O slug não vai à IA (`semTraduzirOSlug`). */

const ORDEM: readonly (typeof COLECOES_TRADUZIDAS_SOZINHAS)[number][] = [
  'pages',
  'solutions',
  'segments',
  'cases',
  'jobs',
  'webinars',
  'resources',
  'partners',
  'specialist-roles',
  'testimonials',
  'topics',
  'posts',
]

/* Os nomes que o plugin dá ao fluxo e à fila (`createPayloadJobsRunner`, sem
   `taskName` nem `queueName` no nosso config). */
const FLUXO = 'translate_document_locales'
const FILA = 'translations'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const naFila = await payload.find({
    collection: 'payload-jobs',
    where: { and: [{ queue: { equals: FILA } }, { completedAt: { exists: false } }] },
    pagination: false,
    depth: 0,
    req,
  })
  const jaPedidos = new Set(
    naFila.docs.map((j) => {
      const input = j.input as { collection_slug?: string; collection_id?: string } | null
      return `${input?.collection_slug}/${input?.collection_id}`
    }),
  )

  let total = 0
  for (const slug of ORDEM) {
    const colecao = payload.collections[slug as CollectionSlug]
    if (!colecao) continue
    const comRascunho = Boolean(colecao.config.versions && colecao.config.versions.drafts)

    const { docs } = await payload.find({
      collection: slug as CollectionSlug,
      where: comRascunho ? { _status: { equals: 'published' } } : {},
      sort: slug === 'posts' ? '-publishedAt' : 'createdAt',
      select: { [CAMPO_DA_TRAVA]: true },
      locale: 'pt',
      pagination: false,
      depth: 0,
      req,
    })

    let naColecao = 0
    for (const doc of docs as unknown as Record<string, unknown>[]) {
      const id = String(doc.id)
      if (doc[CAMPO_DA_TRAVA] === true || jaPedidos.has(`${slug}/${id}`)) continue
      await payload.jobs.queue({
        workflow: FLUXO as never,
        queue: FILA,
        input: {
          collection_slug: slug,
          collection_id: id,
          source_lng: 'pt',
          target_lngs: ['en'],
          strategy: 'overwrite',
          publish_on_translation: true,
          requester_id: null,
          requester_collection: null,
        } as never,
        req,
      })
      naColecao++
    }
    total += naColecao
    payload.logger.info(`[carga-do-ingles] ${slug}: ${naColecao} na fila`)
  }
  payload.logger.info(`[carga-do-ingles] ${total} documentos na fila, um por minuto`)
}

/* Não desfaz: o que a fila já traduziu está publicado, e apagar os pedidos
   pendentes levaria junto os que o admin fez depois. Para parar a carga,
   cancelar em `payload-jobs` os da fila `translations`. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[carga-do-ingles] down não desfaz a carga — ver o comentário da migração')
}
