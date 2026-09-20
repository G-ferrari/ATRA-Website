import { CheckCircle2 } from 'lucide-react'

import { BORDAS } from '@/components/blocks/bordas'
import { GlowCard } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoBentoGrid } from '@/types/content'

import { Icone, iconePorNome } from './icones'
import { PilulaDeSecao } from './pilula-de-secao'

/* Grade bento — porte de `legacy/src/pages/SolutionAI.tsx:395`.
 *
 * Quatro cards de anatomia diferente na mesma grade de 12 colunas: o primeiro
 * traz números, o segundo etiquetas, os dois de baixo lista de conferência.
 * O que varia entra como campo opcional, e o card renderiza o que existe —
 * quatro componentes para quatro cards da mesma seção seria pior. */

/* Classes literais: o Tailwind não enxerga classe montada em tempo de execução. */
const COLUNAS = {
  '5': 'lg:col-span-5',
  '6': 'lg:col-span-6',
  '7': 'lg:col-span-7',
  '12': 'lg:col-span-12',
} as const

const ACENTO = {
  primary: { pilula: 'bg-primary/10 text-primary', caixa: 'bg-primary/10 text-primary', marca: 'text-primary', borda: 'hover:border-primary/40' },
  secondary: { pilula: 'bg-secondary/10 text-secondary', caixa: 'bg-secondary/10 text-secondary', marca: 'text-secondary', borda: 'hover:border-secondary/40' },
} as const

const COR_DO_NUMERO = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  emerald: 'text-emerald-500',
} as const

export function BlocoBento({ bloco }: { bloco: BlocoBentoGrid }) {
  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-16 md:py-24 relative overflow-hidden px-4 sm:px-6 scroll-mt-24',
        bloco.theme === 'surface-1' ? 'bg-surface-1' : 'bg-surface-2',
        BORDAS[bloco.borda],
      )}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          {bloco.eyebrow && <PilulaDeSecao texto={bloco.eyebrow} icone={bloco.eyebrowIcon} />}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-text-main tracking-tight leading-tight mb-3">
            {bloco.title}
          </h2>
          {bloco.description && (
            <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed">{bloco.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
          {bloco.items.map((item) => {
            const cor = ACENTO[item.accent]
            const IconeDoSelo = item.icon ? iconePorNome(item.icon) : null
            const destaque = item.size !== 'supporting'

            return (
              <div key={item.title} className={cn('h-full', COLUNAS[item.span])}>
                <GlowCard
                  glowColor={item.accent === 'secondary' ? 'orange' : 'blue'}
                  customSize
                  radius={6}
                  className={cn(
                    'bg-surface-1 text-text-main h-full flex flex-col justify-between rounded-[6px]  transition-all duration-300',
                    destaque
                      ? 'p-6 sm:p-8 shadow-lg relative overflow-hidden group'
                      : cn('p-6 sm:p-7 shadow-md', cor.borda),
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {/* O card de destaque abre com pílula; o de apoio, com
                          caixa de ícone (`SolutionAI.tsx:436` e `:537`). */}
                      {destaque ? (
                        item.badge && (
                          <div
                            className={cn(
                              'inline-flex items-center gap-2 px-3 py-1 rounded-[6px] text-xs font-bold uppercase tracking-wider',
                              cor.pilula,
                            )}
                          >
                            {IconeDoSelo && <IconeDoSelo size={14} aria-hidden />} {item.badge}
                          </div>
                        )
                      ) : (
                        <div className={cn('w-10 h-10 rounded-[6px] flex items-center justify-center shrink-0', cor.caixa)}>
                          {IconeDoSelo && <IconeDoSelo size={20} aria-hidden />}
                        </div>
                      )}

                      {item.chip &&
                        (destaque ? (
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-[6px]">
                            {item.chip}
                          </span>
                        ) : (
                          <span className={cn('text-[10px] font-bold uppercase tracking-wider', cor.marca)}>
                            {item.chip}
                          </span>
                        ))}
                    </div>

                    {destaque ? (
                      /* O card mais largo ganha um degrau a mais no desktop
                         (`SolutionAI.tsx:444` contra `:497`) — sem ele a seção
                         sai 8px curta e o resto da página sobe junto. */
                      /* ⚠️ A ordem importa: `text-xl` define tamanho **e**
                         entrelinha, então o `cn()` (tailwind-merge) descarta um
                         `leading-tight` que venha antes dele. Com o tamanho no
                         argumento seguinte, era o que acontecia — a entrelinha
                         caía no padrão de 28px onde o legado tem 25px, e a
                         seção saía 8px mais alta. */
                      <h3
                        className={cn(
                          item.size === 'featured-wide' ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-xl sm:text-2xl',
                          'font-extrabold font-display text-text-main mb-3 leading-tight',
                        )}
                      >
                        {item.title}
                      </h3>
                    ) : (
                      <h3 className="text-lg sm:text-xl font-bold font-display text-text-main mb-2">{item.title}</h3>
                    )}

                    <p
                      className={cn(
                        'text-xs sm:text-sm text-text-muted leading-relaxed font-light',
                        destaque ? 'mb-6' : 'mb-4',
                      )}
                    >
                      {item.description}
                    </p>

                    {item.metrics.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                        {item.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="p-3 rounded-[6px] bg-surface-2 "
                          >
                            <div className={cn('text-base font-bold', COR_DO_NUMERO[m.color])}>{m.value}</div>
                            <div className="text-[11px] text-text-muted font-light mt-0.5">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-[6px] bg-surface-2  text-text-main"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.bullets.length > 0 && (
                      <div className="space-y-2">
                        {item.bullets.map((texto) => (
                          <div key={texto} className="flex items-center gap-2 text-xs text-text-main font-light">
                            <CheckCircle2 size={14} className={cn('shrink-0', cor.marca)} aria-hidden />
                            <span>{texto}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {item.footer && (
                    <div
                      className={cn(
                        'mt-6 pt-4 border-t border-slate-200 dark:border-white/5',
                        destaque
                          ? 'flex items-center justify-between text-xs text-text-muted font-light'
                          : 'text-[11px] text-text-muted',
                      )}
                    >
                      <span>{item.footer}</span>
                      {/* Tamanho e movimento do glifo diferem por card no
                          legado: 18px com deslocamento no hover no mais largo
                          (`SolutionAI.tsx:470`), 16px parado no outro (`:516`).
                          Os 2px de diferença mudavam a altura do card. */}
                      {destaque && item.footerIcon && (
                        <Icone
                          nome={item.footerIcon}
                          size={item.size === 'featured-wide' ? 18 : 16}
                          className={cn(
                            'shrink-0',
                            cor.marca,
                            item.size === 'featured-wide' &&
                              'group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform',
                          )}
                        />
                      )}
                    </div>
                  )}
                </GlowCard>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
