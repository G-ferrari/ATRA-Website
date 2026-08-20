import { BORDAS, ESPACOS } from '@/components/blocks/bordas'
import { cn } from '@/lib/utils'
import type { BlocoProcessSteps } from '@/types/content'

/* Etapas de um processo — porte de `legacy/src/pages/Careers.tsx:368`.
 *
 * A numeração sai da ordem do array, não de um campo: número digitado à mão
 * sai de sincronia na primeira vez que alguém reordena as etapas. */
export function BlocoEtapas({ bloco }: { bloco: BlocoProcessSteps }) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {(bloco.eyebrow || bloco.title || bloco.description) && (
          <div className="text-center mb-16">
            {bloco.eyebrow && (
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
                {bloco.eyebrow}
              </span>
            )}
            {/* `mb-4`, não `mb-3`: é o valor de `Careers.tsx:366`, a única
                seção do site que usa este bloco. */}
            {bloco.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-4">
                {bloco.title}
              </h2>
            )}
            {bloco.description && (
              <p className="text-text-muted text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
                {bloco.description}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bloco.steps.map((etapa, i) => (
            <div
              key={etapa.title}
              className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-6 shadow-sm flex flex-col justify-between group hover:border-primary/30 transition-colors"
            >
              <div>
                <div className="w-10 h-10 rounded-[6px] bg-primary/10 text-primary font-bold text-sm flex items-center justify-center mb-4">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-text-main mb-2">{etapa.title}</h3>
                <p className="text-xs text-text-muted font-light leading-relaxed">{etapa.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
