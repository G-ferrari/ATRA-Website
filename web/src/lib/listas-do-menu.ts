import { ondeExisteNoIdioma } from './existe-no-idioma'
import type { Locale } from './locales'
import { getPayload } from './payload'

/* As listas de collection que o mega-menu desenha: soluções, parceiros,
 * segmentos e os cases do painel de conversão (D-51). Saíram do layout para
 * poderem ser testadas — o layout é casca, quem decide o que entra é aqui.
 *
 * `select` em cada consulta porque o menu só precisa do cartão — sem ele,
 * `solutions` arrasta um join por tipo de bloco e o cabeçalho passa a custar
 * dezenas de segundos.
 *
 * ⚠️ O filtro de status é **obrigatório**, e não redundante com o
 * `access.read` da collection: a Local API roda com `overrideAccess: true` por
 * padrão, então o acesso que esconde rascunho do público **não se aplica**. Sem
 * ele o mega-menu lista rascunho para todo visitante — o que só apareceu quando
 * MIG-093 pôs 12 soluções em rascunho, meses depois de a consulta ter sido
 * escrita.
 *
 * ⚠️ E toda lista passa por `ondeExisteNoIdioma` (D-69): no inglês, o que não
 * existe no inglês fica de fora. Com o fallback, a solução criada no admin só
 * em português entrava no menu inglês com o slug português, e o link dava 404
 * — foi assim com Master Data Management, Privacidade & LGPD, o segmento
 * Seguros e o parceiro AWS. */

const PUBLICADO = { _status: { equals: 'published' as const } }

export async function buscarListasDoMenu(locale: Locale) {
  const payload = await getPayload()
  const [solucoes, parceiros, segmentos, cases] = await Promise.all([
    payload.find({
      collection: 'solutions',
      locale,
      depth: 0,
      limit: 100,
      sort: 'order',
      where: ondeExisteNoIdioma(locale, PUBLICADO),
      select: { title: true, slug: true, category: true, icon: true, shortDescription: true, hasPage: true, badge: true },
    }),
    payload.find({
      collection: 'partners',
      locale,
      depth: 1,
      limit: 100,
      sort: 'order',
      /* `partners` não tem rascunho: só o corte do idioma. */
      where: ondeExisteNoIdioma(locale),
      select: { name: true, slug: true, logo: true, logoDark: true, logoScale: true, description: true },
    }),
    payload.find({
      collection: 'segments',
      locale,
      depth: 0,
      limit: 100,
      sort: 'order',
      where: ondeExisteNoIdioma(locale, PUBLICADO),
      select: { name: true, slug: true, icon: true, shortDescription: true },
    }),
    /* Os cases que o painel de conversão pode mostrar. O global guarda só os
       ids (`depth: 0` lá); quem os resolve é esta consulta, que já filtra o que
       está publicado e existe no idioma. `depth: 1` só pela capa. */
    payload.find({
      collection: 'cases',
      locale,
      depth: 1,
      limit: 50,
      sort: '-publishedAt',
      where: ondeExisteNoIdioma(locale, PUBLICADO),
      select: { title: true, slug: true, client: true, heroImage: true },
    }),
  ])

  return { solucoes: solucoes.docs, parceiros: parceiros.docs, segmentos: segmentos.docs, cases: cases.docs }
}
