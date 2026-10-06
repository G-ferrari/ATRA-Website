import { APIError, type CollectionBeforeDeleteHook } from 'payload'

import { ehSecaoMestra, nomeDaSecao } from '@/lib/paginas-mestras'

/* Página-mestra não se apaga (decisão de 05/10): a rota da seção existe no
 * código e depende dela — apagar derrubaria a seção inteira com 404, sem volta
 * pelo admin. Despublicar continua possível: tira a seção do ar de propósito, e
 * o campo "Página-mestra de" avisa disso.
 *
 * `draft: true` porque a página pode estar só em rascunho, e a marca da seção
 * vale do mesmo jeito. */
export const impedirExclusaoDePaginaMestra: CollectionBeforeDeleteHook = async ({ req, id }) => {
  /* `select`: sem ele a leitura de `pages` faz um JOIN por tipo de bloco. */
  const doc = await req.payload.findByID({
    collection: 'pages',
    id,
    depth: 0,
    req,
    draft: true,
    select: { title: true, masterOf: true },
  })
  if (ehSecaoMestra(doc?.masterOf)) {
    throw new APIError(
      `"${doc.title}" é a página-mestra da seção ${nomeDaSecao(doc.masterOf)} e não pode ser apagada. Para tirá-la do ar, despublique.`,
      400,
      undefined,
      true,
    )
  }
}
