import Link from 'next/link'

import { BORDAS } from '@/components/blocks/bordas'
import { cn } from '@/lib/utils'
import type { BlocoAudienceSplit } from '@/types/content'

import { iconePorNome } from './icones'
import { PilulaDeSecao } from './pilula-de-secao'

/* "Para quem é esse serviço" — porte de `legacy/src/pages/SolutionAI.tsx:621`.
 *
 * Duas colunas: texto e botão à esquerda, perfis empilhados à direita.
 *
 * ⚠️ A caixa do ícone é sempre `bg-primary/10`, mesmo quando o ícone é laranja
 * (`SolutionAI.tsx:669`): só o traço muda de cor, o fundo não. Parece descuido
 * do legado e foi portado assim — ver debito-tecnico.md. */
const COR_DO_ICONE = { primary: 'text-primary', secondary: 'text-secondary' } as const

export function BlocoParaQuem({ bloco }: { bloco: BlocoAudienceSplit }) {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            {bloco.eyebrow && <PilulaDeSecao texto={bloco.eyebrow} icone={bloco.eyebrowIcon} />}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-text-main mb-4 leading-tight tracking-tight">
              {bloco.title}
            </h2>
            {bloco.description && (
              <p className="text-xs sm:text-sm md:text-base text-text-muted mb-8 leading-relaxed font-light">
                {bloco.description}
              </p>
            )}
            {bloco.cta && (
              <Link
                href={bloco.cta.href}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-7 py-3 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/30 cursor-pointer"
              >
                {bloco.cta.label}
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {bloco.items.map((item) => {
              const Icone = iconePorNome(item.icon)
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-4 p-5 rounded-[6px] bg-surface-2 border border-slate-200 dark:border-white/5 shadow-xs hover:border-primary/40 transition-all"
                >
                  <div className="shrink-0 p-3 rounded-[6px] bg-primary/10">
                    <Icone size={22} className={COR_DO_ICONE[item.accent]} aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-main mb-1">{item.title}</h3>
                    <p className="text-text-muted font-light text-xs sm:text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
