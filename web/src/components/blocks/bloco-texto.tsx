import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { RichText } from '@/components/content/rich-text'
import { BORDAS, ESPACOS } from '@/components/blocks/bordas'
import { cn } from '@/lib/utils'
import type { BlocoRichTextSection } from '@/types/content'

/* Texto com imagem ao lado — porte de `legacy/src/pages/About.tsx:291` (o
 * cabeçalho dentro da coluna) e de `Careers.tsx:579` (o cabeçalho centralizado
 * acima das duas colunas, com a caixa de status do trainee). */
export function BlocoTexto({ bloco }: { bloco: BlocoRichTextSection }) {
  const temImagem = bloco.imagePosition !== 'none' && bloco.image !== null
  const centrado = bloco.headerLayout === 'centered'

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        ESPACOS[bloco.espaco],
        'relative overflow-hidden scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {centrado && (bloco.eyebrow || bloco.title || bloco.description) && (
          <div className="text-center mb-16">
            {bloco.eyebrow && (
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
                {bloco.eyebrow}
              </span>
            )}
            {bloco.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-4">
                {bloco.title}
              </h2>
            )}
            {bloco.description && (
              <p className="text-text-muted text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light">
                {bloco.description}
              </p>
            )}
          </div>
        )}

        <div
          className={cn(
            'grid items-center',
            /* ⚠️ O respiro entre as colunas difere: /sobre usa `gap-12`
               (`About.tsx:293`) e o trainee usa `gap-10` (`Careers.tsx:591`).
               O `mb-16` também é só do trainee — vem de a seção ter uma faixa
               abaixo no legado. */
            centrado ? 'gap-10 mb-16' : 'gap-12',
            temImagem && 'lg:grid-cols-2',
          )}
        >
          <div
            className={cn(
              centrado && 'space-y-4',
              temImagem && bloco.imagePosition === 'left' && 'lg:order-2',
            )}
          >
            {centrado ? (
              bloco.subtitle && (
                <h3 className="text-xl sm:text-2xl font-bold text-text-main leading-tight">{bloco.subtitle}</h3>
              )
            ) : (
              <>
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
              </>
            )}

            {bloco.body ? (
              <div className="space-y-4 text-xs sm:text-sm text-text-muted font-light leading-relaxed">
                {/* String vazia, não `undefined`: `undefined` aciona o valor
                    padrão do parâmetro e a tipografia do case voltaria a vazar. */}
                <RichText data={bloco.body} className="space-y-4" classeDoParagrafo="" />
              </div>
            ) : null}

            {bloco.callout?.text && (
              <div className="p-4 rounded-[6px] bg-surface-1  text-xs text-text-muted font-light">
                {bloco.callout.label && (
                  <strong className="text-primary font-semibold block mb-1">{bloco.callout.label}</strong>
                )}
                {bloco.callout.text}
              </div>
            )}

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
            /* A moldura difere: /sobre é `aspect-[4/3]` com `shadow-xl`
               (`About.tsx:325`); o trainee é `aspect-[16/10]` com `shadow-lg`
               (`Careers.tsx:604`), e sem o `div` de posicionamento em volta. */
            <div className={cn('relative', bloco.imagePosition === 'left' && 'lg:order-1')}>
              <div
                className={cn(
                  'rounded-[6px] overflow-hidden  relative',
                  centrado ? 'aspect-[16/10] shadow-lg' : 'aspect-[4/3] shadow-xl',
                )}
              >
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
