import { beforeEach, describe, expect, it, vi } from 'vitest'

/* Fluxo da Server Action do diagnóstico — o que ela grava, o que ela recalcula e
 * principalmente o que ela NÃO aceita do cliente. O motor (`calcular`,
 * `montarRoadmap`, os e-mails) e o anti-spam (`conferir`) rodam de verdade;
 * banco, envio de e-mail, globais, cabeçalhos e o limite por IP são simulados.
 * A gravação real no Postgres é conferida à mão na task (execução no banco
 * local) e, pelo formulário, na task 027. */

const payload = { create: vi.fn(), update: vi.fn() }
const enviarAviso = vi.fn()
const lerContato = vi.fn()
const lerDiagnosticoDeMaturidade = vi.fn()
const excedeuPorIp = vi.fn()
const getPayload = vi.fn()

const IP = '203.0.113.7'
const USER_AGENT = 'Mozilla/5.0 (Robo de Teste) Diagnostico/1.0'

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-real-ip': IP, 'user-agent': USER_AGENT }),
}))
vi.mock('@/lib/payload', () => ({ getPayload: () => getPayload() }))
vi.mock('@/lib/email', () => ({ enviarAviso: (...a: unknown[]) => enviarAviso(...a) }))
vi.mock('@/lib/contato', () => ({ lerContato: () => lerContato() }))
vi.mock('@/lib/diagnostico', () => ({
  lerDiagnosticoDeMaturidade: (...a: unknown[]) => lerDiagnosticoDeMaturidade(...a),
}))
vi.mock('@/lib/anti-spam', async (original) => ({
  ...(await original<typeof import('@/lib/anti-spam')>()),
  excedeuPorIp: (...a: unknown[]) => excedeuPorIp(...a),
}))

const { enviarDiagnosticoDeMaturidade } = await import('./diagnostico-maturidade')
const { CAMPO_ISCA } = await import('@/lib/anti-spam')
const { VERSAO, calcular, montarRoadmap, perguntasDoSetor, roadmapEmTexto } = await import(
  '@/lib/diagnostico-maturidade'
)

const SETOR = 'financeiro'
const CAIXA = 'negocios@atra.com.br'
const TEXTOS = {
  titulo: 'Diagnóstico',
  abertura: null,
  conclusao: null,
  email: { assunto: 'Seu Diagnóstico de Maturidade de Dados — ATRA', abertura: 'Obrigado por responder.' },
  agendaUrl: 'https://agenda.exemplo.com.br/atra',
  whatsappUrl: 'https://api.whatsapp.com/send/?phone=5511963060267',
}

/* Um pilar em cada faixa: Segurança 5, Qualidade 3, Governança 2, Conformidade 1
   — nota e gaps diferentes por pilar, para uma troca de pergunta mudar a conta. */
const INDICE_POR_PILAR: Record<string, number> = { Segurança: 3, Qualidade: 2, Governança: 1, Conformidade: 0 }
const RESPOSTAS: Record<string, number> = Object.fromEntries(
  perguntasDoSetor(SETOR).map((q) => [q.id, INDICE_POR_PILAR[q.pilar]]),
)

const form = (campos: Record<string, string>) => {
  const f = new FormData()
  for (const [k, v] of Object.entries(campos)) f.set(k, v)
  return f
}
const valido = (extra: Record<string, string> = {}) =>
  form({
    setor: SETOR,
    porte: '1_5bi',
    cargo: 'cio_cto_cdo',
    respostas: JSON.stringify(RESPOSTAS),
    name: 'Ana Souza',
    email: 'ana.souza@banco.com.br',
    phone: '(11) 99999-0000',
    company: 'Banco Exemplo',
    consentimento: 'on',
    ...extra,
  })
