import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

import { BORDAS } from '@/components/blocks/bordas'
import { GlowCard } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoMethodCards } from '@/types/content'

import { iconePorNome } from './icones'
import { PilulaDeSecao } from './pilula-de-secao'

/* Cards de metodologia — porte de `legacy/src/pages/SolutionAI.tsx:218`.
 *
 * O cabeçalho é uma linha, não um bloco centralizado: texto à esquerda, botão à
 * direita, alinhados pela base (`lg:items-end`). Por isso o CTA mora neste
 * bloco em vez de virar uma faixa depois dele. */

/* Classes literais por acento — o Tailwind não enxerga classe montada em tempo
 * de execução, então `bg-${acento}/10` sairia sem estilo no build de produção. */
const ACENTO = {
  primary: {
    caixa: 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white',
    selo: 'text-primary bg-primary/10',
    titulo: 'group-hover:text-primary',
    borda: 'hover:border-primary/40',
    marca: 'text-primary',
  },
  secondary: {
    caixa: 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white',
    selo: 'text-secondary bg-secondary/10',
    titulo: 'group-hover:text-secondary',
    borda: 'hover:border-secondary/40',
    marca: 'text-secondary',
  },
} as const

export function BlocoCardsDeMetodo({ bloco }: { bloco: BlocoMethodCards }) {
  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-16 md:py-24 scroll-mt-24',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            {bloco.eyebrow && <PilulaDeSecao texto={bloco.eyebrow} icone={bloco.eyebrowIcon} />}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-text-main leading-tight tracking-tight mb-4">
              {bloco.title}
            </h2>
            {bloco.description && (
              <p className="text-xs sm:text-sm md:text-base text-text-muted leading-relaxed font-light">
                {bloco.description}
              </p>
            )}
          </div>

          {bloco.headerCta && (
            <div className="shrink-0 flex items-center gap-3">
              <Link
                href={bloco.headerCta.href}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/30 cursor-pointer"
              >
                {bloco.headerCta.label}
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {bloco.items.map((item) => {
            const Icone = iconePorNome(item.icon)
            const cor = ACENTO[item.accent]

            return (
              <GlowCard
                key={item.title}
                glowColor={item.accent === 'secondary' ? 'orange' : 'blue'}
                customSize
                radius={6}
                className={cn(
                  'p-6 sm:p-8 bg-surface-2 text-text-main shadow-md flex flex-col justify-between h-full rounded-[6px]  transition-all duration-300 group',
                  cor.borda,
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-[6px] flex items-center justify-center transition-all duration-300 shadow-xs',
                        cor.caixa,
                      )}
                    >
                      <Icone size={22} aria-hidden />
                    </div>
                    {item.badge && (
                      <span className={cn('text-xs font-bold font-mono px-2.5 py-1 rounded-[6px]', cor.selo)}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3
                    className={cn(
                      'text-base sm:text-lg font-bold font-display text-text-main mb-3 transition-colors leading-snug',
                      cor.titulo,
                    )}
                  >
                    {item.title}
                  </h3>

                  <p className="text-text-muted text-xs sm:text-sm leading-relaxed font-light mb-6">
                    {item.description}
                  </p>
                </div>

                {item.bullets.length > 0 && (
                  <div className="pt-4 border-t border-slate-200 dark:border-white/5 space-y-2">
                    {item.bullets.map((texto) => (
                      <div key={texto} className="flex items-center gap-2 text-xs text-text-muted font-light">
                        <CheckCircle2 size={14} className={cn('shrink-0', cor.marca)} aria-hidden />
                        <span>{texto}</span>
                      </div>
                    ))}
                  </div>
                )}
              </GlowCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
