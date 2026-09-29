import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import type { Where } from 'payload'

import { FIM_EN, trocarOFim } from './arquivos/fim-das-paginas'

/* Migração de **dados**: toda página interna montada por blocos termina com a
 * faixa da página do Google Cloud, e as soluções e os segmentos do WordPress
 * perdem o formulário do fim (pedido do G-ferrari em 29/09 — D-42).
 *
 * Alcança todas as soluções e todos os segmentos com layout, e /sobre. A regra
 * de troca e a trava moram em `arquivos/fim-das-paginas.ts`, com teste: página
 * que não termina como a migração conhece foi editada no admin e fica como
 * está, com aviso no log.
 *
 * ⚠️ Em **banco novo** isto roda antes de existir conteúdo e não acha página
 * nenhuma (a armadilha do CLAUDE.md). Por isso o seed (`migracoes-de-dados.ts`)
 * e os importadores de soluções e segmentos chamam este `up` no fim.
 *
 * O inglês: a faixa nova entra sem id, então nasce sem texto em /en e cai no
 * português pelo `fallback` — como o resto das páginas que só têm português.
 * Onde a página **tinha** a faixa antiga traduzida (IA e /sobre), grava-se a
 * versão inglesa, relendo o layout em inglês sem fallback para não congelar
 * português dentro do inglês. */

type Colecao = 'solutions' | 'segments' | 'pages'
type Bloco = { blockType: string; id?: string | null; [campo: string]: unknown }

const ultimaFaixa = (layout: Bloco[]) => [...layout].reverse().find((b) => b.blockType === 'ctaBanner')

const ALVOS: { colecao: Colecao; where?: Where }[] = [
  { colecao: 'solutions' },
  { colecao: 'segments' },
  { colecao: 'pages', where: { slug: { equals: 'sobre' } } },
]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const { colecao, where } of ALVOS) {
    const { docs } = await payload.find({ collection: colecao, where, locale: 'pt', depth: 0, limit: 200, pagination: false, req })

    for (const doc of docs) {
      const layout = (doc.layout ?? []) as Bloco[]
      if (layout.length === 0) continue
      const nome = `${colecao}/${doc.slug}`

      const troca = trocarOFim(layout)
      if (!troca.layout) {
        payload.logger.warn(`[fim-das-paginas] "${nome}" mantida: ${troca.motivo}`)
        continue
      }

      /* A faixa antiga em inglês, lida antes de a troca apagá-la: é ela que diz
         se a página foi traduzida. */
      const emIngles = await payload.findByID({ collection: colecao, id: doc.id, locale: 'en', fallbackLocale: false, depth: 0, req })
      const faixaAntigaEn = ultimaFaixa((emIngles.layout ?? []) as Bloco[])
      const faixaAntigaPt = ultimaFaixa(layout)
      const traduzida = Boolean(faixaAntigaEn?.title) && faixaAntigaEn?.title !== faixaAntigaPt?.title

      const gravado = await payload.update({ collection: colecao, id: doc.id, locale: 'pt', data: { layout: troca.layout } as never, depth: 0, req })
      payload.logger.info(`[fim-das-paginas] "${nome}" com o fim padrão`)
      if (!traduzida) continue

      /* O layout inglês relido depois da troca traz os ids de todos os níveis
         (`casarIds` não é preciso) e só o que já era inglês. */
      const releitura = await payload.findByID({ collection: colecao, id: doc.id, locale: 'en', fallbackLocale: false, depth: 0, req })
      const layoutEn = ((releitura.layout ?? []) as Bloco[]).map((b) =>
        b.id === (gravado.layout as Bloco[]).at(-1)?.id
          ? {
              ...b,
              title: FIM_EN.title,
              description: FIM_EN.description,
              cta: { ...(b.cta as object), label: FIM_EN.cta.label },
              secondaryCta: { ...(b.secondaryCta as object), label: FIM_EN.secondaryCta.label },
            }
          : b,
      )
      try {
        await payload.update({ collection: colecao, id: doc.id, locale: 'en', data: { layout: layoutEn } as never, depth: 0, req })
        payload.logger.info(`[fim-das-paginas] "${nome}" com a faixa em inglês`)
      } catch (erro) {
        /* Inglês incompleto em algum bloco obrigatório: a faixa fica no
           português, pelo fallback, e o resto da página não é tocado. */
        payload.logger.warn(`[fim-das-paginas] "${nome}": faixa em inglês não gravada (${(erro as Error).message})`)
      }
    }
  }
}

/* Sem volta automática, como nas outras migrações de conteúdo: a versão
 * anterior de cada página fica no histórico de versões do admin. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[fim-das-paginas] sem desfazer automático: restaurar pelo histórico de versões de cada página')
}
