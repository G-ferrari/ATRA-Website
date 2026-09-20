import { lerConsentimento } from './consentimento'

/* MIG-153 (D-30) — o funil único dos eventos de analytics.
 *
 * ⚠️ `rastrear` é **no-op** sem as duas chaves: `NEXT_PUBLIC_GTM_ID` (sem
 * container não há para onde mandar — P-19) e consentimento de estatística do
 * visitante. Quem chama não confere nada: o ponto de instrumentação fica
 * limpo, e a política mora num lugar só.
 *
 * Os nomes vêm da especificação (`formularios-e-integracoes.md`): são o
 * vocabulário combinado com o marketing, não uma lista aberta — evento novo
 * entra aqui primeiro, para o tipo recusar o nome errado em compile time. */

export type EventoDeRastreio =
  | 'form_submit'
  | 'resource_download'
  | 'chat_started'
  | 'chat_message_sent'
  | 'outbound_click'
  | 'video_play'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function rastrear(evento: EventoDeRastreio, params: Record<string, string | number | boolean> = {}): void {
  try {
    if (!process.env.NEXT_PUBLIC_GTM_ID) return
    if (!lerConsentimento()?.analytics) return
    window.dataLayer = window.dataLayer ?? []
    window.dataLayer.push({ event: evento, ...params })
  } catch {
    /* rastreio nunca derruba a página — mesma postura de guardarUtm */
  }
}
