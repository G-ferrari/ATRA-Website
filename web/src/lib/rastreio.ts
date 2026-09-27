import { lerConsentimento } from './consentimento'

/* MIG-153 (D-30) — o funil único dos eventos de analytics.
 *
 * ⚠️ `rastrear` é **no-op** sem as duas chaves: um container de GTM (sem ele
 * não há para onde mandar) e consentimento de estatística do visitante. Quem
 * chama não confere nada: o ponto de instrumentação fica limpo, e a política
 * mora num lugar só.
 *
 * Desde a D-40 o id do container vem do admin, pelo layout, e só o `Gtm`
 * sabe se há um. Ele avisa aqui com `definirContainer` — antes a chave era
 * ler `NEXT_PUBLIC_GTM_ID`, que no cliente só existe se estiver no build.
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
  /* Diagnóstico de Maturidade de Dados (task 027). O nome não vem de
     `formularios-e-integracoes.md`: é o do HTML do Roger, que o guia de
     implantação dele manda o GTM ouvir (`README-implantacao-rd-station.md`). */
  | 'quiz_maturidade_lead'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/* Estado de módulo, e não do `window`: as ilhas que chamam `rastrear` e o
 * `Gtm` compartilham esta instância do módulo no bundle do cliente. */
let containerDefinido = false

/** O `Gtm` chama com `true` quando o layout lhe entrega um id. */
export function definirContainer(definido: boolean): void {
  containerDefinido = definido
}

export function rastrear(evento: EventoDeRastreio, params: Record<string, string | number | boolean> = {}): void {
  try {
    if (!containerDefinido) return
    if (!lerConsentimento()?.analytics) return
    window.dataLayer = window.dataLayer ?? []
    window.dataLayer.push({ event: evento, ...params })
  } catch {
    /* rastreio nunca derruba a página — mesma postura de guardarUtm */
  }
}
