/* Seed do global `tracking` (D-40) — **só fixture**.
 *
 * ⚠️ Sem `SEED_FIXTURES=1` não grava nada: os ids reais (o container do GTM e
 * o siteId da Lusha) são da ATRA e entram pelo admin, onde só administrador
 * edita. Semear um id aqui poria um script de terceiro no ar pelo seed.
 *
 * Com a chave (só o CI a liga), grava ids de teste para `e2e/rastreamento.spec.ts`
 * provar o caminho inteiro: admin → layout → componente → consentimento. Eles
 * não carregam nada no resto da suíte: o ambiente do gate não tem aviso de
 * cookies (P-14), então ninguém aceita, e os dois scripts ficam fora do DOM.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { GTM_ID_DE_TESTE, LUSHA_SITE_ID_DE_TESTE } from './fixtures-de-rastreamento'

if (!process.env.SEED_FIXTURES) {
  console.log('→ tracking (pulado: os ids reais entram pelo admin)')
  process.exit(0)
}

const payload = await getPayload({ config })

console.log('→ tracking (fixtures de teste)')
await payload.updateGlobal({
  slug: 'tracking',
  data: { gtmId: GTM_ID_DE_TESTE, lushaSiteId: LUSHA_SITE_ID_DE_TESTE },
})
process.exit(0)
