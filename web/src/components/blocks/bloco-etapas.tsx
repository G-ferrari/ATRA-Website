import { BORDAS, ESPACOS } from '@/components/blocks/bordas'
import { cn } from '@/lib/utils'
import type { BlocoProcessSteps } from '@/types/content'

/* Etapas de um processo — porte de `legacy/src/pages/Careers.tsx:368`.
 *
 * A numeração sai da ordem do array, não de um campo: número digitado à mão
 * sai de sincronia na primeira vez que alguém reordena as etapas. */
export function BlocoEtapas({ bloco }: { bloco: BlocoProcessSteps }) {
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
        {(bloco.eyebrow || bloco.title || bloco.description) && (
          <div className={cn('text-center mb-16', bloco.layout === 'timeline' && 'mb-10 lg:mb-16')}>
            {bloco.eyebrow && (
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
                {bloco.eyebrow}
              </span>
            )}
            {/* `mb-4`, não `mb-3`: é o valor de `Careers.tsx:366`, a única
                seção do site que usa este bloco. */}
            {bloco.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-4">
                {bloco.title}
              </h2>
            )}
            {bloco.description && (
              <p
                className={cn(
                  'text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed',
                  /* Subtítulo em texto de apoio, não azul: o azul fica para títulos
                     e destaques, não para parágrafos inteiros (menos acento azul na
                     página). Vale para os dois layouts. */
                  'text-text-muted font-light',
                )}
              >
                {bloco.description}
              </p>
            )}
          </div>
        )}

        {bloco.layout === 'timeline' ? (
          /* Linha do tempo horizontal (layout da jornada da landing): círculos
             numerados sobre uma linha, com título + descrição abaixo. A linha fica
             atrás e os círculos opacos a cobrem entre um e outro. Empilha no mobile;
             `flex-1` adapta a qualquer número de etapas. */
          /* Abaixo de `lg` a linha fica de pé: círculo à esquerda, texto ao lado, e
             a linha desce ligando os círculos. Era a mesma coluna centralizada do
             desktop, com o círculo grande em cima de cada etapa — as duas linhas do
             tempo da RC18 somavam quase 1.700px no celular. O texto vai numa caixa
             que vira `contents` a partir de `lg`, e lá o DOM se comporta como antes. */
          <div className="relative">
            <div className="hidden lg:block absolute top-7 left-0 right-0 h-0.5 bg-primary/20" aria-hidden />
            <div className="lg:hidden absolute top-5 bottom-5 left-5 w-0.5 -translate-x-1/2 bg-primary/20" aria-hidden />
            <div className="flex flex-col lg:flex-row lg:items-start gap-y-6 lg:gap-y-10">
              {bloco.steps.map((etapa, i) => (
                <div
                  key={etapa.title}
                  className="group relative lg:flex-1 flex flex-row items-start gap-4 text-left lg:flex-col lg:items-center lg:gap-0 lg:text-center lg:px-3"
                >
                  <div className="relative z-10 shrink-0 flex h-10 w-10 text-sm lg:mb-5 lg:h-14 lg:w-14 lg:text-base items-center justify-center rounded-full bg-primary font-bold text-white shadow-md shadow-primary/20 transition duration-200 group-hover:shadow-lg group-hover:shadow-primary/30 motion-safe:group-hover:scale-110">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 pt-1.5 lg:contents">
                    <h3 className="text-base lg:text-lg font-bold text-text-main mb-1 lg:mb-2 transition-colors group-hover:text-primary">
                      {etapa.title}
                    </h3>
                    <p className="text-xs text-text-muted font-light leading-relaxed lg:max-w-[240px]">
                      {etapa.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bloco.steps.map((etapa, i) => (
              <div
                key={etapa.title}
                className="bg-surface-2 rounded-[6px] p-6 shadow-sm flex flex-col justify-between group transition duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5"
              >
                <div>
                  <div className="w-10 h-10 rounded-[6px] bg-primary/10 text-primary font-bold text-sm flex items-center justify-center mb-4 transition-colors group-hover:bg-primary group-hover:text-white">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-text-main mb-2">{etapa.title}</h3>
                  <p className="text-xs text-text-muted font-light leading-relaxed">{etapa.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
