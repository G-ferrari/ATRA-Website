import { BORDAS } from '@/components/blocks/bordas'
import { TechHorizontalLine, TechVerticalLine } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { BlocoLogoMarquee } from '@/types/content'

/* Faixa de logos de parceiro da home — porte de `legacy/src/App.tsx:1424`, que
 * renderiza o `LogoCloudSwap` de `components/ui/logo-clouds.tsx:192`.
 *
 * ⚠️ Não é o `partnerShowcase` de /sobre. Aquele é uma grade centrada de 4
 * logos com altura por marca; este são 9 fichas de largura fixa, com o nome
 * embaixo de cada logo, e quebra em 3 colunas no celular em vez de rolar.
 *
 * A "onda" — os logos subindo em cascata a cada 4s — não foi portada: é
 * animação de estado que o `congelado()` do legado já congela no aceite, e
 * portá-la exigiria um cliente para um efeito que ninguém vê na captura.
 * Registrado em debito-tecnico.md. */
export function BlocoFaixaDeLogos({ bloco }: { bloco: BlocoLogoMarquee }) {
  if (bloco.partners.length === 0) return null

  const fichas = bloco.partners.map((p) => (
    <div
      key={p.name}
      className="flex w-28 shrink-0 cursor-default flex-col items-center gap-2.5 sm:w-36 transition-opacity"
    >
      <span className="flex h-12 w-24 items-center justify-center sm:h-14 sm:w-30">
        {/* Caixa fixa, imagem por `object-contain`: os 9 logos têm proporções
            diferentes e o next/image fixaria a caixa pelo arquivo. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.logo.url}
          alt={p.logo.alt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain pointer-events-none opacity-90 hover:opacity-100 transition-opacity"
        />
      </span>
      <span className="select-none whitespace-nowrap text-[11px] font-medium tracking-wide text-text-muted sm:text-xs">
        {p.name}
      </span>
    </div>
  ))

  return (
    <section
      id={bloco.anchor ?? undefined}
      className={cn(
        'py-10 md:py-14 overflow-hidden shadow-inner relative scroll-mt-32',
        bloco.theme === 'surface-2' ? 'bg-surface-2' : 'bg-surface-1',
        BORDAS[bloco.borda],
      )}
    >
      {/* Linhas decorativas da seção, na configuração do gabarito
          (`App.tsx:1426`). Só a home as tem. */}
      <TechHorizontalLine color="blue" align="left" side="top" delay={0.2} />
      <TechVerticalLine color="orange" align="left" alignY="top" delay={0.3} />

      <section className="w-full bg-transparent px-4 py-4 sm:py-6">
        {bloco.title && (
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-text-main sm:text-3xl">{bloco.title}</h2>
          </div>
        )}

        <div className={cn('mx-auto max-w-5xl', bloco.title && 'mt-10 sm:mt-12')}>
          {/* Duas listas, não uma com classes responsivas: o gabarito monta a
              fileira (`sm:flex`) e a grade de 3 colunas (`sm:hidden`) como
              blocos separados, e cada uma tem `gap` próprio. */}
          <div className="hidden items-center justify-center gap-4 sm:flex sm:flex-wrap sm:gap-6 md:gap-8 lg:gap-10">
            {fichas}
          </div>
          <div className="grid grid-cols-3 place-items-center gap-y-6 sm:hidden">{fichas}</div>
        </div>
      </section>
    </section>
  )
}
