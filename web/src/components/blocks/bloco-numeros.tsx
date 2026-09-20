import { cn } from '@/lib/utils'
import type { BlocoStatsGrid } from '@/types/content'

import { ContadorAnimado } from './contador-animado'

/* Grade de números institucionais — porte de `legacy/src/pages/About.tsx:236`. */
export function BlocoNumeros({ bloco }: { bloco: BlocoStatsGrid }) {
  if (bloco.items.length === 0) return null

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16 scroll-mt-32',
        bloco.theme === 'surface-2' && 'bg-surface-2',
      )}
    >
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {bloco.items.map((m) => (
          <div
            key={m.label}
            className="bg-surface-2  p-5 rounded-[6px] shadow-sm flex flex-col items-center text-center group hover:border-primary/30 transition-all duration-300"
          >
            <div className="text-2xl sm:text-3xl font-bold font-display text-primary mb-1">
              <ContadorAnimado ate={m.value} sufixo={m.suffix} />
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider leading-tight">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
