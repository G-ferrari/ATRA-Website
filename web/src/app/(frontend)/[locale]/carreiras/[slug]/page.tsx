import { Briefcase, ChevronLeft, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/content/rich-text'
import { ContactCta } from '@/components/ui'
import { lerContato } from '@/lib/contato'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { toVagaDetalhe } from '@/lib/mappers/job'
import { getPayload } from '@/lib/payload'
import { hrefDe } from '@/lib/routes'
import type { VagaDetalhe } from '@/types/content'
import { metadataDe } from '@/lib/seo'

/* /carreiras/[slug] (MIG-051). Rota **sem gabarito** — não existe no protótipo:
 * no legado a vaga é um item de lista que rola para o banco de talentos, sem
 * página própria.
 *
 * ⚠️ A candidatura em si — formulário e upload de CV — é MIG-102, travada por
 * P-17 (retenção de currículo, acesso do RH). Aqui a vaga é só a descrição; o
 * botão leva ao banco de talentos em /carreiras, que também ainda não coleta. */

const TEXTOS = {
  pt: {
    voltar: 'Ver todas as vagas',
    semCorpoTitulo: 'Descrição em preparação',
    semCorpoTexto: 'Os detalhes desta vaga ainda estão sendo finalizados. Enquanto isso, fale com a gente pelo banco de talentos.',
    ctaTitulo: 'Quer fazer parte',
    ctaDestaque: 'do time?',
    ctaDescricao: 'Deixe seu currículo no nosso banco de talentos. Estamos sempre em busca de bons profissionais de dados.',
    ctaTelefone: 'Telefone',
    ctaEmail: 'E-mail',
    ctaAcao: 'Falar com o RH',
  },
  en: {
    voltar: 'See all roles',
    semCorpoTitulo: 'Description in preparation',
    semCorpoTexto: 'The details for this role are still being finalized. In the meantime, reach out through the talent pool.',
    ctaTitulo: 'Want to join',
    ctaDestaque: 'the team?',
    ctaDescricao: 'Leave your CV in our talent pool. We are always looking for good data professionals.',
    ctaTelefone: 'Phone',
    ctaEmail: 'E-mail',
    ctaAcao: 'Talk to HR',
  },
} as const

async function buscarVaga(slug: string, locale: Locale): Promise<VagaDetalhe | null> {
  const { isEnabled: rascunho } = await draftMode()
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'jobs',
    locale,
    depth: 0,
    limit: 1,
    draft: rascunho,
    where: rascunho
      ? { slug: { equals: slug } }
      : { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return docs[0] ? toVagaDetalhe(docs[0], locale) : null
}

export async function generateStaticParams() {
  const payload = await getPayload()
  const params: { locale: string; slug: string }[] = []
  for (const locale of LOCALES) {
    const { docs } = await payload.find({
      collection: 'jobs',
      locale,
      depth: 0,
      limit: 200,
      where: { _status: { equals: 'published' } },
    })
    params.push(...docs.map((d) => ({ locale, slug: d.slug })))
  }
  return params
}

export async function generateMetadata({ params }: PageProps<'/[locale]/carreiras/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) return {}
  const vaga = await buscarVaga(slug, locale)
  if (!vaga) return {}
  /* A área entra no título quando existe — desde P-28 ela costuma estar vazia,
     e "Engenheiro de Dados — " com traço solto seria pior que o título puro. */
  return metadataDe({
    locale,
    local: { secao: 'carreiras', slug },
    seo: vaga.area ? { ...vaga.seo, title: `${vaga.seo.title} — ${vaga.area}` } : vaga.seo,
    /* Vaga sem descrição não entrega nada a quem chega da busca. */
    corpo: vaga.body,
  })
}

export default async function VagaPage({ params }: PageProps<'/[locale]/carreiras/[slug]'>) {
  const { slug } = await params
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const vaga = await buscarVaga(slug, locale)
  if (!vaga) notFound()

  const t = TEXTOS[locale]
  const contato = await lerContato()

  return (
    <main className="min-h-screen bg-white">
      <section className="relative bg-primary overflow-hidden pt-32 md:pt-44 pb-16">
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-primary/70" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link
            href={`${hrefDe('carreiras', locale)}#trabalhe-conosco`}
            className="inline-flex items-center gap-2 text-white font-bold mb-8 hover:gap-3 hover:text-secondary transition-all"
          >
            <ChevronLeft size={20} aria-hidden /> {t.voltar}
          </Link>
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-secondary font-black uppercase tracking-[0.15em] text-xs md:text-sm mb-4">
              {/* Some quando a vaga não tem área (P-28): etiqueta com rótulo
                  vazio ao lado do ícone é pior do que etiqueta nenhuma. */}
              {vaga.area && (
                <span className="flex items-center gap-2">
                  <Briefcase size={14} aria-hidden /> {vaga.area}
                </span>
              )}
              <span className="flex items-center gap-2">
                <MapPin size={14} aria-hidden /> {vaga.locationLabel}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {vaga.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">{vaga.summary}</p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {vaga.body ? (
              <RichText data={vaga.body} />
            ) : (
              <div className="rounded-[6px] border border-slate-200 bg-slate-50 p-8 text-center mb-12">
                <h2 className="font-bold text-slate-900 mb-1">{t.semCorpoTitulo}</h2>
                <p className="text-sm text-slate-600">{t.semCorpoTexto}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <ContactCta
        title={t.ctaTitulo}
        titleHighlight={t.ctaDestaque}
        description={t.ctaDescricao}
        phoneLabel={t.ctaTelefone}
        emailLabel={t.ctaEmail}
        actionLabel={t.ctaAcao}
        href={hrefDe('contato', locale)}
        contato={contato}
      />
    </main>
  )
}
