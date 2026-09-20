/* Seed do convite de lead no chat (D-29) — fora do `run.mjs`, de propósito.
 *
 * ⚠️ NÃO adicionar à lista SEEDS do executor: mesmo contrato do
 * `cookie-consent.ts` ao lado. O CI do gate roda `pnpm seed`, e ainda que o
 * gabarito de /chat capture só o estado vazio (o convite aparece depois de N
 * mensagens do visitante), o ambiente do gate fica sem os textos jurídicos —
 * é o invariante que P-14 protege. Este script roda à mão onde se quer o
 * convite de pé: dev local e homologação (container `migrate`).
 *
 * Preenche as três frentes editoriais do convite: liga o toggle, textos do
 * cartão e o `consentNotice` — que é o gate de código (vazio = convite
 * desligado no idioma). A terceira chave é de engenharia e não mora aqui:
 * `ENABLE_CHAT_LEAD=1` no ambiente do servidor (docker-compose.prod.yml).
 *
 * O texto é PROVISÓRIO, para o pessoal testar em homologação: a redação final
 * do consentimento é da ATRA (P-14) e o lugar de editá-la é o admin (D-22).
 * Rodar de novo sobrescreve — mesmo contrato do seed da ATRA AI.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'

const payload = await getPayload({ config })

console.log('→ chat-lead (atra-ai.leadCapture)')
await payload.updateGlobal({
  slug: 'atra-ai',
  data: {
    leadCapture: {
      enabled: true,
      inviteAfterUserMessages: 2,
      inviteTitle: 'Quer falar com um especialista?',
      inviteMessage:
        'Deixe seu contato e um especialista da ATRA retorna para continuar a conversa com você.',
      consentNotice:
        'Ao enviar, você autoriza a ATRA a usar estes dados — e um resumo do que você digitou nesta conversa — para entrar em contato. Eles vão para o nosso CRM (RD Station) e não são usados para outra finalidade.',
      successMessage: 'Recebido! Um especialista da ATRA entra em contato em breve.',
    },
  },
  locale: 'pt',
})
await payload.updateGlobal({
  slug: 'atra-ai',
  data: {
    leadCapture: {
      enabled: true,
      inviteAfterUserMessages: 2,
      inviteTitle: 'Want to talk to a specialist?',
      inviteMessage:
        'Leave your contact details and an ATRA specialist will get back to you to continue the conversation.',
      consentNotice:
        'By sending, you authorize ATRA to use this data — and a summary of what you typed in this conversation — to get in touch. It goes to our CRM (RD Station) and is not used for any other purpose.',
      successMessage: 'Got it! An ATRA specialist will reach out shortly.',
    },
  },
  locale: 'en',
})
console.log('  atra-ai.leadCapture ligado (pt/en) — consentNotice provisório até P-14')
process.exit(0)
