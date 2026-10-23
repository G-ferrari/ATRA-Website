import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Form } from '@/payload-types'

/* Task 049 — o envio de um formulário montado no admin. Banco, e-mail, contato
 * e cabeçalhos são simulados; o anti-spam, a conferência e os mappers rodam de
 * verdade. O RD em si é o gancho de `form-submissions` (050), que aqui aparece
 * só pelo resultado que deixou gravado (`rd.syncedAt`). */

const payload = { create: vi.fn(), findByID: vi.fn(), update: vi.fn(), find: vi.fn() }
const enviarAviso = vi.fn()
const lerContato = vi.fn()
const excedeuPorIp = vi.fn()
const redirect = vi.fn((href: string) => {
  throw new Error(`NEXT_REDIRECT ${href}`)
})

vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-real-ip': '203.0.113.7' }) }))
vi.mock('next/navigation', () => ({ redirect: (href: string) => redirect(href) }))
vi.mock('@/lib/payload', () => ({ getPayload: async () => payload }))
vi.mock('@/lib/email', () => ({ enviarAviso: (...a: unknown[]) => enviarAviso(...a) }))
vi.mock('@/lib/contato', () => ({ lerContato: () => lerContato() }))
vi.mock('@/lib/anti-spam', async (original) => ({
  ...(await original<typeof import('@/lib/anti-spam')>()),
  excedeuPorIp: (...a: unknown[]) => excedeuPorIp(...a),
}))

const { enviarFormularioDoAdmin, enviarFormularioDoAdminNoEstado } = await import('./formularios-do-admin')

const formulario = (sobre: Partial<Form> = {}): Form => ({
  id: 12,
  name: 'Inscrição no evento',
  fields: [
    { id: 'f1', type: 'name', width: 'half', label: 'Nome', required: true },
    { id: 'f2', type: 'email', width: 'half', label: 'E-mail', required: true },
    { id: 'f3', type: 'company', width: 'full', label: 'Empresa' },
    {
      id: 'f4',
      type: 'select',
      width: 'full',
      label: 'Área',
      options: [
        { id: 'o1', label: 'Dados', value: 'dados' },
        { id: 'o2', label: 'IA', value: 'ia' },
      ],
    },
    { id: 'f5', type: 'checkbox', width: 'full', label: 'Aceito receber comunicações', consent: true },
  ],
  submitLabel: 'Enviar',
  afterSubmit: 'message',
  successMessage: 'Recebido.',
  notifyEmails: ['eventos@atra.com.br'],
  rd: { conversionIdentifier: 'Evento', tags: [] },
  updatedAt: '2026-10-21T00:00:00.000Z',
  createdAt: '2026-10-21T00:00:00.000Z',
  ...sobre,
})

const envio = (campos: Record<string, string>) => {
  const f = new FormData()
  for (const [k, v] of Object.entries({ formulario: '12', locale: 'pt', source: '/eventos', ...campos })) f.set(k, v)
  return f
}
const valido = () =>
  envio({ 'campo-f1': 'Ana', 'campo-f2': 'ana@empresa.com.br', 'campo-f3': 'Banco X', 'campo-f4': 'ia', 'campo-f5': 'on', utm_campaign: 'outubro' })

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  payload.find.mockResolvedValue({ docs: [formulario()] })
  payload.create.mockResolvedValue({ id: 901 })
  payload.update.mockResolvedValue({})
  payload.findByID.mockResolvedValue({ id: 901, rd: null })
  enviarAviso.mockResolvedValue(true)
  excedeuPorIp.mockReturnValue(false)
  lerContato.mockResolvedValue({
    email: 'negocios@atra.com.br',
    destinos: { contato: 'comercial@atra.com.br', consultores: null, diagnostico: null, carreiras: null, chat: null },
  })
})

