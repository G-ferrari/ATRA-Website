import { readFileSync } from 'node:fs'
import path from 'node:path'

import type { CollectionConfig, PayloadRequest } from 'payload'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  CAMPO_DA_TRAVA,
  CHAVE_DO_PLUGIN,
  comTraducaoAutomatica,
  decidirTraducaoAutomatica,
  TRAVAS,
} from './traducao-automatica'

/* Um `req` falso cujo `findGlobal` faz o que a Local API faz de verdade:
 * troca `req.context` por um objeto novo. Foi isso que, na primeira versão,
 * deixou a trava sem efeito — a chave ia para o objeto velho. */
function pedido(ligados: { en?: boolean; es?: boolean }, contexto: Record<string, unknown> = {}) {
  const req = {
    context: contexto,
    locale: 'pt',
    payload: {
      findGlobal: vi.fn(async () => {
        req.context = { ...req.context }
        return { englishTranslation: { enabled: ligados.en ?? false }, spanishTranslation: { enabled: ligados.es ?? false } }
      }),
      jobs: { queue: vi.fn(async () => ({})) },
    },
  } as unknown as PayloadRequest & { payload: { jobs: { queue: ReturnType<typeof vi.fn> } } }
  return req
}

const OS_DOIS = { en: true, es: true }
const COLECAO = { slug: 'pages', versions: { drafts: true } }

const decidir = async (
  req: PayloadRequest,
  doc: Record<string, unknown> = {},
  previousDoc: Record<string, unknown> = { title: 'antes' },
) => {
  await decidirTraducaoAutomatica({
    doc: { id: 7, _status: 'published', title: 'depois', ...doc },
    previousDoc,
    req,
    collection: COLECAO,
  } as never)
  return (req.context as Record<string, unknown>)[CHAVE_DO_PLUGIN]
}

describe('decidirTraducaoAutomatica', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('os dois idiomas ligados, com chave e sem trava: deixa o plugin traduzir', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    const req = pedido(OS_DOIS)
    expect(await decidir(req)).toBe(false)
    expect(req.payload.jobs.queue).not.toHaveBeenCalled()
  })

  it('a trava dos dois idiomas segura a tradução', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    const req = pedido(OS_DOIS)
    expect(await decidir(req, { [TRAVAS.en]: true, [TRAVAS.es]: true })).toBe(true)
    expect(req.payload.jobs.queue).not.toHaveBeenCalled()
  })

  it('desligada no admin, não traduz', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    const req = pedido({})
    expect(await decidir(req)).toBe(true)
    expect(req.payload.jobs.queue).not.toHaveBeenCalled()
  })

  /* D-77: o plugin só traduz para todos os idiomas ou nenhum. Com um idioma
     travado, ele fica de fora e o pedido vai à fila só com o outro. */
  it('inglês travado: o espanhol vai sozinho para a fila', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    const req = pedido(OS_DOIS)
    expect(await decidir(req, { [CAMPO_DA_TRAVA]: true })).toBe(true)
    expect(req.payload.jobs.queue).toHaveBeenCalledOnce()
    expect(req.payload.jobs.queue.mock.calls[0][0]).toMatchObject({
      queue: 'translations',
      input: { collection_slug: 'pages', collection_id: '7', source_lng: 'pt', target_lngs: ['es'], strategy: 'overwrite' },
    })
  })

  it('só o inglês ligado: o inglês vai sozinho para a fila', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    const req = pedido({ en: true })
    expect(await decidir(req)).toBe(true)
    expect(req.payload.jobs.queue.mock.calls[0][0]).toMatchObject({ input: { target_lngs: ['en'] } })
  })

  /* As condições que o plugin confere, repetidas no pedido de um idioma só. */
  it('um idioma só: não pede rascunho, escrita em outro idioma nem salvamento sem mudança', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    const rascunho = pedido({ es: true })
    await decidir(rascunho, { _status: 'draft' })
    expect(rascunho.payload.jobs.queue).not.toHaveBeenCalled()

    const noIngles = pedido({ es: true })
    ;(noIngles as { locale: string }).locale = 'en'
    await decidir(noIngles)
    expect(noIngles.payload.jobs.queue).not.toHaveBeenCalled()

    const igual = pedido({ es: true })
    await decidir(igual, { title: 'mesmo', updatedAt: '2026-10-28' }, { id: 7, title: 'mesmo', _status: 'published', updatedAt: '2026-10-01' })
    expect(igual.payload.jobs.queue).not.toHaveBeenCalled()
  })

  /* O CI e o migrador de produção não têm a chave: nada se enfileira, e o
     global nem é consultado — em banco novo, migração de dados antiga roda
     antes de a coluna do interruptor existir. */
  it('sem GEMINI_API_KEY, não traduz e não consulta o banco', async () => {
    vi.stubEnv('GEMINI_API_KEY', '')
    const req = pedido(OS_DOIS)
    expect(await decidir(req)).toBe(true)
    expect(req.payload.findGlobal).not.toHaveBeenCalled()
    expect(req.payload.jobs.queue).not.toHaveBeenCalled()
  })

  it('a escrita do próprio tradutor passa intacta', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    const req = pedido(OS_DOIS, { [CHAVE_DO_PLUGIN]: true })
    expect(await decidir(req)).toBe(true)
    expect(req.payload.findGlobal).not.toHaveBeenCalled()
  })

  /* Publicar vários de uma vez na lista do admin usa um `req` só: a trava do
     primeiro não pode valer para o segundo. */
  it('decide de novo a cada documento do mesmo pedido', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'chave')
    const req = pedido(OS_DOIS)
    expect(await decidir(req, { [TRAVAS.en]: true, [TRAVAS.es]: true })).toBe(true)
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

  it('liga a tradução automática para o inglês e o espanhol, sobrescrevendo', () => {
    expect(c.custom?.translatorAutoTranslate).toEqual({ targets: ['en', 'es'], strategy: 'overwrite' })
  })

  it('acrescenta a trava e o gancho, sem mexer no original', () => {
    expect(c.fields.map((f) => ('name' in f ? f.name : null))).toEqual(['title', 'slug', TRAVAS.en, TRAVAS.es])
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
