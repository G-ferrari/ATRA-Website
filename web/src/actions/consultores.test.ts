import { beforeEach, describe, expect, it, vi } from 'vitest'

/* Fluxo da Server Action — o que ela grava, e principalmente o que ela NÃO
 * grava. `conferir` (anti-spam) roda de verdade; banco, e-mail, contato,
 * cabeçalhos e o limite por IP são simulados. A gravação real no Postgres é
 * verificada na task 013, pelo formulário. */

const payload = { find: vi.fn(), create: vi.fn(), update: vi.fn() }
const enviarAviso = vi.fn()
const lerContato = vi.fn()
const excedeuPorIp = vi.fn()
const getPayload = vi.fn()

vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-real-ip': '203.0.113.7' }) }))
vi.mock('@/lib/payload', () => ({ getPayload: () => getPayload() }))
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
  form({ email: 'gestora@banco.com.br', name: 'Ana', phone: '11 99999-0000', ...extra })
/** O que o formulário manda em `perfis` desde a task 020: só os slugs. */
const perfis = (...slugs: string[]) => JSON.stringify(slugs)
const gravado = () => payload.create.mock.calls[0]?.[0]?.data

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  excedeuPorIp.mockReturnValue(false)
  getPayload.mockResolvedValue(payload)
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
        perfis: perfis('12', '4'),
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
      phone: '11 99999-0000',
      source: '/consultores',
      status: 'new',
      notified: false,
      utm: { source: 'linkedin' },
    })
    expect(d.message).toContain('- Data Engineer (Senior)')
    expect(d.message).toContain('- Cloud Architect (Lead / Principal)')
    expect(d.message).toContain('Migração para lakehouse')
  })

  it('consulta o catálogo em pt, só com os ids pedidos, e com select', async () => {
    await solicitarConsultores(valido({ perfis: perfis('12', '4') }))
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
    await solicitarConsultores(valido({ perfis: perfis('12') }))
    expect(enviarAviso).toHaveBeenCalledWith(
      expect.objectContaining({
        para: 'negocios@atra.com.br',
        responderPara: 'gestora@banco.com.br',
        /* Era a empresa até a task 020, quando o campo saiu do formulário. */
        assunto: '[site] solicitação de consultores — Ana',
      }),
    )
    expect(enviarAviso.mock.calls[0][0].texto).toContain('- Data Engineer (Senior)')
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
    await solicitarConsultores(valido({ perfis: perfis('12') }))
    expect(gravado()).not.toHaveProperty('crm')
  })
})

describe('solicitarConsultores — o servidor não confia no cliente', () => {
  it('descarta id que não existe no catálogo', async () => {
    await solicitarConsultores(valido({ perfis: perfis('999', '12') }))
    expect(gravado().message).toContain('Perfis solicitados:')
    expect(gravado().message).toContain('- Data Engineer (Senior)')
    expect(gravado().message.match(/^- /gm)).toHaveLength(1)
  })

  it('só ids forjados e sem descrição: recusa sem gravar', async () => {
    const r = await solicitarConsultores(valido({ perfis: perfis('999', '777') }))
    expect(r).toMatchObject({ ok: false })
    expect(payload.create).not.toHaveBeenCalled()
  })

  /* ⚠️ Aba aberta desde antes do deploy da task 020: manda o formato antigo,
     `[{ slug, quantidade }]`. Melhor o pedido chegar pela descrição do que o
     envio estourar — e é por isso que este caso grava, em vez de recusar. */
  it('formato antigo do cliente não vira perfil, e o pedido chega pela descrição', async () => {
    const r = await solicitarConsultores(
      valido({ perfis: JSON.stringify([{ slug: '12', quantidade: 2 }]), message: 'Dois engenheiros de dados' }),
    )
    expect(r).toEqual({ ok: true })
    expect(gravado().message).toContain('Nenhum perfil do catálogo selecionado')
    expect(gravado().message).toContain('Dois engenheiros de dados')
  })

  it('corta campos no teto do servidor', async () => {
    await solicitarConsultores(valido({ perfis: perfis('12'), name: 'x'.repeat(5000) }))
    expect(gravado().name).toHaveLength(200)
  })
})

describe('solicitarConsultores — a recusa devolve o que foi enviado', () => {
  /* ⚠️ O React 19 reseta o formulário quando a action termina, com sucesso ou
     com erro. Sem os valores de volta, uma recusa apagava tudo o que o
     visitante tinha digitado. */
  it('devolve os campos para o formulário repreencher', async () => {
    const r = await solicitarConsultores(valido({ message: '', perfis: perfis('999') }))
    expect(r).toMatchObject({
      ok: false,
      codigo: 'indisponiveis',
      valores: { name: 'Ana', email: 'gestora@banco.com.br', phone: '11 99999-0000', message: '' },
    })
  })

  it('devolve até na recusa por e-mail, que é a primeira', async () => {
    const r = await solicitarConsultores(form({ email: 'joao@empresa', name: 'João', message: 'contexto' }))
    expect(r).toMatchObject({ ok: false, codigo: 'email', valores: { name: 'João', email: 'joao@empresa', message: 'contexto' } })
  })

  /* Sucesso não devolve nada: o formulário DEVE voltar vazio para o próximo
     pedido. */
  it('sucesso não traz valores', async () => {
    const r = await solicitarConsultores(valido({ perfis: perfis('12') }))
    expect(r).toEqual({ ok: true })
  })
})

