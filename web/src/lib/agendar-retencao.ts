import * as Sentry from '@sentry/nextjs'

import { getPayload } from '@/lib/payload'
import { apagarCandidaturasVencidas } from '@/lib/retencao-de-candidaturas'

/* Quem dispara a limpeza de `retencao-de-candidaturas.ts` (P-17).
 *
 * Um temporizador no próprio servidor, ligado por `instrumentation.ts`: o site
 * roda num processo de longa duração (`next start` na VPS), e o prazo é de
 * meses — varrer duas vezes por dia sobra. Sem fila de jobs do Payload (tabela
 * nova e migração para uma tarefa só) e sem cron na VPS (fora do deploy, ninguém
 * veria quebrar).
 *
 * ⚠️ Roda também a cada deploy, porque o servidor sobe de novo — é inofensivo:
 * a limpeza é idempotente. */

const PRIMEIRA_CORRIDA_MS = 2 * 60 * 1000
const INTERVALO_MS = 12 * 60 * 60 * 1000

async function rodar() {
  try {
    const payload = await getPayload()
    const r = await apagarCandidaturasVencidas(payload)
    if (r.candidaturas || r.curriculos || r.falhas) {
      /* Só contagem: nome e e-mail de quem foi apagado não vão para o log, que
         é guardado (journald) — seria guardar o que acabou de ser apagado. */
      payload.logger.info(
        `[retencao] candidaturas apagadas: ${r.candidaturas}; currículos: ${r.curriculos}; falhas: ${r.falhas}`,
      )
    }
    if (r.falhas) Sentry.captureMessage(`Retenção de candidaturas: ${r.falhas} falha(s) ao apagar`, 'error')
  } catch (e) {
    console.error('[retencao] a limpeza de candidaturas não rodou:', e)
    Sentry.captureException(e)
  }
}

export function agendarLimpezaDeCandidaturas() {
  /* O servidor de desenvolvimento reavalia a instrumentação a cada recarga, e
     cada uma somaria um temporizador. A marca no `globalThis` sobrevive a isso. */
  const marca = globalThis as { __limpezaDeCandidaturasAgendada?: boolean }
  if (marca.__limpezaDeCandidaturasAgendada) return
  marca.__limpezaDeCandidaturasAgendada = true

  /* Não na subida: o primeiro `getPayload` disputaria a conexão com as
     primeiras requisições. `unref` para o temporizador não segurar o processo
     vivo na hora de encerrar. */
  setTimeout(rodar, PRIMEIRA_CORRIDA_MS).unref()
  setInterval(rodar, INTERVALO_MS).unref()
}
