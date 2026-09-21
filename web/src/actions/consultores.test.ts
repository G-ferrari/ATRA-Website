import { beforeEach, describe, expect, it, vi } from 'vitest'

/* Fluxo da Server Action — o que ela grava, e principalmente o que ela NÃO
 * grava. `conferir` (anti-spam) roda de verdade; banco, e-mail, contato,
 * cabeçalhos e o limite por IP são simulados. A gravação real no Postgres é
 * verificada na task 013, pelo formulário. */

const payload = { find: vi.fn(), create: vi.fn(), update: vi.fn() }
const enviarAviso = vi.fn()
const lerContato = vi.fn()
const excedeuPorIp = vi.fn()

vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-real-ip': '203.0.113.7' }) }))
vi.mock('@/lib/payload', () => ({ getPayload: async () => payload }))
vi.mock('@/lib/email', () => ({ enviarAviso: (...a: unknown[]) => enviarAviso(...a) }))
vi.mock('@/lib/contato', () => ({ lerContato: () => lerContato() }))
vi.mock('@/lib/anti-spam', async (original) => ({
  ...(await original<typeof import('@/lib/anti-spam')>()),
  excedeuPorIp: (...a: unknown[]) => excedeuPorIp(...a),
}))

const { solicitarConsultores } = await import('./consultores')
const { CAMPO_ISCA } = await import('@/lib/anti-spam')

/* O que o banco tem: cargo e nível vêm DAQUI, nunca do formulário. */
const CATALOGO = [
  { id: 12, role: 'Data Engineer', level: 'Senior' },
  { id: 4, role: 'Cloud Architect', level: 'Lead / Principal' },
]

const form = (campos: Record<string, string>) => {
  const f = new FormData()
  for (const [k, v] of Object.entries(campos)) f.set(k, v)
  return f
}
const valido = (extra: Record<string, string> = {}) =>
  form({ email: 'gestora@banco.com.br', name: 'Ana', company: 'Banco X', phone: '11 99999-0000', ...extra })
const perfis = (lista: { slug: string; quantidade?: number }[]) => JSON.stringify(lista)
const gravado = () => payload.create.mock.calls[0]?.[0]?.data

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  excedeuPorIp.mockReturnValue(false)
  lerContato.mockResolvedValue({ email: 'negocios@atra.com.br' })
  enviarAviso.mockResolvedValue(true)
  payload.find.mockImplementation(async ({ where }: { where: { id: { in: number[] } } }) => ({
    docs: CATALOGO.filter((p) => where.id.in.includes(p.id)),
  }))
  payload.create.mockResolvedValue({ id: 501 })
  payload.update.mockResolvedValue({})
})

describe('solicitarConsultores — envio válido', () => {
  it('grava com o kind, o contato e o resumo montado a partir do banco', async () => {
    const r = await solicitarConsultores(
      valido({
        perfis: perfis([{ slug: '12', quantidade: 2 }, { slug: '4', quantidade: 1 }]),
        duracao: '6',
        modelo: 'squad',
        message: 'Migração para lakehouse',
        source: '/consultores',
        utm_source: 'linkedin',
      }),
    )
    expect(r).toEqual({ ok: true })
    const d = gravado()
    expect(d).toMatchObject({
      kind: 'consultant-request',
      email: 'gestora@banco.com.br',
      name: 'Ana',
      company: 'Banco X',
      phone: '11 99999-0000',
      source: '/consultores',
      status: 'new',
      notified: false,
      utm: { source: 'linkedin' },
    })
    expect(d.message).toContain('- 2× Data Engineer (Senior)')
    expect(d.message).toContain('- 1× Cloud Architect (Lead / Principal)')
    expect(d.message).toContain('Duração estimada: 6 meses')
    expect(d.message).toContain('Modelo de alocação: Squad gerenciada ATRA')
    expect(d.message).toContain('Migração para lakehouse')
  })

  it('consulta o catálogo em pt, só com os ids pedidos, e com select', async () => {
    await solicitarConsultores(valido({ perfis: perfis([{ slug: '12' }, { slug: '4' }]) }))
    expect(payload.find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'specialist-roles',
        where: { id: { in: [12, 4] } },
        locale: 'pt',
        select: { role: true, level: true },
      }),
    )
  })

  it('avisa o comercial e marca notified pelo id que o create devolveu', async () => {
    await solicitarConsultores(valido({ perfis: perfis([{ slug: '12' }]) }))
    expect(enviarAviso).toHaveBeenCalledWith(
      expect.objectContaining({
        para: 'negocios@atra.com.br',
        responderPara: 'gestora@banco.com.br',
        assunto: '[site] solicitação de consultores — Banco X',
      }),
    )
    expect(enviarAviso.mock.calls[0][0].texto).toContain('- 1× Data Engineer (Senior)')
    expect(payload.update).toHaveBeenCalledWith({ collection: 'form-submissions', id: 501, data: { notified: true } })
  })

  /* Veio pelo "Não encontrou um consultor nesta lista?" (task 014). */
  it('aceita só a descrição, sem perfil nenhum, e não consulta o catálogo', async () => {
    const r = await solicitarConsultores(valido({ message: 'Especialista em SAP com Databricks' }))
    expect(r).toEqual({ ok: true })
    expect(payload.find).not.toHaveBeenCalled()
    expect(gravado().message).toContain('Nenhum perfil do catálogo selecionado')
  })

  /* A sincronização com o CRM é o hook `afterChange` (task 011, testado em
     `lib/crm.test.ts`). A action não finge sincronizar. */
  it('não preenche o grupo crm — quem sincroniza é o hook', async () => {
    await solicitarConsultores(valido({ perfis: perfis([{ slug: '12' }]) }))
    expect(gravado()).not.toHaveProperty('crm')
  })
})

