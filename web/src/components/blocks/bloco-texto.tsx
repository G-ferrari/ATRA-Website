import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { RichText } from '@/components/content/rich-text'
import { BORDAS } from '@/components/blocks/bordas'
import { cn } from '@/lib/utils'
import type { BlocoRichTextSection } from '@/types/content'

/* Texto com imagem ao lado — porte de `legacy/src/pages/About.tsx:291`. */
export function BlocoTexto({ bloco }: { bloco: BlocoRichTextSection }) {
  const temImagem = bloco.imagePosition !== 'none' && bloco.image !== null

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-16 md:py-20 relative overflow-hidden scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className={cn('grid gap-12 items-center', temImagem && 'lg:grid-cols-2')}>
          <div className={cn(temImagem && bloco.imagePosition === 'left' && 'lg:order-2')}>
            {bloco.eyebrow && (
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
                {bloco.eyebrow}
              </span>
            )}
            {bloco.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-6 leading-tight">
                {bloco.title}
              </h2>
            )}
            {bloco.body ? (
              <div className="space-y-4 text-xs sm:text-sm text-text-muted font-light leading-relaxed">
                {/* String vazia, não `undefined`: `undefined` aciona o valor
                    padrão do parâmetro e a tipografia do case voltaria a vazar. */}
                <RichText data={bloco.body} className="space-y-4" classeDoParagrafo="" />
              </div>
            ) : null}

            {bloco.ctas.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-4">
                {bloco.ctas.map((cta) => (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-[6px] text-xs font-semibold transition-all shadow-md shadow-primary/20 flex items-center gap-2 group"
                  >
                    <span>{cta.label}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {temImagem && bloco.image && (
            <div className={cn('relative', bloco.imagePosition === 'left' && 'lg:order-1')}>
              <div className="aspect-[4/3] rounded-[6px] overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 relative">
                <Image
                  src={bloco.image.url}
                  alt={bloco.image.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
