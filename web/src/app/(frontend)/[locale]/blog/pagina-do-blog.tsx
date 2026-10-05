import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PaginaMestra } from '@/components/secoes/pagina-mestra'
import type { Locale } from '@/lib/locales'
import { resolverPaginaMestra } from '@/lib/paginas'
import { SEGMENTO_DE_PAGINA } from '@/lib/routes'
import { metadataDe } from '@/lib/seo'

/* /blog (MIG-043) — porte de `legacy/src/pages/Blog.tsx`, com paginação de
 * verdade desde 02/10 (D-47), e página-mestra da seção desde a D-55.
 *
 * Duas rotas desenham esta página: `/blog` (a primeira) e
 * `/blog/pagina/[numero]` (as seguintes). Cada página é um endereço
 * pré-montado, com 12 artigos; o carrossel do topo só existe na primeira —
 * quem foi à página 5 já passou por ele e quer a lista (`itensEmDestaque`).
 * Topo, textos, a chamada para os webinars do fim e o SEO são a página-mestra
 * do blog, no admin. */

const SUFIXO = { pt: 'página', en: 'page' } as const

/** Metadata de uma página do blog. Cada uma é canônica de si mesma: o conteúdo
 *  é outro, e apontar todas para `/blog` esconderia do Google os artigos antigos. */
export async function metadataDoBlog(locale: Locale, pagina: number): Promise<Metadata> {
  const resolvida = await resolverPaginaMestra('blog', locale, pagina)
  if (!resolvida) return {}
  const { seo } = resolvida
  return metadataDe({
    locale,
    local: pagina <= 1 ? { secao: 'blog' } : { secao: 'blog', slug: `${SEGMENTO_DE_PAGINA}/${pagina}` },
    seo: pagina <= 1 ? seo : { ...seo, title: `${seo.title} — ${SUFIXO[locale]} ${pagina}` },
  })
}

export async function PaginaDoBlog({ locale, pagina }: { locale: Locale; pagina: number }) {
  /* `null` também para página além da última: 404, e não uma lista vazia com
     200, que o Google indexaria como página magra. */
  const resolvida = await resolverPaginaMestra('blog', locale, pagina)
  if (!resolvida) notFound()

  return (
    <PaginaMestra
      pagina={resolvida}
      locale={locale}
      className="min-h-screen bg-surface-1 dark:bg-[#0e1015] text-text-main dark:text-[#f3f4f6]"
    />
  )
}
