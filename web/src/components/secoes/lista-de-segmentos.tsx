import { Building2, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { iconePorNome } from '@/components/blocks/icones'
import { MetricChip, StatusBadge, TechCornerBraces } from '@/components/ui'
import type { Locale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'
import type { CabecalhoDaSecao, SegmentCard } from '@/types/content'

import { TEXTOS_DAS_SECOES } from './textos'
import { TituloComDestaque } from './titulo'

/* /segmentos dentro da página-mestra: o cartão de topo escrito no admin, com a
 * etiqueta depois da contagem ("8 verticais"), e a grade das verticais. */
export function ListaDeSegmentos({
  cabecalho,
  segmentos,
  locale,
  abertura,
  anchor,
}: {
  cabecalho: CabecalhoDaSecao
  segmentos: SegmentCard[]
  locale: Locale
  abertura: boolean
  anchor: string | null
}) {
  /* `h1` quando a lista abre a página, que é o caso de hoje; com um herói de
     página acima, o título da página é o dele. */
  const Titulo = abertura ? 'h1' : 'h2'
  return (
    <>
      <section id={anchor ?? undefined} className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-12 scroll-mt-32">
        <div className="rounded-[6px] bg-surface-2 dark:bg-linear-to-br dark:from-[#12151c] dark:via-[#1a2130] dark:to-[#0e1015] text-slate-900 dark:text-white p-6 sm:p-10 md:p-14 shadow-xl dark:shadow-2xl relative overflow-hidden vort-dot-grid">
          <TechCornerBraces color="blue" position="top-left" size={16} />
          <TechCornerBraces color="orange" position="bottom-right" size={16} />
          <div className="max-w-2xl relative z-10">
            <div className="flex items-center gap-2 mb-4">
              {cabecalho.eyebrow && (
                <StatusBadge label={cabecalho.eyebrow} variant="primary" size="sm" pulse icon={<Building2 size={12} />} />
              )}
              {cabecalho.chip && <MetricChip label={`${segmentos.length} ${cabecalho.chip}`} variant="neutral" size="sm" />}
            </div>
            <Titulo className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display leading-tight">
              <TituloComDestaque cabecalho={cabecalho} />
            </Titulo>
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {segmentos.length === 0 ? (
          <p className="text-sm text-text-muted">{TEXTOS_DAS_SECOES[locale].vazio.segmentos}</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {segmentos.map((segmento) => {
              const Icone = iconePorNome(segmento.icon)
              return <CartaoDeSegmento key={segmento.slug} segmento={segmento} locale={locale} icone={Icone} />
            })}
          </div>
        )}
      </div>
    </>
  )
}

/* O mesmo cartão de `/solucoes`, sem o caso "sem página": todo segmento tem
 * página. Vertical que não deve aparecer fica em rascunho. */
function CartaoDeSegmento({ segmento, locale, icone: Icone }: { segmento: SegmentCard; locale: Locale; icone: LucideIcon }) {
  return (
    <Link
      href={hrefDe('segmentos', locale, segmento.slug)}
      className="flex flex-col p-5 rounded-md bg-surface-2  transition-all group hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:shadow-lg hover:border-primary/30"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <Icone size={20} aria-hidden />
        </div>
        <h2 className="text-text-main font-bold text-sm leading-tight group-hover:text-primary transition-colors">{segmento.name}</h2>
      </div>
      <p className="text-xs text-text-muted leading-relaxed group-hover:text-text-main/90 transition-colors">{segmento.shortDescription}</p>
    </Link>
  )
}
