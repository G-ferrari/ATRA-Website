import { Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { MetricChip, StatusBadge, TechCornerBraces } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoPageHero } from '@/types/content'

import { ContadorAnimado } from './contador-animado'
import { SeloPrazo } from './selo-prazo'
import { TextoDestacado } from './texto-destacado'

/* CTA com href absoluto (http/https) é link externo — ex.: o WhatsApp do diretor
   na RC18. Abre em nova aba; `rel` fecha o vazamento de opener/referrer. */
const ehExterno = (href: string) => /^https?:\/\//i.test(href)

/* Classe literal por cor: o Tailwind não enxerga `text-${cor}` no build. */
const COR_DA_METRICA = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  /* emerald-400 é claro demais sobre o cartão claro do tema claro; escurece nele. */
  emerald: 'text-emerald-600 dark:text-emerald-400',
} as const

/* Envolve os filhos numa `div` só quando `quando` é verdadeiro; senão os devolve
 * como estão, sem caixa nenhuma — o herói sem painel de prazo sai com o mesmo
 * DOM de antes. Fica fora do componente porque a regra de lint proíbe criar
 * componente dentro de outro. */
function Caixa({ quando, className, children }: { quando: boolean; className: string; children: ReactNode }) {
  return quando ? <div className={className}>{children}</div> : <>{children}</>
}

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
  /* Prazo em destaque sem mídia ao lado (a RC18): o selo vai para a coluna da
     direita a partir de `lg`, grande, ao lado da descrição e dos botões — antes a
     metade direita do herói ficava vazia. A ordem do DOM é a de sempre
     (descrição, selo, botões) e é ela que vale abaixo de `lg`: no celular nada
     muda. Quem leva o selo para o lado é a posição na grade. */
  const painelDePrazo = Boolean(bloco.prazoDestaque) && !centro && bloco.mediaMode === 'none'

  return (
    <section
      id={bloco.anchor ?? undefined}
      className="relative pt-6 pb-12 overflow-hidden bg-surface-1 px-3 sm:px-6 scroll-mt-32"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={cn(
            /* ⚠️ Bloco temático (D-31): claro no tema claro, grafite no escuro. O
               gradiente e o texto branco ficam **só** no `dark:`; no claro é
               cartão claro (`bg-surface-2`) com texto escuro (Regra do Par). */
            'rounded-[6px] bg-surface-2 dark:bg-linear-to-br dark:from-[#12151c] dark:via-[#1a2130] dark:to-[#0e1015] text-slate-900 dark:text-white p-6 sm:p-10 md:p-14 shadow-xl dark:shadow-2xl relative overflow-hidden vort-dot-grid',
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
                  {/* Com prazo em destaque, o selo abaixo assume a data — o chip
                      pequeno sairia redundante. */}
                  {bloco.chip && !bloco.prazoDestaque && (
                    <MetricChip label={bloco.chip} variant="neutral" size="sm" />
                  )}
                </div>
              )}

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display mb-4 tracking-tight leading-tight">
                <TextoDestacado texto={bloco.title} destaque={bloco.highlight} />
              </h1>

              {bloco.subtitle && (
                <p className="text-sm md:text-lg font-medium text-slate-700 dark:text-white/90 mb-3">{bloco.subtitle}</p>
              )}

              <Caixa quando={painelDePrazo} className="lg:grid lg:grid-cols-12 lg:gap-x-12">
              <Caixa quando={painelDePrazo} className="lg:col-span-7">
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
                      ? 'text-xs sm:text-sm text-slate-600 dark:text-white/70 font-light max-w-xl mx-auto mb-8'
                      : cn(
                          'text-xs sm:text-sm md:text-base text-slate-600 dark:text-white/70 font-light leading-relaxed mb-6',
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
                    <div key={m.label} className="p-3 rounded-[6px] bg-slate-100 dark:bg-white/5  text-center">
                      <div className={cn('text-lg sm:text-xl font-bold', COR_DA_METRICA[m.color])}>
                        <ContadorAnimado ate={m.value} sufixo={m.suffix} />
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-white/60 font-medium mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}

              </Caixa>

              {/* Prazo em destaque logo acima dos botões (pedido do dono): fecha o
                  discurso do herói com a urgência antes da ação. */}
              {bloco.prazoDestaque && (
                <div
                  className={cn(
                    'mb-5',
                    centro && 'text-center',
                    painelDePrazo && 'lg:mb-0 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 lg:self-center',
                  )}
                >
                  <SeloPrazo prazo={bloco.prazoDestaque} grande={painelDePrazo} />
                </div>
              )}

              <Caixa quando={painelDePrazo} className="lg:col-span-7 lg:col-start-1 lg:row-start-2">
              {bloco.ctas.length > 0 && (
                <div className={cn('flex flex-wrap gap-3', centro && 'justify-center')}>
                  {bloco.ctas.map((cta, i) => (
                    <Link
                      key={cta.href}
                      href={cta.href}
                      target={ehExterno(cta.href) ? '_blank' : undefined}
                      rel={ehExterno(cta.href) ? 'noopener noreferrer' : undefined}
                      className={cn(
                        /* ⚠️ Alinhamento: na variante de solução o primário (laranja)
                           é `px-6 py-3 inline-flex` e o secundário vinha `px-5 py-2.5`
                           inline — saía mais baixo e menor. Aqui o secundário de
                           solução casa a mesma caixa do primário. As demais variantes
                           (heróis sob gate) ficam intactas. */
                        i === 0
                          ? solucao
                            ? 'inline-flex items-center justify-center bg-secondary hover:bg-orange-600 text-white px-6 py-3 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-lg hover:-translate-y-0.5 cursor-pointer'
                            : 'px-5 py-2.5 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer shadow-md shadow-primary/20'
                          : solucao
                            ? 'inline-flex items-center justify-center bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 px-6 py-3 rounded-[6px] text-xs sm:text-sm font-semibold transition-all cursor-pointer'
                            : 'px-5 py-2.5 rounded-[6px] bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 text-xs font-semibold transition-all',
                      )}
                    >
                      {cta.label}
                    </Link>
                  ))}
                </div>
              )}
              </Caixa>
              </Caixa>
            </div>

            {bloco.mediaMode !== 'none' && bloco.images.length > 0 && (
              /* `hidden lg:block` é do legado (`About.tsx:204`): abaixo de lg a
                 coluna some e o texto ocupa a largura toda. */
              <div className="lg:col-span-5 relative hidden lg:block">
                {bloco.mediaMode === 'marquee' ? (
                  <div
                    className="w-full h-[400px] rounded-[6px] overflow-hidden relative bg-black/40  shadow-2xl"
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
                          className="relative w-full aspect-[16/10] rounded-[6px] overflow-hidden shrink-0 shadow-sm "
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
                  <div className="w-full aspect-[4/3] rounded-[6px] overflow-hidden relative  shadow-2xl">
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
