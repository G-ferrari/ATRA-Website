import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { buscarVagasAbertas, enviarParaAtrair } from './atrair'
import type { IntegracaoAtrair } from '@/types/content'

/* Duas regras que não podem quebrar em silêncio:
 *
 * 1. A lista de vagas do ATRAIR nunca derruba a página de carreiras — com o
 *    ATRAIR fora, a grade cai para a lista do CMS (`fonte: 'cms'`).
 * 2. **`fonte: 'atrair'` com zero vagas não é o mesmo que `fonte: 'cms'`** — é
 *    a distinção que a D-41 criou, e a que um refactor distraído desfaz
 *    primeiro. Ver o ⚠️ de `ResultadoDeVagas`.
 */

const LIGADA: IntegracaoAtrair = {
  endpoint: 'https://atrair.exemplo',
  vagas: true,
  bancoDeTalentos: true,
}

describe('buscarVagasAbertas', () => {
  const fetchMock = vi.fn()
  const chaveOriginal = process.env.ATRAIR_API_KEY

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    process.env.ATRAIR_API_KEY = 'chave'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    process.env.ATRAIR_API_KEY = chaveOriginal
  })

  const resposta = (vagas: unknown) => ({ ok: true, json: async () => ({ vagas }) })
  const vaga = (id: number, cargo: string) => ({ id, cargo, url: `https://atrair.exemplo/vaga/${id}` })

  /* ── As três razões de cair para o CMS ─────────────────────────────────── */

  it('chave desligada no CMS: não chama ninguém e manda a grade para o CMS', async () => {
    /* Nem para saber se o ATRAIR está de pé — desligar tem efeito imediato,
       sem esperar o cache de 5 min do fetch, porque não há fetch. */
    expect(await buscarVagasAbertas({ ...LIGADA, vagas: false })).toEqual({
      fonte: 'cms',
      motivo: 'desligado',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sem endereço no global: cai para o CMS sem chamar', async () => {
    expect(await buscarVagasAbertas({ ...LIGADA, endpoint: null })).toEqual({
      fonte: 'cms',
      motivo: 'sem-endereco',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('sem a credencial no servidor: ligada no CMS não basta', async () => {
    /* A segunda tranca. É ela que faz a D-41 não mudar o que está no ar: em
       produção as chaves nascem ligadas e a integração segue inerte até
       alguém provisionar `ATRAIR_API_KEY`. */
    delete process.env.ATRAIR_API_KEY
    expect(await buscarVagasAbertas(LIGADA)).toEqual({ fonte: 'cms', motivo: 'sem-credencial' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  /* ── A distinção que a D-41 existe para criar ──────────────────────────── */

  it('⚠️ ATRAIR respondendo ZERO vagas é `atrair`, não `cms` — a página mostra o vazio', async () => {
    /* Se isto virar `fonte: 'cms'`, uma vaga fechada no ATRAIR volta ao ar
       pela lista antiga da collection `jobs`. Foi o defeito que a D-41 fechou. */
    fetchMock.mockResolvedValue(resposta([]))
    expect(await buscarVagasAbertas(LIGADA)).toEqual({ fonte: 'atrair', vagas: [] })
  })

  it('⚠️ filtrar até sobrar zero também continua `atrair` — não esconde formato torto do outro lado', async () => {
    fetchMock.mockResolvedValue(resposta([{ id: 7, cargo: '   ', url: '' }]))
    expect(await buscarVagasAbertas(LIGADA)).toEqual({ fonte: 'atrair', vagas: [] })
  })

  /* ── O caminho feliz ───────────────────────────────────────────────────── */

  it('manda a chave no cabeçalho e bate no endpoint de vagas', async () => {
    fetchMock.mockResolvedValue(resposta([]))
    await buscarVagasAbertas(LIGADA)
    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toBe('https://atrair.exemplo/api/public/vagas')
    expect((init as RequestInit).headers).toMatchObject({ 'x-api-key': 'chave' })
  })

  it('descarta vaga sem id, sem cargo ou sem endereço — viraria card vazio ou card que não leva a lugar nenhum', async () => {
    fetchMock.mockResolvedValue(
      resposta([
        vaga(1, 'Dev'),
        { ...vaga(2, '   ') },
        { url: 'https://atrair.exemplo/vaga/3', cargo: 'Sem id' },
        { id: 'x', cargo: 'Id torto', url: 'https://atrair.exemplo/vaga/x' },
        { id: 5, cargo: 'Sem endereço' },
      ]),
    )
    const r = await buscarVagasAbertas(LIGADA)
    expect(r.fonte === 'atrair' && r.vagas.map((v) => v.id)).toEqual([1])
  })

  it('a vaga que passa chega com o endereço que o card vai usar', async () => {
    fetchMock.mockResolvedValue(resposta([vaga(12, 'Pessoa Desenvolvedora Full Stack Sênior')]))
    const r = await buscarVagasAbertas(LIGADA)
    /* ⚠️ O endereço vem PRONTO do ATRAIR. O site não monta URL do ATRAIR:
       quem sabe em que domínio o sistema está é o próprio sistema. */
    expect(r.fonte === 'atrair' && r.vagas[0].url).toBe('https://atrair.exemplo/vaga/12')
  })

  /* ── A página de carreiras existe mesmo com o ATRAIR fora ──────────────── */

  it('erro HTTP cai para o CMS', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, text: async () => 'boom' })
    expect(await buscarVagasAbertas(LIGADA)).toEqual({ fonte: 'cms', motivo: 'falhou' })
  })

  it('rede caída cai para o CMS', async () => {
    fetchMock.mockRejectedValue(new Error('ECONNREFUSED'))
    expect(await buscarVagasAbertas(LIGADA)).toEqual({ fonte: 'cms', motivo: 'falhou' })
  })

  it('resposta fora do formato cai para o CMS', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ vagas: 'não é lista' }) })
    expect(await buscarVagasAbertas(LIGADA)).toEqual({ fonte: 'cms', motivo: 'falhou' })
  })
})

describe('enviarParaAtrair', () => {
  const fetchMock = vi.fn()
  const chaveOriginal = process.env.ATRAIR_API_KEY
  const candidatura = { name: 'Maria', email: 'maria@exemplo.com' }

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    process.env.ATRAIR_API_KEY = 'chave'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    process.env.ATRAIR_API_KEY = chaveOriginal
  })

  it('chave própria: desligar o Banco de Talentos não desliga as vagas', async () => {
    /* As duas chaves são separadas por decisão do dono (D-41). Este teste é o
       que impede alguém "simplificar" para uma só. */
    expect(await enviarParaAtrair(candidatura, { ...LIGADA, bancoDeTalentos: false })).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('ligada, posta no endpoint do banco de talentos', async () => {
    fetchMock.mockResolvedValue({ ok: true })
    expect(await enviarParaAtrair(candidatura, LIGADA)).toBe(true)
    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toBe('https://atrair.exemplo/api/public/talent-pool')
    expect((init as RequestInit).method).toBe('POST')
  })

  it('sem endereço não chama e devolve false', async () => {
    expect(await enviarParaAtrair(candidatura, { ...LIGADA, endpoint: null })).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('⚠️ recusa e rede caída devolvem false sem lançar — a inscrição já está no banco', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 422, text: async () => 'nope' })
    expect(await enviarParaAtrair(candidatura, LIGADA)).toBe(false)
    fetchMock.mockRejectedValue(new Error('ECONNREFUSED'))
    expect(await enviarParaAtrair(candidatura, LIGADA)).toBe(false)
  })
})
