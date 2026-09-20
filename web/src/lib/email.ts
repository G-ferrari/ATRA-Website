/* Envio do aviso de lead (MIG-100).
 *
 * ⚠️ Pelo HTTP do Resend, sem SDK. Uma chamada `fetch` não justifica uma
 * dependência nova — e o pacote de e-mail do Payload traria um adapter inteiro
 * para o mesmo POST.
 *
 * ⚠️ **Sem chave, não falha.** Em desenvolvimento e no container do aceite não
 * há `RESEND_API_KEY`, e o formulário precisa funcionar do mesmo jeito: o lead
 * entra no banco e o envio devolve `false`. Quem grava marca `notified`, então
 * a diferença fica visível no admin em vez de virar silêncio.
 *
 * ⚠️ `RESEND_API_KEY` **sem** `NEXT_PUBLIC_`: chave de servidor. É a regra 7, e
 * o CI reprova o prefixo junto de `KEY`.
 */

export type Aviso = {
  para: string
  assunto: string
  texto: string
  /** Para quem recebe poder responder direto ao visitante. */
  responderPara?: string
}

const REMETENTE = process.env.RESEND_FROM ?? 'ATRA <nao-responda@atra.com.br>'

export async function enviarAviso(aviso: Aviso): Promise<boolean> {
  const chave = process.env.RESEND_API_KEY
  if (!chave) return false

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${chave}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: REMETENTE,
        to: [aviso.para],
        subject: aviso.assunto,
        text: aviso.texto,
        ...(aviso.responderPara ? { reply_to: aviso.responderPara } : {}),
      }),
      signal: AbortSignal.timeout(8_000),
    })
    if (!r.ok) {
      console.error('[email] Resend recusou:', r.status, await r.text().catch(() => ''))
      return false
    }
    return true
  } catch (e) {
    /* ⚠️ Nunca propaga: o lead **já está no banco** quando isto roda, e deixar
     * a exceção subir transformaria um aviso não entregue em erro na tela para
     * quem acabou de enviar o formulário com sucesso. */
    console.error('[email] falhou:', e)
    return false
  }
}
