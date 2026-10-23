import { beforeEach, describe, expect, it, vi } from 'vitest'

/* Task #209: a consulta que dá à página de item o slug do outro idioma. O que
 * se confere é a forma dela — os dois idiomas numa consulta, sem fallback, só o
 * slug e o texto, só publicado fora do preview — e que o resultado passa pela
 * regra do sitemap. A regra em si é o teste de `versoesDe`; o formato do
 * `locale: 'all'`, o de `parDeTodosOsIdiomas`. O banco é simulado. */

const payload = { find: vi.fn() }
const rascunho = { isEnabled: false }
vi.mock('@/lib/payload', () => ({ getPayload: async () => payload }))
vi.mock('next/headers', () => ({ draftMode: async () => rascunho }))

const { versoesDoItem } = await import('./versoes-do-item')

type Consulta = { collection: string; locale?: string; select?: Record<string, boolean>; where?: unknown; draft?: boolean }
const consulta = (): Consulta => payload.find.mock.calls[0][0] as Consulta
const PUBLICADO = '"_status":{"equals":"published"}'

beforeEach(() => {
  vi.clearAllMocks()
  rascunho.isEnabled = false
  payload.find.mockResolvedValue({ docs: [] })
})

describe('versoesDoItem', () => {
  it('lê os dois idiomas numa consulta, só com o slug e o texto', async () => {
    await versoesDoItem('posts', 42)
    expect(payload.find).toHaveBeenCalledTimes(1)
    expect(consulta()).toMatchObject({ collection: 'posts', locale: 'all', select: { slug: true, title: true } })
    expect(JSON.stringify(consulta().where)).toContain('"id":{"equals":42}')
  })

  it('fora do preview, só publicado', async () => {
    await versoesDoItem('cases', 1)
    expect(JSON.stringify(consulta().where)).toContain(PUBLICADO)
    expect(consulta().draft).toBe(false)
  })

  it('no preview, a última versão, sem o filtro de publicado', async () => {
    rascunho.isEnabled = true
    await versoesDoItem('cases', 1)
    expect(JSON.stringify(consulta().where)).not.toContain(PUBLICADO)
    expect(consulta().draft).toBe(true)
  })

  /* `partners` não tem rascunho: o filtro por `_status` seria erro de consulta. */
  it('parceiro: sem filtro de status, e compara a descrição, porque o nome é marca', async () => {
    await versoesDoItem('partners', 1)
    expect(JSON.stringify(consulta().where)).not.toContain('_status')
    expect(consulta().select).toEqual({ slug: true, description: true })
  })

  it('segmento compara o nome', async () => {
    await versoesDoItem('segments', 1)
    expect(consulta().select).toEqual({ slug: true, name: true })
  })

  it('traduzido: o slug de cada idioma', async () => {
    payload.find.mockResolvedValue({
      docs: [{ id: 3, title: { pt: 'Privacidade & LGPD', en: 'Privacy & LGPD' }, slug: { pt: 'privacidade', en: 'privacy' } }],
    })
    expect(await versoesDoItem('solutions', 3)).toEqual({ pt: 'privacidade', en: 'privacy' })
  })

  it('criado só em português: só o português', async () => {
    payload.find.mockResolvedValue({ docs: [{ id: 9, title: { pt: 'Webinar' }, slug: { pt: 'webinar' } }] })
    expect(await versoesDoItem('webinars', 9)).toEqual({ pt: 'webinar' })
  })

  it('documento não encontrado: nenhuma versão', async () => {
    expect(await versoesDoItem('jobs', 7)).toEqual({})
  })
})
