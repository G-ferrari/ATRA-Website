import { ListaDeArtigos } from '@/app/(frontend)/[locale]/blog/lista-de-artigos'
import type { Locale } from '@/lib/locales'
import { POR_PAGINA } from '@/lib/paginacao'
import { cn } from '@/lib/utils'
import type { CabecalhoDaSecao, PostCard } from '@/types/content'

import { cabecalhoAberto, RESPIRO_DE_ABERTURA } from './cabecalho-aberto'
import { TEXTOS_DAS_SECOES } from './textos'

/* Barra de filtro: lista fixa no legado (`Blog.tsx:62`), não derivada das tags.
 * É o vocabulário do blog e não coincide com as tags dos cards — "Managed IT" e
 * "Retail" aparecem nos posts e não na barra. Vira campo do CMS quando alguém
 * quiser mudar sem deploy. */
const CATEGORIAS = ['Business', 'IA', 'Cloud', 'Analytics', 'Cybersecurity', 'Strategy']

/* /blog e /blog/pagina/N (D-47) dentro da página-mestra: 12 artigos por
 * endereço, com busca e filtro na ilha cliente da rota. Da segunda página em
 * diante não há destaque, e a lista abre a página. */
export function ListaDoBlog({
  cabecalho,
  posts,
  pagina,
  totalDePaginas,
  locale,
  abertura,
  anchor,
}: {
  cabecalho: CabecalhoDaSecao
  posts: PostCard[]
  pagina: number
  totalDePaginas: number
  locale: Locale
  abertura: boolean
  anchor: string | null
}) {
  const t = TEXTOS_DAS_SECOES[locale].blog
  return (
    <section
      id={anchor ?? undefined}
      className={cn(
        'pb-20 md:pb-24 bg-surface-1 dark:bg-[#0e1015] scroll-mt-32',
        abertura ? RESPIRO_DE_ABERTURA : 'pt-20 md:pt-24',
      )}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <ListaDeArtigos
          posts={posts}
          pagina={pagina}
          porPagina={POR_PAGINA}
          categorias={CATEGORIAS}
          locale={locale}
          cabecalho={cabecalhoAberto({
            cabecalho,
            abertura,
            chave: 'cabecalho-blog',
            classeDoTitulo: 'text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main leading-tight',
            depoisDoTitulo: pagina > 1 && (
              <p className="mt-2 text-xs sm:text-sm text-text-muted font-light">{t.paginaDe(pagina, totalDePaginas)}</p>
            ),
          })}
        />
      </div>
    </section>
  )
}