const enviar = (dados: FormData) => enviarDiagnosticoDeMaturidade(null, dados)
const gravado = () => payload.create.mock.calls[0]?.[0]?.data
const emailAoLead = () => enviarAviso.mock.calls[0]?.[0]
const avisoAAtra = () => enviarAviso.mock.calls[1]?.[0]
const registrado = () =>
  [...vi.mocked(console.error).mock.calls, ...vi.mocked(console.warn).mock.calls].flat().map(String).join(' ')

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  excedeuPorIp.mockReturnValue(false)
  getPayload.mockResolvedValue(payload)
  lerContato.mockResolvedValue({ email: CAIXA, destinos: SEM_DESTINOS })
  lerDiagnosticoDeMaturidade.mockResolvedValue(TEXTOS)
  enviarAviso.mockResolvedValue(true)
  payload.create.mockResolvedValue({ id: 701 })
  payload.update.mockResolvedValue({})
})

const SEM_DESTINOS = { contato: null, consultores: null, diagnostico: null, carreiras: null, chat: null }

describe('enviarDiagnosticoDeMaturidade — envio válido', () => {
  it('grava com o kind, o contato e o grupo diagnostic refeito pelo motor', async () => {
    const r = await enviar(valido({ source: '/diagnostico-maturidade', utm_source: 'linkedin', utm_campaign: 'rc18' }))
    expect(r).toEqual({ ok: true, email: 'ana.souza@banco.com.br' })

    const calculo = calcular(SETOR, RESPOSTAS)
    const d = gravado()
    expect(d).toMatchObject({
      kind: 'data-maturity-diagnostic',
      email: 'ana.souza@banco.com.br',
      name: 'Ana Souza',
      phone: '(11) 99999-0000',
      company: 'Banco Exemplo',
      source: '/diagnostico-maturidade',
      utm: { source: 'linkedin', campaign: 'rc18' },
      status: 'new',
      notified: false,
    })
    expect(d.diagnostic).toMatchObject({
      sector: 'financeiro',
      size: '1_5bi',
      role: 'cio_cto_cdo',
      average: calculo.media,
      level: calculo.nivel,
      pillars: calculo.pilares,
      dama: calculo.damas,
      gaps: calculo.gaps,
      topGaps: calculo.topGaps.join(' | '),
      roadmap: roadmapEmTexto(montarRoadmap(calculo)),
      version: VERSAO,
    })
    expect(payload.create.mock.calls[0][0]).toMatchObject({ collection: 'form-submissions', overrideAccess: true })
  })

  it('topGaps no formato do HTML: "Rótulo (gap)" separados por " | "', async () => {
    await enviar(valido())
    expect(gravado().diagnostic.topGaps).toMatch(/^[^|]+ \(\d+\)( \| [^|]+ \(\d+\)){2}$/)
  })

  it('uma entrada de resposta por pergunta respondida, com texto e nota da base', async () => {
    await enviar(valido())
    const perguntas = perguntasDoSetor(SETOR)
    const { answers } = gravado().diagnostic
    expect(answers).toHaveLength(perguntas.length)
    const primeira = perguntas[0]
    const alternativa = primeira.alternativas[RESPOSTAS[primeira.id]]
    expect(answers[0]).toEqual({
      id: primeira.id,
      pilar: primeira.pilar,
      nota: alternativa.nota,
      tags: [...alternativa.tags],
      texto: alternativa.texto,
    })
  })

  it('message curto com o perfil em rótulo, sem repetir o que os campos do RD já levam', async () => {
    await enviar(valido())
    const { message } = gravado()
    expect(message).toContain('Setor: Mercado Financeiro')
    expect(message).toContain('Porte: R$ 1 bi – 5 bi')
    expect(message).toContain('Cargo: CIO / CTO / CDO')
    expect(message).toContain(`${perguntasDoSetor(SETOR).length} de ${perguntasDoSetor(SETOR).length} perguntas`)
    expect(message).not.toMatch(/Nível|Maiores gaps/)
  })

  it('envia o resultado ao lead com HTML, texto e reply_to na caixa de Diagnóstico', async () => {
    await enviar(valido())
    const m = emailAoLead()
    expect(m).toMatchObject({ para: 'ana.souza@banco.com.br', assunto: TEXTOS.email.assunto, responderPara: CAIXA })
    expect(m.html).toMatch(/^<!DOCTYPE html>/)
    expect(m.html).toContain('Olá, Ana Souza,')
    expect(m.html).toContain(TEXTOS.agendaUrl)
    expect(m.texto).toContain('Maturidade por pilar')
    /* O global é lido em pt: o corpo é o texto do motor, só em português. */
    expect(lerDiagnosticoDeMaturidade).toHaveBeenCalledWith('pt')
  })

  it('avisa a caixa de Diagnóstico com as respostas, respondendo ao lead', async () => {
    await enviar(valido())
    const a = avisoAAtra()
    expect(a).toMatchObject({
      para: CAIXA,
      responderPara: 'ana.souza@banco.com.br',
      assunto: '[site] diagnóstico de maturidade — Banco Exemplo',
    })
    expect(a.html).toBeUndefined()
    expect(a.texto).toContain('Nome: Ana Souza')
    expect(a.texto).toContain(`Respostas (${perguntasDoSetor(SETOR).length} de ${perguntasDoSetor(SETOR).length} perguntas)`)
  })

  /* Contato → Destino dos formulários → Diagnóstico (P-29): preenchido, vence o
     e-mail geral — no aviso à ATRA e no reply_to do resultado. */
  it('usa a caixa de "Diagnóstico" do admin quando ela está preenchida', async () => {
    lerContato.mockResolvedValue({ email: CAIXA, destinos: { ...SEM_DESTINOS, diagnostico: 'dados@atra.com.br' } })
    await enviar(valido())
    expect(avisoAAtra()).toMatchObject({ para: 'dados@atra.com.br' })
    expect(enviarAviso.mock.calls.find(([m]) => m.para === 'ana.souza@banco.com.br')?.[0]).toMatchObject({
      responderPara: 'dados@atra.com.br',
    })
  })

  it('marca resultSentAt e notified numa escrita só, pelo id que o create devolveu', async () => {
    await enviar(valido())
    expect(payload.update).toHaveBeenCalledTimes(1)
    expect(payload.update).toHaveBeenCalledWith({
      collection: 'form-submissions',
      id: 701,
      data: { resultSentAt: expect.any(String), notified: true },
    })
    const { resultSentAt } = payload.update.mock.calls[0][0].data
    expect(new Date(resultSentAt).toISOString()).toBe(resultSentAt)
  })

  it('e-mail gravado em minúsculas, como o buildPayload do HTML', async () => {
    const r = await enviar(valido({ email: 'Ana.Souza@Banco.com.BR' }))
    expect(r).toEqual({ ok: true, email: 'ana.souza@banco.com.br' })
    expect(gravado().email).toBe('ana.souza@banco.com.br')
  })

  /* A sincronização é o hook `afterChange` (task 023, `lib/rd-marketing.test.ts`). */
  it('não preenche o grupo rd — quem sincroniza é o hook', async () => {
    await enviar(valido())
    expect(gravado()).not.toHaveProperty('rd')
  })

  it('resposta parcial grava, com a conta só sobre o que foi respondido', async () => {
    const parcial = { gov_estrategia: 3, seg_acesso: 0 }
    const r = await enviar(valido({ respostas: JSON.stringify(parcial) }))
    expect(r).toMatchObject({ ok: true })
    expect(gravado().diagnostic.average).toBe(calcular(SETOR, parcial).media)
    expect(gravado().diagnostic.answers).toHaveLength(2)
  })
})

