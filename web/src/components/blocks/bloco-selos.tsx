import Image from 'next/image'

import { cn } from '@/lib/utils'
import type { BlocoSealsBanner } from '@/types/content'

/* Faixa de selos e certificações — porte de `legacy/src/App.tsx:1217`.
 *
 * Os selos vêm de `site-settings`: são os mesmos na home, em /sobre e em
 * /carreiras, e mantê-los num lugar só evita a divergência que P-01 registra
 * para os números. */
export function BlocoSelos({ bloco }: { bloco: BlocoSealsBanner }) {
  if (bloco.seals.length === 0) return null

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-16 overflow-hidden scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {(bloco.title || bloco.description) && (
          <div className="text-center mb-10">
            {bloco.title && (
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 font-display">
                {bloco.title}
              </h3>
            )}
            <div className="w-12 h-0.5 bg-primary/40 mx-auto rounded-full" />
            {bloco.description && (
              <p className="text-xs sm:text-sm text-text-muted font-light mt-4 max-w-2xl mx-auto">
                {bloco.description}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-700">
          {bloco.seals.map((s) => (
            <Image
              key={s.name}
              src={s.image.url}
              alt={s.name}
              width={s.image.width}
              height={s.image.height}
              className="h-10 md:h-12 w-auto object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
