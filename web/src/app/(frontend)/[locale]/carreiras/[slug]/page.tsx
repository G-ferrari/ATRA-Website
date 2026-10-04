import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { BlocoCta } from '@/components/blocks/bloco-cta'
import { BlocoHero } from '@/components/blocks/bloco-hero'
import { RichText } from '@/components/content/rich-text'
import { Candidatura } from '@/components/forms/candidatura'
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
 * Desde a revisão de 03/10 a página usa as peças das outras páginas internas:
 * o topo é o `BlocoHero` (o cartão claro/grafite de soluções e segmentos) e o
 * fim é o `BlocoCta` da faixa padrão. Antes eram um topo azul próprio, com
 * texto laranja e cinza abaixo do contraste mínimo, e a caixa `ContactCta`.
 *
 * ⚠️ **Para onde vai o candidato.** A candidatura com currículo — formulário e
 * upload — é MIG-102, travada por P-17 (retenção do CV, acesso do RH). Enquanto
 * ela não liga, o botão do topo e o da faixa final levam ao **banco de
 * talentos** em /carreiras. Até 03/10 a faixa dizia "deixe seu currículo no
 * banco de talentos", mas o botão ia para /contato e mostrava o telefone e o
 * e-mail comerciais: a candidatura chegava ao RD Station como lead de venda. */

const TEXTOS = {
  pt: {
    voltar: 'Ver todas as vagas',
    selo: 'Vaga aberta',
    candidatarTitulo: 'Candidate-se a esta vaga',
    semCorpoTitulo: 'Descrição em preparação',
    semCorpoTexto: 'Os detalhes desta vaga ainda estão sendo finalizados. Enquanto isso, fale com a gente pelo banco de talentos.',
    talentos: 'Cadastrar no banco de talentos',
    ctaTitulo: 'Quer fazer parte do time?',
    ctaDescricao: 'Deixe seu currículo no nosso banco de talentos. Estamos sempre em busca de bons profissionais de dados.',
  },
  en: {
    voltar: 'See all roles',
    selo: 'Open role',
    candidatarTitulo: 'Apply for this role',
    semCorpoTitulo: 'Description in preparation',
    semCorpoTexto: 'The details for this role are still being finalized. In the meantime, reach out through the talent pool.',
    talentos: 'Join our talent pool',
    ctaTitulo: 'Want to join the team?',
    ctaDescricao: 'Leave your CV in our talent pool. We are always looking for good data professionals.',
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
  const listaDeVagas = `${hrefDe('carreiras', locale)}#trabalhe-conosco`
  const bancoDeTalentos = `${hrefDe('carreiras', locale)}#banco-talentos`

  return (
    <main className="pt-24 md:pt-36 pb-0 bg-surface-1 min-h-screen text-text-main">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <Link
          href={listaDeVagas}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-primary hover:gap-2.5 transition-all"
        >
          <ChevronLeft size={18} aria-hidden /> {t.voltar}
        </Link>
      </div>

      {/* O cartão de topo das páginas internas. A área (quando existe, P-28)
          vai no selo; o modelo de trabalho, na etiqueta ao lado. */}
      <BlocoHero
        bloco={{
          tipo: 'pageHero',
          id: 'vaga',
          anchor: null,
          navLabel: null,
          theme: 'surface-1',
          borda: 'nenhuma',
          espaco: 'normal',
          badge: vaga.area ?? t.selo,
          chip: vaga.locationLabel,
          title: vaga.title,
          highlight: [],
          subtitle: null,
          description: vaga.summary,
          align: 'left',
          ctas: [{ label: t.talentos, href: bancoDeTalentos }],
          ctaVariant: 'secondary',
          descriptionWidth: 'wide',
          mediaMode: 'none',
          images: [],
          metrics: [],
        }}
      />

      <section className="pt-8 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {vaga.body ? (
              <RichText data={vaga.body} />
            ) : (
              <div className="rounded-[6px]  bg-slate-50 dark:bg-[#181b22] p-8 text-center mb-12">
                <h2 className="font-bold text-slate-900 dark:text-white mb-1">{t.semCorpoTitulo}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t.semCorpoTexto}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MIG-102: a candidatura existe e funciona, mas só monta com
       * `ENABLE_JOB_APPLICATIONS=1` — P-17 (retenção do CV e acesso do RH,
       * LGPD) é quem liga. Variável de servidor lida aqui no Server Component;
       * mudar exige rebuild, o que está certo: ligar coleta de dado pessoal
       * não deveria ser um toggle silencioso. */}
      {process.env.ENABLE_JOB_APPLICATIONS === '1' && (
        <section className="pb-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-display font-light text-text-main mb-6">
                {t.candidatarTitulo}
              </h2>
              <Candidatura jobId={vaga.id} jobTitle={vaga.title} />
            </div>
          </div>
        </section>
      )}

      {/* A faixa padrão do fim das páginas (D-42), com o texto de carreiras: o
          visitante daqui é candidato, e a faixa de "Entre em contato" o mandaria
          ao formulário comercial. */}
      <BlocoCta
        bloco={{
          tipo: 'ctaBanner',
          id: 'fim-da-vaga',
          anchor: null,
          navLabel: null,
          theme: 'surface-1',
          borda: 'nenhuma',
          espaco: 'normal',
          variant: 'dark-centered',
          /* Sem destaque no título e sem segundo botão, de propósito: o trecho
             destacado sai em laranja, abaixo do contraste no tema claro, e o
             segundo botão desta variante leva o ícone da IA. A volta para a
             lista já está no topo da página. */
          title: t.ctaTitulo,
          highlight: null,
          description: t.ctaDescricao,
          cta: { label: t.talentos, href: bancoDeTalentos },
          secondaryCta: null,
        }}
      />
    </main>
  )
}
