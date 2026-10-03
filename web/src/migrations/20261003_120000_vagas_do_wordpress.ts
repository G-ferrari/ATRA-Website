import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { intocada, lerVagasExportadas, PROVA_DA_CARGA, VAGAS_FECHADAS } from './arquivos/vagas-wp/sincronia'

/* Migração de **dados**: põe as vagas do site no mesmo ponto do WordPress em
 * 03/10 — cria as 6 abertas depois da carga de 25/08, atualiza o texto das que
 * mudaram lá e despublica as 4 que fecharam.
 *
 * O texto já convertido vem de `arquivos/vagas-wp/vagas.json`, escrito por
 * `scripts/wp-import/exportar-vagas.ts` com o recorte e o conversor do
 * importador. É o caminho dos artigos novos: o deploy não roda importador.
 *
 * Travas (regras e teste em `arquivos/vagas-wp/sincronia.ts`):
 * - **Só onde a carga do WordPress está.** Banco novo tem as vagas de teste do
 *   seed; criar vagas reais no meio delas mudaria o que o e2e mede.
 * - **Não sobrescreve o admin.** Vaga alterada depois da carga de 25/08 foi
 *   editada por alguém, e fica como está — atualizar e despublicar, só a
 *   intocada. Vaga que não existe é criada.
 * - **Despublica, não apaga** — e só as 4 da lista fechada. O endereço antigo
 *   delas no WordPress passa a levar a `/carreiras` (`redirects.csv`).
 *
 * O inglês recebe título, slug e resumo, como no importador: sem o slug em
 * `en`, `/en/careers/<slug>` dá 404. O texto é o português (P-08). */

type Ctx = Pick<MigrateUpArgs, 'payload' | 'req'>

export async function sincronizarVagas({ payload, req }: Ctx): Promise<void> {
  const { totalDocs: temCarga } = await payload.count({ collection: 'jobs', where: { slug: { equals: PROVA_DA_CARGA } }, locale: 'pt', req })
  if (temCarga === 0) {
    payload.logger.warn('[vagas-wp] este banco não tem a carga de vagas do WordPress — pulado')
    return
  }

  for (const vaga of lerVagasExportadas()) {
    const { docs } = await payload.find({ collection: 'jobs', where: { slug: { equals: vaga.slug } }, locale: 'pt', depth: 0, limit: 1, req })
    const atual = docs[0]
    if (atual && !intocada(atual.updatedAt)) {
      payload.logger.warn(`[vagas-wp] "${vaga.titulo}" foi editada no admin — mantida`)
      continue
    }

    const dados = {
      title: vaga.titulo,
      slug: vaga.slug,
      locationType: vaga.modelo,
      summary: vaga.resumo,
      /* O campo guarda `{ root }`; o arquivo traz só a raiz, como sai do
       * conversor. Sem o invólucro a vaga é gravada e a página sai sem texto. */
      body: { root: vaga.corpo } as never,
      publishedAt: vaga.publicadaEm,
      _status: 'published' as const,
    }
    const doc = atual
      ? await payload.update({ collection: 'jobs', id: atual.id, locale: 'pt', data: dados, depth: 0, req })
      : await payload.create({ collection: 'jobs', locale: 'pt', data: dados, depth: 0, req })
    await payload.update({
      collection: 'jobs',
      id: doc.id,
      locale: 'en',
      data: { title: dados.title, slug: dados.slug, summary: dados.summary },
      depth: 0,
      req,
    })
    payload.logger.info(`[vagas-wp] "${vaga.titulo}" ${atual ? 'atualizada' : 'criada'}`)
  }

  for (const slug of VAGAS_FECHADAS) {
    const { docs } = await payload.find({ collection: 'jobs', where: { slug: { equals: slug } }, locale: 'pt', depth: 0, limit: 1, req })
    const vaga = docs[0]
    if (!vaga || vaga._status !== 'published') continue
    if (!intocada(vaga.updatedAt)) {
      payload.logger.warn(`[vagas-wp] "${vaga.title}" fechou no WordPress, mas foi editada no admin — mantida`)
      continue
    }
    await payload.update({ collection: 'jobs', id: vaga.id, locale: 'pt', data: { _status: 'draft' }, depth: 0, req })
    payload.logger.info(`[vagas-wp] "${vaga.title}" despublicada (fechou no WordPress)`)
  }
}

export async function up(ctx: MigrateUpArgs): Promise<void> {
  await sincronizarVagas(ctx)
}

/* Sem volta automática: vaga se publica e despublica pelo admin (Conteúdo →
 * Vagas), e o texto anterior fica no histórico de versões. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[vagas-wp] sem desfazer automático: ajustar as vagas pelo admin, se for o caso')
}
