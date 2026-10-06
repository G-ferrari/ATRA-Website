import { RascunhoIncompleto } from '@/components/content/rascunho-incompleto'
import { ListaDeCases as IlhaDeCases } from '@/app/(frontend)/[locale]/cases-de-sucesso/lista-de-cases'
import type { Locale } from '@/lib/locales'
import { cn } from '@/lib/utils'
import type { CabecalhoDaSecao, CaseCard, Topic } from '@/types/content'

import { cabecalhoAberto, RESPIRO_DE_ABERTURA } from './cabecalho-aberto'

/* /cases-de-sucesso dentro da página-mestra — a fatia vertical de referência.
 * O filtro por assunto e a busca são a ilha cliente da rota; o cabeçalho entra
 * nela já renderizado, porque divide a linha com a busca. */
export function ListaDeCases({
  cabecalho,
  cases,
  incompletos,
  topicos,
  locale,
  abertura,
  anchor,
}: {
  cabecalho: CabecalhoDaSecao
  cases: CaseCard[]
  incompletos: string[]
  topicos: Topic[]
  locale: Locale
  abertura: boolean
  anchor: string | null
}) {
  return (
    <section
      id={anchor ?? undefined}
      className={cn('scroll-mt-32', abertura ? `${RESPIRO_DE_ABERTURA} pb-16 md:pb-24` : 'py-16 md:py-24')}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Só no modo rascunho: fora dele a lista só traz publicados. */}
        {incompletos.length > 0 && (
          <div className="mb-8">
            <RascunhoIncompleto campos={incompletos} />
          </div>
        )}

        <IlhaDeCases
          cases={cases}
          topics={topicos}
          locale={locale}
          cabecalho={cabecalhoAberto({
            cabecalho,
            abertura,
            chave: 'cabecalho-cases',
            classeDoTitulo: 'text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main leading-tight',
          })}
        />
      </div>
    </section>
  )
}
