import { lerCatalogoDaIa } from '../catalogo-da-ia'
import type { Locale } from '../locales'
import { PREFIXO_DO_CODIGO, codigoDaPagina, secaoDaPagina } from '../mappers/catalogo-da-ia'
import { getPayload } from '../payload'

import { apagarTrechos, gravarTrechos, trechosGuardados } from './banco'
import type { GerarEmbeddings } from './embeddings'
import { planejar, trechosDesejados } from './plano'
import { paragrafosDoDocumento } from './texto'

/* O índice da busca da ATRA AI (D-73): o texto de tudo o que o catálogo lista,
 * em trechos com vetor, na tabela `ai_chunks`.
 *
 * O catálogo (`lib/catalogo-da-ia.ts`) decide **o que** entra: o que está
 * publicado, tem endereço e existe no idioma (D-69). Daqui sai só o **texto**
 * de cada item. Com isso a busca nunca acha trecho de página que a conversa não
 * pode recomendar, e um item despublicado sai do índice na sincronização
 * seguinte, pelo mesmo critério que o tira do catálogo.
 *
 * ⚠️ Sincronizar é comparar, não refazer. Cada trecho guarda o hash do próprio
 * texto (mais modelo e dimensão), e só o que mudou vai ao Gemini. Republicar um
 * artigo custa os embeddings dos trechos dele; mudar uma vírgula num, o de um. */

type Documento = { id: number | string; slug?: string | null; masterOf?: string | null; hasPage?: boolean | null }

const PUBLICADO = { _status: { equals: 'published' as const } }

/* Páginas de 10: soluções, segmentos e páginas pagam um JOIN por tipo de
 * bloco (armadilha do CLAUDE.md), e uma página de 100 documentos com o layout
 * inteiro segura a conexão por muito tempo. */
const POR_PAGINA = 10

/** O texto de cada documento publicado, pelo código do catálogo. */
async function paragrafosPublicados(locale: Locale): Promise<Map<string, string[]>> {
  const payload = await getPayload()
  const porCodigo = new Map<string, string[]>()

  const ler = async (
    collection: 'solutions' | 'segments' | 'cases' | 'webinars' | 'resources' | 'posts' | 'pages',
    codigo: (doc: Documento) => string | null,
    where: Record<string, unknown> = PUBLICADO,
  ) => {
    for (let pagina = 1; ; pagina++) {
      const { docs, hasNextPage } = await payload.find({
        collection,
        locale,
        depth: 0,
        limit: POR_PAGINA,
        page: pagina,
        where,
      } as Parameters<typeof payload.find>[0])
      for (const doc of docs as unknown as Documento[]) {
        const c = codigo(doc)
        if (c) porCodigo.set(c, paragrafosDoDocumento(doc))
      }
      if (!hasNextPage) break
    }
  }

  const porId = (prefixo: string) => (doc: Documento) => `${prefixo}${doc.id}`
  await ler('solutions', porId(PREFIXO_DO_CODIGO.solutions))
  await ler('segments', porId(PREFIXO_DO_CODIGO.segments))
  await ler('cases', porId(PREFIXO_DO_CODIGO.cases))
  await ler('webinars', porId(PREFIXO_DO_CODIGO.webinars))
  await ler('resources', porId(PREFIXO_DO_CODIGO.resources), { kind: { equals: 'ebook' }, ...PUBLICADO })
  await ler('posts', porId(PREFIXO_DO_CODIGO.posts))
  /* O código da página leva a seção, como no catálogo — e a rota mora no
     português: a seção não muda com o idioma. */
  await ler('pages', (doc) => {
    const secao = secaoDaPagina(doc)
    return secao ? codigoDaPagina(secao) : null
  })

  return porCodigo
}

export type ResultadoDaSincronizacao = { locale: Locale; trechos: number; gravados: number; apagados: number }

export async function sincronizarIdioma(locale: Locale, gerar: GerarEmbeddings): Promise<ResultadoDaSincronizacao> {
  const [catalogo, paragrafos, guardados] = await Promise.all([
    lerCatalogoDaIa(locale),
    paragrafosPublicados(locale),
    trechosGuardados(locale),
  ])
  const desejados = trechosDesejados(catalogo, paragrafos)
  const { gravar, apagar } = planejar(desejados, guardados)

  /* Os vetores primeiro, a gravação depois: se o Gemini falhar no meio, o
     índice fica como estava, e a próxima sincronização tenta de novo. */
  const vetores = await gerar(
    gravar.map((t) => t.conteudo),
    'RETRIEVAL_DOCUMENT',
  )
  await gravarTrechos(
    locale,
    gravar.map((t, i) => ({ ...t, vetor: vetores[i] })),
  )
  await apagarTrechos(locale, apagar)

  return { locale, trechos: desejados.length, gravados: gravar.length, apagados: apagar.length }
}

export async function sincronizarIndice(gerar: GerarEmbeddings): Promise<ResultadoDaSincronizacao[]> {
  /* Um idioma por vez: são as mesmas consultas pesadas, e em paralelo elas
     disputariam o banco com o site. */
  return [await sincronizarIdioma('pt', gerar), await sincronizarIdioma('en', gerar)]
}
