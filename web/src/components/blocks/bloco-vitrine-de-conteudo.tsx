import { ArrowRight, BookOpen } from 'lucide-react'
import Image from 'next/image'

import { NewsletterInline } from '@/components/forms/newsletter-inline'
import Link from 'next/link'

import { BORDAS } from '@/components/blocks/bordas'
import { TechHorizontalLine, TechVerticalLine } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoContentTeaser } from '@/types/content'

import { Icone } from './icones'

/* Vitrine de conteúdo da home — porte de `legacy/src/App.tsx:2170`.
 *
 * Três colunas: texto + dois cartões, dois cartões, e um destaque com a caixa
 * de inscrição embaixo.
 *
 * ⚠️ Os cartões pequenos e o destaque são **fixture do gabarito**: título
 * inventado, capa do picsum e `href="#"`. Ver a nota do campo em
 * `blocks/index.ts` e a linha em debito-tecnico.md. */

function Cartao({
  card,
  aspecto,
}: {
  card: BlocoContentTeaser['cards'][number]
  aspecto: string
}) {
  return (
    <Link
      href={card.href ?? '#'}
      className={cn('relative group overflow-hidden rounded-[6px] block shadow-xl', aspecto)}
    >
      {card.image && (
        <Image
          src={card.image.url}
          alt={card.image.alt}
          fill
          sizes="(min-width: 1024px) 30vw, 100vw"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-surface-1/95 via-surface-1/60 to-transparent p-5 flex flex-col justify-end">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Icone nome={card.icon} size={13} className="text-secondary" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">{card.category}</span>
        </div>
        <h3 className="text-sm sm:text-base font-medium leading-tight text-text-main group-hover:text-primary transition-colors">
          {card.title} <ArrowRight size={13} className="inline ml-1" aria-hidden />
        </h3>
      </div>
    </Link>
  )
}

export function BlocoVitrineDeConteudo({ bloco }: { bloco: BlocoContentTeaser }) {
  const primeira = bloco.cards.filter((c) => c.column === 'first')
  const segunda = bloco.cards.filter((c) => c.column === 'second')

  /* As colunas rolam na horizontal no celular e empilham a partir de `md` — daí
     o `-mx-4 px-4` que sangra até a borda da tela antes de voltar ao normal. */
  const trilho =
    'flex md:flex-col overflow-x-auto md:overflow-x-visible gap-4 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar'

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-16 md:py-24 text-text-subtle overflow-hidden relative scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      {/* Linhas decorativas da seção, na configuração do gabarito
          (`App.tsx:2180`). Só a home as tem. */}
      <TechHorizontalLine color="blue" align="left" side="top" delay={0.2} />
      <TechVerticalLine color="orange" align="left" alignY="bottom" delay={0.3} />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          <div className="flex flex-col gap-6">
            <div>
              {bloco.eyebrow && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-3">
                  <BookOpen size={13} aria-hidden /> {bloco.eyebrow}
                </div>
              )}
              <h2 className="text-xl sm:text-2xl font-display font-light leading-tight mb-4 text-text-main">
                {bloco.title}
              </h2>
              {bloco.description && (
                <p className="text-text-muted font-light text-xs sm:text-sm leading-relaxed">{bloco.description}</p>
              )}
            </div>

            <div className={trilho}>
              {primeira.map((c) => (
                <div key={c.title} className="min-w-[240px] md:min-w-0 w-full shrink-0">
                  <Cartao card={c} aspecto="aspect-[4/3]" />
                </div>
              ))}
            </div>
          </div>

          <div className={cn(trilho, 'items-start')}>
            {segunda.map((c) => (
              <div key={c.title} className="min-w-[240px] md:min-w-0 w-full shrink-0">
                <Cartao card={c} aspecto="aspect-square" />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            {bloco.featured && (
              <div className="relative group overflow-hidden rounded-[6px] min-h-[280px] md:min-h-[340px] shadow-xl">
                {bloco.featured.image && (
                  <Image
                    src={bloco.featured.image.url}
                    alt={bloco.featured.image.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-surface-1/95 via-surface-1/50 to-transparent p-6 flex flex-col justify-between">
                  <div>
                    {bloco.featured.category && (
                      <span className="text-[10px] font-bold tracking-widest uppercase mb-1.5 block text-secondary">
                        {bloco.featured.category}
                      </span>
                    )}
                    <h3 className="text-base font-display leading-snug text-text-main">{bloco.featured.title}</h3>
                  </div>
                  {bloco.featured.ctaLabel && (
                    <Link
                      href={bloco.featured.href ?? '#'}
                      className="bg-secondary hover:bg-orange-600 text-white px-5 py-2.5 rounded-[6px] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 w-fit transition-colors shadow-md cursor-pointer active:scale-95"
                    >
                      {bloco.featured.ctaLabel} <ArrowRight size={14} aria-hidden />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {bloco.newsletter && (
              <div className="bg-surface-2 p-6 rounded-[6px] shadow-xl">
                <h4 className="text-base md:text-lg font-light font-display mb-4 text-text-main">
                  {bloco.newsletter.title}
                </h4>
                {/* MIG-103: viva, com dupla confirmação. O render inicial
                    reproduz o estático classe por classe — ver a nota na ilha. */}
                <NewsletterInline placeholder={bloco.newsletter.placeholder} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
