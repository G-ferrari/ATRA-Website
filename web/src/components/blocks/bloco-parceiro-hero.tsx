import { Sparkles } from 'lucide-react'
import Link from 'next/link'

import { MetricChip, StatusBadge, TechCornerBraces } from '@/components/ui'
import type { BlocoPartnerHero } from '@/types/content'

import { TextoDestacado } from './texto-destacado'

/* Abertura da página de parceiro — porte de
 * `legacy/src/components/PartnerPageBase.tsx:99`.
 *
 * ⚠️ Não é o `pageHero` com um campo a mais. Além da faixa de prêmios, que não
 * existe em nenhum outro herói, a escala do `h1` sobe em quatro degraus
 * (`sm:text-3xl md:text-4xl lg:text-5xl`) contra os três do `pageHero`
 * (`sm:text-4xl md:text-5xl`) — no tablet são 36px contra 48px — e a seção abre
 * com `pt-4`, não `pt-6`. */
export function BlocoParceiroHero({ bloco }: { bloco: BlocoPartnerHero }) {
  return (
    <section
      id={bloco.anchor ?? undefined}
      className="relative pt-4 pb-12 overflow-hidden px-3 sm:px-6 scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="rounded-[6px] bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015]  text-white p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden vort-dot-grid text-center">
          <TechCornerBraces color="blue" position="top-left" size={16} />
          <TechCornerBraces color="orange" position="bottom-right" size={16} />

          <div className="max-w-3xl mx-auto relative z-10">
            {(bloco.badge || bloco.chip) && (
              <div className="flex items-center justify-center gap-2 mb-4">
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

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-white mb-4 tracking-tight leading-tight">
              <TextoDestacado texto={bloco.title} destaque={bloco.highlight} className="text-primary" />
            </h1>

            {bloco.description && (
              <p className="text-xs sm:text-sm md:text-base text-white/70 mb-8 font-light leading-relaxed max-w-2xl mx-auto">
                {bloco.description}
              </p>
            )}
          </div>

          {bloco.awards.length > 0 && (
            /* A faixa sangra para fora do respiro do cartão (`-mx-4 px-4`) para
               que o corte no mobile aconteça na borda, e não com margem. */
            <div className="overflow-x-auto -mx-4 px-4 no-scrollbar mb-8 relative z-10">
              <div className="flex justify-start md:justify-center gap-3 w-max md:w-auto mx-auto pb-2">
                {bloco.awards.map((p) => (
                  <div
                    key={`${p.title}-${p.highlight}`}
                    className="bg-white/5  backdrop-blur-md p-4 rounded-[6px] shadow-sm flex flex-col items-center justify-center min-w-[140px] shrink-0"
                  >
                    {bloco.logo && (
                      /* `h-6 w-auto`: a altura manda e a largura sai do aspecto
                         do arquivo, como no gabarito. Por isso `<img>` e não
                         `next/image`, que fixaria a caixa pelas dimensões
                         declaradas. */
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={bloco.logo.url}
                        alt={bloco.logo.alt}
                        className="h-6 mb-2 pointer-events-none object-contain brightness-110"
                      />
                    )}
                    {p.topText && (
                      <div className="text-[9px] font-bold text-white/50 mb-0.5 uppercase tracking-wider">
                        {p.topText}
                      </div>
                    )}
                    {/* `whitespace-pre-line`: no gabarito o título do prêmio tem
                        quebra de linha embutida ("Partner of the Year\nService"). */}
                    <div className="text-xs font-semibold text-white leading-tight text-center whitespace-pre-line">
                      {p.title}
                    </div>
                    {p.highlight && <div className="mt-2 text-primary text-xs font-bold">{p.highlight}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {bloco.cta && (
            <div className="relative z-10">
              <Link
                href={bloco.cta.href}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/20"
              >
                {bloco.cta.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
