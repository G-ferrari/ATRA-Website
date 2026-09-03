import type { AtraAi } from '@/payload-types'
import type { ConviteDeLead } from '@/types/content'

/* Mapper do convite de lead no chat (MIG-150, D-29). */

/* ⚠️ Reservas de texto para os campos **opcionais**. O editor pode ligar o
 * convite sem escrever título — e título vazio é cartão quebrado, não escolha.
 * São editáveis no CMS (D-22): o código só segura a porta até o marketing
 * passar. O `consentNotice` fica de fora de propósito — texto jurídico não se
 * inventa em código (P-14), e sem ele o convite não existe. */
const RESERVA = {
  pt: {
    titulo: 'Quer falar com um especialista?',
    mensagem: 'Deixe seu contato e o time da ATRA continua a conversa com você.',
    sucesso: 'Recebido! Em breve alguém da ATRA entra em contato.',
  },
  en: {
    titulo: 'Want to talk to a specialist?',
    mensagem: 'Leave your details and the ATRA team will follow up with you.',
    sucesso: 'Got it! Someone from ATRA will reach out soon.',
  },
} as const

export function toConviteDeLead(doc: AtraAi, locale: 'pt' | 'en'): ConviteDeLead | null {
  const grupo = doc.leadCapture
  if (!grupo?.enabled) return null

  /* Consentimento é gate de código, não combinado: vazio neste idioma, o
   * convite não renderiza — mesmo com tudo o mais ligado. */
  const consentimento = grupo.consentNotice?.trim()
  if (!consentimento) return null

  const reserva = RESERVA[locale]
  return {
    aposMensagens: grupo.inviteAfterUserMessages ?? 2,
    titulo: grupo.inviteTitle?.trim() || reserva.titulo,
    mensagem: grupo.inviteMessage?.trim() || reserva.mensagem,
    consentimento,
    sucesso: grupo.successMessage?.trim() || reserva.sucesso,
  }
}