describe('solicitarConsultores — nada de dado pessoal no log', () => {
  /* ⚠️ A mensagem do erro do Drizzle traz `params:` com os valores da query. */
  it('falha ao gravar não leva e-mail, nome nem telefone para o console', async () => {
    const erro = Object.assign(
      new Error('Failed query: insert into "form_submissions" params: gestora@banco.com.br,Ana,11 99999-0000'),
      { cause: { code: '22021' } },
    )
    payload.create.mockRejectedValue(erro)
    await solicitarConsultores(valido({ perfis: perfis('12') }))
    const registrado = vi.mocked(console.error).mock.calls.flat().map(String).join(' ')
    expect(registrado).toContain('22021')
    for (const pessoal of ['gestora@banco.com.br', 'Ana', '99999-0000']) expect(registrado).not.toContain(pessoal)
  })

  it('o mesmo vale para a falha depois de gravar', async () => {
    payload.update.mockRejectedValue(new Error('params: gestora@banco.com.br'))
    await solicitarConsultores(valido({ perfis: perfis('12') }))
    const registrado = vi.mocked(console.error).mock.calls.flat().map(String).join(' ')
    expect(registrado).toContain('501')
    expect(registrado).not.toContain('gestora@banco.com.br')
  })
})

describe('solicitarConsultores — campos de uma linha', () => {
  /* ⚠️ Com a quebra de linha, o telefone forjava um bloco "Perfis solicitados"
     acima do resumo real, dentro do e-mail do comercial. */
  it('colapsa quebras de linha em nome e telefone', async () => {
    await solicitarConsultores(
      valido({
        perfis: perfis('12'),
        name: 'Ana\r\nSilva',
        phone: '11\n\nPerfis solicitados:\n- Cloud Architect (Lead / Principal)',
      }),
    )
    expect(gravado()).toMatchObject({ name: 'Ana Silva' })
    expect(gravado().phone).not.toContain('\n')
    const aviso = enviarAviso.mock.calls[0][0]
    expect(aviso.assunto).not.toMatch(/[\r\n]/)
    /* No corpo, o único "Perfis solicitados" que abre linha é o do resumo real. */
    expect(aviso.texto.match(/^Perfis solicitados/gm)).toHaveLength(1)
  })
})

describe('solicitarConsultores — recusa sem gravar', () => {
  /* ⚠️ Mensagem própria: com a mesma do vazio, quem tinha escolhido um perfil
     depois despublicado lia "escolha ao menos um perfil". */
  it('só perfis que sumiram do catálogo: mensagem que não engana', async () => {
    const r = await solicitarConsultores(valido({ perfis: perfis('999') }))
    expect(r).toMatchObject({ ok: false, codigo: 'indisponiveis', erro: expect.stringMatching(/não estão mais disponíveis/) })
  })

  /* ⚠️ Id acima do `integer` do Postgres estourava a consulta e derrubava o
     pedido inteiro, inclusive o perfil válido. */
  it('id fora do integer nem chega à consulta, e o perfil válido segue', async () => {
    const r = await solicitarConsultores(valido({ perfis: perfis('12', '2147483648') }))
    expect(r).toEqual({ ok: true })
    expect(payload.find).toHaveBeenCalledWith(expect.objectContaining({ where: { id: { in: [12] } } }))
  })

  it('banco fora do ar: responde erro em vez de lançar', async () => {
    getPayload.mockRejectedValue(new Error('ECONNREFUSED'))
    await expect(solicitarConsultores(valido({ perfis: perfis('12') }))).resolves.toMatchObject({
      ok: false,
    })
  })

  it('a mensagem gravada respeita o teto, mesmo com descrição longa e perfis', async () => {
    await solicitarConsultores(valido({ perfis: perfis('12', '4'), message: 'x'.repeat(5000) }))
    expect(gravado().message.length).toBeLessThanOrEqual(5000)
  })

  it('sem perfil e sem descrição: erro legível, e nem consulta o banco', async () => {
    const r = await solicitarConsultores(valido())
    expect(r).toMatchObject({ ok: false, codigo: 'vazio', erro: expect.stringMatching(/perfil|descreva/i) })
    expect(payload.find).not.toHaveBeenCalled()
    expect(payload.create).not.toHaveBeenCalled()
  })

  it('e-mail inválido', async () => {
    const r = await solicitarConsultores(form({ email: 'sem-arroba', message: 'x' }))
    expect(r).toMatchObject({ ok: false, codigo: 'email' })
    expect(payload.create).not.toHaveBeenCalled()
  })
})

