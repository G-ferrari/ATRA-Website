import { readFileSync } from 'node:fs'
import path from 'node:path'

import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { MATERIAS_DO_WORDPRESS, type MateriaDoWordpress } from './arquivos/atra-na-midia/conteudo'

/* Migração de **dados**: cria na collection `press` as 6 matérias da página
 * `/atra-na-midia/` do WordPress (D-49), com as capas de `arquivos/atra-na-midia/`.
 *
 * É o caminho das soluções, dos segmentos e dos artigos novos: conteúdo que
 * precisa chegar a um ambiente que já existe vem por migração, porque o deploy
 * não roda seed nem importador.
 *
 * Travas:
 * - **Só onde a carga do WordPress está.** Banco novo roda as migrações antes
 *   de existir conteúdo — e, no job `verify` do CI, sem storage para receber as
 *   capas. Ali quem cria as matérias é o seed (`migracoes-de-dados.ts`), pela
 *   mesma função, no job que tem o MinIO. A prova da carga é o último artigo
 *   dela, como na migração dos artigos novos.
 * - **Só cria.** Matéria cujo link já existe — publicada, rascunho, cadastrada à
 *   mão — fica como está. O `url` é `unique` na collection.
 * - A capa é achada pelo prefixo do arquivo (`atra-na-midia-NN-`), que sobrevive
 *   à conversão para WebP: rodar duas vezes não sobe a imagem de novo.
 *
 * O inglês não é gravado: os campos localizados caem no português pelo
 * `fallback`, como o resto do conteúdo que ainda não foi traduzido. */

const PASTA = path.resolve(process.cwd(), 'src/migrations/arquivos/atra-na-midia')
const ULTIMO_ARTIGO_DA_CARGA = 'atra-no-rio-preto-tech-summit-2026-dados-cloud-e-ia'

type Ctx = Pick<MigrateUpArgs, 'payload' | 'req'>

async function capa({ payload, req }: Ctx, materia: MateriaDoWordpress): Promise<number> {
  const chave = materia.imagem.match(/^atra-na-midia-\d+-/)?.[0]
  if (!chave) throw new Error(`[atra-na-midia] nome de capa fora do padrão: ${materia.imagem}`)
  const { docs } = await payload.find({ collection: 'media', where: { filename: { contains: chave } }, limit: 1, depth: 0, req })
  if (docs[0]) return docs[0].id

  const data = readFileSync(path.join(PASTA, materia.imagem))
  const doc = await payload.create({
    collection: 'media',
    locale: 'pt',
    /* A página antiga não dava texto alternativo a nenhuma das capas. O título
       da matéria com o veículo descreve o que a imagem ilustra. */
    data: { alt: `${materia.veiculo}: ${materia.titulo}`, credit: materia.origemDaImagem },
    file: { data, mimetype: 'image/jpeg', name: materia.imagem, size: data.length },
    req,
  })
  return doc.id
}

export async function criarMateriasDaImprensa(ctx: Ctx, { exigirCarga }: { exigirCarga: boolean }): Promise<void> {
  const { payload, req } = ctx

  if (exigirCarga) {
    const { totalDocs } = await payload.count({ collection: 'posts', where: { slug: { equals: ULTIMO_ARTIGO_DA_CARGA } }, locale: 'pt', req })
    if (totalDocs === 0) {
      payload.logger.warn('[atra-na-midia] este banco não tem a carga do WordPress — pulado (as matérias entram pelo seed)')
      return
    }
  }

  for (const [i, materia] of MATERIAS_DO_WORDPRESS.entries()) {
    const { totalDocs } = await payload.count({ collection: 'press', where: { url: { equals: materia.url } }, req })
    if (totalDocs > 0) {
      payload.logger.warn(`[atra-na-midia] "${materia.veiculo}" já existe — mantida`)
      continue
    }

    await payload.create({
      collection: 'press',
      locale: 'pt',
      data: {
        title: materia.titulo,
        outlet: materia.veiculo,
        description: materia.resumo,
        url: materia.url,
        coverImage: await capa(ctx, materia),
        kind: materia.tipo,
        order: i + 1,
        _status: 'published',
      },
      req,
    })
    payload.logger.info(`[atra-na-midia] "${materia.veiculo}" criada`)
  }
}

export async function up(ctx: MigrateUpArgs): Promise<void> {
  await criarMateriasDaImprensa(ctx, { exigirCarga: true })
}

/* Sem volta automática: matéria publicada some do site despublicando ou
 * apagando no admin (Conteúdo → ATRA na mídia). */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[atra-na-midia] sem desfazer automático: despublicar pelo admin, se for o caso')
}
