import { cache } from 'react'

import { toAparencia } from './mappers/appearance'
import { getPayload } from './payload'
import type { Aparencia } from '@/types/content'

/* #215 (D-65) — o peso dos títulos que o layout põe no `<body>`. Quem chama é
 * o **layout**, nunca componente (regra 4).
 *
 * Sem `locale`: o global não é localizado. Salvar no admin revalida o site
 * (hook dos globals em `payload.config.ts`), então trocar o peso não pede
 * deploy. */
export const lerAparencia = cache(async (): Promise<Aparencia> => {
  const payload = await getPayload()
  const doc = await payload.findGlobal({ slug: 'appearance', depth: 0 })
  return toAparencia(doc)
})
