/* Seed da ATRA AI (MIG-061).
 *
 * O system prompt sai do código e vira campo editável (D-12): no legado é uma
 * constante de 30 linhas em `server.ts:6`, e mudá-la exige deploy — num texto
 * que é decisão de marketing e vendas (D-22).
 *
 * As tags de UI generativa que ele manda injetar (`[UI_PARTNER:…]`,
 * `[UI_CHART:…]`, `[UI_CONTACT]`) são convertidas em cartões por
 * `chat/ui-generativa.tsx` — mudar o formato delas aqui quebra o parse lá,
 * em silêncio (as tags que não casam são engolidas, como no legado).
 *
 * O texto vem de `migrations/arquivos/instrucao-da-atra-ai.ts`: é o do
 * protótipo, já sem o manual do cartão de serviço, que a D-60 trocou pela
 * recomendação com o catálogo do site (`lib/instrucao-da-ia.ts`).
 *
 * ⚠️ `requestsPerHour: 20` é provisório. D-12 decidiu limite por IP com teto de
 * custo, e disse que os números dependem de P-04 — em aberto.
 */
import { getPayload } from 'payload'

import { TIPOS_RECOMENDAVEIS } from '../../src/lib/mappers/catalogo-da-ia'
import { INSTRUCAO_INICIAL } from '../../src/migrations/arquivos/instrucao-da-atra-ai'
import config from '../../src/payload.config'

const payload = await getPayload({ config })


console.log('→ ATRA AI')
await payload.updateGlobal({
  slug: 'atra-ai',
  data: {
    enabled: true,
    systemPrompt: INSTRUCAO_INICIAL,
    /* D-60: escrito, e não deixado para o `defaultValue` — que só vale na
       primeira gravação do global, e este seed roda de novo. */
    recommends: [...TIPOS_RECOMENDAVEIS],
    requestsPerHour: 20,
    unavailableMessage:
      'A ATRA AI está indisponível no momento. Fale com a gente pelo WhatsApp ou por negocios@atra.com.br.',
  },
  locale: 'pt',
})
await payload.updateGlobal({
  slug: 'atra-ai',
  data: {
    systemPrompt: INSTRUCAO_INICIAL,
    unavailableMessage:
      'ATRA AI is unavailable right now. Reach us on WhatsApp or at negocios@atra.com.br.',
  },
  locale: 'en',
})
console.log('  atra-ai')
process.exit(0)
