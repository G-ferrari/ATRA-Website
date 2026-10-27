import { readFileSync } from 'node:fs'
import path from 'node:path'

import type { CollectionConfig, PayloadRequest } from 'payload'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  CAMPO_DA_TRAVA,
  CHAVE_DO_PLUGIN,
  comTraducaoAutomatica,
  decidirTraducaoAutomatica,
} from './traducao-automatica'

/* Um `req` falso cujo `findGlobal` faz o que a Local API faz de verdade:
 * troca `req.context` por um objeto novo. Foi isso que, na primeira versão,
 * deixou a trava sem efeito — a chave ia para o objeto velho. */
function pedido(ligada: boolean, contexto: Record<string, unknown> = {}) {
  const req = {
    context: contexto,
    payload: {
      findGlobal: vi.fn(async () => {
        req.context = { ...req.context }
        return { englishTranslation: { enabled: ligada } }
      }),
    },
  } as unknown as PayloadRequest
  return req
}

const decidir = async (req: PayloadRequest, doc: Record<string, unknown> = {}) => {
  await decidirTraducaoAutomatica({ doc, req } as never)
  return (req.context as Record<string, unknown>)[CHAVE_DO_PLUGIN]
}

describe('decidirTraducaoAutomatica', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('ligada, com chave e sem trava: deixa o plugin traduzir', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    expect(await decidir(pedido(true))).toBe(false)
  })

  it('a trava do documento segura a tradução', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    expect(await decidir(pedido(true), { [CAMPO_DA_TRAVA]: true })).toBe(true)
  })

  it('desligada no admin, não traduz', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    expect(await decidir(pedido(false))).toBe(true)
  })

  /* O CI e o migrador de produção não têm a chave: nada se enfileira, e o
     global nem é consultado — em banco novo, migração de dados antiga roda
     antes de a coluna do interruptor existir. */
  it('sem GEMINI_API_KEY, não traduz e não consulta o banco', async () => {
    vi.stubEnv('GEMINI_API_KEY', '')
    const req = pedido(true)
    expect(await decidir(req)).toBe(true)
    expect(req.payload.findGlobal).not.toHaveBeenCalled()
  })

  it('a escrita do próprio tradutor passa intacta', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    const req = pedido(true, { [CHAVE_DO_PLUGIN]: true })
    expect(await decidir(req)).toBe(true)
    expect(req.payload.findGlobal).not.toHaveBeenCalled()
  })

  /* Publicar vários de uma vez na lista do admin usa um `req` só: a trava do
     primeiro não pode valer para o segundo. */
  it('decide de novo a cada documento do mesmo pedido', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    const req = pedido(true)
    expect(await decidir(req, { [CAMPO_DA_TRAVA]: true })).toBe(true)
    expect(await decidir(req)).toBe(false)
  })
})

describe('comTraducaoAutomatica', () => {
  const base: CollectionConfig = {
    slug: 'exemplo',
    fields: [
      { name: 'title', type: 'text', localized: true },
      { name: 'slug', type: 'text', localized: true },
    ],
  }
  const c = comTraducaoAutomatica(base)

  it('liga a tradução automática para o inglês, sobrescrevendo', () => {
    expect(c.custom?.translatorAutoTranslate).toEqual({ targets: ['en'], strategy: 'overwrite' })
  })

  it('acrescenta a trava e o gancho, sem mexer no original', () => {
    expect(c.fields.map((f) => ('name' in f ? f.name : null))).toEqual(['title', 'slug', CAMPO_DA_TRAVA])
    expect(c.hooks?.afterChange).toContain(decidirTraducaoAutomatica)
    expect(base.fields).toHaveLength(2)
  })

  it('o slug não vai à IA', () => {
    const slug = c.fields.find((f) => 'name' in f && f.name === 'slug')
    expect(slug?.custom).toMatchObject({ translateKit: { exclude: true } })
  })
})

/* O plugin não exporta o nome da chave; se uma versão nova trocar, o gancho
   deixaria de valer em silêncio. */
it('a chave de contexto é a que o plugin lê', () => {
  /* Caminho direto: o `exports` do pacote não expõe o `package.json`. */
  const raiz = path.resolve(__dirname, '../../node_modules/@focus-reactive/payload-plugin-translator')
  const fonte = readFileSync(path.join(raiz, 'dist/types/AutoTranslateContext.js'), 'utf8')
  expect(fonte).toContain(`AUTO_TRANSLATE_SKIP_CONTEXT_KEY = "${CHAVE_DO_PLUGIN}"`)
})
