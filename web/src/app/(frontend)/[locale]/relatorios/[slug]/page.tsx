import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { PaginaDeMaterial, type TextosDoMaterial } from '@/components/content/pagina-de-material'
import { lerContato } from '@/lib/contato'
import { isLocale, LOCALES } from '@/lib/locales'
import { buscarMaterial, slugsDeMaterial } from '@/lib/materiais'
import { metadataDe } from '@/lib/seo'

/* /relatorios/[slug] (MIG-045). Rota **sem gabarito** — não existe no protótipo.
 * A estrutura vive em `PaginaDeMaterial`, compartilhada com a outra rota. */

const KIND = 'report' as const
const SECAO = 'relatorios' as const

const TEXTOS: Record<'pt' | 'en', TextosDoMaterial> = {
  pt: {
    voltar: 'Voltar para relatórios',
    prefixo: 'Relatório Técnico',
    cta: 'Baixar Relatório Grátis',
    ctaIndisponivel: 'O arquivo ainda não está disponível para download.',
    paginas: 'páginas',
    semCorpoTitulo: 'Resumo em preparação',
    semCorpoTexto: 'Assim que o resumo do relatório estiver pronto, ele aparece aqui.',
    ctaTitulo: 'Precisa de um recorte',
    ctaDestaque: 'para o seu setor?',
    ctaDescricao: 'Nossos especialistas cruzam os dados deste relatório com a realidade do seu negócio. Fale com a gente.',
    ctaTelefone: 'Telefone',
    ctaEmail: 'E-mail',
    ctaAcao: 'Fale com um especialista',
  },
  en: {
    voltar: 'Back to reports',
    prefixo: 'Technical Report',
    cta: 'Download the free report',
    ctaIndisponivel: 'The file is not available for download yet.',
    paginas: 'pages',
    semCorpoTitulo: 'Summary in preparation',
    semCorpoTexto: 'The report summary shows up here as soon as it is ready.',
    ctaTitulo: 'Need a cut',
    ctaDestaque: 'for your sector?',
    ctaDescricao: 'Our specialists cross this report with your own business reality. Talk to us.',
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
}: PageProps<'/[locale]/relatorios/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const material = await buscarMaterial(KIND, slug, locale)
  if (!material) return {}

  /* Sem corpo **e** sem download, a página não entrega nada a quem chega da
     busca. Volta a ser indexável quando MIG-104 ligar o formulário. */
  return metadataDe({ locale, local: { secao: 'relatorios', slug }, seo: material.seo, corpo: material.body })
}

export default async function MaterialPage({ params }: PageProps<'/[locale]/relatorios/[slug]'>) {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const material = await buscarMaterial(KIND, slug, locale)
  if (!material) notFound()

  return (
    <PaginaDeMaterial material={material} secao={SECAO} locale={locale} t={TEXTOS[locale]} contato={await lerContato()} />
  )
}