describe('enviarDiagnosticoDeMaturidade — a nota é sempre a do servidor', () => {
  it('pergunta de outro setor, índice fora do intervalo e nota do cliente não mudam a conta', async () => {
    const forjado = {
      ...RESPOSTAS,
      /* De saúde, não de financeiro: não pertence ao questionário deste setor. */
      conf_sau_anvisa: 3,
      /* Índices que não apontam para alternativa nenhuma. */
      gov_estrategia: 9,
      gov_papeis: -1,
      gov_catalogo: 1.5,
      /* A alternativa com a nota "dentro": o cliente tenta ditar a nota. */
      gov_arquitetura: { indice: 3, nota: 5 },
      /* Pergunta que não existe. */
      pergunta_inventada: 3,
    }
    await enviar(
      valido({
        respostas: JSON.stringify(forjado),
        /* Campos com cara de resultado: nenhum é lido. */
        average: '5',
        level: '5 · Otimizado',
        nota: '5',
        media: '5',
        topGaps: 'nenhum',
      }),
    )
    const limpo: Record<string, number> = { ...RESPOSTAS }
    for (const id of ['gov_estrategia', 'gov_papeis', 'gov_catalogo', 'gov_arquitetura']) delete limpo[id]
    const esperado = calcular(SETOR, limpo)

    const d = gravado().diagnostic
    expect(d.average).toBe(esperado.media)
    expect(d.level).toBe(esperado.nivel)
    expect(d.pillars).toEqual(esperado.pilares)
    expect(d.gaps).toEqual(esperado.gaps)
    const ids = d.answers.map((a: { id: string }) => a.id)
    expect(ids).not.toContain('conf_sau_anvisa')
    expect(ids).not.toContain('pergunta_inventada')
    expect(ids).not.toContain('gov_estrategia')
    expect(ids).toHaveLength(Object.keys(limpo).length)
  })

  it('a mesma resposta com e sem lixo forjado dá a mesma nota', async () => {
    await enviar(valido())
    const honesto = gravado().diagnostic
    payload.create.mockClear()
    await enviar(valido({ respostas: JSON.stringify({ ...RESPOSTAS, conf_cap_cvm: 3, conf_tel_anatel: 3 }) }))
    expect(gravado().diagnostic).toEqual(honesto)
  })

  it('o e-mail do resultado sai com a nota recalculada', async () => {
    await enviar(valido({ respostas: JSON.stringify({ ...RESPOSTAS, gov_estrategia: 9 }), average: '5' }))
    const limpo: Record<string, number> = { ...RESPOSTAS }
    delete limpo.gov_estrategia
    const media = calcular(SETOR, limpo).media.toFixed(1).replace('.', ',')
    expect(emailAoLead().texto).toContain(`${media} · Nível`)
  })

  it('nenhuma resposta válida: recusa sem gravar', async () => {
    const r = await enviar(valido({ respostas: JSON.stringify({ conf_sau_anvisa: 3, gov_estrategia: 7 }) }))
    expect(r).toMatchObject({ ok: false, codigo: 'respostas' })
    expect(payload.create).not.toHaveBeenCalled()
  })

  it('JSON quebrado ou ausente é o mesmo que nenhuma resposta', async () => {
    for (const respostas of ['{"gov_estrategia":', '', '[3,2,1]', '"texto"']) {
      const r = await enviar(valido({ respostas }))
      expect(r).toMatchObject({ ok: false, codigo: 'respostas' })
    }
    expect(payload.create).not.toHaveBeenCalled()
  })

  it('setor, porte ou cargo fora da lista: recusa sem gravar', async () => {
    const perfis: Record<string, string>[] = [
      { setor: 'constructor' },
      { setor: '' },
      { porte: 'gigante' },
      { cargo: 'estagiario' },
    ]
    for (const extra of perfis) {
      const r = await enviar(valido(extra))
      expect(r).toMatchObject({ ok: false, codigo: 'perfil' })
    }
    expect(payload.create).not.toHaveBeenCalled()
    expect(excedeuPorIp).not.toHaveBeenCalled()
  })
})

