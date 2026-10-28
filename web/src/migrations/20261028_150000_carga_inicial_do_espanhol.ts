import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'
import type { CollectionSlug } from 'payload'

import { GLOBAIS_TRADUZIDOS, pedirTraducaoDeGlobal } from '../lib/traducao-de-globais'
import {
  COLECOES_TRADUZIDAS_SOZINHAS,
  FILA_DE_TRADUCAO,
  FLUXO_DE_TRADUCAO,
  TRAVAS,
} from '../lib/traducao-automatica'

/* Migração de **dados**: a carga inicial do espanhol (D-77), gêmea da
 * `20261027_200000_carga_inicial_do_ingles`. Pedido do Leonardo, 28/10, que
 * não tem acesso ao servidor: por isso é migração, e não script.
 *
 * Quatro passos:
 *
 * 1. **O slug português vira o slug espanhol** de todo documento que ainda não
 *    tem um. Sem slug gravado no espanhol, o documento não existe no `/es`
 *    (D-69): a rota dá 404 e as listagens saem vazias. A tradução também o
 *    copiaria (o plugin põe o slug português quando o destino está vazio,
 *    D-74), mas só quando a fila chegar no documento — umas 6 horas para o
 *    último. Copiado antes, o `/es` existe inteiro desde o deploy e mostra o
 *    português pelo fallback, item a item, até a tradução chegar.
 *    Por SQL, e não `payload.update`: o update parte da última versão, e com
 *    rascunho pendente publicaria o rascunho (ver CLAUDE.md).
 * 2. **O interruptor do espanhol copia o do inglês**: quem ligou a tradução
 *    automática quis o site traduzido, e um idioma novo não deveria nascer
 *    parado sem ninguém ter pedido.
 * 3. **Os documentos publicados vão à fila**, na ordem da carga do inglês:
 *    páginas primeiro, o Blog por último, do mais novo para o mais antigo. A
 *    trava "Espanhol revisado à mão" vale; documento que já tem pedido de
 *    espanhol na fila fica com o dele.
 * 4. **Os globais** (menu, rodapé, painel, cookies, ATRA AI, diagnóstico) vão
 *    à fila depois dos documentos — `lib/traducao-de-globais.ts`.
 *
 * Só enfileira: quem traduz é a fila, um por minuto, e ela começa quando
 * alguém abre o admin depois do deploy. ~340 pedidos, umas 6 horas.
 *
 * Em banco novo (CI) roda antes de existir conteúdo: não copia nem enfileira
 * documento. Os globais entram na fila mesmo assim, e sem `GEMINI_API_KEY`
 * falham nas 4 tentativas e ficam registrados em `payload-jobs` — o mesmo que
 * a carga do inglês faria. */

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

type Banco = MigrateUpArgs['db']

/** O passo 1, sozinho: o seed o chama de novo (`scripts/seed/migracoes-de-dados.ts`),
 *  porque em banco novo o `migrate` roda antes de existir conteúdo. Idempotente:
 *  só preenche slug espanhol vazio. */
export async function copiarSlugsParaOEspanhol(db: Banco, log: (msg: string) => void = () => {}) {
  /* Tabelas achadas pela coluna, para collection nova com slug localizado não
     ficar de fora (os `_v` guardam `version_slug`). */
  const { rows: tabelas } = await db.execute<{ table_name: string; column_name: string }>(sql`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND column_name IN ('slug', 'version_slug') AND table_name LIKE '%\_locales'`)
  for (const { table_name: tabela, column_name: coluna } of tabelas) {
    const { rows } = await db.execute<{ copiados: number }>(sql`
      WITH copiados AS (
        INSERT INTO ${sql.identifier(tabela)} ("_locale", "_parent_id", ${sql.identifier(coluna)})
        SELECT 'es', "_parent_id", ${sql.identifier(coluna)} FROM ${sql.identifier(tabela)}
        WHERE "_locale" = 'pt' AND ${sql.identifier(coluna)} IS NOT NULL
        ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET ${sql.identifier(coluna)} = EXCLUDED.${sql.identifier(coluna)}
        WHERE ${sql.identifier(tabela)}.${sql.identifier(coluna)} IS NULL
        RETURNING 1
      ) SELECT count(*)::int AS copiados FROM copiados`)
    if (rows[0]?.copiados) log(`[carga-do-espanhol] ${tabela}: ${rows[0].copiados} slugs`)
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  /* 1. O slug. */
  await copiarSlugsParaOEspanhol(db, (msg) => payload.logger.info(msg))

  /* 2. O interruptor. */
  await db.execute(sql`UPDATE "integrations" SET "spanish_translation_enabled" = "english_translation_enabled"`)

  /* 3. Os documentos. */
  const naFila = await payload.find({
    collection: 'payload-jobs',
    where: { and: [{ queue: { equals: FILA_DE_TRADUCAO } }, { completedAt: { exists: false } }] },
    pagination: false,
    depth: 0,
    req,
  })
  const jaPedidos = new Set(
    naFila.docs.flatMap((j) => {
      const input = j.input as { collection_slug?: string; collection_id?: string; target_lngs?: string[] } | null
      return input?.target_lngs?.includes('es') ? [`${input.collection_slug}/${input.collection_id}`] : []
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
      select: { [TRAVAS.es]: true },
      locale: 'pt',
      pagination: false,
      depth: 0,
      req,
    })

    let naColecao = 0
    for (const doc of docs as unknown as Record<string, unknown>[]) {
      const id = String(doc.id)
      if (doc[TRAVAS.es] === true || jaPedidos.has(`${slug}/${id}`)) continue
      await payload.jobs.queue({
        workflow: FLUXO_DE_TRADUCAO as never,
        queue: FILA_DE_TRADUCAO,
        input: {
          collection_slug: slug,
          collection_id: id,
          source_lng: 'pt',
          target_lngs: ['es'],
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
    payload.logger.info(`[carga-do-espanhol] ${slug}: ${naColecao} na fila`)
  }

  /* 4. Os globais. */
  for (const global of GLOBAIS_TRADUZIDOS) await pedirTraducaoDeGlobal(payload, global, 'es', req)
  payload.logger.info(`[carga-do-espanhol] ${total} documentos e ${GLOBAIS_TRADUZIDOS.length} globais na fila, um por minuto`)
}

/* Não desfaz, como a carga do inglês: o slug copiado é o que faz o `/es`
   existir, e o que a fila já traduziu está publicado. A volta de verdade é a
   de `20261028_144743_espanhol`, que apaga o idioma inteiro. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[carga-do-espanhol] down não desfaz a carga — ver o comentário da migração')
}
