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
              <p
                className={cn(
                  'text-xs sm:text-sm md:text-base mb-8 leading-relaxed',
                  /* No modo faixa (layout do "verdadeiro desafio" da landing) o
                     parágrafo é o azul de destaque; nas demais telas, texto de
                     apoio. */
                  bloco.itemLayout === 'strip' ? 'text-primary font-medium' : 'text-text-muted font-light',
                )}
              >
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

          {bloco.itemLayout === 'strip' ? (
            /* Faixa compacta (layout do "verdadeiro desafio" da landing): uma frase
               de intro + um painel com ícone+rótulo em linha. As descrições dos
               itens não entram nesta forma — o rótulo basta. */
            <div>
              {bloco.itemsIntro && (
                <p className="text-sm sm:text-base text-text-muted font-light leading-relaxed mb-6">
                  {bloco.itemsIntro}
                </p>
              )}
              <div className="rounded-[6px] bg-surface-2 shadow-sm p-6 sm:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8 text-center">
                  {bloco.items.map((item) => {
                    const Icone = iconePorNome(item.icon)
                    return (
                      <div key={item.title} className="group flex flex-col items-center gap-3">
                        <div className="w-11 h-11 rounded-[6px] bg-primary/10 flex items-center justify-center transition-colors duration-200 group-hover:bg-primary">
                          <Icone
                            size={20}
                            className={cn(COR_DO_ICONE[item.accent], 'transition-colors duration-200 group-hover:text-white')}
                            aria-hidden
                          />
                        </div>
                        <span className="text-xs font-semibold text-text-main leading-snug">{item.title}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {bloco.items.map((item) => {
                const Icone = iconePorNome(item.icon)
                return (
                  <div
                    key={item.title}
                    className="group flex items-start gap-4 p-5 rounded-[6px] bg-surface-2 shadow-xs transition duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5"
                  >
                    <div className="shrink-0 p-3 rounded-[6px] bg-primary/10 transition-colors group-hover:bg-primary">
                      <Icone
                        size={22}
                        className={cn(COR_DO_ICONE[item.accent], 'transition-colors group-hover:text-white')}
                        aria-hidden
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text-main mb-1">{item.title}</h3>
                      <p className="text-text-muted font-light text-xs sm:text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
