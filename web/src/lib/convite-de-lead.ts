import { cache } from 'react'

import { toConviteDeLead } from './mappers/atra-ai'
import { getPayload } from './payload'
import type { Locale } from './locales'
import type { ConviteDeLead } from '@/types/content'

/* MIG-150 (D-29) — o que a página do chat resolve para a ilha desenhar o
 * convite de lead. Quem chama é a **página**, nunca componente (regra 4).
 *
 * ⚠️ As três chaves se somam aqui e no mapper: `ENABLE_CHAT_LEAD` (env,
 * engenharia), `leadCapture.enabled` (toggle editorial) e `consentNotice`
 * preenchido no idioma (P-14). Qualquer uma fechada devolve `null`, a ilha não
 * recebe convite nenhum, e o DOM fica **idêntico** ao de antes da feature —
 * que é o que o gate visual de `/chat` exige. */
export const lerConviteDeLead = cache(async (locale: Locale): Promise<ConviteDeLead | null> => {
  if (process.env.ENABLE_CHAT_LEAD !== '1') return null
  const payload = await getPayload()
  return toConviteDeLead(await payload.findGlobal({ slug: 'atra-ai', depth: 0, locale }), locale)
})
