import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { PaginaDeMaterial, type TextosDoMaterial } from '@/components/content/pagina-de-material'
import { lerContato } from '@/lib/contato'
import { isLocale, LOCALES } from '@/lib/locales'
import { buscarMaterial, slugsDeMaterial } from '@/lib/materiais'
import { robotsDeCorpo } from '@/lib/seo'

/* /ebooks/[slug] (MIG-045). Rota **sem gabarito** — não existe no protótipo.
 * A estrutura vive em `PaginaDeMaterial`, compartilhada com a outra rota. */

const KIND = 'ebook' as const
const SECAO = 'ebooks' as const

const TEXTOS: Record<'pt' | 'en', TextosDoMaterial> = {
  pt: {
    voltar: 'Voltar para e-books',
    prefixo: 'E-book',
    cta: 'Baixar E-book agora',
    ctaIndisponivel: 'O arquivo ainda não está disponível para download.',
    paginas: 'páginas',
    semCorpoTitulo: 'Prévia em preparação',
    semCorpoTexto: 'Assim que a prévia do e-book estiver pronta, ela aparece aqui.',
    ctaTitulo: 'Quer aplicar isso',
    ctaDestaque: 'na sua operação?',
    ctaDescricao: 'Nossos especialistas ajudam a sair do guia para a prática, com o que você já tem hoje.',
    ctaTelefone: 'Telefone',
    ctaEmail: 'E-mail',
    ctaAcao: 'Fale com um especialista',
  },
  en: {
    voltar: 'Back to ebooks',
    prefixo: 'Ebook',
    cta: 'Download the ebook',
    ctaIndisponivel: 'The file is not available for download yet.',
    paginas: 'pages',
    semCorpoTitulo: 'Preview in preparation',
    semCorpoTexto: 'The ebook preview shows up here as soon as it is ready.',
    ctaTitulo: 'Want to apply this',
    ctaDestaque: 'to your operation?',
    ctaDescricao: 'Our specialists help you move from the guide to practice, with what you already have.',
    ctaTelefone: 'Phone',
    ctaEmail: 'E-mail',
    ctaAcao: 'Talk to a specialist',
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
}: PageProps<'/[locale]/ebooks/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const material = await buscarMaterial(KIND, slug, locale)
  if (!material) return {}

  return {
    title: material.title,
    description: material.description,
    openGraph: { images: [{ url: material.image.url }] },
    /* Sem corpo **e** sem download, a página não entrega nada a quem chega da
     * busca. Volta a ser indexável quando MIG-104 ligar o formulário. */
    robots: robotsDeCorpo(material.body),
  }
}

export default async function MaterialPage({ params }: PageProps<'/[locale]/ebooks/[slug]'>) {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const material = await buscarMaterial(KIND, slug, locale)
  if (!material) notFound()

  return (
    <PaginaDeMaterial material={material} secao={SECAO} locale={locale} t={TEXTOS[locale]} contato={await lerContato()} />
  )
}
