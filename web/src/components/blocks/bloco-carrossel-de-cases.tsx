'use client'

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'

import { BORDAS } from '@/components/blocks/bordas'
import { TechHorizontalLine, TechVerticalLine } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoCaseCarousel } from '@/types/content'

import { iconePorNome } from './icones'

/* Carrossel de cases da home — porte de `legacy/src/App.tsx:1605`.
 *
 * Rolagem horizontal com `snap`, uma barra de progresso e duas setas. Cada item
 * são **dois** cartões lado a lado: o de texto colorido (42%) e o da imagem
 * (58%), num contêiner de largura fixa que deixa o próximo aparecer pela borda. */
export function BlocoCarrosselDeCases({ bloco }: { bloco: BlocoCaseCarousel }) {
  const trilhoRef = useRef<HTMLDivElement>(null)
  const [progresso, setProgresso] = useState(0)

  const aoRolar = () => {
    const el = trilhoRef.current
    if (!el) return
    const total = el.scrollWidth - el.clientWidth
    setProgresso(total > 0 ? (el.scrollLeft / total) * 100 : 0)
  }

  const rolar = (direcao: -1 | 1) => {
    const el = trilhoRef.current
    if (!el) return
    el.scrollBy({ left: direcao * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-16 md:py-24 overflow-hidden relative scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      {/* Linhas decorativas da seção, na configuração do gabarito
          (`App.tsx:1729`). Só a home as tem. */}
      <TechHorizontalLine color="blue" align="left" side="bottom" delay={0.2} />
      <TechVerticalLine color="orange" align="left" alignY="top" delay={0.3} />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 gap-6">
          <div className="max-w-xl">
            {bloco.eyebrow && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider mb-3">
                {bloco.eyebrow}
              </div>
            )}
            <h2 className="text-3xl md:text-5xl font-light font-display text-text-main leading-tight">
              {bloco.title}
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end text-left md:text-right max-w-md gap-3">
            {bloco.description && (
              <p className="text-xs md:text-sm text-text-muted leading-relaxed font-light">{bloco.description}</p>
            )}
            {bloco.cta && (
              <Link
                href={bloco.cta.href}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[6px] bg-primary hover:bg-[#2B7FDB] text-white text-xs font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 group cursor-pointer shrink-0"
              >
                <span>{bloco.cta.label}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden />
              </Link>
            )}
          </div>
        </div>

        <div
          ref={trilhoRef}
          onScroll={aoRolar}
          className="flex gap-5 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 select-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {bloco.items.map((c, i) => {
            const Icone = iconePorNome(c.icon)
            return (
              <div
                key={`${c.title}-${i}`}
                className="flex flex-col sm:flex-row gap-2 shrink-0 snap-start w-[85vw] sm:w-[680px] md:w-[740px] lg:w-[780px]"
              >
                <div
                  /* A cor é dado, não classe: são cinco azuis diferentes
                     escolhidos a dedo, e o Tailwind não enxerga
                     `bg-[${variável}]` no build. */
                  style={{ backgroundColor: c.color }}
                  className="w-full sm:w-[42%] shrink-0 rounded-[6px] p-5 sm:p-6 md:p-7 flex flex-col justify-between text-white shadow-xl relative overflow-hidden group transition-all"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/10 rounded-full pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3 sm:mb-6">
                      <span className="text-xs sm:text-sm font-semibold tracking-wider text-white/90 uppercase font-display">
                        {c.company}
                      </span>
                      <div className="w-7 h-7 rounded-[6px] bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                        <Icone size={14} aria-hidden />
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg md:text-xl font-normal font-display leading-snug mb-2 sm:mb-3 text-white">
                      {c.title}
                    </h3>

                    {/* O `line-clamp` cresce com a viewport: 3 linhas no
                        celular, 5 no desktop. */}
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light line-clamp-3 sm:line-clamp-4 md:line-clamp-5">
                      {c.description}
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-5 pt-3.5 border-t border-white/15 flex items-center justify-between">
                    <Link
                      href={c.href}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-white/90 hover:text-white group-hover:translate-x-1 transition-all"
                    >
                      <span>{bloco.readLabel ?? 'Ler estudo de caso'}</span>
                      <ArrowRight size={13} aria-hidden />
                    </Link>
                  </div>
                </div>

                <div className="w-full sm:w-[58%] shrink-0 rounded-[6px] overflow-hidden shadow-xl relative group h-[200px] sm:h-auto sm:min-h-[340px] md:min-h-[400px]">
                  {c.image && (
                    /* ⚠️ `<img>` **no fluxo**, não `next/image` com `fill`.
                     *
                     * O cartão é `sm:h-auto sm:min-h-[340px] md:min-h-[400px]`:
                     * a altura sai do conteúdo, com um piso. Uma imagem
                     * absoluta (`fill`) não conta como conteúdo e o cartão fica
                     * sempre no piso; a do gabarito conta. A diferença só
                     * aparece sob o marcador 1×1 do aceite visual, onde o
                     * quadrado esticado a 452px de largura empurrava o cartão
                     * do legado para 452px de altura contra os 400px do nosso —
                     * 52px que deslocavam metade da home. */
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.image.url}
                      alt={c.image.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-3 md:mt-4 flex items-center justify-between gap-6 pt-2">
          {/* `Math.max(15, …)`: a barra nunca fica vazia, nem no início. */}
          <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative max-w-xl">
            <div
              className="h-full bg-primary rounded-full transition-all duration-200"
              style={{ width: `${Math.max(15, progresso)}%` }}
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => rolar(d)}
                className="w-10 h-10 md:w-11 md:h-11 rounded-[6px]  dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-primary hover:border-primary hover:text-white dark:hover:bg-primary dark:hover:border-primary transition-all active:scale-90 cursor-pointer shadow-xs"
                aria-label={d === -1 ? 'Anterior' : 'Próximo'}
              >
                {d === -1 ? <ChevronLeft size={20} aria-hidden /> : <ChevronRight size={20} aria-hidden />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