describe('enviarDiagnosticoDeMaturidade — contato', () => {
  it('e-mail pessoal: recusa no campo, sem gravar', async () => {
    const r = await enviar(valido({ email: 'ana.souza@gmail.com' }))
    expect(r).toMatchObject({
      ok: false,
      codigo: 'contato',
      campos: { email: expect.stringMatching(/corporativo/) },
    })
    expect(getPayload).not.toHaveBeenCalled()
    expect(payload.create).not.toHaveBeenCalled()
    expect(enviarAviso).not.toHaveBeenCalled()
  })

  /* `ehEmailCorporativo` tira a quebra antes de testar; o valor gravado não. */
  it('quebra de linha no meio do e-mail é recusada, e não gravada', async () => {
    const r = await enviar(valido({ email: 'ana@ban\nco.com.br' }))
    expect(r).toMatchObject({ ok: false, codigo: 'contato', campos: { email: expect.any(String) } })
    expect(payload.create).not.toHaveBeenCalled()
  })

  it('domínio pessoal em maiúsculas também é pessoal', async () => {
    const r = await enviar(valido({ email: 'Ana@HOTMAIL.COM' }))
    expect(r).toMatchObject({ ok: false, codigo: 'contato', campos: { email: expect.any(String) } })
  })

  it('sem consentimento: recusa, sem gravar', async () => {
    const dados = valido()
    dados.delete('consentimento')
    const r = await enviar(dados)
    expect(r).toMatchObject({
      ok: false,
      codigo: 'contato',
      erro: 'É preciso autorizar o contato para receber o diagnóstico.',
      campos: { consentimento: 'É preciso autorizar o contato para receber o diagnóstico.' },
    })
    expect(payload.create).not.toHaveBeenCalled()
  })

  it('todos os campos errados de uma vez, com o texto do HTML', async () => {
    const r = await enviar(
      valido({ name: 'Al', email: 'sem-arroba', phone: '9999-0000', company: '   ', consentimento: '' }),
    )
    expect(r).toMatchObject({
      ok: false,
      codigo: 'contato',
      erro: 'Informe seu nome.',
      campos: {
        name: 'Informe seu nome.',
        email: 'Use um e-mail corporativo válido (não aceitamos gmail, hotmail, etc.).',
        phone: 'Informe um telefone com DDD.',
        consentimento: 'É preciso autorizar o contato para receber o diagnóstico.',
      },
    })
    expect(r).not.toHaveProperty('campos.company')
  })

  /* Como no HTML v1.7: a empresa é "(opcional)". */
  it('aceita envio sem empresa', async () => {
    expect(await enviar(valido({ company: '' }))).toMatchObject({ ok: true })
    expect(gravado()).toMatchObject({ kind: 'data-maturity-diagnostic' })
  })

  it('telefone conta dígitos, não caracteres', async () => {
    expect(await enviar(valido({ phone: '(11) 9999-000' }))).toMatchObject({ ok: false, campos: { phone: expect.any(String) } })
    expect(await enviar(valido({ phone: '11 3333-4444' }))).toMatchObject({ ok: true })
  })

  /* ⚠️ O React 19 reseta o formulário quando a action termina, com sucesso ou
     com erro. Sem os valores de volta, uma recusa apagava o que foi digitado. */
  it('a recusa devolve os campos para o formulário repreencher', async () => {
    const r = await enviar(valido({ email: 'ana@gmail.com' }))
    expect(r).toMatchObject({
      ok: false,
      valores: {
        name: 'Ana Souza',
        email: 'ana@gmail.com',
        phone: '(11) 99999-0000',
        company: 'Banco Exemplo',
        consentimento: true,
      },
    })
  })

  it('devolve os valores também na recusa de perfil e de falha', async () => {
    expect(await enviar(valido({ setor: 'x' }))).toMatchObject({ ok: false, valores: { name: 'Ana Souza' } })
    getPayload.mockRejectedValue(new Error('ECONNREFUSED'))
    expect(await enviar(valido())).toMatchObject({ ok: false, codigo: 'falha', valores: { company: 'Banco Exemplo' } })
  })

  it('sucesso não traz valores nem campos', async () => {
    expect(await enviar(valido())).toEqual({ ok: true, email: 'ana.souza@banco.com.br' })
  })

  /* ⚠️ Com a quebra de linha, a empresa forjaria cabeçalho no assunto e o
     telefone um bloco "Resultado" dentro do aviso ao comercial. */
  it('colapsa quebras de linha em nome, telefone e empresa', async () => {
    await enviar(
      valido({
        name: 'Ana\r\nSouza',
        phone: '11 99999-0000\n\nResultado\nMédia: 5,00',
        company: 'Banco\nBcc: alguem@exemplo.com',
      }),
    )
    expect(gravado()).toMatchObject({ name: 'Ana Souza', company: 'Banco Bcc: alguem@exemplo.com' })
    expect(gravado().phone).not.toContain('\n')
    const a = avisoAAtra()
    expect(a.assunto).not.toMatch(/[\r\n]/)
    expect(a.texto.match(/^Resultado$/gm)).toHaveLength(1)
  })

  it('corta campos no teto do servidor', async () => {
    await enviar(valido({ company: 'x'.repeat(5000), utm_campaign: 'y'.repeat(5000) }))
    expect(gravado().company).toHaveLength(200)
    expect(gravado().utm.campaign.length).toBeLessThanOrEqual(200)
  })
})

