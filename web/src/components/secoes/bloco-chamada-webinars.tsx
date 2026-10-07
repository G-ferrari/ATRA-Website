import { Play, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { TextoDestacado } from '@/components/blocks/texto-destacado'
import type { Locale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'
import type { BlocoWebinarTeaser } from '@/types/content'

/**
 * "Chamada para os webinars" (feature paginas-mestras, D-55) — a faixa que
 * fechava o blog (`Blog.tsx:283`), agora com os textos no admin e em qualquer
 * página. Os dois links levam a /webinars; a capa é a do primeiro webinar da
 * página de webinars (a ordem do admin), injetada pela página. No legado era um
 * hotlink fixo do Unsplash.
 */
export function BlocoChamadaWebinars({ bloco, locale }: { bloco: BlocoWebinarTeaser; locale: Locale }) {
  const destino = hrefDe('webinars', locale)
  return (
    <section
      id={bloco.anchor ?? undefined}
      className="py-20 md:py-24 bg-surface-2 dark:bg-[#13161c] border-t border-b border-slate-200 dark:border-white/10 text-text-main dark:text-white overflow-hidden relative scroll-mt-32"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-1/2 -left-[10%] -translate-y-1/2 w-[60vw] h-[60vw] md:w-[35vw] md:h-[35vw] opacity-40 dark:opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, rgba(60, 152, 250, 0.4) 0%, rgba(60, 152, 250, 0) 70%)' }}
        />
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] md:w-[35vw] md:h-[35vw] opacity-30 dark:opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, rgba(253, 186, 116, 0.35) 0%, rgba(253, 186, 116, 0) 70%)' }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <div className="flex-1">
            {bloco.eyebrow && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest mb-6">
                <Sparkles size={13} aria-hidden />
                <span>{bloco.eyebrow}</span>
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4 md:mb-6 leading-tight text-text-main dark:text-white">
              <TextoDestacado texto={bloco.title} destaque={bloco.highlight} />
            </h2>
            {bloco.description && (
              <p className="text-sm md:text-base text-text-muted dark:text-gray-300 mb-8 max-w-xl font-light leading-relaxed">
                {bloco.description}
              </p>
            )}
            {bloco.actionLabel && (
              <Link
                href={destino}
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white px-7 py-3.5 rounded-[6px] font-bold text-xs sm:text-sm transition-all shadow-md shadow-primary/25 cursor-pointer active:scale-95"
              >
                <Play size={16} fill="currentColor" aria-hidden />
                <span>{bloco.actionLabel}</span>
              </Link>
            )}
          </div>

          <div className="flex-1 w-full max-w-2xl">
            {/* Nome acessível próprio: sem capa (nenhum webinar publicado) o link
                só teria o ícone, que é decorativo. */}
            <Link
              href={destino}
              aria-label={bloco.actionLabel ?? bloco.title}
              className="block aspect-video rounded-[6px] overflow-hidden relative group shadow-2xl  cursor-pointer bg-surface-1 dark:bg-[#0e1015]"
            >
              {bloco.capa && (
                <Image
                  src={bloco.capa.url}
                  alt={bloco.capa.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all flex items-center justify-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-all shadow-xl shadow-primary/30">
                  <Play className="fill-white ml-0.5" size={24} aria-hidden />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
