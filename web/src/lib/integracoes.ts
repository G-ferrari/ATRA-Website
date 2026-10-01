import { cache } from 'react'

import { toIntegracaoAtrair } from './mappers/integracao'
import { getPayload } from './payload'
import type { IntegracaoAtrair } from '@/types/content'

/* D-41 — as chaves da integração com o ATRAIR, para quem vai chamá-lo.
 *
 * Quem chama é **página ou Server Action**, nunca componente (regra 4): a
 * página de carreiras resolve as vagas e passa como prop; a action do
 * formulário resolve antes de sincronizar o currículo.
 *
 * `cache()` por requisição: `/carreiras` leria o mesmo global duas vezes se um
 * dia a página e a action coincidissem no mesmo render.
 *
 * Sem `locale`: o global não é localizado. Salvar no admin revalida o site
 * (hook dos globals em `payload.config.ts`), então **ligar ou desligar a
 * integração não pede deploy** — que é o ponto da D-41. ⚠️ A grade também tem o
 * cache de 5 min do `fetch` no `lib/atrair.ts`: desligar a chave tem efeito
 * imediato (a página deixa de chamar), ligar pode levar até esse tempo para
 * mostrar vaga nova.
 */
export const lerIntegracaoAtrair = cache(async (): Promise<IntegracaoAtrair> => {
  const payload = await getPayload()
  const doc = await payload.findGlobal({ slug: 'integrations', depth: 0 })
  return toIntegracaoAtrair(doc, { endpoint: process.env.ATRAIR_API_URL })
})
