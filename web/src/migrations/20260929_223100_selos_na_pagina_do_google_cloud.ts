import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { imagem } from './20260927_235900_solucoes_do_wordpress'
import { PAGINAS_DO_WORDPRESS } from './arquivos/solucoes-wp/conteudo'

/* Migração de **dados**: a página do Google Cloud ganha a grade com os 10 selos
 * oficiais, logo depois de "Nossas especializações" (pedido de 29/09).
 *
 * Os selos são os mesmos da solução Data Analytics — Partner, a especialização
 * em Data Analytics, 3 expertises e 5 certificações —, que vieram do WordPress
 * com título e texto (`arquivos/solucoes-wp/conteudo.ts`). A seção reaproveita
 * os dois: é o mesmo conteúdo publicado pela ATRA, em outro lugar do site.
 *
 * Os 7 cartões de especialização, que repetiam o logo do parceiro no lugar de
 * um selo, perderam o logo no componente (`bloco-parceiro-secao.tsx`). A lista
 * deles veio do protótipo e não bate com os selos (só Data Analytics coincide);
 * trocá-la é decisão de conteúdo (D-22) e não entra aqui.
 *
 * Trava: só age se a página existe, ainda tem a grade de especializações e não
 * tem grade de imagens. Em banco novo roda antes do conteúdo existir — o seed
 * (`migracoes-de-dados.ts`) chama este `up` no fim. */

type Bloco = { blockType: string; rightColumn?: string; [campo: string]: unknown }

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs } = await payload.find({
    collection: 'partners',
    where: { slug: { equals: 'google-cloud' } },
    locale: 'pt',
    depth: 0,
    limit: 1,
    req,
  })
  const parceiro = docs[0]
  if (!parceiro) {
    payload.logger.warn('[selos-gcp] parceiro "google-cloud" não existe neste banco — pulado')
    return
  }

  const layout = (parceiro.layout ?? []) as Bloco[]
  if (layout.some((b) => b.blockType === 'imageGrid')) {
    payload.logger.warn('[selos-gcp] a página já tem uma grade de imagens — mantida')
    return
  }
  const especializacoes = layout.findIndex((b) => b.blockType === 'partnerSplit' && b.rightColumn === 'specGrid')
  if (especializacoes < 0) {
    payload.logger.warn('[selos-gcp] a página não tem mais a grade de especializações — mantida')
    return
  }

  const secao = PAGINAS_DO_WORDPRESS.find((p) => p.slug === 'data-analytics')?.secoes.find(
    (s) => s.tipo === 'imagens',
  )
  if (secao?.tipo !== 'imagens') throw new Error('[selos-gcp] a seção de selos sumiu de solucoes-wp/conteudo.ts')

  const imagens: { image: number }[] = []
  for (const i of secao.imagens) imagens.push({ image: await imagem({ payload, req }, i.arquivo, i.alt, i.origem) })

  const grade = {
    blockType: 'imageGrid',
    anchor: 'certificacoes',
    navLabel: 'Certificações',
    title: secao.titulo,
    description: secao.descricao,
    images: imagens,
    boxed: true,
  }

  await payload.update({
    collection: 'partners',
    id: parceiro.id,
    locale: 'pt',
    data: { layout: [...layout.slice(0, especializacoes + 1), grade, ...layout.slice(especializacoes + 1)] } as never,
    req,
  })
  payload.logger.info(`[selos-gcp] ${imagens.length} selos na página do Google Cloud`)
}

/* Sem volta automática: tirar a grade é apagar o bloco no admin (Parceiros →
 * Google Cloud), o que não perde edição feita depois. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[selos-gcp] sem desfazer automático: apagar o bloco "Grade de imagens" pelo admin')
}
