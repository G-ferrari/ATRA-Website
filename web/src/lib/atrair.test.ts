import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { buscarVagasAbertas } from './atrair'

/* A regra que não pode quebrar em silêncio: a lista de vagas do ATRAIR nunca
 * derruba a página de carreiras. Com o ATRAIR fora, a grade cai para a lista
 * do CMS — e para isso `buscarVagasAbertas` precisa devolver `[]`, nunca
 * lançar. */

describe('buscarVagasAbertas', () => {
  const fetchMock = vi.fn()
  const envOriginal = { url: process.env.ATRAIR_API_URL, chave: process.env.ATRAIR_API_KEY }

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    process.env.ATRAIR_API_URL = 'https://atrair.exemplo'
    process.env.ATRAIR_API_KEY = 'chave'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    process.env.ATRAIR_API_URL = envOriginal.url
    process.env.ATRAIR_API_KEY = envOriginal.chave
  })

  const resposta = (vagas: unknown) => ({ ok: true, json: async () => ({ vagas }) })
  const vaga = (id: number, cargo: string) => ({ id, cargo, url: `https://atrair.exemplo/vaga/${id}` })

  it('sem as envs, não chama ninguém e devolve lista vazia', async () => {
    delete process.env.ATRAIR_API_URL
    expect(await buscarVagasAbertas()).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('manda a chave no cabeçalho e bate no endpoint de vagas', async () => {
    fetchMock.mockResolvedValue(resposta([]))
    await buscarVagasAbertas()
    const [url, init] = fetchMock.mock.calls[0]
    expect(String(url)).toBe('https://atrair.exemplo/api/public/vagas')
    expect((init as RequestInit).headers).toMatchObject({ 'x-api-key': 'chave' })
  })

  it('a barra sobrando na URL não vira barra dupla', async () => {
    process.env.ATRAIR_API_URL = 'https://atrair.exemplo/'
    fetchMock.mockResolvedValue(resposta([]))
    await buscarVagasAbertas()
    expect(String(fetchMock.mock.calls[0][0])).toBe('https://atrair.exemplo/api/public/vagas')
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
    expect((await buscarVagasAbertas()).map((v) => v.id)).toEqual([1])
  })

  it('a vaga que passa chega com o endereço que o card vai usar', async () => {
    fetchMock.mockResolvedValue(resposta([vaga(12, 'Pessoa Desenvolvedora Full Stack Sênior')]))
    const [primeira] = await buscarVagasAbertas()
    /* ⚠️ O endereço vem PRONTO do ATRAIR. O site não monta URL do ATRAIR:
       quem sabe em que domínio o sistema está é o próprio sistema. */
    expect(primeira.url).toBe('https://atrair.exemplo/vaga/12')
  })

  /* ⚠️ Os três seguintes são a mesma promessa: a página de carreiras existe
     mesmo com o ATRAIR fora. Nenhum deles pode lançar. */
  it('erro HTTP devolve lista vazia', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, text: async () => 'boom' })
    expect(await buscarVagasAbertas()).toEqual([])
  })

  it('rede caída devolve lista vazia', async () => {
    fetchMock.mockRejectedValue(new Error('ECONNREFUSED'))
    expect(await buscarVagasAbertas()).toEqual([])
  })

  it('resposta fora do formato devolve lista vazia', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ vagas: 'não é lista' }) })
    expect(await buscarVagasAbertas()).toEqual([])
  })
})
