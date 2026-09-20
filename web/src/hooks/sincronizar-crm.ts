import type { CollectionAfterChangeHook } from 'payload'

import { deveSincronizar, sincronizarLead, type LeadParaCrm } from '@/lib/crm'

/* MIG-148 — o hook que leva o lead ao RD Station CRM (D-26).
 *
 * Hook de `form-submissions`, **não** código nas Server Actions: contato,
 * newsletter, candidatura e download desembocam todos na mesma collection, e
 * aqui a sincronização cobre os quatro sem que nenhum saiba dela. Quem decide
 * o que sincroniza é `deveSincronizar` (`lib/crm.ts`) — candidatura, por
 * exemplo, é RH e fica de fora.
 *
 * ⚠️ O hook **escreve na própria collection** para gravar o resultado, e essa
 * escrita dispararia este mesmo hook: `context.skipCrmSync` corta o laço. Sem
 * ele, um lead viraria recursão infinita no primeiro sync.
 *
 * ⚠️ Falha aqui nunca derruba a gravação do lead — mesmo contrato do
 * `enviarAviso`. O que falha fica legível no admin (`crm.error`), com
 * `syncedAt` vazio, e **qualquer** escrita posterior no doc (o `notified` da
 * action, um "lido" no admin) tenta de novo. O retry é de graça, de propósito.
 */
export const sincronizarComCrm: CollectionAfterChangeHook = async ({ doc, req, context }) => {
  if (context?.skipCrmSync) return doc
  /* Sem token não há o que tentar — e não há erro a registrar: a ausência é
   * estado (`syncedAt` vazio), não falha. */
  if (!process.env.RDSTATION_CRM_TOKEN) return doc

  const lead = doc as LeadParaCrm & { id: number | string }
  if (!deveSincronizar(lead)) return doc

  const resultado = await sincronizarLead(lead)

  try {
    await req.payload.update({
      collection: 'form-submissions',
      id: lead.id,
      /* O grupo vai inteiro: update parcial de grupo não é garantia do
       * adapter, e aqui os quatro campos são deste hook mesmo. */
      data: {
        crm: resultado.ok
          ? {
              contactId: resultado.contactId,
              dealId: resultado.dealId,
              syncedAt: new Date().toISOString(),
              error: null,
            }
          : {
              /* Id parcial gravado é o que impede o retry de duplicar contato. */
              contactId: resultado.contactId ?? lead.crm?.contactId ?? null,
              dealId: lead.crm?.dealId ?? null,
              syncedAt: null,
              error: resultado.motivo,
            },
      },
      context: { skipCrmSync: true },
    })
  } catch (e) {
    console.error('[crm] não gravou o resultado da sincronização:', e)
  }

  return doc
}
