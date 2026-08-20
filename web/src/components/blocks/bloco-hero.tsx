import { Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { MetricChip, StatusBadge, TechCornerBraces } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoPageHero } from '@/types/content'

import { ContadorAnimado } from './contador-animado'
import { TextoDestacado } from './texto-destacado'

/* Classe literal por cor: o Tailwind não enxerga `text-${cor}` no build. */
const COR_DA_METRICA = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  emerald: 'text-emerald-400',
} as const

/* Abertura de página — porte de `legacy/src/pages/About.tsx:150`, que é a mesma
 * caixa usada em `Glossary.tsx:71` e `Careers.tsx:99`. */
export function BlocoHero({ bloco }: { bloco: BlocoPageHero }) {
  /* ⚠️ O respiro entre as colunas segue o estilo do botão, e isso é acoplamento
   * implícito assumido: no legado os três (botão laranja, descrição larga,
   * `lg:gap-12`) só aparecem juntos, na página de solução. O certo seria um
   * campo `variant` só, no lugar de `ctaVariant` + `descriptionWidth` — mas
   * trocar exige uma migração que **remove** coluna, e o gerador do Payload
   * trava num prompt interativo que não roda sem terminal. Fica para a próxima
   * mudança de schema neste bloco; ver debito-tecnico.md. */
  const solucao = bloco.ctaVariant === 'secondary'
  /* /carreiras (`Careers.tsx:101`) centraliza a caixa inteira e troca a grade
     de 12 colunas por uma coluna só de `max-w-3xl`. */
  const centro = bloco.align === 'center'

  return (
    <section
      id={bloco.anchor ?? undefined}
      className="relative pt-6 pb-12 overflow-hidden bg-surface-1 px-3 sm:px-6 scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={cn(
            'rounded-[6px] bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015] border border-white/5 text-white p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden vort-dot-grid',
            centro && 'text-center',
          )}
        >
          <TechCornerBraces color="blue" position="top-left" size={16} />
          <TechCornerBraces color="orange" position="bottom-right" size={16} />

          <div
            className={cn(
              centro
                ? 'max-w-3xl mx-auto relative z-10'
                : 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10',
              !centro && solucao && 'lg:gap-12',
            )}
          >
            <div className={centro ? undefined : bloco.mediaMode === 'none' ? 'lg:col-span-12' : 'lg:col-span-7'}>
              {(bloco.badge || bloco.chip) && (
                <div className={cn('flex items-center gap-2 mb-4', centro && 'justify-center')}>
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

              {bloco.subtitle && (
                <p className="text-sm md:text-lg font-medium text-white/90 mb-3">{bloco.subtitle}</p>
              )}

              {bloco.description && (
                /* ⚠️ A variante centralizada não é a mesma classe com
                   `text-center` por cima. `Careers.tsx:129` não tem
                   `md:text-base` nem `leading-relaxed`, e fecha em `mb-8` — três
                   diferenças de altura, não de alinhamento. Por isso as duas
                   strings são inteiras, sem `cn()` mesclando: mesclar deixava a
                   entrelinha do gabarito de fora. */
                <p
                  className={
                    centro
                      ? 'text-xs sm:text-sm text-white/70 font-light max-w-xl mx-auto mb-8'
                      : cn(
                          'text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed mb-6',
                          bloco.descriptionWidth === 'wide' ? 'max-w-2xl' : 'max-w-xl',
                        )
                  }
                >
                  {bloco.description}
                </p>
              )}

              {bloco.metrics.length > 0 && (
                <div
                  className={cn(
                    'grid grid-cols-3 gap-3',
                    centro ? 'max-w-md mx-auto' : 'mb-6 max-w-lg',
                  )}
                >
                  {bloco.metrics.map((m) => (
                    <div key={m.label} className="p-3 rounded-[6px] bg-white/5 border border-white/10 text-center">
                      <div className={cn('text-lg sm:text-xl font-bold', COR_DA_METRICA[m.color])}>
                        <ContadorAnimado ate={m.value} sufixo={m.suffix} />
                      </div>
                      <div className="text-[10px] text-white/60 font-medium mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {bloco.ctas.length > 0 && (
                <div className={cn('flex flex-wrap gap-3', centro && 'justify-center')}>
                  {bloco.ctas.map((cta, i) => (
                    <Link
                      key={cta.href}
                      href={cta.href}
                      className={cn(
                        i > 0
                          ? 'px-5 py-2.5 rounded-[6px] bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-all'
                          : solucao
                            ? 'inline-flex items-center justify-center bg-secondary hover:bg-orange-600 text-white px-6 py-3 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-lg hover:-translate-y-0.5 cursor-pointer'
                            : 'px-5 py-2.5 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer shadow-md shadow-primary/20',
                      )}
                    >
                      {cta.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {bloco.mediaMode !== 'none' && bloco.images.length > 0 && (
              /* `hidden lg:block` é do legado (`About.tsx:204`): abaixo de lg a
                 coluna some e o texto ocupa a largura toda. */
              <div className="lg:col-span-5 relative hidden lg:block">
                {bloco.mediaMode === 'marquee' ? (
                  <div
                    className="w-full h-[400px] rounded-[6px] overflow-hidden relative bg-black/40 border border-white/10 shadow-2xl"
                    style={{
                      maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                      WebkitMaskImage:
                        'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                    }}
                  >
                    {/* A lista entra duplicada: é o que faz a rolagem emendar
                        sem salto, já que a animação vai de 0 a -50%. */}
                    <div className="absolute inset-x-0 w-full animate-marquee-vertical hover:[animation-play-state:paused] flex flex-col gap-3 py-3 px-3">
                      {[...bloco.images, ...bloco.images].map((img, i) => (
                        <div
                          key={`${img.url}-${i}`}
                          className="relative w-full aspect-[16/10] rounded-[6px] overflow-hidden shrink-0 shadow-sm border border-white/5"
                        >
                          <Image
                            src={img.url}
                            alt={img.alt}
                            fill
                            sizes="(min-width: 1024px) 33vw, 0px"
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full aspect-[4/3] rounded-[6px] overflow-hidden relative border border-white/10 shadow-2xl">
                    <Image
                      src={bloco.images[0].url}
                      alt={bloco.images[0].alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, 0px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
