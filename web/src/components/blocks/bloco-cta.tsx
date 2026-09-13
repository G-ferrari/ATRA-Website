import { ArrowRight, Bot } from 'lucide-react'
import Link from 'next/link'

import { BORDAS, ESPACOS } from '@/components/blocks/bordas'
import { TechCornerBraces } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoCtaBanner } from '@/types/content'

import { TextoDestacado } from './texto-destacado'

/* Faixa de chamada — porte de `legacy/src/components/CaseDetailBase.tsx:185`,
 * a mesma caixa que fecha `About.tsx:456`.
 *
 * Duas formas, porque o legado tem duas: `primary` é a caixa azul arredondada
 * do case; `subtle` é a faixa de largura inteira que fecha `/sobre`, sem caixa
 * interna e com borda no topo.
 *
 * Sem o bloco de telefone e e-mail que a versão do case tem: aquele é o
 * `ctaContact` (MIG-053), que carrega formulário. Aqui é só a faixa. */
export function BlocoCta({ bloco }: { bloco: BlocoCtaBanner }) {
  const azul = bloco.variant === 'primary'

  /* Caixa escura (MIG-056) — porte de `legacy/src/pages/SolutionAI.tsx:821`.
   * A mesma moldura do herói, fechando a página: texto à esquerda, os dois
   * botões empilhados à direita. */
  if (bloco.variant === 'dark') {
    return (
      <section
        id={bloco.anchor ?? undefined}
        className="py-16 md:py-24 bg-surface-1 relative overflow-hidden px-3 sm:px-6 scroll-mt-32"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="rounded-[6px] bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015]  text-white p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden vort-dot-grid">
            <TechCornerBraces color="blue" position="top-left" size={14} />
            <TechCornerBraces color="orange" position="bottom-right" size={14} />

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-white mb-3 leading-tight">
                  <TextoDestacado
                    texto={bloco.title}
                    destaque={bloco.highlight}
                    className="text-secondary font-normal"
                  />
                </h2>
                {bloco.description && (
                  <p className="text-xs sm:text-sm md:text-base text-white/70 leading-relaxed max-w-xl font-light">
                    {bloco.description}
                  </p>
                )}
              </div>

              <div className="shrink-0 flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                {bloco.cta && (
                  <Link
                    href={bloco.cta.href}
                    className="inline-flex w-full md:w-auto items-center justify-center bg-secondary hover:bg-orange-600 text-white px-8 py-3 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-lg hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                  >
                    {bloco.cta.label}
                  </Link>
                )}
                {bloco.secondaryCta && (
                  <div className="flex flex-col items-center w-full">
                    <Link
                      href={bloco.secondaryCta.href}
                      className="inline-flex w-full md:w-auto items-center justify-center bg-white/10 hover:bg-white/20 text-white px-8 py-2.5 rounded-[6px] text-xs font-medium transition-all whitespace-nowrap "
                    >
                      {bloco.secondaryCta.label}
                    </Link>
                    {bloco.secondaryCta.caption && (
                      <span className="text-white/40 text-[10px] mt-1.5 uppercase tracking-wider font-semibold text-center">
                        {bloco.secondaryCta.caption}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* Caixa escura centralizada (MIG-054a) — porte de
   * `legacy/src/components/PartnerPageBase.tsx:312`. Mesma moldura da `dark`,
   * mas com o texto no centro e os dois botões lado a lado; o segundo carrega o
   * glifo do agente de IA, que no gabarito é literal. */
  if (bloco.variant === 'dark-centered') {
    return (
      <section
        id={bloco.anchor ?? undefined}
        className={cn(
          ESPACOS[bloco.espaco],
          'bg-surface-1 relative overflow-hidden px-3 sm:px-6 scroll-mt-32',
        )}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="rounded-[6px] bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015]  text-white p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden vort-dot-grid text-center">
            <TechCornerBraces color="blue" position="top-left" size={14} />
            <TechCornerBraces color="orange" position="bottom-right" size={14} />

            <div className="max-w-3xl mx-auto relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-white mb-3 leading-tight">
                <TextoDestacado texto={bloco.title} destaque={bloco.highlight} className="text-secondary" />
              </h2>
              {bloco.description && (
                <p className="text-xs sm:text-sm md:text-base text-white/70 mb-8 font-light leading-relaxed whitespace-pre-line max-w-xl mx-auto">
                  {bloco.description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {bloco.cta && (
                  <Link
                    href={bloco.cta.href}
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/20"
                  >
                    {bloco.cta.label}
                  </Link>
                )}
                {bloco.secondaryCta && (
                  <Link
                    href={bloco.secondaryCta.href}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white  px-6 py-2.5 rounded-[6px] text-xs sm:text-sm font-medium transition-all"
                  >
                    <Bot size={16} aria-hidden />
                    <span>{bloco.secondaryCta.label}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!azul) {
    return (
      <section
        id={bloco.anchor ?? undefined}
        className={cn(
          'py-16 md:py-20 bg-surface-2 text-center scroll-mt-32',
          BORDAS[bloco.borda],
        )}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-4 tracking-tight">
            <TextoDestacado texto={bloco.title} destaque={bloco.highlight} />
          </h2>
          {bloco.description && (
            <p className="text-xs sm:text-sm text-text-muted font-light mb-8 max-w-xl mx-auto leading-relaxed">
              {bloco.description}
            </p>
          )}
          {bloco.cta && (
            <Link
              href={bloco.cta.href}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-[6px] bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/20"
            >
              {bloco.cta.label}
            </Link>
          )}
        </div>
      </section>
    )
  }

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn('py-24 scroll-mt-32', bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-slate-50')}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={cn(
            'rounded-[6px] p-8 md:p-16 text-center relative overflow-hidden',
            azul
              ? 'bg-primary text-white shadow-xl shadow-primary/20'
              : 'bg-surface-2 text-text-main ',
          )}
        >
          {azul && (
            <>
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </>
          )}

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              <TextoDestacado
                texto={bloco.title}
                destaque={bloco.highlight}
                className={azul ? 'text-secondary' : 'text-primary font-normal'}
              />
            </h2>

            {bloco.description && (
              <p className={cn('text-lg mb-12', azul ? 'text-white/80' : 'text-text-muted')}>
                {bloco.description}
              </p>
            )}

            {bloco.cta && (
              <Link
                href={bloco.cta.href}
                className={cn(
                  'inline-flex items-center gap-3 px-10 py-5 rounded-[6px] font-bold text-lg transition-all hover:-translate-y-1 shadow-lg',
                  azul ? 'bg-secondary hover:bg-orange-600 text-white' : 'bg-primary hover:bg-primary-dark text-white',
                )}
              >
                {bloco.cta.label} <ArrowRight size={20} aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
