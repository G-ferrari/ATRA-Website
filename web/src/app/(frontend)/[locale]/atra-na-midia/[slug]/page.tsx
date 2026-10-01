import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { PaginaDeMaterial, type TextosDoMaterial } from '@/components/content/pagina-de-material'
import { isLocale, LOCALES } from '@/lib/locales'
import { buscarMaterial, slugsDeMaterial } from '@/lib/materiais'
import { metadataDe } from '@/lib/seo'

/* /atra-na-midia/[slug] — era /relatorios/[slug] (MIG-045). Rota **sem gabarito** — não existe no protótipo.
 * A estrutura vive em `PaginaDeMaterial`, compartilhada com a outra rota. */

const KIND = 'report' as const
const SECAO = 'relatorios' as const

const TEXTOS: Record<'pt' | 'en', TextosDoMaterial> = {
  pt: {
    voltar: 'Voltar para ATRA na mídia',
    prefixo: 'Relatório Técnico',
    cta: 'Baixar Relatório Grátis',
    ctaIndisponivel: 'O arquivo ainda não está disponível para download.',
    paginas: 'páginas',
    semCorpoTitulo: 'Resumo em preparação',
    semCorpoTexto: 'Assim que o resumo do relatório estiver pronto, ele aparece aqui.',
  },
  en: {
    voltar: 'Back to ATRA in the media',
    prefixo: 'Technical Report',
    cta: 'Download the free report',
    ctaIndisponivel: 'The file is not available for download yet.',
    paginas: 'pages',
    semCorpoTitulo: 'Summary in preparation',
    semCorpoTexto: 'The report summary shows up here as soon as it is ready.',
  },
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of LOCALES) {
    const slugs = await slugsDeMaterial(KIND, locale)
    params.push(...slugs.map((slug) => ({ locale, slug })))
  }
  return params
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/atra-na-midia/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const material = await buscarMaterial(KIND, slug, locale)
  if (!material) return {}

  /* Sem corpo **e** sem download, a página não entrega nada a quem chega da
     busca. Volta a ser indexável quando MIG-104 ligar o formulário. */
  return metadataDe({ locale, local: { secao: 'relatorios', slug }, seo: material.seo, corpo: material.body })
}

export default async function MaterialPage({ params }: PageProps<'/[locale]/atra-na-midia/[slug]'>) {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const material = await buscarMaterial(KIND, slug, locale)
  if (!material) notFound()

  return (
    <PaginaDeMaterial material={material} secao={SECAO} locale={locale} t={TEXTOS[locale]} />
  )
}
