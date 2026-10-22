import type { CollectionAfterChangeHook, Payload } from 'payload'

import { toConfigDoFormulario } from '@/lib/mappers/form'
import { toIntegracaoRd } from '@/lib/mappers/integracao'
import { chaveDoRdConfigurada, deveSincronizar, enviarConversao, type LeadParaRd } from '@/lib/rd-marketing'

/* D-54 — o hook que leva o lead ao RD Station Marketing (sucede o
 * `sincronizar-crm.ts` de MIG-148, com o mesmo contrato).
 *
 * Hook de `form-submissions`, **não** código nas Server Actions: contato,
 * newsletter, download, consultores, chat, diagnóstico e banco de talentos
 * (D-62) desembocam todos na mesma collection, e aqui a sincronização cobre
 * todos sem que nenhum saiba dela. Quem decide o que sincroniza é
 * `deveSincronizar` (`lib/rd-marketing.ts`) — a candidatura com currículo, por
 * exemplo, é RH e fica de fora.
 *
 * O hook **escreve na própria collection** para gravar o resultado, direto no
 * adaptador (ver o `db.updateOne` abaixo), que não dispara gancho nenhum.
 * `context.skipRdSync` continua respeitado para quem quiser gravar sem
 * sincronizar.
 *
 * ⚠️ Falha aqui nunca derruba a gravação do lead — mesmo contrato do
 * `enviarAviso`. O que falha fica legível no admin (`rd.error`), com
 * `syncedAt` vazio, e a próxima edição no admin (um "lido", por exemplo)
 * tenta de novo. O `notified` da action **não** tenta (task 045): ele só é
 * gravado quando o site já avisou o time, e uma nova tentativa que passasse
 * faria o RD avisar também. O retry é de graça, de propósito:
 * conversão no RD é evento, e o lead é deduplicado por e-mail do lado de lá,
 * então repetir não cria lead duplo.
 */
export const sincronizarComRd: CollectionAfterChangeHook = async ({ doc, req, context }) => {
  if (context?.skipRdSync) return doc
  /* Sem chave não há o que tentar — e não há erro a registrar: a ausência é
   * estado (`syncedAt` vazio), não falha. */
  /* A mesma regra do quadro do admin (`chaveDoRdConfigurada`): chave só com
     espaço é ausente lá e aqui — senão o admin diria "Ausente" e o gancho
     tentaria enviar. */
  if (!chaveDoRdConfigurada()) return doc

  const lead = doc as LeadParaRd & { id: number | string }
  if (!deveSincronizar(lead)) return doc

  /* Pelo `req.payload`, não pelo `lib/integracoes.ts`: aquele importa o
   * `lib/payload.ts` (alias `@payload-config`), e este hook entra no grafo do
   * `payload.config` — o importador do WordPress e seus testes carregam o
   * config sem o alias. O global é lido a cada lead, de propósito: o hook roda
   * fora de requisição de página, onde o `cache()` do React não vale. */
  const config = toIntegracaoRd(await req.payload.findGlobal({ slug: 'integrations', depth: 0 }))
  const resultado = await enviarConversao(await comFormulario(await comMaterial(lead, req.payload), req.payload), config)

  try {
    /* ⚠️ Direto no adaptador (`db.updateOne`), com o `req` (15/10). Duas
     * armadilhas, as duas achadas na task 044:
     *
     * 1. **Sem o `req`**, a escrita ia por outra conexão, que não enxerga o
     *    documento do `create` (a transação dele ainda está aberta): morria
     *    em "NotFound", o `syncedAt` nunca era gravado e cada edição no admin
     *    reenviava o lead ao RD. Escondido desde a D-54 porque a chave nunca
     *    esteve no servidor.
     * 2. **Com o `req` num `payload.update`**, uma falha nele chama
     *    `killTransaction(req)` — desfaz a transação do **lead**, e o `create`
     *    ainda responde sucesso: lead no RD, nada no banco. E o
     *    `context.skipRdSync` que o update grava no `req` compartilhado
     *    vazaria para os outros documentos de uma edição em lote.
     *
     * O `db.updateOne` usa a mesma transação sem validação, sem ganchos (não
     * precisa do `skipRdSync`) e sem `killTransaction`. O grupo vai inteiro:
     * os três campos são deste gancho. */
    await req.payload.db.updateOne({
      collection: 'form-submissions',
      id: lead.id,
      req,
      returning: false,
      data: {
        rd: resultado.ok
          ? { eventUuid: resultado.eventUuid, syncedAt: new Date().toISOString(), error: null }
          : { eventUuid: lead.rd?.eventUuid ?? null, syncedAt: null, error: resultado.motivo },
      },
    })
  } catch (e) {
    console.error('[rd] não gravou o resultado da sincronização:', e)
  }

  return doc
}

