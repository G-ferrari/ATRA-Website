/* MIG-102 — sincronização do Banco de Talentos com o ATRAIR (sistema de R&S da ATRA).
 *
 * ⚠️ HTTP puro, sem SDK — a mesma escolha do `crm.ts`: uma chamada `fetch`
 * não justifica dependência nova.
 *
 * ⚠️ **Sem as envs, não sincroniza e não falha.** A candidatura já está no
 * Postgres quando isto roda (grava primeiro, sincroniza depois — D-26 vale
 * aqui também); a falta fica no log do servidor, nunca vira erro para o
 * candidato que acabou de enviar o currículo.
 *
 * ⚠️ Currículo é dado de RH, não lead comercial (D-29): o destino é o ATRAIR,
 * não o CRM. O ATRAIR deduplica por e-mail do lado de lá — reenviar o mesmo
 * candidato atualiza o cadastro em vez de duplicar.
 *
 * ⚠️ `ATRAIR_API_KEY` **sem** `NEXT_PUBLIC_`: chave de servidor (regra 7,
 * o CI reprova o prefixo junto de `KEY`).
 */

const TIMEOUT_MS = 8_000

/** O que o endpoint público do ATRAIR (`POST /api/public/talent-pool`) aceita. */
export type CandidaturaParaAtrair = {
  name: string
  email: string
  phone?: string
  linkedinUrl?: string
  /** Valor do select como está na página (pt ou en — o ATRAIR normaliza). */
  area?: string
  senioridade?: string
  source?: string
}

export async function enviarParaAtrair(candidatura: CandidaturaParaAtrair): Promise<boolean> {
  const base = process.env.ATRAIR_API_URL
  const chave = process.env.ATRAIR_API_KEY
  if (!base || !chave) {
    console.warn('[atrair] ATRAIR_API_URL/ATRAIR_API_KEY ausentes — candidatura não sincronizada')
    return false
  }

  try {
    const r = await fetch(`${base.replace(/\/$/, '')}/api/public/talent-pool`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': chave },
      body: JSON.stringify(candidatura),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!r.ok) {
      console.error('[atrair] recusou a candidatura:', r.status, await r.text().catch(() => ''))
      return false
    }
    return true
  } catch (e) {
    /* ⚠️ Nunca propaga: a candidatura já está no banco e visível no admin. */
    console.error('[atrair] falhou:', e)
    return false
  }
}
