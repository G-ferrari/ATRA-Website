import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { casarIds } from '../../scripts/seed/ids'
import { ABAS_DE_SOLUCOES } from '../lib/abas-de-solucoes'

import { layoutEsqueleto, SLUG_MARCADOR, SLUGS_ANTIGOS, SOLUCOES_NOVAS } from './arquivos/solucoes-estrutura'

/* Migração de **dados**: troca a oferta do menu de Soluções pela estrutura nova
 * (D-52, pedido do G-ferrari em 02/10) — 18 soluções em 4 abas, cada uma com a
 * sua página-esqueleto, no lugar das 18 que estavam no ar.
 *
 * ⚠️ **Apaga de vez** as 18 antigas — as 6 do protótipo e as 12 do WordPress,
 * com as páginas e o histórico de versões. Foi a escolha do G-ferrari entre
 * despublicar, reaproveitar e apagar. As imagens ficam na Biblioteca, e o que
 * traz o texto de volta é o backup diário da VPS (ou o WordPress, enquanto ele
 * existir). A lista do que sai é fechada: `SLUGS_ANTIGOS`. A RC18 não está nela.
 *
 * Trava: se a solução-marcador da estrutura nova já existe, não faz nada. É o
 * que impede uma segunda corrida de apagar "Alocação de Consultores" e
 * "Assessoria em Produtos" — que mantêm o endereço — depois de o time já ter
 * escrito a página nova.
 *
 * As novas nascem publicadas, com página: topo (título e a frase da lista) e a
 * faixa final padrão. O inglês repete o português, com o mesmo endereço (P-08)
 * — sem o slug em inglês a rota não existe naquele idioma. */

type Ctx = Pick<MigrateUpArgs, 'payload' | 'req'>

export async function montarNovaEstruturaDeSolucoes({ payload, req }: Ctx): Promise<void> {
  const { totalDocs: jaChegou } = await payload.count({
    collection: 'solutions',
    where: { slug: { equals: SLUG_MARCADOR } },
    locale: 'pt',
    req,
  })
  if (jaChegou > 0) {
    payload.logger.warn('[solucoes] a estrutura nova já está neste banco — nada a fazer')
    return
  }

  const { docs: antigas } = await payload.find({
    collection: 'solutions',
    locale: 'pt',
    depth: 0,
    limit: SLUGS_ANTIGOS.length,
    where: { and: [{ slug: { in: SLUGS_ANTIGOS } }, { category: { not_equals: 'rc18' } }] },
    select: { slug: true },
    req,
  })
  for (const antiga of antigas) {
    await payload.delete({ collection: 'solutions', id: antiga.id, depth: 0, req })
    payload.logger.info(`[solucoes] apagada: ${antiga.slug}`)
  }

  const ordemNaAba = new Map<string, number>()
  for (const solucao of SOLUCOES_NOVAS) {
    const aba = ABAS_DE_SOLUCOES.find((a) => a.id === solucao.aba)!
    const order = ordemNaAba.get(solucao.aba) ?? 0
    ordemNaAba.set(solucao.aba, order + 1)

    const comuns = {
      slug: solucao.slug,
      category: solucao.aba,
      icon: solucao.icon,
      hasPage: true,
      order,
      _status: 'published' as const,
    }
    const textos = { title: solucao.title, shortDescription: solucao.shortDescription, badge: solucao.badge ?? null }

    const criada = await payload.create({
      collection: 'solutions',
      locale: 'pt',
      data: { ...comuns, ...textos, layout: layoutEsqueleto(solucao, aba.pt, 'pt') } as never,
      req,
    })

    /* O inglês reenvia o layout com os ids de todos os níveis: sem eles o
     * Payload trata os blocos como novos e o português fica órfão. */
    const gravada = await payload.findByID({ collection: 'solutions', id: criada.id, locale: 'pt', depth: 0, req })
    await payload.update({
      collection: 'solutions',
      id: criada.id,
      locale: 'en',
      data: { ...comuns, ...textos, layout: casarIds(layoutEsqueleto(solucao, aba.en, 'en'), gravada.layout) } as never,
      req,
    })
    payload.logger.info(`[solucoes] criada: ${solucao.slug} (${aba.pt})`)
  }
}

export async function up(ctx: MigrateUpArgs): Promise<void> {
  await montarNovaEstruturaDeSolucoes(ctx)
}

/* Sem volta: as páginas antigas foram apagadas, e só o backup as devolve. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[solucoes] sem desfazer automático: as soluções antigas só voltam por restauração de backup')
}
