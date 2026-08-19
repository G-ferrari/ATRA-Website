import { cn } from '@/lib/utils'
import type { BlocoPartnerShowcase } from '@/types/content'

/* Vitrine de parceiros — porte de `legacy/src/pages/About.tsx:376`.
 *
 * ⚠️ Não confundir com `sealsBanner` (`App.tsx:1217`), que é outra coisa: um
 * card bento com troféu, estrelas e os selos GPTW/LIPT. Construí este com aquele
 * nome por engano em MIG-048; o bloco de selos entra na fase da home. */
export function BlocoParceiros({ bloco }: { bloco: BlocoPartnerShowcase }) {
  if (bloco.partners.length === 0) return null

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-16 overflow-hidden scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {bloco.title && (
          <div className="text-center mb-10">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 font-display">
              {bloco.title}
            </h3>
            <div className="w-12 h-0.5 bg-primary/40 mx-auto rounded-full" />
          </div>
        )}

        <div
          className={cn(
            'flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 transition-all duration-700',
            bloco.grayscale && 'grayscale hover:grayscale-0',
          )}
        >
          {bloco.partners.map((p) =>
            p.logo ? (
              /* eslint-disable-next-line @next/next/no-img-element -- a largura
                 sai do aspecto do arquivo (`w-auto`), e o `next/image` a fixaria
                 pelos width/height declarados. O legado usa <img> simples aqui
                 (`About.tsx:384`); manter igual é o que faz os dois lados
                 medirem o mesmo. */
              <img
                key={p.slug}
                src={p.logo.url}
                alt={p.name}
                loading="lazy"
                decoding="async"
                className="h-10 md:h-12 w-auto object-contain"
              />
            ) : null,
          )}
        </div>
      </div>
    </section>
  )
}
