import { Building2, type LucideIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { locale as getLocale } from 'next/root-params'

import { iconePorNome } from '@/components/blocks/icones'
import { MetricChip, StatusBadge, TechCornerBraces } from '@/components/ui'
import { isLocale, LOCALES, type Locale } from '@/lib/locales'
import { toSegmentCard } from '@/lib/mappers/segment'
import { getPayload } from '@/lib/payload'
import { hrefDe } from '@/lib/routes'
import type { SegmentCard } from '@/types/content'
import { metadataDe } from '@/lib/seo'

/* /segmentos (MIG-091).
 *
 * ⚠️ **Não há gabarito**: o protótipo não tem esta rota. As 8 verticais existem
 * só no WordPress (D-17), e a página nasce aqui. O aceite é funcional.
 *
 * O layout é o do índice de soluções, de propósito: as duas listam catálogo com
 * ícone, nome e uma frase, e inventar uma linguagem visual para uma rota nova é
 * o que a regra 3 de `blocos.md` existe para impedir. A diferença é que aqui não
 * há categoria — verticais não se agrupam. */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

const META = {
  pt: {
    title: 'Segmentos',
    description: 'As verticais de mercado que a ATRA atende, de serviços financeiros a saúde e varejo.',
  },
  en: {
    title: 'Segments',
    description: 'The market verticals ATRA serves, from financial services to healthcare and retail.',
  },
} as const

const TEXTOS = {
  pt: {
    badge: 'Para quem a gente resolve',
    chip: 'verticais',
    titulo: 'Dado é o mesmo.',
    destaque: 'O negócio, não.',
    vazio: 'Nenhum segmento publicado.',
  },
  en: {
    badge: 'Who we solve it for',
    chip: 'verticals',
    titulo: 'The data is the same.',
    destaque: 'The business is not.',
    vazio: 'No published segments.',
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const idioma = isLocale(locale) ? locale : 'pt'
  const { title, description } = META[idioma]
  return metadataDe({
    locale: idioma,
    local: { secao: 'segmentos' },
    seo: { title, description, image: null, noIndex: false },
  })
}

export default async function SegmentosPage() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const t = TEXTOS[locale]
  const payload = await getPayload()

  /* ⚠️ `select` obrigatório, pelo mesmo motivo de `/solucoes`: sem ele o adapter
   * Postgres monta um `LEFT JOIN LATERAL` para cada tipo de bloco que o `layout`
   * aceita, mesmo com `depth: 0`, e a página passa de ~1s para dezenas de
   * segundos. O índice só precisa do cartão. */
  const { docs } = await payload.find({
    collection: 'segments',
    locale,
    depth: 0,
    limit: 100,
    sort: 'order',
    /* Rascunho fora: a Local API roda com `overrideAccess: true` e o
     * `access.read` da collection não filtra nada aqui. */
    where: { _status: { equals: 'published' } },
    select: { name: true, slug: true, icon: true, shortDescription: true },
  })
  const segmentos = docs.map(toSegmentCard)

  return (
    <main className="pt-24 md:pt-36 pb-20 min-h-screen bg-surface-1 text-text-main">
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-12">
        <div className="rounded-[6px] bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015]  text-white p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden vort-dot-grid">
          <TechCornerBraces color="blue" position="top-left" size={16} />
          <TechCornerBraces color="orange" position="bottom-right" size={16} />
          <div className="max-w-2xl relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <StatusBadge label={t.badge} variant="primary" size="sm" pulse icon={<Building2 size={12} />} />
              <MetricChip label={`${segmentos.length} ${t.chip}`} variant="neutral" size="sm" />
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display leading-tight">
              {t.titulo} <span className="text-primary font-normal">{t.destaque}</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {segmentos.length === 0 ? (
          <p className="text-sm text-text-muted">{t.vazio}</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {segmentos.map((segmento) => {
              /* Resolvido aqui, e não dentro do cartão: `iconePorNome` devolve um
                 componente, e `react-hooks/static-components` proíbe criar
                 componente no corpo de outro. Mesmo lugar em que `/solucoes`
                 resolve o dele. */
              const Icone = iconePorNome(segmento.icon)
              return <CartaoDeSegmento key={segmento.slug} segmento={segmento} locale={locale} icone={Icone} />
            })}
          </div>
        )}
      </div>
    </main>
  )
}

/* O mesmo cartão de `/solucoes`, sem o caso "sem página": todo segmento tem
 * página. Vertical que não deve aparecer fica em rascunho, e rascunho não chega
 * até aqui. */
function CartaoDeSegmento({
  segmento,
  locale,
  icone: Icone,
}: {
  segmento: SegmentCard
  locale: Locale
  icone: LucideIcon
}) {
  return (
    <Link
      href={hrefDe('segmentos', locale, segmento.slug)}
      className="flex flex-col p-5 rounded-md bg-surface-2  transition-all group hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:shadow-lg hover:border-primary/30"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <Icone size={20} aria-hidden />
        </div>
        <h2 className="text-text-main font-bold text-sm leading-tight group-hover:text-primary transition-colors">
          {segmento.name}
        </h2>
      </div>
      <p className="text-xs text-text-muted leading-relaxed group-hover:text-text-main/90 transition-colors">
        {segmento.shortDescription}
      </p>
    </Link>
  )
}