describe('enviarDiagnosticoDeMaturidade — tempo de resposta', () => {
  it('a partir do carimbo de início, em segundos', async () => {
    await enviar(valido({ inicio: String(Date.now() - 300_000) }))
    const s = gravado().diagnostic.durationSeconds
    expect(s).toBeGreaterThanOrEqual(300)
    expect(s).toBeLessThanOrEqual(301)
  })

  it('carimbo ausente, ilegível, no futuro ou de horas atrás: vazio', async () => {
    for (const inicio of ['', 'ontem', String(Date.now() + 60_000), String(Date.now() - 3 * 60 * 60 * 1000), '-5']) {
      payload.create.mockClear()
      await enviar(valido({ inicio }))
      expect(gravado().diagnostic.durationSeconds).toBeUndefined()
    }
  })
})

describe('enviarDiagnosticoDeMaturidade — LGPD', () => {
  it('nenhum IP nem user agent no documento gravado', async () => {
    await enviar(valido())
    const serializado = JSON.stringify(payload.create.mock.calls[0][0])
    expect(serializado).not.toContain(IP)
    expect(serializado).not.toContain(USER_AGENT)
    expect(serializado).not.toMatch(/"(ip|userAgent|user_agent|ua)"/i)
  })

  it('o IP só serve ao limite por IP', async () => {
    await enviar(valido())
    expect(excedeuPorIp).toHaveBeenCalledWith(IP)
  })

  /* ⚠️ A mensagem do erro do Drizzle traz `params:` com os valores da query. */
  it('falha ao gravar não leva e-mail, nome nem telefone para o console', async () => {
    const erro = Object.assign(
      new Error('Failed query: insert into "form_submissions" params: ana.souza@banco.com.br,Ana Souza,(11) 99999-0000'),
      { cause: { code: '22021' } },
    )
    payload.create.mockRejectedValue(erro)
    const r = await enviar(valido())
    expect(r).toMatchObject({ ok: false, codigo: 'falha' })
    expect(registrado()).toContain('22021')
    for (const pessoal of ['ana.souza@banco.com.br', 'Ana Souza', '99999-0000', 'Banco Exemplo']) {
      expect(registrado()).not.toContain(pessoal)
    }
  })

  it('o mesmo vale para as falhas depois de gravar', async () => {
    lerContato.mockRejectedValue(new Error('params: ana.souza@banco.com.br'))
    await enviar(valido())
    payload.update.mockRejectedValue(new Error('params: Ana Souza (11) 99999-0000'))
    lerContato.mockResolvedValue({ email: CAIXA, destinos: SEM_DESTINOS })
    await enviar(valido())
    expect(registrado()).toContain('701')
    for (const pessoal of ['ana.souza@banco.com.br', 'Ana Souza', '99999-0000']) {
      expect(registrado()).not.toContain(pessoal)
    }
  })
})

