import { CheckCircle2, Sparkles } from 'lucide-react'

import { BORDAS, ESPACOS } from '@/components/blocks/bordas'
import { GlowCard } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoValueCards } from '@/types/content'

import { iconePorNome } from './icones'
import { TextoDestacado } from './texto-destacado'

/* Cards de valores — porte de `legacy/src/pages/About.tsx:351` (cartão curto) e
 * `Careers.tsx:222` (cartão alto).
 *
 * Os dois mostram os mesmos três valores da ATRA com anatomias diferentes: o
 * curto é um `GlowCard` com ícone, título e uma frase; o alto acrescenta
 * divisor e checklist, pinta a frase de azul (ou laranja, no terceiro) e sobe a
 * caixa no hover. Ver a nota do campo `variant` em `blocks/index.ts`. */
export function BlocoValores({ bloco }: { bloco: BlocoValueCards }) {
  const alto = bloco.variant === 'expanded'

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        ESPACOS[bloco.espaco],
        'relative overflow-hidden scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      {/* O brilho ambiente é só do cartão alto (`Careers.tsx:195`): um halo azul
          atrás da grade, a 25% no claro e 10% no escuro. */}
      {alto && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[40vw] max-w-[800px] opacity-25 dark:opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle at center, rgba(60, 152, 250, 0.35) 0%, transparent 70%)' }}
          />
        </div>
      )}

      <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 relative z-10', alto && 'lg:px-8')}>
        {(bloco.eyebrow || bloco.title) && (
          <div className={cn('text-center', alto ? 'max-w-3xl mx-auto mb-14 md:mb-16' : 'mb-16')}>
            {bloco.eyebrow &&
              (alto ? (
                /* ⚠️ Não reusar `PilulaDeSecao`: aquela é a pílula numerada da
                   página de solução, com `rounded-[6px]`, `font-bold`,
                   `tracking-wider` e sem borda. Esta tem `rounded-[4px]`,
                   `font-semibold`, `tracking-widest` e contorno. */
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest mb-3">
                  <Sparkles size={12} aria-hidden />
                  <span>{bloco.eyebrow}</span>
                </div>
              ) : (
                <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
                  {bloco.eyebrow}
                </span>
              ))}
            {bloco.title && (
              <h2
                className={cn(
                  'text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main',
                  alto ? 'mb-4 tracking-tight' : 'mb-3',
                )}
              >
                <TextoDestacado texto={bloco.title} destaque={bloco.highlight} />
              </h2>
            )}
            {alto && bloco.description && (
              /* ⚠️ `dark:text-gray-300` (`Careers.tsx:214`). Sem ele o texto sai
                 em `text-muted`, que no escuro é gray-400 — um tom mais escuro,
                 e o aceite visual captura em modo escuro. */
              <p className="text-text-muted dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                {bloco.description}
              </p>
            )}
          </div>
        )}

        <div className={cn('grid md:grid-cols-3 gap-6', alto && 'grid-cols-1 lg:gap-8 items-stretch')}>
          {bloco.items.map((v) => {
            const Icone = iconePorNome(v.icon)
            const laranja = v.glowColor === 'orange'

            return alto ? (
              <div
                key={v.title}
                className={cn(
                  'group relative flex flex-col justify-between bg-surface-2  rounded-[6px] p-7 sm:p-8 lg:p-9 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1',
                  laranja ? 'hover:border-secondary/50' : 'hover:border-primary/50',
                )}
              >
                <div
                  className={cn(
                    'absolute top-0 left-0 right-0 h-1 transition-all duration-300 rounded-t-[8px]',
                    laranja ? 'bg-secondary/0 group-hover:bg-secondary' : 'bg-primary/0 group-hover:bg-primary',
                  )}
                />
                <div>
                  <div
                    className={cn(
                      'w-14 h-14 rounded-[6px] flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform',
                      laranja ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary',
                    )}
                  >
                    <Icone size={26} strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-text-main mb-2">{v.title}</h3>
                  {/* `min-h-[36px]` é o que mantém divisor e checklist dos três
                      cartões na mesma linha quando a frase quebra em duas. */}
                  <p
                    className={cn(
                      'text-xs sm:text-[13px] font-medium mb-5 min-h-[36px] flex items-center',
                      /* No escuro o azul clareia (`Careers.tsx:231`); o laranja
                         não muda (`:285`). Assimetria do legado. */
                      laranja ? 'text-secondary' : 'text-primary dark:text-[#3C98FA]',
                    )}
                  >
                    {v.description}
                  </p>
                  <div className="h-px w-full bg-slate-200 dark:bg-white/10 mb-6" />
                  <ul className="space-y-3.5 text-xs sm:text-[13px] text-text-muted dark:text-gray-300 font-light leading-relaxed">
                    {v.bullets.map((b) => (
                      <li key={b} className="flex gap-3 items-start">
                        <CheckCircle2
                          size={16}
                          className={cn('mt-0.5 shrink-0', laranja ? 'text-secondary' : 'text-primary')}
                          aria-hidden
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <GlowCard key={v.title} glowColor={v.glowColor} className="p-8 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <Icone size={24} aria-hidden />
                  </div>
                  <h3 className="text-lg font-bold font-display text-text-main mb-3 group-hover:text-primary transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-xs text-text-muted font-light leading-relaxed">{v.description}</p>
                </div>
              </GlowCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
