import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { buscarVagasAbertas, lerVagaEscolhida } from './atrair'

/* A integração com o ATRAIR tem duas regras que não podem quebrar em silêncio:
 * a vaga escolhida no formulário tem que virar o id certo, e a lista de vagas
 * nunca pode derrubar a página de carreiras. As duas estão aqui. */

describe('lerVagaEscolhida', () => {
  it('separa o id do cargo', () => {
    expect(lerVagaEscolhida('12::Pessoa Desenvolvedora Full Stack Sênior')).toEqual({
      id: 12,
      cargo: 'Pessoa Desenvolvedora Full Stack Sênior',
    })
  })

  it('"não tenho vaga específica" manda valor vazio, e isso é um caso válido', () => {
    expect(lerVagaEscolhida('')).toEqual({})
  })

  it('corta no primeiro `::` e leva o resto como cargo', () => {
    expect(lerVagaEscolhida('7::Dev :: Full Stack')).toEqual({ id: 7, cargo: 'Dev :: Full Stack' })
  })

  it('id que não é inteiro positivo não vira vaga', () => {
    /* ⚠️ Quem posta o formulário não é obrigado a ser o nosso HTML. Um id
       inventado não pode chegar ao ATRAIR como se fosse escolha do candidato. */
    for (const torto of ['abc::Dev', '0::Dev', '-3::Dev', '1.5::Dev', '::Dev']) {
      expect(lerVagaEscolhida(torto).id, torto).toBeUndefined()
    }
    expect(lerVagaEscolhida('abc::Dev').cargo).toBe('Dev')
  })

  it('cargo vazio não vira string vazia', () => {
    expect(lerVagaEscolhida('12::   ')).toEqual({ id: 12, cargo: undefined })
  })
})

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

  it('descarta vaga sem id ou sem cargo — viraria opção em branco no formulário', async () => {
    fetchMock.mockResolvedValue(
      resposta([
        { id: 1, cargo: 'Dev' },
        { id: 2, cargo: '   ' },
        { cargo: 'Sem id' },
        { id: 'x', cargo: 'Id torto' },
      ]),
    )
    expect((await buscarVagasAbertas()).map((v) => v.id)).toEqual([1])
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
