import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import type { CollectionSlug } from 'payload'

import { TAREFA_DE_GLOBAL } from '../lib/traducao-de-globais'
import { FILA_DE_TRADUCAO, FLUXO_DE_TRADUCAO, TRAVAS, type IdiomaTraduzido } from '../lib/traducao-automatica'

/* Migração de **dados**: retoma a carga do espanhol (D-77), que parou no meio.
 *
 * Em 30/10 o Gemini passou a recusar a `GEMINI_API_KEY` (a ATRA AI respondia
 * 502). A fila de tradução seguia andando, um pedido por minuto, e cada pedido
 * de espanhol que chegou à vez dele falhou as 4 tentativas e ficou parado em
 * `payload-jobs` com `hasError` — que o Payload não tenta de novo. A chave
 * voltou (chat conferido em 04/11), mas os pedidos não. Em 04/11 o `/es/blog`
 * ainda mostrava artigos em português e o menu do `/es` misturava "Soluções"
 * com "Soluciones". Pedido do Leonardo, 04/11, que não tem acesso ao servidor:
 * por isso é migração, como a carga de 28/10.
 *
 * Repõe na fila **só os pedidos que falharam**, com a mesma entrada: o que já
 * foi traduzido não se traduz de novo. Documento com a trava "Espanhol revisado
 * à mão" fica de fora, e pedido que já tem gêmeo pendente na fila também. Os
 * documentos voltam na ordem original (o Blog no fim) e os globais (menu,
 * rodapé…) por último. O pedido velho fica em `payload-jobs` como registro.
 *
 * Um pedido falho que também pedia o inglês volta com os dois idiomas: se ele
 * falhou, o inglês daquele documento também ficou para trás.
 *
 * Em banco novo (CI) não há pedido falho: não faz nada. */

type EntradaDeDocumento = {
  collection_slug?: string
  collection_id?: string
  target_lngs?: string[]
}
type EntradaDeGlobal = { global?: string; alvo?: string }

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs: jobs } = await payload.find({
    collection: 'payload-jobs',
    where: { queue: { equals: FILA_DE_TRADUCAO } },
    sort: 'createdAt',
    pagination: false,
    depth: 0,
    req,
  })

  const pendentes = new Set<string>()
  const chave = (j: (typeof jobs)[number]) => {
    const input = (j.input ?? {}) as EntradaDeDocumento & EntradaDeGlobal
    return input.global ? `global/${input.global}/${input.alvo}` : `${input.collection_slug}/${input.collection_id}`
  }
  for (const j of jobs) if (!j.hasError && !j.completedAt) pendentes.add(chave(j))

  const repostos = new Set<string>()
  let documentos = 0
  let globais = 0
  const globaisFalhos: (typeof jobs)[number][] = []

  for (const j of jobs) {
    if (!j.hasError) continue
    const id = chave(j)
    if (pendentes.has(id) || repostos.has(id)) continue

    if (j.taskSlug === TAREFA_DE_GLOBAL) {
      if ((j.input as EntradaDeGlobal | null)?.alvo === 'es') globaisFalhos.push(j)
      continue
    }
    if (j.workflowSlug !== FLUXO_DE_TRADUCAO) continue
    const input = j.input as EntradaDeDocumento | null
    if (!input?.collection_slug || !input.collection_id || !input.target_lngs?.includes('es')) continue

    /* A trava pode ter sido marcada depois do pedido; e o documento pode ter
       sido apagado. */
    const doc = (await payload
      .findByID({
        collection: input.collection_slug as CollectionSlug,
        id: input.collection_id,
        locale: 'pt',
        depth: 0,
        disableErrors: true,
        req,
      })
      .catch(() => null)) as Record<string, unknown> | null
    if (!doc) continue
    const alvos = input.target_lngs.filter((l) => doc[TRAVAS[l as IdiomaTraduzido]] !== true)
    if (!alvos.includes('es')) continue

    await payload.jobs.queue({
      workflow: FLUXO_DE_TRADUCAO as never,
      queue: FILA_DE_TRADUCAO,
      input: { ...(j.input as object), target_lngs: alvos } as never,
      req,
    })
    repostos.add(id)
    documentos++
  }

  for (const j of globaisFalhos) {
    const id = chave(j)
    if (repostos.has(id)) continue
    await payload.jobs.queue({ task: TAREFA_DE_GLOBAL as never, queue: FILA_DE_TRADUCAO, input: j.input as never, req })
    repostos.add(id)
    globais++
  }

  payload.logger.info(
    `[retomar-espanhol] ${documentos} documentos e ${globais} globais de volta à fila, um por minuto`,
  )
}

/* Não desfaz: o que a fila traduzir está publicado, como na carga de 28/10. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[retomar-espanhol] down não desfaz a retomada — ver o comentário da migração')
}
