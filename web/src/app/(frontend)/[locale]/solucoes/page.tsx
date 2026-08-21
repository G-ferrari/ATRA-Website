import { Layers, type LucideIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { locale as getLocale } from 'next/root-params'

import { iconePorNome } from '@/components/blocks/icones'
import { MetricChip, StatusBadge, TechCornerBraces } from '@/components/ui'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { toSolutionCard } from '@/lib/mappers/solution'
import { getPayload } from '@/lib/payload'
import { hrefDe } from '@/lib/routes'
import type { SolutionCard, SolutionCategory } from '@/types/content'

/* /solucoes (MIG-055).
 *
 * ⚠️ **Única rota da Fase 3 que muda de comportamento** (D-09). No legado
 * `/solucoes` e `/solucoes/inteligencia-artificial` servem a mesma página de IA
 * (`App.tsx:2621-2622`) — não há índice, e por isso não há gabarito visual.
 * O aceite aqui é funcional, e o vocabulário é o do próprio site: o card abaixo
 * é o do painel de Soluções do mega-menu (`App.tsx:252`), que mostra estas
 * mesmas 6 ofertas. MIG-072a monta o painel a partir da mesma collection. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

const META = {
  pt: {
    title: 'Soluções',
    description: 'Inovação e IA, dados e analytics, governança e cultura: a oferta da ATRA ponta a ponta.',
  },
  en: {
    title: 'Solutions',
    description: 'Innovation and AI, data and analytics, governance and culture: ATRA offerings end to end.',
  },
} as const

const TEXTOS = {
  pt: {
    badge: 'Da estratégia à operação',
    chip: '3 frentes',
    titulo: 'Soluções que ligam',
    destaque: 'dado a decisão',
    vazio: 'Nenhuma solução publicada.',
  },
  en: {
    badge: 'From strategy to operations',
    chip: '3 fronts',
    titulo: 'Solutions that turn',
    destaque: 'data into decisions',
    vazio: 'No published solutions.',
  },
} as const

/* Ordem e rótulo das 3 categorias do mega-menu (`App.tsx:45`). A ordem é a do
 * legado e não alfabética: começa em Inovação & IA, que é a ponta comercial. */
const CATEGORIAS: { id: SolutionCategory; label: Record<Locale, string> }[] = [
  { id: 'innovation-ai', label: { pt: 'Inovação & IA', en: 'Innovation & AI' } },
  { id: 'data-bi', label: { pt: 'Dados, BI & Advanced Analytics', en: 'Data, BI & Advanced Analytics' } },
  { id: 'governance-culture', label: { pt: 'Governança & Cultura', en: 'Governance & Culture' } },
]

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return META[isLocale(locale) ? locale : 'pt']
}

export default async function SolucoesPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const t = TEXTOS[locale]
  const payload = await getPayload()
  /* ⚠️ O `select` não é otimização especulativa: sem ele o adapter Postgres
   * monta um `LEFT JOIN LATERAL` para **cada um dos 16 tipos de bloco** que a
   * collection aceita, mesmo com `depth: 0`, porque o `layout` é um campo do
   * documento. Medido: 18–23s para servir esta página, contra ~1s das outras.
   * O índice só precisa do cartão — a página de detalhe é quem lê o `layout`. */
  const { docs } = await payload.find({
    collection: 'solutions',
    locale,
    depth: 0,
    limit: 100,
    sort: 'order',
    /* ⚠️ Rascunho fora, explicitamente: a Local API roda com
     * `overrideAccess: true`, então o `access.read` da collection não filtra
     * nada aqui. Ver a nota no layout. */
    where: { _status: { equals: 'published' } },
    select: {
      title: true,
      slug: true,
      category: true,
      icon: true,
      shortDescription: true,
      hasPage: true,
    },
  })
  const solucoes = docs.map(toSolutionCard)

  return (
    <main className="pt-24 md:pt-36 pb-20 min-h-screen bg-surface-1 text-text-main">
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-12">
        <div className="rounded-[6px] bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015] border border-white/5 text-white p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden vort-dot-grid">
          <TechCornerBraces color="blue" position="top-left" size={16} />
          <TechCornerBraces color="orange" position="bottom-right" size={16} />
          <div className="max-w-2xl relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <StatusBadge label={t.badge} variant="primary" size="sm" pulse icon={<Layers size={12} />} />
              <MetricChip label={t.chip} variant="neutral" size="sm" />
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display leading-tight">
              {t.titulo} <span className="text-primary font-normal">{t.destaque}</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {solucoes.length === 0 && <p className="text-sm text-text-muted">{t.vazio}</p>}

        {CATEGORIAS.map((categoria) => {
          const daCategoria = solucoes.filter((s) => s.category === categoria.id)
          // Categoria vazia some: o índice mostra a oferta, não o esquema.
          if (daCategoria.length === 0) return null

          return (
            <section key={categoria.id}>
              <h2 className="text-lg sm:text-xl font-bold font-display text-text-main mb-5">
                {categoria.label[locale]}
              </h2>
              <div className="grid gap-5 md:grid-cols-2">
                {daCategoria.map((solucao) => {
                  /* Resolvido aqui, e não dentro do cartão: `iconePorNome`
                   * devolve um componente, e a regra `react-hooks/static-
                   * components` proíbe criar componente no corpo de um. Mesmo
                   * lugar em que `bloco-grade-de-cards.tsx:61` resolve o dele. */
                  const Icone = iconePorNome(solucao.icon)
                  return <CartaoDeSolucao key={solucao.slug} solucao={solucao} locale={locale} icone={Icone} />
                })}
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}

/* Card do painel de Soluções do mega-menu (`App.tsx:252`), com uma diferença:
 * lá todo card é `<Link>`, mesmo os 5 que apontam para `#`. Aqui a solução sem
 * página é uma `<div>` — no índice, um link que não sai do lugar é pior que um
 * card estático, e `hasPage` já carrega essa informação (D-09). */
function CartaoDeSolucao({
  solucao,
  locale,
  icone: Icone,
}: {
  solucao: SolutionCard
  locale: Locale
  icone: LucideIcon
}) {
  const classe =
    'flex flex-col p-5 rounded-md bg-surface-2 border border-slate-200 dark:border-white/5 transition-all group'

  const conteudo = (
    <>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <Icone size={20} aria-hidden />
        </div>
        <h3 className="text-text-main font-bold text-sm leading-tight group-hover:text-primary transition-colors">
          {solucao.title}
        </h3>
      </div>
      <p className="text-xs text-text-muted leading-relaxed group-hover:text-text-main/90 transition-colors">
        {solucao.shortDescription}
      </p>
    </>
  )

  return solucao.hasPage ? (
    <Link
      href={hrefDe('solucoes', locale, solucao.slug)}
      className={`${classe} hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:shadow-lg hover:border-primary/30`}
    >
      {conteudo}
    </Link>
  ) : (
    <div className={classe}>{conteudo}</div>
  )
}
