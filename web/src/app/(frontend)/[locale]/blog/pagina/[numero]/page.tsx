import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound, permanentRedirect } from 'next/navigation'

import { contarPostsPublicados } from '@/lib/blog'
import { isLocale, LOCALES } from '@/lib/locales'
import { paginaDaUrl, totalDePaginas } from '@/lib/paginacao'
import { hrefDe } from '@/lib/routes'

import { metadataDoBlog, PaginaDoBlog } from '../../pagina-do-blog'

/* /blog/pagina/[numero] — da segunda página do blog em diante (D-47).
 *
 * Endereço próprio, e não `?pagina=2`: parâmetro de busca tiraria a página do
 * pré-render (toda visita montaria a lista no servidor), e resolvê-lo só no
 * navegador faria a página 2 abrir mostrando a 1 antes de trocar.
 *
 * ⚠️ A página 1 **não** mora aqui: `/blog/pagina/1` redireciona para `/blog`,
 * ou seriam dois endereços com o mesmo conteúdo. */

export async function generateStaticParams() {
  const params: { locale: string; numero: string }[] = []
  for (const locale of LOCALES) {
    const total = totalDePaginas(await contarPostsPublicados(locale))
    for (let n = 2; n <= total; n++) params.push({ locale, numero: String(n) })
  }
  return params
}

export async function generateMetadata({ params }: PageProps<'/[locale]/blog/pagina/[numero]'>): Promise<Metadata> {
  const { numero } = await params
  const locale = await getLocale()
  const pagina = paginaDaUrl(numero)
  if (!isLocale(locale) || !pagina) return {}
  return metadataDoBlog(locale, pagina)
}

export default async function PaginaDoBlogPage({ params }: PageProps<'/[locale]/blog/pagina/[numero]'>) {
  const { numero } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  /* `02`, `abc`, `0`: não são páginas. 404, e não um palpite. */
  const pagina = paginaDaUrl(numero)
  if (!pagina) notFound()
  if (pagina === 1) permanentRedirect(hrefDe('blog', locale))

  return <PaginaDoBlog locale={locale} pagina={pagina} />
}
