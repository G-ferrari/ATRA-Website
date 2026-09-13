'use client'

import Image from 'next/image'
import { useState } from 'react'

import { BORDAS } from '@/components/blocks/bordas'
import { cn } from '@/lib/utils'
import type { BlocoAccordionSteps } from '@/types/content'

import { Icone } from './icones'
import { PilulaDeSecao } from './pilula-de-secao'

/* Etapas em acordeão — porte de `legacy/src/pages/SolutionAI.tsx:685`.
 *
 * Ilha cliente porque abrir e fechar é estado. A primeira já nasce aberta, como
 * no legado (`useState(0)`) — e é o que torna a captura da regressão visual
 * determinística: sem isso a seção mediria altura diferente a cada execução.
 *
 * ⚠️ Sem a animação de altura do legado (`AnimatePresence` + `motion.div`). O
 * conteúdo aparece e some direto. A captura é de estado parado, então não muda
 * o gabarito, e animar exigiria trazer `motion` para uma seção que não anima
 * na entrada — ver debito-tecnico.md. */
export function BlocoAcordeao({ bloco }: { bloco: BlocoAccordionSteps }) {
  const [aberta, setAberta] = useState<number | null>(0)

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-16 md:py-24 scroll-mt-28 md:scroll-mt-32',
        bloco.theme === 'surface-1' ? 'bg-surface-1' : 'bg-surface-2',
        BORDAS[bloco.borda],
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 lg:mb-12">
          {bloco.eyebrow && <PilulaDeSecao texto={bloco.eyebrow} icone={bloco.eyebrowIcon} />}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-text-main leading-tight tracking-tight">
            {bloco.title}
          </h2>
          {bloco.description && (
            <p className="text-xs sm:text-sm text-text-muted font-light mt-2 max-w-2xl">{bloco.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          {bloco.image && (
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[6px] overflow-hidden shadow-xl  aspect-[4/3] lg:aspect-square w-full">
                <Image
                  src={bloco.image.url}
                  alt={bloco.image.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />

                {bloco.imageBadge && (
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto bg-surface-1/95 backdrop-blur-md p-3 rounded-[6px] shadow-lg  flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[4px] bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {bloco.imageBadge.icon && <Icone nome={bloco.imageBadge.icon} size={16} />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text-main">{bloco.imageBadge.title}</div>
                      {bloco.imageBadge.subtitle && (
                        <div className="text-[10px] text-text-muted">{bloco.imageBadge.subtitle}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={bloco.image ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <div className="space-y-3.5">
              {bloco.steps.map((etapa, i) => {
                const ativa = aberta === i
                return (
                  <div
                    key={etapa.title}
                    className={cn(
                      'rounded-[6px] overflow-hidden border transition-all duration-300',
                      ativa
                        ? 'bg-surface-1 border-primary/40 shadow-md'
                        : 'bg-surface-1/60 hover:bg-surface-1 border-slate-200 dark:border-white/5',
                    )}
                  >
                    <button
                      type="button"
                      aria-expanded={ativa}
                      onClick={() => setAberta(ativa ? null : i)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-3.5">
                        <span
                          className={cn(
                            'w-7 h-7 rounded-[4px] flex items-center justify-center text-xs font-bold font-mono transition-colors',
                            ativa ? 'bg-primary text-white' : 'bg-surface-2 text-text-muted',
                          )}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={cn(
                            'font-bold text-xs sm:text-sm md:text-base transition-colors',
                            ativa ? 'text-primary' : 'text-text-main',
                          )}
                        >
                          {etapa.title}
                        </span>
                      </span>
                      <span
                        className={cn(
                          'w-7 h-7 rounded-[6px] flex items-center justify-center transition-colors shrink-0',
                          ativa ? 'bg-primary/20 text-primary' : 'bg-surface-2 text-text-muted',
                        )}
                        aria-hidden
                      >
                        <span className="text-sm font-bold leading-none">{ativa ? '-' : '+'}</span>
                      </span>
                    </button>
                    {ativa && (
                      <div className="px-5 pb-5 pt-0 text-text-muted text-xs sm:text-sm leading-relaxed font-light pl-14">
                        {etapa.description}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
