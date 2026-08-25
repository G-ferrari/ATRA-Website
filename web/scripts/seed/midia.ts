import { readFileSync } from 'node:fs'
import path from 'node:path'

import type { Payload } from 'payload'

/* Upsert de mídia dos seeds — um lugar só (MIG-146).
 *
 * Este helper existia em **dez cópias** espalhadas pelos seeds, cada uma com o
 * mesmo corpo e pequenas derivas (o fallback de mimetype divergia, a chave de
 * busca também começava a divergir). A armadilha que todas carregam agora mora
 * numa linha só:
 *
 * ⚠️ A deduplicação é pelo **nome sem extensão**, com `contains`. A collection
 * `Media` converte todo upload para WebP (`formatOptions`), então o `.jpg` que
 * sobe vira `.webp` no `filename` — comparar o nome inteiro nunca casa e o
 * seed re-sobe o acervo todo a cada corrida.
 *
 * `ids.ts` já provou que módulo compartilhado funciona entre os seeds: a
 * restrição do `run.mjs` é sobre importar um *seed* do outro (top-level await
 * + process.exit), não utilitários-folha como este.
 */

export const MIMES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

type Opcoes = {
  /* `regravar` re-envia o arquivo quando o doc já existe, em vez de devolver o
   * que está lá. É a semântica de `sobre.ts` (MIG-071): os logos da vitrine
   * foram semeados uma vez como SVG desenhado à mão, e a versão que só criava
   * devolvia o desenho errado para sempre num banco que já tinha rodado o
   * seed. Os demais seeds não precisam — e re-enviar 300 arquivos por corrida
   * transformaria idempotência em upload em massa. */
  regravar?: boolean
}

/** Sobe (ou acha) uma mídia a partir de um caminho absoluto. Devolve o id. */
export async function midiaDe(
  payload: Payload,
  caminho: string,
  alt: string,
  { regravar = false }: Opcoes = {},
): Promise<number> {
  const nome = path.basename(caminho)
  const chave = nome.replace(/\.[^.]+$/, '')
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { contains: chave } },
    limit: 1,
    depth: 0,
  })
  if (docs[0] && !regravar) return docs[0].id

  const file = {
    data: readFileSync(caminho),
    mimetype: MIMES[path.extname(nome).toLowerCase()] ?? 'image/png',
    name: nome,
    size: 0,
  }
  const doc = docs[0]
    ? await payload.update({ collection: 'media', id: docs[0].id, data: { alt }, file, locale: 'pt' })
    : await payload.create({ collection: 'media', data: { alt }, file, locale: 'pt' })
  return doc.id
}

/* O marcador de capa pendente — a imagem que diz "falta capa" onde o conteúdo
 * ainda não tem uma de verdade (D-22/D-27). Era criado por quatro cópias de
 * `capaMarcadora`, com dois textos de alt diferentes; fica o descritivo. */
export async function capaPendente(payload: Payload): Promise<number> {
  return midiaDe(
    payload,
    path.resolve(process.cwd(), 'scripts/seed/assets/capa-pendente.png'),
    'CAPA PENDENTE — imagem real entra com o conteúdo',
  )
}
