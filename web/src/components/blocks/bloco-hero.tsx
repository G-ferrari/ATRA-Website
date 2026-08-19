import { Sparkles } from 'lucide-react'
import Link from 'next/link'

import { MetricChip, StatusBadge, TechCornerBraces } from '@/components/ui'
import type { BlocoPageHero } from '@/types/content'

import { TextoDestacado } from './texto-destacado'

/* Abertura de página — porte de `legacy/src/pages/About.tsx:150`, que é a mesma
 * caixa usada em `Glossary.tsx:71` e `Careers.tsx:99`. */
export function BlocoHero({ bloco }: { bloco: BlocoPageHero }) {
  return (
    <section
      id={bloco.anchor ?? undefined}
      className="relative pt-6 pb-12 overflow-hidden bg-surface-1 px-3 sm:px-6 scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="rounded-[6px] bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015] border border-white/5 text-white p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden vort-dot-grid">
          <TechCornerBraces color="blue" position="top-left" size={16} />
          <TechCornerBraces color="orange" position="bottom-right" size={16} />

          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7">
              {(bloco.badge || bloco.chip) && (
                <div className="flex items-center gap-2 mb-4">
                  {bloco.badge && (
                    <StatusBadge
                      label={bloco.badge}
                      variant="primary"
                      size="sm"
                      pulse
                      icon={<Sparkles size={12} />}
                    />
                  )}
                  {bloco.chip && <MetricChip label={bloco.chip} variant="neutral" size="sm" />}
                </div>
              )}

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display mb-4 tracking-tight leading-tight">
                <TextoDestacado texto={bloco.title} destaque={bloco.highlight} />
              </h1>

              {bloco.description && (
                <p className="text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed mb-6 max-w-xl">
                  {bloco.description}
                </p>
              )}

              {bloco.ctas.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {bloco.ctas.map((cta, i) => (
                    <Link
                      key={cta.href}
                      href={cta.href}
                      className={
                        i === 0
                          ? 'px-5 py-2.5 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer shadow-md shadow-primary/20'
                          : 'px-5 py-2.5 rounded-[6px] bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-all'
                      }
                    >
                      {cta.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
