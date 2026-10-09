import type { CollectionAfterChangeHook } from 'payload'

import { toIntegracaoRd } from '@/lib/mappers/integracao'
import { deveSincronizar, enviarConversao, type LeadParaRd } from '@/lib/rd-marketing'

/* D-54 — o hook que leva o lead ao RD Station Marketing (sucede o
 * `sincronizar-crm.ts` de MIG-148, com o mesmo contrato).
 *
 * Hook de `form-submissions`, **não** código nas Server Actions: contato,
 * newsletter, download, consultores, chat e diagnóstico desembocam todos na
 * mesma collection, e aqui a sincronização cobre todos sem que nenhum saiba
 * dela. Quem decide o que sincroniza é `deveSincronizar` (`lib/rd-marketing.ts`)
 * — candidatura, por exemplo, é RH e fica de fora.
 *
 * ⚠️ O hook **escreve na própria collection** para gravar o resultado, e essa
 * escrita dispararia este mesmo hook: `context.skipRdSync` corta o laço. Sem
 * ele, um lead viraria recursão infinita no primeiro sync.
 *
 * ⚠️ Falha aqui nunca derruba a gravação do lead — mesmo contrato do
 * `enviarAviso`. O que falha fica legível no admin (`rd.error`), com
 * `syncedAt` vazio, e **qualquer** escrita posterior no doc (o `notified` da
 * action, um "lido" no admin) tenta de novo. O retry é de graça, de propósito:
 * conversão no RD é evento, e o lead é deduplicado por e-mail do lado de lá,
 * então repetir não cria lead duplo.
 */
export const sincronizarComRd: CollectionAfterChangeHook = async ({ doc, req, context }) => {
  if (context?.skipRdSync) return doc
  /* Sem chave não há o que tentar — e não há erro a registrar: a ausência é
   * estado (`syncedAt` vazio), não falha. */
  if (!process.env.RDSTATION_MARKETING_API_KEY) return doc

  const lead = doc as LeadParaRd & { id: number | string }
  if (!deveSincronizar(lead)) return doc

  /* Pelo `req.payload`, não pelo `lib/integracoes.ts`: aquele importa o
   * `lib/payload.ts` (alias `@payload-config`), e este hook entra no grafo do
   * `payload.config` — o importador do WordPress e seus testes carregam o
   * config sem o alias. O global é lido a cada lead, de propósito: o hook roda
   * fora de requisição de página, onde o `cache()` do React não vale. */
  const config = toIntegracaoRd(await req.payload.findGlobal({ slug: 'integrations', depth: 0 }))
  const resultado = await enviarConversao(lead, config)

  try {
    await req.payload.update({
      collection: 'form-submissions',
      id: lead.id,
      /* O grupo vai inteiro: update parcial de grupo não é garantia do
       * adapter, e aqui os três campos são deste hook mesmo. */
      data: {
        rd: resultado.ok
          ? { eventUuid: resultado.eventUuid, syncedAt: new Date().toISOString(), error: null }
          : { eventUuid: lead.rd?.eventUuid ?? null, syncedAt: null, error: resultado.motivo },
      },
      context: { skipRdSync: true },
    })
  } catch (e) {
    console.error('[rd] não gravou o resultado da sincronização:', e)
  }

  return doc
}
