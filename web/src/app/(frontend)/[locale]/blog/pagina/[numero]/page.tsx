import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { contarPostsPublicados } from '@/lib/blog'
import { isLocale, LOCALES } from '@/lib/locales'
import { paginaDaUrl, totalDePaginas } from '@/lib/paginacao'

import { metadataDoBlog, PaginaDoBlog } from '../../pagina-do-blog'

/* /blog/pagina/[numero] — da segunda página do blog em diante (D-47).
 *
 * Endereço próprio, e não `?pagina=2`: parâmetro de busca tiraria a página do
 * pré-render (toda visita montaria a lista no servidor), e resolvê-lo só no
 * navegador faria a página 2 abrir mostrando a 1 antes de trocar.
 *
 * ⚠️ A página 1 **não** mora aqui: `/blog/pagina/1` redireciona para `/blog`,
 * ou seriam dois endereços com o mesmo conteúdo. Quem responde é a lista de
 * redirects (`PRIMEIRA_PAGINA`, em `lib/redirects.ts`), antes de chegar aqui —
 * feito desta página, o Next devolvia o `Location` em dobro. */

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
  // Só chega aqui se a lista de redirects falhar; 404 é melhor que conteúdo em dois endereços.
  if (pagina === 1) notFound()

  return <PaginaDoBlog locale={locale} pagina={pagina} />
}
