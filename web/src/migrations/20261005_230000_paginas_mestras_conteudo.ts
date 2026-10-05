import { sql, type MigrateDownArgs, type MigrateUpArgs, type PostgresAdapter } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

import { layoutEmIngles, PAGINAS_MESTRAS_INICIAIS } from './arquivos/paginas-mestras'

/* Migração de **dados** das páginas-mestras (feature paginas-mestras, D-55):
 * cada seção ganha a sua página em Páginas, com os textos que estavam no
 * código em 05/10, literais — o visual não muda no dia em que vira CMS.
 *
 * - As 8 que eram código (Soluções, Segmentos, Consultores, Blog, Webinars,
 *   Cases, ATRA na mídia, E-books) são **criadas**, publicadas, em PT e EN.
 * - Carreiras e Insights já eram páginas do CMS: só ganham a marca de
 *   página-mestra, sem nenhuma mudança de conteúdo.
 *
 * Trava: seção que já tem página-mestra é pulada — a migração nunca toca no
 * que foi editado no admin. Endereço da seção já ocupado por outra página
 * **derruba** a migração (e o deploy, com rollback): pular em silêncio deixaria
 * a seção em 404 com o deploy verde.
 *
 * ⚠️ Em **banco novo** as 8 nascem aqui, mas Carreiras e Insights ainda não
 * existem (o seed as cria depois). Por isso `scripts/seed/migracoes-de-dados.ts`
 * chama `criarPaginasMestras` de novo no fim — é ela que as marca no CI. */

const JA_ERAM_CMS = [
  { secao: 'carreiras', slug: 'carreiras' },
  { secao: 'insights', slug: 'insights' },
] as const

type Executor = { execute: (consulta: ReturnType<typeof sql>) => Promise<unknown> }

export async function criarPaginasMestras(payload: Payload, req?: PayloadRequest, db?: Executor): Promise<void> {
  /* Fora de uma migração (o seed), sem transação: a conexão do adapter. */
  const banco = db ?? (payload.db as unknown as PostgresAdapter).drizzle
  /* `select`: sem ele a consulta a `pages` faz um JOIN por tipo de bloco. */
  const marcada = async (secao: string) =>
    (
      await payload.find({
        collection: 'pages',
        where: { masterOf: { equals: secao } },
        limit: 1,
        depth: 0,
        select: { masterOf: true },
        req,
      })
    ).docs[0]
  const comSlug = async (slug: string, locale: 'pt' | 'en') =>
    (
      await payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        locale,
        limit: 1,
        depth: 0,
        select: { slug: true },
        req,
      })
    ).docs[0]

  for (const { secao, slug } of JA_ERAM_CMS) {
    if (await marcada(secao)) continue
    const pagina = await comSlug(slug, 'pt')
    if (!pagina) {
      payload.logger.warn(`[paginas-mestras] "${slug}" ainda não existe; o seed a marca no fim`)
      continue
    }
    /* ⚠️ Por SQL, e não `payload.update`. O update parte da **última versão**
       da página: com um rascunho pendente no admin, ele publicaria o rascunho —
       e, com o `_status` dele, despublicaria a seção (404). A marca vai também
       para todas as versões: restaurar uma versão anterior a 05/10 não pode
       apagá-la, e o campo, vazio, nem aparece no admin para ser remarcado. */
    /* Um comando por chamada: com parâmetros, o Postgres não aceita dois. */
    await banco.execute(sql`UPDATE "pages" SET "master_of" = ${secao}::"enum_pages_master_of" WHERE "id" = ${pagina.id}`)
    await banco.execute(
      sql`UPDATE "_pages_v" SET "version_master_of" = ${secao}::"enum__pages_v_version_master_of" WHERE "parent_id" = ${pagina.id}`,
    )
    payload.logger.info(`[paginas-mestras] "${slug}" marcada como página-mestra de ${secao}`)
  }

  for (const p of PAGINAS_MESTRAS_INICIAIS) {
    if (await marcada(p.secao)) continue

    for (const locale of ['pt', 'en'] as const) {
      if (await comSlug(p.slug[locale], locale)) {
        throw new Error(
          `[paginas-mestras] "${p.slug[locale]}" (${locale}) já é o endereço de outra página: a página-mestra de ${p.secao} não pode nascer. Renomeie a outra página no admin e rode de novo.`,
        )
      }
    }

    const criada = await payload.create({
      collection: 'pages',
      locale: 'pt',
      depth: 0,
      req,
      data: {
        title: p.title.pt,
        slug: p.slug.pt,
        masterOf: p.secao,
        layout: p.layout,
        seo: p.seo.pt,
        _status: 'published',
      } as never,
    })
    /* O inglês por cima do português gravado, com os ids que o Payload deu a
       cada bloco — sem eles o português ficaria órfão. */
    await payload.update({
      collection: 'pages',
      id: criada.id,
      locale: 'en',
      depth: 0,
      req,
      data: {
        title: p.title.en,
        slug: p.slug.en,
        seo: p.seo.en,
        layout: layoutEmIngles((criada.layout ?? []) as never, p.layoutEn),
        _status: 'published',
      } as never,
    })
    payload.logger.info(`[paginas-mestras] página-mestra de ${p.secao} criada`)
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await criarPaginasMestras(payload, req, db)
}

/* Sem volta automática: apagar as páginas derrubaria as rotas (404), e elas não
 * podem ser apagadas pelo admin de propósito. Para desfazer, reverter o código
 * das rotas e apagar as páginas pelo banco. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[paginas-mestras] sem desfazer automático')
}
