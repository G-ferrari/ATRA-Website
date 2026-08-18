import { Calendar, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { FeaturedHero, MetricChip, StatusBadge, type FeaturedItem } from '@/components/ui'
import { RascunhoIncompleto } from '@/components/content/rascunho-incompleto'
import { toCaseCard } from '@/lib/mappers/case'
import { mapearOuFaltando, toTopics } from '@/lib/mappers/shared'
import { getPayload } from '@/lib/payload'
import { hrefDe } from '@/lib/routes'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import type { CaseCard, Topic } from '@/types/content'

import { ListaDeCases } from './lista-de-cases'

/* Listagem de cases — a fatia vertical de referência.
 *
 * A página resolve o dado e monta as props; o markup interativo vive na ilha
 * cliente. Nenhum componente busca dado (contratos-de-dados.md). */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

/** O legado destaca os 3 primeiros (SuccessStories.tsx:60). */
const DESTAQUES = 3

const TEXTOS = {
  pt: {
    badge: 'Histórias Reais de Sucesso',
    chip: 'Grandes Instituições',
    titulo: 'Todos os',
    tituloDestaque: 'cases de sucesso',
    acao: 'Continuar lendo',
    metaTitle: 'Cases de Sucesso',
    metaDescription:
      'Histórias reais de transformação com dados, IA e cloud nos maiores bancos e empresas do Brasil.',
  },
  en: {
    badge: 'Real Success Stories',
    chip: 'Major Institutions',
    titulo: 'All',
    tituloDestaque: 'success stories',
    acao: 'Keep reading',
    metaTitle: 'Success Stories',
    metaDescription:
      'Real transformation stories with data, AI and cloud at Brazil’s largest banks and enterprises.',
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = TEXTOS[isLocale(locale) ? locale : 'pt']
  return { title: t.metaTitle, description: t.metaDescription }
}

/* Subtexto do destaque.
 *
 * ⚠️ Porte fiel de um defeito. O legado monta `${client} • ${date}`
 * (FeaturedHero.tsx:53) mas nenhum case tem `date`, então o site no ar mostra
 * "Banco XPTO • " com o marcador solto. Reproduzido aqui de propósito: MIG-030
 * compara pixel a pixel contra aquele build. A correção é passar `publishedAt`
 * — uma linha, prevista para depois do aceite visual. Ver debito-tecnico.md. */
function subtitulo(caso: CaseCard): string {
  const data = ''
  return `${caso.client || ''} • ${data}`
}

function paraDestaque(caso: CaseCard, locale: Locale): FeaturedItem {
  return {
    id: caso.slug,
    title: caso.title,
    description: caso.summary,
    tags: caso.topics.map((t) => t.name),
    image: caso.image,
    href: hrefDe('cases', locale, caso.slug),
    eyebrow: subtitulo(caso),
    thumbLabel: caso.client,
  }
}

export default async function CasesPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const payload = await getPayload()

  /* Modo rascunho (D-20): com ele ligado, o editor vê o que ainda não publicou.
   * Para quem visita o site, `isEnabled` é falso e a página segue estática —
   * o Next só passa a renderizar por requisição quando o cookie existe. */
  const { isEnabled: rascunho } = await draftMode()

  // depth: 2 popula heroImage e topics — os mappers exigem documento, não id.
  const { docs } = await payload.find({
    collection: 'cases',
    locale,
    depth: 2,
    limit: 100,
    sort: '-publishedAt',
    draft: rascunho,
    ...(rascunho ? {} : { where: { _status: { equals: 'published' } } }),
  })

  /* Um rascunho pela metade não pode derrubar a listagem inteira: mapeia um a
   * um e separa os que ainda não estão prontos. Fora do modo rascunho a lista
   * só traz publicados, então `incompletos` fica sempre vazia. */
  const cases: CaseCard[] = []
  const incompletos: string[] = []
  for (const doc of docs) {
    const r = mapearOuFaltando(() => toCaseCard(doc))
    if ('doc' in r) cases.push(r.doc)
    else incompletos.push(r.faltando)
  }

  /* Os chips vêm dos assuntos marcados para o filtro, na ordem definida no
   * admin — não de tudo que está em uso. Ver Topics.showInFilter. */
  const { docs: assuntos } = await payload.find({
    collection: 'topics',
    locale,
    depth: 0,
    limit: 50,
    sort: 'filterOrder',
    where: { showInFilter: { equals: true } },
  })
  const categorias: Topic[] = toTopics(assuntos)

  const t = TEXTOS[locale]

  /* `key` num elemento que não é lista: o React valida chaves de qualquer
   * elemento criado num componente e renderizado dentro de um array de filhos
   * de outro — e `cabecalho` cai exatamente nisso ao dividir a linha flex com a
   * busca dentro da ilha. Sem ela, aviso no console em toda renderização. */
  const cabecalho = (
    <div key="cabecalho-cases">
      <div className="flex items-center gap-2 mb-3">
        <StatusBadge label={t.badge} variant="primary" size="sm" pulse icon={<Sparkles size={12} />} />
        <MetricChip label={t.chip} variant="neutral" size="sm" />
      </div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main leading-tight">
        {t.titulo} <span className="text-primary font-normal">{t.tituloDestaque}</span>
      </h2>
    </div>
  )

  return (
    <main className="min-h-screen bg-surface-1 text-text-main">
      {cases.length > 0 && (
        <FeaturedHero
          items={cases.slice(0, DESTAQUES).map((c) => paraDestaque(c, locale))}
          actionLabel={t.acao}
          eyebrowIcon={<Calendar size={15} aria-hidden />}
        />
      )}

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {incompletos.length > 0 && (
            <div className="mb-8">
              <RascunhoIncompleto campos={incompletos} />
            </div>
          )}

          <ListaDeCases cases={cases} topics={categorias} locale={locale} cabecalho={cabecalho} />
        </div>
      </section>
    </main>
  )
}
