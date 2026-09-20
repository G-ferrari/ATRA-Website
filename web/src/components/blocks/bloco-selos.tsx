import { BORDAS, ESPACOS } from '@/components/blocks/bordas'
import { cn } from '@/lib/utils'
import type { BlocoSealsBanner } from '@/types/content'

/* Faixa de selos de reconhecimento — porte de `legacy/src/pages/Careers.tsx:306`.
 *
 * A caixa branca em volta de cada selo não é decoração: os arquivos do GPTW e do
 * LIPT têm fundo claro e sumiriam no tema escuro. */
export function BlocoSelos({ bloco }: { bloco: BlocoSealsBanner }) {
  if (bloco.seals.length === 0) return null

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        ESPACOS[bloco.espaco],
        'scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {bloco.title && (
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-text-main mb-10">
            {bloco.title}
          </h2>
        )}

        <div className="flex overflow-x-auto no-scrollbar justify-center items-center gap-6 md:gap-10 pb-4">
          {bloco.seals.map((s) => (
            <div
              key={s.name}
              className="bg-white p-3 sm:p-4 rounded-[6px]  shadow-sm flex items-center justify-center shrink-0 min-w-[140px] h-[100px] sm:h-[120px] md:h-[136px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- a caixa é
                  fixa e a imagem se ajusta por `max-h`/`max-w`; o next/image
                  fixaria a caixa pelas dimensões declaradas. */}
              <img
                src={s.image.url}
                alt={s.name}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-[160px] object-contain shrink-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
