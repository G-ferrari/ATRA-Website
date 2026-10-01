import { cache } from 'react'

import { toRastreamento } from './mappers/tracking'
import { getPayload } from './payload'
import type { Rastreamento } from '@/types/content'

/* D-40 — os ids que o layout entrega ao `Gtm` e à `Lusha`. Quem chama é o
 * **layout**, nunca componente (regra 4).
 *
 * Não confundir com `rastreio.ts`, que é o funil dos eventos: este arquivo diz
 * *quais* scripts existem; aquele, o que se manda para eles.
 *
 * Sem `locale`: o global não é localizado. Salvar no admin revalida o site
 * (hook dos globals em `payload.config.ts`), então trocar um id não pede
 * deploy. */
export const lerRastreamento = cache(async (): Promise<Rastreamento> => {
  const payload = await getPayload()
  const doc = await payload.findGlobal({ slug: 'tracking', depth: 0 })
  return toRastreamento(doc, { gtmId: process.env.NEXT_PUBLIC_GTM_ID })
})
