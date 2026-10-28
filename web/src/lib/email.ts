/* Envio dos e-mails do site: avisos de lead (MIG-100) e o resultado do
 * diagnóstico ao visitante (task 024).
 *
 * Dois caminhos, escolhidos pelo ambiente:
 *
 * 1. **SMTP**, quando há `SMTP_HOST` — o serviço de retransmissão do Google
 *    Workspace (`smtp-relay.gmail.com`, 587), desde 28/10. O Resend nunca chegou
 *    a entregar em produção: o domínio atra.com.br não foi verificado lá, e o
 *    e-mail da ATRA já mora no Google. Passo a passo de quem configura em
 *    `docs/05-operacao/email-pelo-google-workspace.md`.
 * 2. **Resend**, pelo HTTP, quando só há `RESEND_API_KEY` — o caminho antigo,
 *    mantido para a volta ser trocar variável, não código.
 *
 * ⚠️ `nodemailer` e não `fetch`: SMTP não é HTTP, e escrever o protocolo à mão
 * (STARTTLS, AUTH, quebra de linha do corpo) é o tipo de código que só falha em
 * produção. O Resend segue sem SDK, numa chamada só.
 *
 * ⚠️ **Sem nenhum dos dois, não falha.** Em desenvolvimento e no container do
 * aceite não há credencial, e o formulário precisa funcionar do mesmo jeito: o
 * lead entra no banco e o envio devolve `false`. Quem grava marca `notified`,
 * então a diferença fica visível no admin em vez de virar silêncio.
 *
 * ⚠️ `SMTP_PASSWORD` e `RESEND_API_KEY` **sem** `NEXT_PUBLIC_`: credenciais de
 * servidor. É a regra 7, e o CI reprova o prefixo junto de `KEY` e `PASSWORD`.
 */

import nodemailer from 'nodemailer'

export type Aviso = {
  /** Um endereço, ou vários — os formulários do admin escolhem a lista (049). */
  para: string | string[]
  assunto: string
  /** Sempre enviado: é o que lê quem não abre HTML, e o que os avisos internos usam. */
  texto: string
  /** Corpo HTML opcional (o resultado do diagnóstico, task 024). Sem ele, o
   * e-mail sai só em texto, como todos os avisos anteriores. */
  html?: string
  /** Para quem recebe poder responder direto ao visitante. */
  responderPara?: string
  /** Cópia oculta: quem guarda o e-mail sem o destinatário saber — o endereço de
   * registro do CRM, por exemplo. Vazio é o mesmo que ausente. */
  copiaOculta?: string | string[]
}

/* Lido a cada envio, e não no carregamento do módulo: os testes trocam o
 * ambiente entre um caso e outro. `RESEND_FROM` fica como reserva de quem já o
 * tinha configurado. */
const remetente = () => process.env.EMAIL_FROM || process.env.RESEND_FROM || 'ATRA <nao-responda@atra.com.br>'

/* Teto de cada envio. O lead já está gravado quando isto roda, e o visitante
 * espera a resposta da action: um servidor de e-mail mudo não pode segurar a
 * tela dele. */
const TETO_MS = 8_000

const lista = (v: string | string[] | undefined): string[] =>
  (Array.isArray(v) ? v : v ? [v] : []).map((e) => e.trim()).filter(Boolean)

export async function enviarAviso(aviso: Aviso): Promise<boolean> {
  try {
    if (process.env.SMTP_HOST) return await porSmtp(aviso)
    if (process.env.RESEND_API_KEY) return await porResend(aviso, process.env.RESEND_API_KEY)
    return false
  } catch (e) {
    /* ⚠️ Nunca propaga: o lead **já está no banco** quando isto roda, e deixar
     * a exceção subir transformaria um aviso não entregue em erro na tela para
     * quem acabou de enviar o formulário com sucesso.
     *
     * ⚠️ Nunca o erro inteiro: o do nodemailer leva o comando SMTP que falhou,
     * e nele vão os endereços do visitante. A mensagem fica — é ela que diz
     * "Username and Password not accepted" ou "Mail relay denied" —, com todo
     * endereço de e-mail apagado. */
    const erro = e as { code?: unknown; responseCode?: unknown; message?: unknown } | null
    const mensagem = String(erro?.message ?? e).replace(/[^\s<>@]+@[^\s<>@]+/g, '<e-mail>')
    console.error('[email] falhou:', erro?.code ?? '', erro?.responseCode ?? '', mensagem)
    return false
  }
}

async function porSmtp(aviso: Aviso): Promise<boolean> {
  const porta = Number(process.env.SMTP_PORT) || 587
  const usuario = process.env.SMTP_USER
  const transporte = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: porta,
    /* 465 é TLS desde o primeiro byte; 587 começa em texto e sobe com
     * STARTTLS — e `requireTLS` recusa seguir sem ele, que é o que a regra do
     * Google ("Exigir criptografia TLS") espera. */
    secure: porta === 465,
    requireTLS: porta !== 465,
    /* Sem usuário, a retransmissão do Google aceita só pelo IP — vale se a
     * regra no Admin não exigir autenticação. */
    ...(usuario ? { auth: { user: usuario, pass: process.env.SMTP_PASSWORD ?? '' } } : {}),
    connectionTimeout: TETO_MS,
    greetingTimeout: TETO_MS,
    socketTimeout: TETO_MS,
  })
  const copia = lista(aviso.copiaOculta)
  await transporte.sendMail({
    from: remetente(),
    to: lista(aviso.para),
    subject: aviso.assunto,
    text: aviso.texto,
    /* Só com HTML de verdade. Com as duas partes, o cliente de e-mail mostra a
     * HTML e esconde o texto: um `html: ''` faria o aviso chegar em branco. */
    ...(aviso.html ? { html: aviso.html } : {}),
    ...(aviso.responderPara ? { replyTo: aviso.responderPara } : {}),
    ...(copia.length ? { bcc: copia } : {}),
  })
  return true
}

async function porResend(aviso: Aviso, chave: string): Promise<boolean> {
  const copia = lista(aviso.copiaOculta)
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${chave}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: remetente(),
      to: lista(aviso.para),
      subject: aviso.assunto,
      text: aviso.texto,
      ...(aviso.html ? { html: aviso.html } : {}),
      ...(aviso.responderPara ? { reply_to: aviso.responderPara } : {}),
      ...(copia.length ? { bcc: copia } : {}),
    }),
    signal: AbortSignal.timeout(TETO_MS),
  })
  if (!r.ok) {
    console.error('[email] Resend recusou:', r.status, await r.text().catch(() => ''))
    return false
  }
  return true
}
