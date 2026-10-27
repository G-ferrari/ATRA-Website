'use client'

import type { MouseEvent } from 'react'

import { hreflangDe } from '@/lib/seo'
import { localePrefix, type Locale } from '@/lib/locales'
import { TEXTOS_CASCA } from '@/lib/navegacao'
import { cn } from '@/lib/utils'

/* Botão PT/EN do cabeçalho (D-74). O legado tinha o seletor só na gaveta do
 * celular (`App.tsx:1046`), e o porte não o trouxe: até aqui o visitante só
 * chegava ao `/en` pelo Google.
 *
 * O destino é a **mesma página** no outro idioma, quando ela tem par, e a
 * inicial do outro idioma quando não tem. Quem sabe o par é a própria página:
 * o `<link rel="alternate" hreflang>` que o `metadataDe` põe no `<head>`, com o
 * slug de cada idioma (D-07) e o critério do sitemap. Ler de lá, na hora do
 * clique, evita repetir no cabeçalho a consulta que a página já fez — e a
 * navegação do Next troca esses links a cada rota. Sem par declarado não há
 * versão de verdade no outro idioma, e mandar para a mesma rota no inglês
 * mostraria o português pelo fallback. */
export function AlternadorDeIdioma({ locale, className }: { locale: Locale; className?: string }) {
  const outro: Locale = locale === 'pt' ? 'en' : 'pt'
  const t = TEXTOS_CASCA[locale]

  const aoClicar = (e: MouseEvent<HTMLAnchorElement>) => {
    const par = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflangDe(outro)}"]`)
    if (!par?.href) return
    e.preventDefault()
    /* Só o caminho: o `href` do `<head>` é absoluto, com a origem de produção,
       e em homologação ou no dev levaria para fora do ambiente. */
    const destino = new URL(par.href)
    window.location.assign(destino.pathname + destino.search)
  }

  return (
    <a
      href={localePrefix(outro) || '/'}
      hrefLang={hreflangDe(outro)}
      lang={hreflangDe(outro)}
      onClick={aoClicar}
      title={t.outroIdioma}
      className={cn(
        'w-9 h-9 rounded-[6px] items-center justify-center shrink-0 text-xs font-semibold tracking-wide border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors active:scale-95',
        className,
      )}
    >
      {/* O nome acessível começa pelo que se vê ("EN"), para quem comanda por
          voz poder dizer o que está escrito no botão. */}
      {outro.toUpperCase()}
      <span className="sr-only"> {t.outroIdioma}</span>
    </a>
  )
}