describe('enviarFormularioDoAdmin', () => {
  it('lê só o formulário publicado, pelo id, com os rótulos em português', async () => {
    await enviarFormularioDoAdmin(valido())
    expect(payload.find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'forms',
        where: { and: [{ id: { equals: 12 } }, { _status: { equals: 'published' } }] },
        locale: 'pt',
      }),
    )
  })

  it('grava o envio com o kind novo, o formulário, as colunas padrão, as respostas, a origem e a UTM', async () => {
    expect(await enviarFormularioDoAdmin(valido())).toEqual({ ok: true })
    expect(payload.create).toHaveBeenCalledTimes(1)
    const { data } = payload.create.mock.calls[0][0]
    expect(data).toMatchObject({
      kind: 'custom-form',
      form: 12,
      email: 'ana@empresa.com.br',
      name: 'Ana',
      company: 'Banco X',
      communicationConsent: true,
      source: '/eventos',
      utm: { campaign: 'outubro' },
      status: 'new',
      notified: false,
    })
    expect(data.answers).toEqual([
      { fieldId: 'f1', label: 'Nome', value: 'Ana' },
      { fieldId: 'f2', label: 'E-mail', value: 'ana@empresa.com.br' },
      { fieldId: 'f3', label: 'Empresa', value: 'Banco X' },
      { fieldId: 'f4', label: 'Área', value: 'ia' },
      { fieldId: 'f5', label: 'Aceito receber comunicações', value: 'Sim' },
    ])
  })

  it('campo intruso no envio não chega ao banco', async () => {
    const f = valido()
    f.set('campo-xyz', 'intruso')
    f.set('admin', 'true')
    await enviarFormularioDoAdmin(f)
    expect(JSON.stringify(payload.create.mock.calls[0][0].data)).not.toMatch(/intruso|admin/)
  })

  const semFormulario: [string, () => void, Record<string, string>][] = [
    ['rascunho, despublicado ou apagado', () => void payload.find.mockResolvedValue({ docs: [] }), {}],
    ['id que não é número', () => undefined, { formulario: 'abc' }],
    ['erro ao ler o formulário', () => void payload.find.mockRejectedValue(new Error('banco fora')), {}],
  ]
  it.each(semFormulario)('formulário %s → mensagem genérica, nada gravado', async (_, preparar, extra) => {
    preparar()
    const r = await enviarFormularioDoAdmin(envio({ ...extra, 'campo-f1': 'Ana', 'campo-f2': 'ana@empresa.com.br' }))
    expect(r).toEqual({ ok: false, erro: expect.stringMatching(/Não foi possível enviar/) })
    expect(payload.create).not.toHaveBeenCalled()
  })

  it('envio inválido devolve o erro de cada campo e não grava', async () => {
    const r = await enviarFormularioDoAdmin(envio({ 'campo-f2': 'errado', 'campo-f4': 'outra' }))
    expect(r).toEqual({
      ok: false,
      erros: { f1: 'Preencha este campo.', f2: 'Confira o e-mail informado.', f4: 'Escolha uma das opções.' },
    })
    expect(payload.create).not.toHaveBeenCalled()
  })

  /* Task 051: a seção entrega esta direto ao `useActionState`. Com erro, o
     que foi digitado volta (o React 19 limpa o formulário a cada envio) — só
     os campos do formulário, nunca os escondidos. */
  it('no formato do useActionState: com erro devolve o que foi digitado; com sucesso, só o resultado', async () => {
    const f = envio({ 'campo-f2': 'errado', 'campo-f3': 'Banco X', utm_source: 'google' })
    const r = await enviarFormularioDoAdminNoEstado(null, f)
    expect(r).toMatchObject({ ok: false, valores: { 'campo-f2': 'errado', 'campo-f3': 'Banco X' } })
    expect(Object.keys(r.ok ? {} : (r.valores ?? {}))).toEqual(['campo-f2', 'campo-f3'])
    expect(await enviarFormularioDoAdminNoEstado(r, valido())).toEqual({ ok: true })
  })

  it('erros no idioma da página', async () => {
    const r = await enviarFormularioDoAdmin(envio({ locale: 'en', 'campo-f2': 'ana@empresa.com.br' }))
    expect(r).toEqual({ ok: false, erros: { f1: 'Please fill in this field.' } })
  })

  it.each([
    ['isca preenchida', { website: 'http://spam' }],
    ['enviado rápido demais', { carimbo: String(Date.now()) }],
  ])('robô (%s) recebe sucesso falso e nada é gravado', async (_, extra) => {
    expect(await enviarFormularioDoAdmin(envio({ ...camposMinimos(), ...extra }))).toEqual({ ok: true })
    expect(payload.create).not.toHaveBeenCalled()
  })

  it('RD aceitou → o site não avisa', async () => {
    payload.findByID.mockResolvedValue({ id: 901, rd: { syncedAt: '2026-10-21T10:00:00Z' } })
    expect(await enviarFormularioDoAdmin(valido())).toEqual({ ok: true })
    expect(enviarAviso).not.toHaveBeenCalled()
    expect(payload.update).not.toHaveBeenCalled()
  })

  it('RD não aceitou → aviso aos endereços do formulário, com as respostas, e notified sem nova tentativa no RD', async () => {
    expect(await enviarFormularioDoAdmin(valido())).toEqual({ ok: true })
    expect(enviarAviso).toHaveBeenCalledWith(
      expect.objectContaining({
        para: ['eventos@atra.com.br'],
        assunto: '[site] Inscrição no evento — Banco X',
        responderPara: 'ana@empresa.com.br',
        texto: expect.stringContaining('Área: ia'),
      }),
    )
    expect(enviarAviso.mock.calls[0][0].texto).toMatch(/Veio de: \/eventos\nCampanha: outubro$/)
    expect(payload.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: 901, data: { notified: true }, context: { skipRdSync: true } }),
    )
  })

  it('sem endereços no formulário → destino geral de contato', async () => {
    payload.find.mockResolvedValue({ docs: [formulario({ notifyEmails: [] })] })
    await enviarFormularioDoAdmin(valido())
    expect(enviarAviso.mock.calls[0][0].para).toBe('comercial@atra.com.br')
  })

  it('aviso que falha não derruba o envio já gravado, e notified fica falso', async () => {
    enviarAviso.mockRejectedValue(new Error('resend fora'))
    expect(await enviarFormularioDoAdmin(valido())).toEqual({ ok: true })
    expect(payload.update).not.toHaveBeenCalled()
  })

  it('gravação que falha → mensagem genérica, sem aviso, e sem dado pessoal no log', async () => {
    payload.create.mockRejectedValue(Object.assign(new Error('insert ana@empresa.com.br Banco X'), { code: '23505' }))
    const r = await enviarFormularioDoAdmin(valido())
    expect(r).toEqual({ ok: false, erro: expect.any(String) })
    expect(enviarAviso).not.toHaveBeenCalled()
    const log = JSON.stringify((console.error as unknown as { mock: { calls: unknown[][] } }).mock.calls)
    expect(log).toMatch(/23505/)
    expect(log).not.toMatch(/ana@empresa|Banco X/)
  })

  it('depois do envio por página → redireciona no idioma da página, depois de gravar', async () => {
    payload.find.mockResolvedValue({ docs: [formulario({ afterSubmit: 'page', redirectPath: '/contato' })] })
    const f = valido()
    f.set('locale', 'en')
    await expect(enviarFormularioDoAdmin(f)).rejects.toThrow('NEXT_REDIRECT /en/contact')
    expect(payload.create).toHaveBeenCalledTimes(1)
  })

  /* D-71: o item vai ao slug inglês quando existe no inglês. */
  it('depois do envio para um item → o slug inglês dele', async () => {
    payload.find.mockImplementation(async (args: { collection: string }) =>
      args.collection === 'cases'
        ? { docs: [{ id: 9, slug: { pt: 'abc', en: 'abc-en' } }] }
        : { docs: [formulario({ afterSubmit: 'page', redirectPath: '/cases-de-sucesso/abc' })] },
    )
    const f = valido()
    f.set('locale', 'en')
    await expect(enviarFormularioDoAdmin(f)).rejects.toThrow('NEXT_REDIRECT /en/success-stories/abc-en')
  })
  it('limite por IP conta só envio válido: erro de campo não gasta vaga', async () => {
    await enviarFormularioDoAdmin(envio({ 'campo-f2': 'errado' }))
    expect(excedeuPorIp).not.toHaveBeenCalled()
  })

  /* 051: sem JavaScript, o sucesso de verdade num formulário que leva a outra
     página é o redirecionamento; o falso não pode responder diferente. */
  it('sucesso falso num formulário que leva a outra página também redireciona, sem gravar', async () => {
    payload.find.mockResolvedValue({ docs: [formulario({ afterSubmit: 'page', redirectPath: '/obrigado' })] })
    await expect(enviarFormularioDoAdmin(envio({ ...camposMinimos(), website: 'http://spam' }))).rejects.toThrow(
      'NEXT_REDIRECT /obrigado',
    )
    excedeuPorIp.mockReturnValue(true)
    await expect(enviarFormularioDoAdmin(valido())).rejects.toThrow('NEXT_REDIRECT /obrigado')
    expect(payload.create).not.toHaveBeenCalled()
  })

  it('limite por IP estourado → sucesso falso, nada gravado, e o descarte no log sem o IP', async () => {
    excedeuPorIp.mockReturnValue(true)
    expect(await enviarFormularioDoAdmin(valido())).toEqual({ ok: true })
    expect(payload.create).not.toHaveBeenCalled()
    const log = JSON.stringify((console.warn as unknown as { mock: { calls: unknown[][] } }).mock.calls)
    expect(log).toMatch(/limite de envios do IP/)
    expect(log).not.toMatch(/203\.0\.113\.7/)
  })

  it('texto de apresentação faltando em português não impede o envio de ser gravado', async () => {
    payload.find.mockResolvedValue({ docs: [formulario({ successMessage: '', submitLabel: '' })] })
    expect(await enviarFormularioDoAdmin(valido())).toEqual({ ok: true })
    expect(payload.create).toHaveBeenCalledTimes(1)
  })

  it('na página em inglês, a caixa de consentimento guarda o texto que o visitante viu', async () => {
    payload.find.mockImplementation(async ({ locale }: { locale: string }) => ({
      docs: [
        locale === 'en'
          ? formulario({ fields: formulario().fields?.map((f) => (f.id === 'f5' ? { ...f, label: 'I agree to receive communications' } : f)) })
          : formulario(),
      ],
    }))
    const f = valido()
    f.set('locale', 'en')
    await enviarFormularioDoAdmin(f)
    const respostas = payload.create.mock.calls[0][0].data.answers as { fieldId: string; label: string }[]
    expect(respostas.find((r) => r.fieldId === 'f5')?.label).toBe('I agree to receive communications')
    expect(respostas.find((r) => r.fieldId === 'f1')?.label).toBe('Nome')
  })
})

function camposMinimos(): Record<string, string> {
  return { 'campo-f1': 'Ana', 'campo-f2': 'ana@empresa.com.br' }
}