/* ⚠️ Robô barrado recebe SUCESSO: dizer "você foi barrado" entrega o critério. */
describe('enviarDiagnosticoDeMaturidade — anti-spam devolve sucesso falso', () => {
  it('isca preenchida', async () => {
    const r = await enviar(valido({ [CAMPO_ISCA]: 'http://spam' }))
    expect(r).toEqual({ ok: true, email: 'ana.souza@banco.com.br' })
    expect(getPayload).not.toHaveBeenCalled()
    expect(payload.create).not.toHaveBeenCalled()
    expect(enviarAviso).not.toHaveBeenCalled()
  })

  it('carimbo rápido demais', async () => {
    const r = await enviar(valido({ carimbo: String(Date.now()) }))
    expect(r).toMatchObject({ ok: true })
    expect(payload.create).not.toHaveBeenCalled()
  })

  it('estouro do limite por IP — antes de conectar ao banco', async () => {
    excedeuPorIp.mockReturnValue(true)
    const r = await enviar(valido())
    expect(r).toMatchObject({ ok: true })
    expect(getPayload).not.toHaveBeenCalled()
    expect(payload.create).not.toHaveBeenCalled()
  })

  /* Sem oráculo: envio inválido recebe o erro de campo mesmo com a isca, e não
     gasta a cota por IP. */
  it('contato inválido recebe o erro de campo mesmo com a isca preenchida', async () => {
    const r = await enviar(valido({ email: 'ana@gmail.com', [CAMPO_ISCA]: 'http://spam' }))
    expect(r).toMatchObject({ ok: false, codigo: 'contato' })
    expect(excedeuPorIp).not.toHaveBeenCalled()
  })

  /* Carimbo ausente passa: pode ser JavaScript bloqueado. */
  it('carimbo ausente NÃO reprova', async () => {
    await enviar(valido())
    expect(payload.create).toHaveBeenCalledTimes(1)
  })
})