describe('solicitarConsultores — o servidor não confia no cliente', () => {
  it('descarta id que não existe no catálogo', async () => {
    await solicitarConsultores(valido({ perfis: perfis([{ slug: '999', quantidade: 5 }, { slug: '12' }]) }))
    expect(gravado().message).toContain('Perfis solicitados (1 pessoa):')
    expect(gravado().message).not.toContain('5×')
  })

  it('só ids forjados e sem descrição: recusa sem gravar', async () => {
    const r = await solicitarConsultores(valido({ perfis: perfis([{ slug: '999' }, { slug: '777' }]) }))
    expect(r).toMatchObject({ ok: false })
    expect(payload.create).not.toHaveBeenCalled()
  })

  it('quantidade fora da faixa é presa, não aceita', async () => {
    await solicitarConsultores(valido({ perfis: perfis([{ slug: '12', quantidade: 9000 }]) }))
    expect(gravado().message).toContain('- 20× Data Engineer')
  })

  it('duração e modelo inválidos somem do resumo em vez de gravar lixo', async () => {
    await solicitarConsultores(valido({ perfis: perfis([{ slug: '12' }]), duracao: '999', modelo: 'toString' }))
    expect(gravado().message).not.toMatch(/Duração|Modelo/)
  })

  it('corta campos no teto do servidor', async () => {
    await solicitarConsultores(valido({ perfis: perfis([{ slug: '12' }]), name: 'x'.repeat(5000) }))
    expect(gravado().name).toHaveLength(200)
  })
})

describe('solicitarConsultores — recusa sem gravar', () => {
  it('sem perfil e sem descrição: erro legível, e nem consulta o banco', async () => {
    const r = await solicitarConsultores(valido())
    expect(r).toEqual({ ok: false, erro: expect.stringMatching(/perfil|descreva/i) })
    expect(payload.find).not.toHaveBeenCalled()
    expect(payload.create).not.toHaveBeenCalled()
  })

  it('e-mail inválido', async () => {
    const r = await solicitarConsultores(form({ email: 'sem-arroba', message: 'x' }))
    expect(r).toMatchObject({ ok: false })
    expect(payload.create).not.toHaveBeenCalled()
  })
})

/* ⚠️ Robô barrado recebe SUCESSO: dizer "você foi barrado" entrega o critério. */
describe('solicitarConsultores — anti-spam devolve sucesso falso', () => {
  it('isca preenchida', async () => {
    const r = await solicitarConsultores(valido({ perfis: perfis([{ slug: '12' }]), [CAMPO_ISCA]: 'http://spam' }))
    expect(r).toEqual({ ok: true })
    expect(payload.create).not.toHaveBeenCalled()
    expect(enviarAviso).not.toHaveBeenCalled()
  })

  it('carimbo rápido demais', async () => {
    const r = await solicitarConsultores(valido({ perfis: perfis([{ slug: '12' }]), carimbo: String(Date.now()) }))
    expect(r).toEqual({ ok: true })
    expect(payload.create).not.toHaveBeenCalled()
  })

  it('estouro do limite por IP', async () => {
    excedeuPorIp.mockReturnValue(true)
    const r = await solicitarConsultores(valido({ perfis: perfis([{ slug: '12' }]) }))
    expect(r).toEqual({ ok: true })
    expect(payload.create).not.toHaveBeenCalled()
  })

  /* Carimbo ausente passa: pode ser JavaScript bloqueado, e recusar um envio
     honesto é pior que aceitar um automático. */
  it('carimbo ausente NÃO reprova', async () => {
    await solicitarConsultores(valido({ perfis: perfis([{ slug: '12' }]) }))
    expect(payload.create).toHaveBeenCalledTimes(1)
  })
})

describe('solicitarConsultores — depois de gravar, é sucesso', () => {
  it('aviso recusado: grava e não marca notified', async () => {
    enviarAviso.mockResolvedValue(false)
    const r = await solicitarConsultores(valido({ perfis: perfis([{ slug: '12' }]) }))
    expect(r).toEqual({ ok: true })
    expect(payload.create).toHaveBeenCalledTimes(1)
    expect(payload.update).not.toHaveBeenCalled()
  })

  /* ⚠️ No modelo (`diagnostico-rc18.ts`) isto derrubaria a resposta com o lead
     já salvo: o visitante tentaria de novo, e o comercial receberia duplicata. */
  it('falha ao ler o contato depois de gravar: continua sucesso', async () => {
    lerContato.mockRejectedValue(new Error('banco caiu'))
    const r = await solicitarConsultores(valido({ perfis: perfis([{ slug: '12' }]) }))
    expect(r).toEqual({ ok: true })
    expect(payload.create).toHaveBeenCalledTimes(1)
  })

  it('falha ao marcar notified: continua sucesso', async () => {
    payload.update.mockRejectedValue(new Error('timeout'))
    const r = await solicitarConsultores(valido({ perfis: perfis([{ slug: '12' }]) }))
    expect(r).toEqual({ ok: true })
  })

  it('falha ao GRAVAR: aí sim é erro — nada foi salvo', async () => {
    payload.create.mockRejectedValue(new Error('constraint'))
    const r = await solicitarConsultores(valido({ perfis: perfis([{ slug: '12' }]) }))
    expect(r).toMatchObject({ ok: false })
    expect(enviarAviso).not.toHaveBeenCalled()
  })

  it('falha ao conferir o catálogo: erro, sem gravar um resumo sem perfis', async () => {
    payload.find.mockRejectedValue(new Error('timeout'))
    const r = await solicitarConsultores(valido({ perfis: perfis([{ slug: '12' }]) }))
    expect(r).toMatchObject({ ok: false })
    expect(payload.create).not.toHaveBeenCalled()
  })
})