/* ⚠️ Robô barrado recebe SUCESSO: dizer "você foi barrado" entrega o critério. */
describe('solicitarConsultores — anti-spam devolve sucesso falso', () => {
  it('isca preenchida', async () => {
    const r = await solicitarConsultores(valido({ perfis: perfis('12'), [CAMPO_ISCA]: 'http://spam' }))
    expect(r).toEqual({ ok: true })
    expect(payload.create).not.toHaveBeenCalled()
    expect(payload.find).not.toHaveBeenCalled()
    expect(enviarAviso).not.toHaveBeenCalled()
  })

  it('carimbo rápido demais', async () => {
    const r = await solicitarConsultores(valido({ perfis: perfis('12'), carimbo: String(Date.now()) }))
    expect(r).toEqual({ ok: true })
    expect(payload.create).not.toHaveBeenCalled()
  })

  it('estouro do limite por IP — antes de qualquer consulta ao banco', async () => {
    excedeuPorIp.mockReturnValue(true)
    const r = await solicitarConsultores(valido({ perfis: perfis('12') }))
    expect(r).toEqual({ ok: true })
    expect(payload.find).not.toHaveBeenCalled()
    expect(payload.create).not.toHaveBeenCalled()
  })

  /* O limite é por IP de verdade: `ipDe` lê `x-real-ip` primeiro (MIG-140). */
  it('confere o limite com o IP da requisição', async () => {
    await solicitarConsultores(valido({ perfis: perfis('12') }))
    expect(excedeuPorIp).toHaveBeenCalledWith('203.0.113.7')
  })

  /* ⚠️ Sem oráculo. Com a checagem de vazio DEPOIS das barreiras, o robô
     recebia `{ ok: true }` se barrado e erro de vazio se não — e testava cada
     técnica sem nunca ser aceito. */
  it('envio vazio recebe o erro de vazio mesmo com a isca preenchida', async () => {
    const r = await solicitarConsultores(valido({ [CAMPO_ISCA]: 'http://spam' }))
    expect(r).toMatchObject({ ok: false, codigo: 'vazio', erro: expect.stringMatching(/perfil|descreva/i) })
    expect(excedeuPorIp).not.toHaveBeenCalled()
  })

  /* Carimbo ausente passa: pode ser JavaScript bloqueado, e recusar um envio
     honesto é pior que aceitar um automático. */
  it('carimbo ausente NÃO reprova', async () => {
    await solicitarConsultores(valido({ perfis: perfis('12') }))
    expect(payload.create).toHaveBeenCalledTimes(1)
  })
})

describe('solicitarConsultores — depois de gravar, é sucesso', () => {
  it('aviso recusado: grava e não marca notified', async () => {
    enviarAviso.mockResolvedValue(false)
    const r = await solicitarConsultores(valido({ perfis: perfis('12') }))
    expect(r).toEqual({ ok: true })
    expect(payload.create).toHaveBeenCalledTimes(1)
    expect(payload.update).not.toHaveBeenCalled()
  })

  /* ⚠️ No modelo (`diagnostico-rc18.ts`) isto derrubaria a resposta com o lead
     já salvo: o visitante tentaria de novo, e o comercial receberia duplicata. */
  it('falha ao ler o contato depois de gravar: continua sucesso', async () => {
    lerContato.mockRejectedValue(new Error('banco caiu'))
    const r = await solicitarConsultores(valido({ perfis: perfis('12') }))
    expect(r).toEqual({ ok: true })
    expect(payload.create).toHaveBeenCalledTimes(1)
  })

  it('falha ao marcar notified: continua sucesso', async () => {
    payload.update.mockRejectedValue(new Error('timeout'))
    const r = await solicitarConsultores(valido({ perfis: perfis('12') }))
    expect(r).toEqual({ ok: true })
  })

  it('falha ao GRAVAR: aí sim é erro — nada foi salvo', async () => {
    payload.create.mockRejectedValue(new Error('constraint'))
    const r = await solicitarConsultores(valido({ perfis: perfis('12') }))
    expect(r).toMatchObject({ ok: false, codigo: 'falha' })
    expect(enviarAviso).not.toHaveBeenCalled()
  })

  it('falha ao conferir o catálogo: erro, sem gravar um resumo sem perfis', async () => {
    payload.find.mockRejectedValue(new Error('timeout'))
    const r = await solicitarConsultores(valido({ perfis: perfis('12') }))
    expect(r).toMatchObject({ ok: false })
    expect(payload.create).not.toHaveBeenCalled()
  })
})
