import type { Locale } from './locales'
import { buscarPostsDoBlog } from './blog'
import { lerContato } from './contato'
import { toCaseCard } from './mappers/case'
import { toConsultantRole } from './mappers/consultant'
import type { UltimosConteudos } from './mappers/insights'
import { toMateriaDaImprensa } from './mappers/press'
import { toPostCard } from './mappers/post'
import { toResource } from './mappers/resource'
import { toSegmentCard } from './mappers/segment'
import { mapearOuFaltando, toTopics } from './mappers/shared'
import { toSolutionCard } from './mappers/solution'
import { toWebinar } from './mappers/webinar'
import { buscarMateriais } from './materiais'
import { totalDePaginas } from './paginacao'
import type { SecaoMestra } from './paginas-mestras'
import { getPayload } from './payload'
import type { CaseCard, ConteudoDaSecao } from '@/types/content'

/* A parte automática de cada página-mestra (feature paginas-mestras, D-55): as
 * mesmas consultas que as rotas de seção faziam, agora num lugar só, para o
 * resolvedor injetar nos blocos "Lista da seção" e "Destaques da seção".
 *
 * ⚠️ Toda consulta escreve o filtro de publicado (a Local API roda com
 * `overrideAccess: true`), e no modo rascunho mostra o rascunho — é o que o
 * editor quer ver no preview. `select` onde a collection tem blocos: sem ele o
 * adapter faz um JOIN por tipo de bloco e `/solucoes` levava 18–23 s.
 *
 * Insights e Carreiras não têm lista aqui: a Insights monta as faixas no
 * próprio bloco dela, e Carreiras usa o bloco de vagas. */
export async function buscarConteudoDaSecao(
  secao: SecaoMestra,
  locale: Locale,
  { rascunho, pagina = 1 }: { rascunho: boolean; pagina?: number },
): Promise<ConteudoDaSecao | null> {
  const payload = await getPayload()
  const publicado = rascunho ? {} : { where: { _status: { equals: 'published' as const } } }

  switch (secao) {
    case 'solucoes': {
      const { docs } = await payload.find({
        collection: 'solutions',
        locale,
        depth: 0,
        limit: 100,
        sort: 'order',
        where: { _status: { equals: 'published' } },
        select: { title: true, slug: true, category: true, icon: true, shortDescription: true, hasPage: true, badge: true },
      })
      return { secao, solucoes: docs.map(toSolutionCard) }
    }

    case 'segmentos': {
      const { docs } = await payload.find({
        collection: 'segments',
        locale,
        depth: 0,
        limit: 100,
        sort: 'order',
        where: { _status: { equals: 'published' } },
        select: { name: true, slug: true, icon: true, shortDescription: true },
      })
      return { secao, segmentos: docs.map(toSegmentCard) }
    }

    case 'webinars': {
      const { docs } = await payload.find({ collection: 'webinars', locale, depth: 1, limit: 100, sort: 'order', draft: rascunho, ...publicado })
      return { secao, webinars: docs.map(toWebinar) }
    }

    case 'midia': {
      const { docs } = await payload.find({ collection: 'press', locale, depth: 1, limit: 100, sort: 'order', draft: rascunho, ...publicado })
      return { secao, materias: docs.map(toMateriaDaImprensa) }
    }

    case 'ebooks':
      return { secao, materiais: await buscarMateriais('ebook', locale) }

    case 'cases': {
      // depth: 2 popula heroImage e topics — os mappers exigem documento, não id.
      const { docs } = await payload.find({ collection: 'cases', locale, depth: 2, limit: 100, sort: '-publishedAt', draft: rascunho, ...publicado })
      /* Um rascunho pela metade não derruba a listagem: mapeia um a um e separa
       * os que ainda não estão prontos (só existem no modo rascunho). */
      const cases: CaseCard[] = []
      const incompletos: string[] = []
      for (const doc of docs) {
        const r = mapearOuFaltando(() => toCaseCard(doc))
        if ('doc' in r) cases.push(r.doc)
        else incompletos.push(r.faltando)
      }
      /* Os chips vêm dos assuntos marcados para o filtro, na ordem do admin. */
      const { docs: assuntos } = await payload.find({
        collection: 'topics',
        locale,
        depth: 0,
        limit: 50,
        sort: 'filterOrder',
        where: { showInFilter: { equals: true } },
      })
      return { secao, cases, incompletos, topicos: toTopics(assuntos) }
    }

    case 'blog': {
      const posts = await buscarPostsDoBlog(locale, rascunho)
      return { secao, posts, pagina, totalDePaginas: totalDePaginas(posts.length) }
    }

    case 'consultores': {
      const { docs } = await payload.find({ collection: 'specialist-roles', locale, depth: 0, limit: 100, sort: 'order' })
      return { secao, perfis: docs.map(toConsultantRole), contato: await lerContato() }
    }

    case 'insights':
    case 'carreiras':
      return null
  }
}

/**
 * Os primeiros de cada seção, para as faixas da Insights (D-55): na ordem em
 * que a página da seção os mostra — data de publicação em Cases, Blog e
 * E-books; a ordem do admin em Webinars e ATRA na mídia, que é a ordem das
 * duas páginas.
 *
 * ⚠️ Só publicado, mesmo no modo rascunho: a Insights é vitrine do que está no
 * ar, e o critério de aceite é que rascunho nunca aparece nela.
 */
export async function buscarUltimosConteudos(locale: Locale, limite: number): Promise<UltimosConteudos> {
  const payload = await getPayload()
  const publicado = { _status: { equals: 'published' as const } }

  const [cases, posts, webinars, materias, ebooks] = await Promise.all([
    payload.find({ collection: 'cases', locale, depth: 2, limit: limite, sort: '-publishedAt', where: publicado }),
    payload.find({
      collection: 'posts',
      locale,
      depth: 1,
      limit: limite,
      sort: '-publishedAt',
      where: publicado,
      /* Sem o `body`: JSONB de artigo inteiro só para desenhar cartão. */
      select: { title: true, slug: true, description: true, coverImage: true, tags: true, publishedAt: true },
    }),
    payload.find({ collection: 'webinars', locale, depth: 1, limit: limite, sort: 'order', where: publicado }),
    payload.find({ collection: 'press', locale, depth: 1, limit: limite, sort: 'order', where: publicado }),
    payload.find({
      collection: 'resources',
      locale,
      depth: 1,
      limit: limite,
      sort: '-publishedAt',
      where: { kind: { equals: 'ebook' }, ...publicado },
    }),
  ])

  /* Case publicado incompleto (rascunho antigo publicado à força) fica de fora
     em vez de derrubar a página inteira. */
  const casos: CaseCard[] = []
  for (const doc of cases.docs) {
    const r = mapearOuFaltando(() => toCaseCard(doc))
    if ('doc' in r) casos.push(r.doc)
  }

  return {
    cases: casos,
    posts: posts.docs.map(toPostCard),
    webinars: webinars.docs.map(toWebinar),
    materias: materias.docs.map(toMateriaDaImprensa),
    ebooks: ebooks.docs.map(toResource),
  }
}
