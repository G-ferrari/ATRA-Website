/* Seed do aviso de cookies (D-30) — fora do `run.mjs`, de propósito.
 *
 * ⚠️ NÃO adicionar à lista SEEDS do executor. O CI do gate roda `pnpm seed`,
 * e `bannerMessage` preenchida acende o banner nas 13 rotas do aceite visual —
 * o gabarito não tem o elemento, e religar o gate (pré-requisito do cutover)
 * reprovaria tudo. O ambiente do gate fica sem texto; este script roda à mão
 * onde se quer o banner de pé: dev local e homologação (container `migrate`).
 *
 * O texto é PROVISÓRIO, para a validação em homologação: a redação final do
 * compromisso jurídico é da ATRA (P-14) e o lugar de editá-la é o admin (D-22).
 * Rodar de novo sobrescreve a mensagem — mesmo contrato do seed da ATRA AI.
 *
 * ⚠️ Rodando aqui (fora do Next) o `revalidatePath` de MIG-143 não dispara:
 * em homologação o texto só chega às páginas estáticas no próximo build
 * (deploy) — ou salvando o global no admin, que revalida em processo.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'

const payload = await getPayload({ config })

console.log('→ cookie-consent')
await payload.updateGlobal({
  slug: 'cookie-consent',
  data: {
    bannerMessage:
      'Usamos cookies para o site funcionar e, com a sua permissão, para medir visitas (Google Analytics) e lembrar de qual campanha você chegou (parâmetros UTM). Você escolhe o que autoriza e pode mudar a escolha a qualquer momento.',
  },
  locale: 'pt',
})
await payload.updateGlobal({
  slug: 'cookie-consent',
  data: {
    bannerMessage:
      'We use cookies to make the site work and, with your permission, to measure visits (Google Analytics) and remember which campaign brought you here (UTM parameters). You choose what to allow and can change your choice at any time.',
  },
  locale: 'en',
})
console.log('  cookie-consent: bannerMessage (pt/en) gravada — texto provisório até P-14')
process.exit(0)
