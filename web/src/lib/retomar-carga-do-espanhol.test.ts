import { describe, expect, it } from 'vitest'

import { up } from '../migrations/20261104_150000_retomar_carga_do_espanhol'

/* A retomada da carga do espanhol (04/11): repõe na fila só o pedido de
   espanhol que falhou, respeitando a trava, sem duplicar o que já está
   pendente, e põe os globais por último. */

type Job = Record<string, unknown>

function cenario(jobs: Job[], docs: Record<string, Record<string, unknown> | null>) {
  const fila: { workflow?: string; task?: string; input: Record<string, unknown> }[] = []
  const payload = {
    find: async () => ({ docs: jobs }),
    findByID: async ({ collection, id }: { collection: string; id: string }) => docs[`${collection}/${id}`] ?? null,
    jobs: { queue: async (p: { workflow?: string; task?: string; input: Record<string, unknown> }) => void fila.push(p) },
    logger: { info: () => {}, warn: () => {} },
  }
  return { fila, rodar: () => up({ payload, req: {}, db: {} } as never) }
}

const doc = (colecao: string, id: string, alvos = ['es'], extra: Job = {}): Job => ({
  workflowSlug: 'translate_document_locales',
  input: { collection_slug: colecao, collection_id: id, source_lng: 'pt', target_lngs: alvos, strategy: 'overwrite' },
  ...extra,
})
const global = (nome: string, extra: Job = {}): Job => ({ taskSlug: 'traduzir-global', input: { global: nome, alvo: 'es' }, ...extra })

describe('retomar a carga do espanhol', () => {
  it('repõe só os pedidos de espanhol que falharam, globais por último', async () => {
    const { fila, rodar } = cenario(
      [
        global('header', { hasError: true }),
        doc('pages', '1', ['es'], { hasError: true }),
        doc('pages', '2', ['es'], { completedAt: '2026-10-28T20:00:00Z' }),
        doc('posts', '3', ['en'], { hasError: true }),
        doc('posts', '4', ['en', 'es'], { hasError: true }),
      ],
      { 'pages/1': {}, 'pages/2': {}, 'posts/3': {}, 'posts/4': {} },
    )
    await rodar()
    expect(fila.map((p) => p.input.collection_id ?? p.input.global)).toEqual(['1', '4', 'header'])
    expect(fila[1]?.input.target_lngs).toEqual(['en', 'es'])
    expect(fila[2]?.task).toBe('traduzir-global')
  })

  it('respeita a trava e o documento apagado', async () => {
    const { fila, rodar } = cenario(
      [doc('pages', '1', ['en', 'es'], { hasError: true }), doc('pages', '2', ['es'], { hasError: true })],
      { 'pages/1': { spanishLocked: true }, 'pages/2': null },
    )
    await rodar()
    expect(fila).toEqual([])
  })

  it('tira só o idioma travado', async () => {
    const { fila, rodar } = cenario([doc('pages', '1', ['en', 'es'], { hasError: true })], {
      'pages/1': { englishLocked: true },
    })
    await rodar()
    expect(fila[0]?.input.target_lngs).toEqual(['es'])
  })

  it('não duplica pedido pendente nem pedido falho repetido', async () => {
    const { fila, rodar } = cenario(
      [
        doc('pages', '1', ['es'], { hasError: true }),
        doc('pages', '1', ['es']),
        doc('pages', '2', ['es'], { hasError: true }),
        doc('pages', '2', ['es'], { hasError: true }),
        global('footer', { hasError: true }),
        global('footer', { hasError: true }),
      ],
      { 'pages/1': {}, 'pages/2': {} },
    )
    await rodar()
    expect(fila.map((p) => p.input.collection_id ?? p.input.global)).toEqual(['2', 'footer'])
  })
})
