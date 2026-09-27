import { BORDAS, ESPACOS } from '@/components/blocks/bordas'
import { cn } from '@/lib/utils'
import type { BlocoImageGrid } from '@/types/content'

/* Grade de imagens soltas — selos, certificações, prêmios (27/09).
 *
 * Cabeçalho igual ao da grade de cards (`bloco-grade-de-cards.tsx`), para a
 * seção não destoar das vizinhas na página de solução. As imagens quebram em
 * linhas centralizadas em vez de rolar de lado como a faixa de selos: dez selos
 * numa linha só escondem metade no celular.
 *
 * A caixa branca é a da faixa de selos (`bloco-selos.tsx`): selo em JPEG de
 * fundo branco vira um quadrado solto no tema escuro. */
export function BlocoGradeDeImagens({ bloco }: { bloco: BlocoImageGrid }) {
  if (bloco.images.length === 0) return null

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        ESPACOS[bloco.espaco],
        'scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {(bloco.eyebrow || bloco.title || bloco.description) && (
          <div className="text-center mb-12 max-w-3xl mx-auto">
            {bloco.eyebrow && (
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
                {bloco.eyebrow}
              </span>
            )}
            {bloco.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-3">
                {bloco.title}
              </h2>
            )}
            {bloco.description && <p className="text-text-muted font-light">{bloco.description}</p>}
          </div>
        )}

        <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {bloco.images.map(({ image, caption }) => (
            <li key={image.url} className="flex flex-col items-center gap-2 w-[128px] sm:w-[148px]">
              <div
                className={cn(
                  'flex items-center justify-center w-full aspect-square rounded-[6px]',
                  bloco.boxed && 'bg-white p-3 shadow-sm',
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- a caixa é
                    fixa e a imagem se ajusta por `max-h`/`max-w`, como na faixa
                    de selos; o next/image fixaria a caixa pelas dimensões. */}
                <img
                  src={image.url}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              {caption && <span className="text-xs text-text-muted text-center">{caption}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
