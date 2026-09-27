import { ehGtmId, ehLushaSiteId } from '@/lib/formatos-de-rastreamento'
import type { Tracking } from '@/payload-types'
import type { Rastreamento } from '@/types/content'

/* Mapper do global `tracking` (D-40).
 *
 * O admin vence. `NEXT_PUBLIC_GTM_ID` fica de reserva só para o GTM: até a
 * D-40 era a única fonte do id, e um ambiente que já o tenha não perde o
 * container com o deploy. A Lusha nasceu no admin e não tem reserva.
 *
 * ⚠️ Valor fora do formato vira `null` também aqui, não só na validação do
 * admin — a reserva vem do ambiente, que o admin não valida, e o id acaba na
 * URL de um script. */
export function toRastreamento(
  doc: Pick<Tracking, 'gtmId' | 'lushaSiteId'>,
  reserva: { gtmId?: string } = {},
): Rastreamento {
  const gtmId = doc.gtmId?.trim() || reserva.gtmId?.trim() || ''
  const lushaSiteId = doc.lushaSiteId?.trim() || ''
  return {
    gtmId: ehGtmId(gtmId) ? gtmId : null,
    lushaSiteId: ehLushaSiteId(lushaSiteId) ? lushaSiteId : null,
  }
}
