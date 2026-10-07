import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { comMosaico } from './arquivos/assessoria-mosaico'

/* Migração de **dados**: na página de Assessoria em Produtos, a seção de
 * parceiros — montada pelo marketing com a vitrine de conteúdo — passa para o
 * bloco "Mosaico de parceiros" (07/10, decisão do G-ferrari). Imagens, nomes,
 * textos e destinos são os que estão na página; só o bloco muda.
 *
 * Travas, todas para não atropelar o admin:
 * - a página já tem o mosaico, ou não tem uma vitrine em que todo cartão leva a
 *   um parceiro → nada a converter (`comMosaico`);
 * - a página não está publicada, ou tem **rascunho pendente** → não converte.
 *   `payload.update` parte da última versão: com rascunho, a conversão
 *   publicaria junto o que ainda não foi aprovado (a armadilha do CLAUDE.md).
 *
 * O inglês: a seção não tem texto próprio em inglês e cai no português pelo
 * `fallback`; o bloco novo nasce do mesmo jeito. Se um dia tiver, a conversão
 * já terá rodado.
 *
 * Em banco novo a página é o esqueleto de 02/10, sem vitrine: pula. */

const SLUG = 'assessoria-em-produtos'
type Bloco = { blockType: string; id?: string | null; [campo: string]: unknown }

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs } = await payload.find({
    collection: 'solutions',
    where: { slug: { equals: SLUG } },
    locale: 'pt',
    fallbackLocale: false,
    depth: 0,
    limit: 1,
    req,
  })
  const pagina = docs[0]
  if (!pagina) {
    payload.logger.warn(`[assessoria-mosaico] "${SLUG}" não existe — nada a converter`)
    return
  }

  const layout = comMosaico((pagina.layout ?? []) as Bloco[])
  if (!layout) {
    payload.logger.info('[assessoria-mosaico] sem vitrine de parceiros para converter (ou o mosaico já está na página)')
    return
  }

  if (pagina._status !== 'published') {
    payload.logger.warn('[assessoria-mosaico] a página não está publicada — conversão não feita')
    return
  }
  const { docs: versoes } = await payload.findVersions({
    collection: 'solutions',
    where: { parent: { equals: pagina.id } },
    sort: '-updatedAt',
    limit: 1,
    depth: 0,
    req,
  })
  if (versoes[0]?.version?._status === 'draft') {
    payload.logger.warn('[assessoria-mosaico] há rascunho pendente na página — conversão não feita, para não publicá-lo junto')
    return
  }

  await payload.update({ collection: 'solutions', id: pagina.id, locale: 'pt', data: { layout } as never, depth: 0, req })
  const mosaico = layout.find((b) => b.blockType === 'partnerMosaic')
  payload.logger.info(`[assessoria-mosaico] seção de parceiros convertida: ${(mosaico?.items as unknown[]).length} cartões`)
}

/* Sem volta automática: a versão anterior da página, com a vitrine, fica no
 * histórico de versões do admin. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[assessoria-mosaico] sem desfazer automático: restaurar a versão anterior da página no admin')
}
