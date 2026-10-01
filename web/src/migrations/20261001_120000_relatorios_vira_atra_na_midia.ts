import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { comAtraNaMidia, mudaAlgo } from './arquivos/atra-na-midia'

/* Migração de **dados**: "Relatórios" vira "ATRA na mídia" no conteúdo gravado
 * no CMS — o item do menu, a aba e a categoria dos cartões da página Insights —
 * e todo link para `/relatorios` passa a apontar para `/atra-na-midia` (D-43,
 * pedido do G-ferrari em 01/10).
 *
 * O título e o endereço da própria página mudaram no código (`lib/routes.ts`),
 * e o endereço antigo redireciona (`ROTAS_RENOMEADAS`): esta migração existe
 * para o menu não mostrar o nome velho nem depender do redirect a cada clique.
 *
 * A regra mora em `arquivos/atra-na-midia.ts`, com teste: troca rótulo exato e
 * destino, nunca frase. Só grava onde algo muda, então rodar de novo não cria
 * versão. O inglês é relido sem fallback, para não congelar português dentro
 * dele; onde o inglês de uma página está incompleto, fica o aviso no log.
 *
 * Banco novo não precisa dela: os seeds (`navegacao.ts`, `insights.ts`) já
 * nascem com o nome e o endereço novos. */

const IDIOMAS = ['pt', 'en'] as const

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const slug of ['navigation', 'footer'] as const) {
    for (const locale of IDIOMAS) {
      // Sem os campos de sistema: o que volta para o `updateGlobal` é só conteúdo.
      const { id: _id, createdAt: _c, updatedAt: _u, globalType: _g, ...atual } = (await payload.findGlobal({
        slug,
        locale,
        fallbackLocale: false,
        depth: 0,
        req,
      })) as unknown as Record<string, unknown>
      if (!mudaAlgo(atual)) continue
      try {
        await payload.updateGlobal({ slug, locale, data: comAtraNaMidia(atual) as never, depth: 0, req })
        payload.logger.info(`[atra-na-midia] global "${slug}" (${locale}) atualizado`)
      } catch (erro) {
        payload.logger.warn(`[atra-na-midia] global "${slug}" (${locale}) não gravado: ${(erro as Error).message}`)
      }
    }
  }

  const { docs: paginas } = await payload.find({ collection: 'pages', locale: 'pt', depth: 0, limit: 200, pagination: false, select: { slug: true }, req })
  for (const { id, slug } of paginas) {
    for (const locale of IDIOMAS) {
      const pagina = await payload.findByID({ collection: 'pages', id, locale, fallbackLocale: false, depth: 0, req })
      if (!mudaAlgo(pagina.layout)) continue
      try {
        await payload.update({ collection: 'pages', id, locale, data: { layout: comAtraNaMidia(pagina.layout) } as never, depth: 0, req })
        payload.logger.info(`[atra-na-midia] página "${slug}" (${locale}) atualizada`)
      } catch (erro) {
        payload.logger.warn(`[atra-na-midia] página "${slug}" (${locale}) não gravada: ${(erro as Error).message}`)
      }
    }
  }
}

/* Sem volta automática: o nome antigo não volta, e o conteúdo anterior de cada
 * página fica no histórico de versões do admin. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[atra-na-midia] sem desfazer automático: restaurar pelo histórico de versões, se for o caso')
}