describe('enviarDiagnosticoDeMaturidade — depois de gravar, é sucesso', () => {
  it('Resend fora (sem chave ou recusando): grava, sem resultSentAt nem notified, e responde sucesso', async () => {
    enviarAviso.mockResolvedValue(false)
    const r = await enviar(valido())
    expect(r).toEqual({ ok: true, email: 'ana.souza@banco.com.br' })
    expect(payload.create).toHaveBeenCalledTimes(1)
    expect(gravado()).toMatchObject({ notified: false })
    expect(gravado()).not.toHaveProperty('resultSentAt')
    expect(payload.update).not.toHaveBeenCalled()
  })

  it('resultado não saiu, aviso saiu: marca só notified', async () => {
    enviarAviso.mockResolvedValueOnce(false).mockResolvedValueOnce(true)
    await enviar(valido())
    expect(payload.update).toHaveBeenCalledWith({ collection: 'form-submissions', id: 701, data: { notified: true } })
  })

  it('resultado saiu, aviso não: marca só resultSentAt', async () => {
    enviarAviso.mockResolvedValueOnce(true).mockResolvedValueOnce(false)
    await enviar(valido())
    const { data } = payload.update.mock.calls[0][0]
    expect(data).toEqual({ resultSentAt: expect.any(String) })
  })

  it('falha ao ler contato ou textos depois de gravar: continua sucesso, sem enviar', async () => {
    lerDiagnosticoDeMaturidade.mockRejectedValue(new Error('banco caiu'))
    const r = await enviar(valido())
    expect(r).toMatchObject({ ok: true })
    expect(payload.create).toHaveBeenCalledTimes(1)
    expect(enviarAviso).not.toHaveBeenCalled()
    expect(payload.update).not.toHaveBeenCalled()
  })

  it('envio do resultado lançando não cala o aviso à ATRA', async () => {
    enviarAviso.mockRejectedValueOnce(new Error('timeout')).mockResolvedValueOnce(true)
    const r = await enviar(valido())
    expect(r).toMatchObject({ ok: true })
    expect(avisoAAtra()).toMatchObject({ para: CAIXA })
    expect(payload.update).toHaveBeenCalledWith({ collection: 'form-submissions', id: 701, data: { notified: true } })
  })

  it('falha ao marcar o envio: continua sucesso', async () => {
    payload.update.mockRejectedValue(new Error('timeout'))
    expect(await enviar(valido())).toMatchObject({ ok: true })
  })

  it('banco fora do ar: responde erro legível em vez de lançar', async () => {
    getPayload.mockRejectedValue(new Error('ECONNREFUSED'))
    await expect(enviar(valido())).resolves.toMatchObject({
      ok: false,
      codigo: 'falha',
      erro: expect.stringMatching(/WhatsApp/),
    })
    expect(enviarAviso).not.toHaveBeenCalled()
  })

  it('falha ao GRAVAR: aí sim é erro — nada foi salvo, nada é enviado', async () => {
    payload.create.mockRejectedValue(new Error('constraint'))
    const r = await enviar(valido())
    expect(r).toMatchObject({ ok: false, codigo: 'falha' })
    expect(enviarAviso).not.toHaveBeenCalled()
  })
})
