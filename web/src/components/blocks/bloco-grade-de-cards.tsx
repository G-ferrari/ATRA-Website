import { cn } from '@/lib/utils'
import type { BlocoIconCardGrid } from '@/types/content'

import { iconePorNome } from './icones'

/* Grade de cards com ícone — porte de `legacy/src/pages/About.tsx:403` e `:434`.
 *
 * As duas ocorrências do legado usam a mesma grade de formas diferentes: uma só
 * com rótulo, centralizada e compacta; outra com título e descrição, alinhada à
 * esquerda. O card muda conforme `description` estiver preenchida, em vez de
 * existirem dois blocos quase idênticos para o editor escolher errado. */

const COLUNAS: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
}

export function BlocoGradeDeCards({ bloco }: { bloco: BlocoIconCardGrid }) {
  const compacto = bloco.items.every((i) => !i.description)

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-16 md:py-20 relative overflow-hidden scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {(bloco.eyebrow || bloco.title) && (
          <div className="max-w-3xl mx-auto text-center mb-16">
            {bloco.eyebrow && (
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
                {bloco.eyebrow}
              </span>
            )}
            {bloco.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-3">
                {bloco.title}
              </h2>
            )}
          </div>
        )}

        <div className={cn('grid gap-4 md:gap-6', COLUNAS[bloco.columns])}>
          {bloco.items.map((item) => {
            const Icone = iconePorNome(item.icon)

            return compacto ? (
              <div
                key={item.title}
                className="p-5 bg-surface-1 border border-slate-200 dark:border-white/5 rounded-[6px] hover:border-primary/40 hover:shadow-md transition-all duration-300 flex flex-col justify-center items-center text-center group"
              >
                <div className="w-10 h-10 rounded-[6px] bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary transition-all">
                  <Icone className="w-5 h-5 text-primary group-hover:text-white transition-colors" aria-hidden />
                </div>
                <span className="text-xs font-semibold text-text-main group-hover:text-primary transition-colors leading-relaxed">
                  {item.title}
                </span>
              </div>
            ) : (
              <div
                key={item.title}
                className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-6 group hover:border-primary/30 transition-all"
              >
                <div className="w-10 h-10 rounded-[6px] bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-all">
                  <Icone className="w-5 h-5 text-primary group-hover:text-white transition-colors" aria-hidden />
                </div>
                <h3 className="text-sm font-bold text-text-main mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-text-muted font-light leading-relaxed">{item.description}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
