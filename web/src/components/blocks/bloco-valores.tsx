import { GlowCard } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoValueCards } from '@/types/content'

import { iconePorNome } from './icones'

/* Cards de valores — porte de `legacy/src/pages/About.tsx:351`. */
export function BlocoValores({ bloco }: { bloco: BlocoValueCards }) {
  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-16 md:py-20 relative overflow-hidden scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {bloco.title && (
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-3">
              {bloco.title}
            </h2>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {bloco.items.map((v) => {
            const Icone = iconePorNome(v.icon)
            return (
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