/* Task 046 — o download vai ao RD com o identificador do e-book baixado, e o
 * cadastro só guarda o id dele (`resource`). Lido aqui, e não gravado no
 * cadastro pela action: o identificador é do marketing e pode mudar até o
 * envio, e o retry por edição deve usar o nome de hoje.
 *
 * Só o slug em português e o identificador (`select`): a consulta é a cada
 * download. E sem `draft`: vale o que está publicado. Falhar ao ler não
 * derruba nada — `identificadorDe` cai no identificador do formulário.
 *
 * ⚠️ **Sem o `req`** do lead, ao contrário do `db.updateOne` acima. O
 * `findByID` do Payload chama `killTransaction(req)` quando falha: com o `req`
 * do `create`, um material apagado desfaria a gravação do **lead**, e o
 * `create` ainda responderia sucesso. O material não está na transação do
 * lead, e outra conexão o enxerga igual. */
async function comMaterial(lead: LeadParaRd & { resource?: unknown }, payload: Payload): Promise<LeadParaRd> {
  if (lead.kind !== 'material-download') return lead
  /* O `create` pode devolver o material populado ou só o id, conforme a
     profundidade; o que importa aqui é o id. */
  const ref = lead.resource
  const id = typeof ref === 'object' && ref !== null ? (ref as { id?: unknown }).id : ref
  if (typeof id !== 'number' && typeof id !== 'string') return lead
  try {
    const material = await payload.findByID({
      collection: 'resources',
      id,
      locale: 'pt',
      depth: 0,
      select: { slug: true, rdConversionIdentifier: true },
      disableErrors: true,
    })
    if (!material) return lead
    return { ...lead, material: { slug: material.slug, identificador: material.rdConversionIdentifier } }
  } catch (e) {
    console.error('[rd] não leu o material do download:', e)
    return lead
  }
}

/* Task 050 — o formulário do admin vai ao RD com o identificador, as tags e o
 * destino de cada campo **do formulário**, lidos aqui pelo id (`form`), com o
 * nome de hoje: o retry por edição usa o que o marketing escreveu por último.
 *
 * Mesmas regras do `comMaterial`: sem o `req` do lead (falha aqui desfaria a
 * gravação dele), `disableErrors`, e sem `draft` — vale o publicado. Apagado
 * ou ilegível: `formulario: null`, `identificadorDe` devolve nada, o lead fica
 * gravado, o motivo vai para `rd.error` e o site já avisou o time (049). */
async function comFormulario(lead: LeadParaRd & { form?: unknown }, payload: Payload): Promise<LeadParaRd> {
  if (lead.kind !== 'custom-form') return lead
  const ref = lead.form
  const id = typeof ref === 'object' && ref !== null ? (ref as { id?: unknown }).id : ref
  if (typeof id !== 'number' && typeof id !== 'string') return { ...lead, formulario: null }
  try {
    const doc = await payload.findByID({ collection: 'forms', id, locale: 'pt', depth: 0, disableErrors: true })
    if (!doc) return { ...lead, formulario: null }
    const config = toConfigDoFormulario(doc)
    return {
      ...lead,
      formulario: {
        identificador: config.rd.identificador,
        tags: config.rd.tags,
        campos: config.campos.map((c) => ({ id: c.id, tipo: c.tipo, campoNoRd: c.campoNoRd })),
      },
    }
  } catch (e) {
    console.error('[rd] não leu o formulário do envio:', e instanceof Error ? e.name : 'erro')
    return { ...lead, formulario: null }
  }
}
