import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { BORDAS, ESPACOS } from '@/components/blocks/bordas'
import { LogoComTema } from '@/components/ui'
import type { Locale } from '@/lib/locales'
import { cn } from '@/lib/utils'
import type { BlocoPartnerSplit } from '@/types/content'

import { iconePorNome } from './icones'

/* As três seções de duas colunas da página de parceiro — porte de
 * `legacy/src/components/PartnerPageBase.tsx:166`, `:213` e `:250`.
 *
 * As três têm a **mesma** coluna esquerda (linha de apoio, título, parágrafos,
 * botão) e diferem só no que vai à direita: a imagem com etiqueta, a lista de
 * conferência, ou a grade de fichas de especialização. É por isso que são um
 * bloco com `rightColumn`, e não três blocos. */

/* Porte de `getSpecIcon` (`PartnerPageBase.tsx:20`): a palavra no nome decide o
 * glifo. ⚠️ A **ordem** é parte da regra — "Data Analytics" casa com `data`
 * antes de casar com qualquer outra, e "Cloud Migration" casa com `cloud` antes
 * de `migration`, que nem é testado. Reordenar troca ícone. */
const REGRAS: [string[], string][] = [
  [['data', 'analytics'], 'chart'],
  [['cloud'], 'cloud'],
  [['infrastructure'], 'server'],
  [['development', 'app'], 'code'],
  [['workplace', 'user'], 'users'],
  [['managed', 'support'], 'headset'],
  [['security'], 'shield'],
]

function iconeDe(nome: string): string {
  const n = nome.toLowerCase()
  return REGRAS.find(([palavras]) => palavras.some((p) => n.includes(p)))?.[1] ?? 'award'
}

const ESPECIALIZACAO = { pt: 'Especialização', en: 'Specialisation' } as const

export function BlocoParceiroSecao({ bloco, locale }: { bloco: BlocoPartnerSplit; locale: Locale }) {
  const especializacoes = bloco.rightColumn === 'specGrid'

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        ESPACOS[bloco.espaco],
        'scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2 relative overflow-hidden text-text-main' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div>
            {bloco.eyebrow && (
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
                {bloco.eyebrow}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-4 leading-tight">
              {bloco.title}
            </h2>

            {/* ⚠️ `whitespace-pre-line`: o gabarito preserva as quebras que o
                texto traz (`PartnerPageBase.tsx:181`). E o respiro do **último**
                parágrafo é maior — `mb-6` contra `mb-4` —, o que só aparece
                quando há mais de um. */}
            {bloco.body.map((p, i) => (
              <p
                key={p}
                className={cn(
                  'text-xs sm:text-sm md:text-base text-text-muted leading-relaxed font-light whitespace-pre-line',
                  i === bloco.body.length - 1 ? 'mb-6' : 'mb-4',
                )}
              >
                {p}
              </p>
            ))}

            {especializacoes && bloco.items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                {bloco.items.map((nome) => {
                  const Icone = iconePorNome(iconeDe(nome))
                  return (
                    <div
                      key={nome}
                      className="group flex items-center gap-3 p-3 bg-surface-2  rounded-[6px] shadow-xs hover:border-primary/40 transition-all duration-300"
                    >
                      <div className="w-8 h-8 rounded-[6px] bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                        <Icone size={16} aria-hidden />
                      </div>
                      <span className="font-semibold text-text-main text-xs group-hover:text-primary transition-colors leading-tight">
                        {nome}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {bloco.cta && (
              <Link
                href={bloco.cta.href}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/20"
              >
                {bloco.cta.label}
              </Link>
            )}

            {bloco.linkCta && (
              <Link
                href={bloco.linkCta.href}
                className="inline-flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm hover:underline group"
              >
                <span>{bloco.linkCta.label}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden />
              </Link>
            )}
          </div>

          {bloco.rightColumn === 'checklist' ? (
            <div className="space-y-3">
              {bloco.items.map((texto) => (
                <div
                  key={texto}
                  className="flex items-start gap-3 bg-surface-1  p-4 rounded-[6px] shadow-xs"
                >
                  <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={16} aria-hidden />
                  <p className="text-text-main text-xs sm:text-sm font-light leading-relaxed">{texto}</p>
                </div>
              ))}
            </div>
          ) : especializacoes ? (
            <div className="relative">
              <div className="bg-surface-2  p-6 rounded-[6px] shadow-sm flex items-center justify-center min-h-[320px]">
                <div className="grid grid-cols-2 gap-3 relative w-full max-w-sm mx-auto">
                  {bloco.items.map((nome) => (
                    <div
                      key={nome}
                      className="bg-surface-1  p-4 rounded-[6px] aspect-square flex flex-col items-center justify-center text-center shadow-xs hover:border-primary/40 transition-all"
                    >
                      {bloco.logo && (
                        <LogoComTema logo={bloco.logo} logoDark={bloco.logoDark} className="h-5 mb-2 object-contain" />
                      )}
                      {/* ⚠️ No legado este rótulo é literal em português
                          (`PartnerPageBase.tsx:299`), mesmo na versão inglesa da
                          página. Traduzido aqui porque é chrome de componente,
                          não texto de marketing — e não muda um pixel em PT, que
                          é o que o aceite visual compara. */}
                      <div className="text-[9px] font-bold text-primary uppercase tracking-wider mb-1">
                        {ESPECIALIZACAO[locale]}
                      </div>
                      <div className="text-xs font-semibold text-text-main leading-tight line-clamp-2">{nome}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            bloco.image && (
              <div className="relative">
                <div className="relative rounded-[6px] shadow-xl w-full h-[360px] md:h-[420px]  overflow-hidden">
                  <Image
                    src={bloco.image.url}
                    alt={bloco.image.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {bloco.imageLabel && (
                  <div className="absolute bottom-4 left-4 bg-surface-1/95 backdrop-blur-md p-3.5 rounded-[6px] shadow-xl flex items-center gap-3 ">
                    {bloco.logo && (
                      <LogoComTema
                        logo={bloco.logo}
                        logoDark={bloco.logoDark}
                        className="h-7 w-auto object-contain max-w-[120px]"
                      />
                    )}
                    <div className="text-xs font-bold text-text-main">{bloco.imageLabel}</div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
}
