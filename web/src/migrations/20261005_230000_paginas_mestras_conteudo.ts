import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
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
 * que foi editado no admin. Slug ocupado por outra página também pula, com
 * aviso: quem resolve é uma pessoa.
 *
 * ⚠️ Em **banco novo** as 8 nascem aqui, mas Carreiras e Insights ainda não
 * existem (o seed as cria depois). Por isso `scripts/seed/migracoes-de-dados.ts`
 * chama `criarPaginasMestras` de novo no fim — é ela que as marca no CI. */

const JA_ERAM_CMS = [
  { secao: 'carreiras', slug: 'carreiras' },
  { secao: 'insights', slug: 'insights' },
] as const

export async function criarPaginasMestras(payload: Payload, req?: PayloadRequest): Promise<void> {
  const marcada = async (secao: string) =>
    (await payload.find({ collection: 'pages', where: { masterOf: { equals: secao } }, limit: 1, depth: 0, req })).docs[0]

  for (const { secao, slug } of JA_ERAM_CMS) {
    if (await marcada(secao)) continue
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      locale: 'pt',
      limit: 1,
      depth: 0,
      req,
    })
    if (!docs[0]) {
      payload.logger.warn(`[paginas-mestras] "${slug}" ainda não existe; o seed a marca no fim`)
      continue
    }
    await payload.update({ collection: 'pages', id: docs[0].id, locale: 'pt', data: { masterOf: secao }, depth: 0, req })
    payload.logger.info(`[paginas-mestras] "${slug}" marcada como página-mestra de ${secao}`)
  }

  for (const p of PAGINAS_MESTRAS_INICIAIS) {
    if (await marcada(p.secao)) continue

    const ocupado = await payload.find({
      collection: 'pages',
      where: { slug: { equals: p.slug.pt } },
      locale: 'pt',
      limit: 1,
      depth: 0,
      req,
    })
    if (ocupado.docs[0]) {
      payload.logger.warn(`[paginas-mestras] "${p.slug.pt}" já é o endereço de outra página; ${p.secao} fica sem página-mestra`)
      continue
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

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await criarPaginasMestras(payload, req)
}

/* Sem volta automática: apagar as páginas derrubaria as rotas (404), e elas não
 * podem ser apagadas pelo admin de propósito. Para desfazer, reverter o código
 * das rotas e apagar as páginas pelo banco. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[paginas-mestras] sem desfazer automático')
}
