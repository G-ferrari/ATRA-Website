import type { Field, Payload, PayloadRequest } from 'payload'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('./traducao', () => ({
  provedorDeTraducao: {
    translate: vi.fn(async (input: Record<number, string>) =>
      Object.fromEntries(Object.entries(input).map(([k, v]) => [k, `ES:${v}`])),
    ),
  },
}))

import { pedirTraducaoAoSalvar, textosLocalizados, traduzirGlobal } from './traducao-de-globais'

const CAMPOS: Field[] = [
  { name: 'titulo', type: 'text', localized: true },
  { name: 'href', type: 'text' },
  { name: 'consentNotice', type: 'textarea', localized: true },
  {
    name: 'itens',
    type: 'array',
    fields: [
      { name: 'rotulo', type: 'text', localized: true },
      { name: 'icone', type: 'text' },
    ],
  },
  { name: 'grupo', type: 'group', localized: true, fields: [{ name: 'texto', type: 'text' }] },
  { type: 'tabs', tabs: [{ label: 'Aba', fields: [{ name: 'naAba', type: 'text', localized: true }] }] },
]

const PT = {
  id: 1,
  titulo: 'Soluções',
  href: '/solucoes',
  consentNotice: 'Autorizo o contato',
  itens: [
    { id: 'a', rotulo: 'Dados', icone: 'db' },
    { id: 'b', rotulo: '  ', icone: 'x' },
  ],
  grupo: { texto: 'Herdado' },
  naAba: 'Na aba',
  updatedAt: '2026-10-28',
}

describe('textosLocalizados', () => {
  it('acha só texto localizado com conteúdo, e deixa o consentimento de fora', () => {
    expect(textosLocalizados(CAMPOS, PT)).toEqual([
      { caminho: ['titulo'], texto: 'Soluções' },
      { caminho: ['itens', 0, 'rotulo'], texto: 'Dados' },
      { caminho: ['grupo', 'texto'], texto: 'Herdado' },
      { caminho: ['naAba'], texto: 'Na aba' },
    ])
  })
})

describe('traduzirGlobal', () => {
  /* A armadilha do `casarIds`: o espanhol vai com os ids das linhas do
     português, senão a lista ganha linhas novas e o texto do pt fica órfão. */
  it('grava o espanhol com o documento português inteiro, ids incluídos', async () => {
    const updateGlobal = vi.fn(async () => ({}))
    const payload = {
      config: { globals: [{ slug: 'navigation', fields: CAMPOS }] },
      findGlobal: vi.fn(async () => structuredClone(PT)),
      updateGlobal,
    } as unknown as Payload

    expect(await traduzirGlobal(payload, 'navigation', 'es')).toBe(4)
    const chamada = (updateGlobal.mock.calls[0] as unknown[])[0] as { locale: string; data: Record<string, unknown> }
    expect(chamada.locale).toBe('es')
    expect(chamada.data).toEqual({
      titulo: 'ES:Soluções',
      href: '/solucoes',
      consentNotice: 'Autorizo o contato',
      itens: [
        { id: 'a', rotulo: 'ES:Dados', icone: 'db' },
        { id: 'b', rotulo: '  ', icone: 'x' },
      ],
      grupo: { texto: 'ES:Herdado' },
      naAba: 'ES:Na aba',
    })
  })
})

describe('pedirTraducaoAoSalvar', () => {
  afterEach(() => vi.unstubAllEnvs())

  const salvar = (req: Partial<PayloadRequest>, doc: unknown = { titulo: 'novo' }) => {
    const queue = vi.fn(async () => ({}))
    const pedido = {
      context: {},
      locale: 'pt',
      ...req,
      payload: {
        findGlobal: vi.fn(async () => ({ spanishTranslation: { enabled: true } })),
        jobs: { queue },
      },
    } as unknown as PayloadRequest
    return pedirTraducaoAoSalvar({ doc, previousDoc: { titulo: 'velho' }, req: pedido, global: { slug: 'footer' } } as never).then(
      () => queue,
    )
  }

  it('salvar o português com chave e interruptor pede o espanhol', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    const queue = await salvar({})
    expect(queue).toHaveBeenCalledWith(expect.objectContaining({ input: { global: 'footer', alvo: 'es' } }))
  })

  it('não pede nada sem a chave, fora do português, sem mudança ou na escrita da própria tarefa', async () => {
    expect(await salvar({})).not.toHaveBeenCalled()
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    expect(await salvar({ locale: 'en' })).not.toHaveBeenCalled()
    expect(await salvar({}, { titulo: 'velho' })).not.toHaveBeenCalled()
    expect(await salvar({ context: { atraTraducaoDeGlobal: true } })).not.toHaveBeenCalled()
  })
})
