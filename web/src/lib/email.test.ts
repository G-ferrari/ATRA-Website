import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/* O nodemailer trocado por um espião: nenhum teste abre conexão. */
const sendMail = vi.fn()
const createTransport = vi.fn(() => ({ sendMail }))
vi.mock('nodemailer', () => ({ default: { createTransport: (...a: unknown[]) => createTransport(...(a as [])) } }))

import { enviarAviso } from './email'

/* O corpo que chegaria ao Resend, sem rede: o `fetch` é trocado por um espião. */
const fetchFalso = vi.fn()
const corpoEnviado = () => JSON.parse(fetchFalso.mock.calls[0][1].body as string) as Record<string, unknown>
const mensagemSmtp = () => sendMail.mock.calls[0][0] as Record<string, unknown>
const configSmtp = () => (createTransport.mock.calls[0] as unknown[])[0] as Record<string, unknown>

beforeEach(() => {
  fetchFalso.mockReset()
  fetchFalso.mockResolvedValue(new Response('{}', { status: 200 }))
  sendMail.mockReset()
  sendMail.mockResolvedValue({ messageId: '<1@atra>' })
  createTransport.mockClear()
  vi.stubGlobal('fetch', fetchFalso)
  vi.stubEnv('SMTP_HOST', '')
  vi.stubEnv('RESEND_API_KEY', '')
  vi.stubEnv('EMAIL_FROM', '')
  vi.stubEnv('RESEND_FROM', '')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('enviarAviso pelo Resend', () => {
  beforeEach(() => vi.stubEnv('RESEND_API_KEY', 're_teste'))

  /* Os avisos de antes da task 024 (contato, chat, newsletter, candidatura) não
   * passam `html` — e têm que continuar chegando exatamente como chegavam. */
  it('aviso sem html manda só o texto, sem a chave `html`', async () => {
    expect(await enviarAviso({ para: 'contato@atra.com.br', assunto: 'Assunto', texto: 'Corpo' })).toBe(true)
    const corpo = corpoEnviado()
    expect(corpo.text).toBe('Corpo')
    expect(corpo).not.toHaveProperty('html')
    expect(corpo).not.toHaveProperty('bcc')
  })

  it('aviso com html manda as duas partes', async () => {
    await enviarAviso({ para: 'lead@empresa.com.br', assunto: 'Assunto', texto: 'Corpo', html: '<p>Corpo</p>' })
    const corpo = corpoEnviado()
    expect(corpo.text).toBe('Corpo')
    expect(corpo.html).toBe('<p>Corpo</p>')
  })

  it('html vazio conta como ausente', async () => {
    await enviarAviso({ para: 'lead@empresa.com.br', assunto: 'Assunto', texto: 'Corpo', html: '' })
    expect(corpoEnviado()).not.toHaveProperty('html')
  })

  it('sem chave do Resend e sem SMTP não chama a rede e devolve false', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    expect(await enviarAviso({ para: 'x@empresa.com.br', assunto: 'A', texto: 'B', html: '<p>B</p>' })).toBe(false)
    expect(fetchFalso).not.toHaveBeenCalled()
    expect(sendMail).not.toHaveBeenCalled()
  })
})

describe('enviarAviso por SMTP (Google Workspace)', () => {
  beforeEach(() => {
    vi.stubEnv('SMTP_HOST', 'smtp-relay.gmail.com')
    vi.stubEnv('SMTP_PORT', '587')
    vi.stubEnv('SMTP_USER', 'site@atra.com.br')
    vi.stubEnv('SMTP_PASSWORD', 'senha-de-app')
  })

  it('com SMTP_HOST vai por SMTP, mesmo com a chave do Resend presente', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_teste')
    expect(await enviarAviso({ para: 'lead@empresa.com.br', assunto: 'A', texto: 'B' })).toBe(true)
    expect(sendMail).toHaveBeenCalledTimes(1)
    expect(fetchFalso).not.toHaveBeenCalled()
  })

  /* 587 sobe com STARTTLS e não pode seguir sem ele: é a regra "Exigir
   * criptografia TLS" do Admin do Google. */
  it('na 587 exige STARTTLS e autentica com o usuário do ambiente', async () => {
    await enviarAviso({ para: 'lead@empresa.com.br', assunto: 'A', texto: 'B' })
    expect(configSmtp()).toMatchObject({
      host: 'smtp-relay.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user: 'site@atra.com.br', pass: 'senha-de-app' },
    })
  })

  it('sem usuário não manda `auth` (retransmissão só pelo IP)', async () => {
    vi.stubEnv('SMTP_USER', '')
    await enviarAviso({ para: 'lead@empresa.com.br', assunto: 'A', texto: 'B' })
    expect(configSmtp()).not.toHaveProperty('auth')
  })

  it('leva remetente, resposta, cópia oculta e as duas partes', async () => {
    vi.stubEnv('EMAIL_FROM', 'ATRA <nao-responda@atra.com.br>')
    await enviarAviso({
      para: 'lead@empresa.com.br',
      assunto: 'Seu diagnóstico',
      texto: 'Corpo',
      html: '<p>Corpo</p>',
      responderPara: 'diagnostico@atra.com.br',
      copiaOculta: ['registro@crm.exemplo.com'],
    })
    expect(mensagemSmtp()).toEqual({
      from: 'ATRA <nao-responda@atra.com.br>',
      to: ['lead@empresa.com.br'],
      subject: 'Seu diagnóstico',
      text: 'Corpo',
      html: '<p>Corpo</p>',
      replyTo: 'diagnostico@atra.com.br',
      bcc: ['registro@crm.exemplo.com'],
    })
  })

  it('cópia oculta vazia não vira `bcc`', async () => {
    await enviarAviso({ para: 'lead@empresa.com.br', assunto: 'A', texto: 'B', copiaOculta: [] })
    expect(mensagemSmtp()).not.toHaveProperty('bcc')
    expect(mensagemSmtp().from).toBe('ATRA <nao-responda@atra.com.br>')
  })

  /* O lead já está no banco quando o envio roda: servidor recusando vira
   * `false` e log, nunca exceção — e o log não leva o endereço do visitante. */
  it('recusa do servidor devolve false sem propagar nem logar o destinatário', async () => {
    const erro = Object.assign(new Error('550 Mail relay denied for lead@empresa.com.br'), { code: 'EENVELOPE' })
    sendMail.mockRejectedValue(erro)
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(await enviarAviso({ para: 'lead@empresa.com.br', assunto: 'A', texto: 'B' })).toBe(false)
    expect(log.mock.calls.flat().map(String).join(' ')).not.toContain('lead@empresa.com.br')
    log.mockRestore()
  })
})
