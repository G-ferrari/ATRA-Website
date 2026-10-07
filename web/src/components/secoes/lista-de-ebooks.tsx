import { Download } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { EntradaAnimada } from '@/components/ui'
import type { Locale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { CabecalhoDaSecao, Resource } from '@/types/content'

import { cabecalhoAberto, RESPIRO_DE_ABERTURA } from './cabecalho-aberto'
import { TEXTOS_DAS_SECOES } from './textos'

/* /ebooks (MIG-041) — porte de `legacy/src/pages/Ebooks.tsx`, dentro da
 * página-mestra. A grade nasce sem cabeçalho, como no legado; se a editora
 * escrever título ou texto, ele aparece acima dela. */
export function ListaDeEbooks({
  cabecalho,
  materiais,
  locale,
  abertura,
  anchor,
}: {
  cabecalho: CabecalhoDaSecao
  materiais: Resource[]
  locale: Locale
  abertura: boolean
  anchor: string | null
}) {
  const t = TEXTOS_DAS_SECOES[locale].ebooks
  return (
    <section
      id={anchor ?? undefined}
      className={cn('scroll-mt-32', abertura ? `${RESPIRO_DE_ABERTURA} pb-20 md:pb-24` : 'py-20 md:py-24')}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {cabecalhoAberto({
          cabecalho,
          abertura,
          chave: 'cabecalho-ebooks',
          classeDaCaixa: 'mb-12 md:mb-16 max-w-3xl',
          classeDoTitulo: 'text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main leading-tight',
        })}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {materiais.map((r, i) => (
            <EntradaAnimada
              key={r.slug}
              index={i}
              className="relative bg-surface-2  hover:border-primary/40 rounded-[6px] p-6 sm:p-8 shadow-sm hover:shadow-xl hover:bg-surface-3 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[3/4] rounded-[6px] overflow-hidden mb-6 shadow-inner relative ">
                  <Image
                    src={r.image.url}
                    alt={r.image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-[4px] bg-primary text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm shadow-sm">
                      {t.selo}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold font-display text-text-main mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {r.title}
                </h3>
                <div className="text-xs text-text-muted mb-6 font-light">
                  {r.pages} {t.paginas}
                </div>
              </div>
              {/* Era botão sem destino, agora leva à página do e-book, e o
                  cartão inteiro clica. */}
              <Link
                href={hrefDe('ebooks', locale, r.slug)}
                className="w-full py-3 rounded-[6px] border border-primary/40 text-primary font-bold text-xs sm:text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98 after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3C98FA]"
              >
                <Download size={16} aria-hidden /> <span>{t.cta}</span>
              </Link>
            </EntradaAnimada>
          ))}
        </div>
      </div>
    </section>
  )
}
