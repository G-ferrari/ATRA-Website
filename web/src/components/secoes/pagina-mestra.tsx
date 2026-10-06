import { RenderBlocks } from '@/components/blocks/render-blocks'
import type { VagaAberta } from '@/lib/atrair'
import type { Locale } from '@/lib/locales'
import type { PaginaMestraResolvida } from '@/lib/paginas'
import { cn } from '@/lib/utils'

/**
 * O corpo de toda rota de página-mestra (D-55): a `<main>` da seção com os
 * blocos dentro. Cada rota mantém as classes que tinha (fundo, respiro de
 * baixo); o respiro de cima sob o cabeçalho fixo depende do que abre a página
 * — o carrossel de destaques e as listas abertas trazem o deles, e somar o da
 * `<main>` empurraria o conteúdo 144px para baixo. Ver `marcarAbertura`.
 */
export function PaginaMestra({
  pagina,
  locale,
  className,
  vagasDoAtrair,
}: {
  pagina: PaginaMestraResolvida
  locale: Locale
  className: string
  vagasDoAtrair?: VagaAberta[] | null
}) {
  return (
    <main className={cn(!pagina.topoProprio && 'pt-24 md:pt-36', className)}>
      <RenderBlocks blocos={pagina.blocos} locale={locale} vagasDoAtrair={vagasDoAtrair} />
    </main>
  )
}
