import { lerCatalogoDaIa } from '@/lib/catalogo-da-ia'
import { montarLlmsTxt } from '@/lib/llms-txt'
import { getPayload } from '@/lib/payload'
import { ORIGEM } from '@/lib/seo'

/* `/llms.txt` (D-80) — ver `lib/llms-txt.ts`.
 *
 * Fica na raiz de `app/`, fora de `[locale]`, como `robots.ts` e `sitemap.ts`:
 * é um arquivo do domínio, e o `proxy.ts` não intercepta caminho com ponto.
 * Em português, o idioma do site; o mapa do site leva às outras versões. */

/** Revalida a cada hora, como o sitemap: publicar não deve exigir deploy. */
export const revalidate = 3600

/* Sem descrição da inicial no admin, a mesma frase padrão do layout. */
const RESUMO_PADRAO = 'Consultoria de Dados e IA.'

export async function GET(): Promise<Response> {
  const payload = await getPayload()
  const [catalogo, inicial] = await Promise.all([
    lerCatalogoDaIa('pt'),
    payload.find({
      collection: 'pages',
      locale: 'pt',
      depth: 0,
      limit: 1,
      where: { slug: { equals: 'home' }, _status: { equals: 'published' } },
      select: { seo: { metaDescription: true } },
    }),
  ])

  const corpo = montarLlmsTxt({
    catalogo,
    origem: ORIGEM,
    resumo: inicial.docs[0]?.seo?.metaDescription?.trim() || RESUMO_PADRAO,
  })
  return new Response(corpo, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
}
