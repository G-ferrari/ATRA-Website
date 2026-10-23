import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Bloco } from '@/types/content'

/* D-69 (task #52): toda listagem do inglês cujo cartão leva à página do item
 * consulta só o que tem slug em inglês. Sem o corte, o documento criado só em
 * português entra com o slug português emprestado pelo fallback, e o link dá
 * 404 — o menu de Soluções em 07/10; o blog, os webinars e a faixa de
 * parceiros da home em 23/10.
 *
 * O que se confere é a consulta: que a de cada listagem, em inglês, leva o
 * corte do idioma (e continua só com publicado), e que em português nada muda.
 * Que o corte no `where` faz o que promete é o teste de `existe-no-idioma`. O
 * banco é simulado. */

const PAGINA_COM_VAGAS = { title: 'Carreiras', seo: null, layout: [{ blockType: 'jobsList', id: 'vagas' }] }

const payload = { find: vi.fn(), count: vi.fn(), findGlobal: vi.fn() }
vi.mock('@/lib/payload', () => ({ getPayload: async () => payload }))
vi.mock('next/headers', () => ({ draftMode: async () => ({ isEnabled: false }) }))
vi.mock('next/root-params', () => ({ locale: async () => 'en' }))
vi.mock('@/lib/contato', () => ({ lerContato: async () => ({ avisoDoBancoDeTalentos: null }) }))
/* `cache()` do React guardaria o resultado entre um teste e outro. */
vi.mock('react', async (original) => ({ ...(await original<typeof import('react')>()), cache: <T>(fn: T) => fn }))

const { buscarListasDoMenu } = await import('./listas-do-menu')
const { buscarConteudoDaSecao, buscarUltimosConteudos } = await import('./conteudo-da-secao')
const { contarPostsPublicados } = await import('./blog')
const { comParceirosCadastrados } = await import('./parceiros')
const { resolverPagina } = await import('./paginas')

type Consulta = { collection: string; where?: unknown; limit?: number }
const consultasDe = (collection: string): Consulta[] =>
  payload.find.mock.calls.map((c) => c[0] as Consulta).filter((c) => c.collection === collection)
const onde = (collection: string) => {
  const consultas = consultasDe(collection)
  expect(consultas, `nenhuma consulta a ${collection}`).not.toHaveLength(0)
  return JSON.stringify(consultas.map((c) => c.where ?? null))
}
const CORTE = '"slug":{"exists":true}'
const PUBLICADO = '"_status":{"equals":"published"}'

beforeEach(() => {
  vi.clearAllMocks()
  payload.find.mockImplementation(async (args: Consulta) => ({ docs: args.collection === 'pages' ? [PAGINA_COM_VAGAS] : [] }))
  payload.count.mockResolvedValue({ totalDocs: 0 })
  payload.findGlobal.mockResolvedValue({})
})

describe('menu (soluções, parceiros, segmentos, cases do painel)', () => {
  const COLECOES = ['solutions', 'partners', 'segments', 'cases']

  it('no inglês, cada lista leva o corte do idioma', async () => {
    await buscarListasDoMenu('en')
    for (const c of COLECOES) expect(onde(c), c).toContain(CORTE)
    /* O corte soma ao filtro de publicado, não o substitui. */
    for (const c of ['solutions', 'segments', 'cases']) expect(onde(c), c).toContain(PUBLICADO)
  })

  it('no português, nenhum corte', async () => {
    await buscarListasDoMenu('pt')
    for (const c of COLECOES) expect(onde(c), c).not.toContain(CORTE)
  })
})

describe('índices das seções', () => {
  const SECOES = [
    ['solucoes', 'solutions'],
    ['segmentos', 'segments'],
    ['webinars', 'webinars'],
    ['cases', 'cases'],
    ['blog', 'posts'],
    ['ebooks', 'resources'],
  ] as const

  for (const [secao, collection] of SECOES) {
    it(`${secao}: só o que existe no inglês, e o português inteiro`, async () => {
      await buscarConteudoDaSecao(secao, 'en', { rascunho: false })
      expect(onde(collection)).toContain(CORTE)
      expect(onde(collection)).toContain(PUBLICADO)

      vi.clearAllMocks()
      await buscarConteudoDaSecao(secao, 'pt', { rascunho: false })
      expect(onde(collection)).not.toContain(CORTE)
    })
  }

  it('no preview em inglês, o rascunho entra, mas o corte continua', async () => {
    await buscarConteudoDaSecao('webinars', 'en', { rascunho: true })
    expect(onde('webinars')).toContain(CORTE)
    expect(onde('webinars')).not.toContain(PUBLICADO)
  })

  it('ATRA na mídia fica de fora: a matéria abre no veículo, não há página do item', async () => {
    await buscarConteudoDaSecao('midia', 'en', { rascunho: false })
    expect(onde('press')).not.toContain(CORTE)
  })

  it('a contagem que pré-monta as páginas do blog usa o mesmo corte', async () => {
    await contarPostsPublicados('en')
    expect(JSON.stringify(payload.count.mock.calls[0][0].where)).toContain(CORTE)
  })
})

describe('faixas da Insights', () => {
  it('no inglês, o corte vai na consulta — os três de cada faixa são três que abrem', async () => {
    await buscarUltimosConteudos('en', 3)
    for (const c of ['cases', 'posts', 'webinars', 'resources']) {
      expect(onde(c), c).toContain(CORTE)
      expect(consultasDe(c)[0].limit, c).toBe(3)
    }
    expect(onde('press')).not.toContain(CORTE)
  })

  it('no português, nenhum corte', async () => {
    await buscarUltimosConteudos('pt', 3)
    for (const c of ['cases', 'posts', 'webinars', 'resources']) expect(onde(c), c).not.toContain(CORTE)
  })
})

describe('faixa de parceiros e vagas', () => {
  const FAIXA = [{ tipo: 'logoMarquee' }] as unknown as Bloco[]

  it('a faixa de logos no inglês só traz parceiro com slug em inglês', async () => {
    await comParceirosCadastrados(FAIXA, 'en')
    expect(onde('partners')).toContain(CORTE)

    vi.clearAllMocks()
    await comParceirosCadastrados(FAIXA, 'pt')
    expect(onde('partners')).not.toContain(CORTE)
  })

  it('a lista de vagas do CMS no inglês só traz vaga com slug em inglês', async () => {
    await resolverPagina('carreiras', 'careers', 'en')
    expect(onde('jobs')).toContain(CORTE)
    expect(onde('jobs')).toContain(PUBLICADO)

    vi.clearAllMocks()
    await resolverPagina('carreiras', 'careers', 'pt')
    expect(onde('jobs')).not.toContain(CORTE)
  })
})
