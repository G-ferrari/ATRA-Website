import { cache } from 'react'

import { toAvisoDeCookies } from './mappers/cookie-consent'
import { getPayload } from './payload'
import type { Locale } from './locales'
import type { AvisoDeCookies } from '@/types/content'

/* MIG-151 (D-30) — o que o layout resolve para o banner de cookies desenhar.
 * Quem chama é o **layout**, nunca componente (regra 4).
 *
 * `null` enquanto `bannerMessage` estiver vazio no idioma — o gate de código
 * de D-29/D-30: sem texto jurídico (P-14) não há banner, o DOM fica idêntico
 * ao de antes da feature, e o gate visual das 13 rotas segue válido. Publicar
 * o texto no admin liga o banner **sem deploy** (revalidação de MIG-143). */
export const lerAvisoDeCookies = cache(async (locale: Locale): Promise<AvisoDeCookies | null> => {
  const payload = await getPayload()
  return toAvisoDeCookies(await payload.findGlobal({ slug: 'cookie-consent', depth: 0, locale }), locale)
})
