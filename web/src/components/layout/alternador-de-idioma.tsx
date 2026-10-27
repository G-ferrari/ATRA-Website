'use client'

import type { MouseEvent } from 'react'

import { hreflangDe } from '@/lib/seo'
import { localePrefix, type Locale } from '@/lib/locales'
import { TEXTOS_CASCA } from '@/lib/navegacao'
import { cn } from '@/lib/utils'

/* Botão de idioma do cabeçalho (D-74), com a bandeira do outro idioma. O legado tinha o seletor só na gaveta do
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
      aria-label={t.outroIdioma}
      className={cn(
        'w-9 h-9 rounded-[6px] items-center justify-center shrink-0 border border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors active:scale-95',
        className,
      )}
    >
      {/* Bandeira do idioma de destino (pedido do Leonardo, 27/10), em SVG e
          não em emoji: o Windows não desenha emoji de bandeira, mostra as
          letras "US"/"BR". Inglês é a dos EUA porque a tradução é para inglês
          americano (`lib/traducao.ts`). */}
      {outro === 'en' ? <BandeiraDosEua /> : <BandeiraDoBrasil />}
    </a>
  )
}

/* Desenho simplificado, de propósito: a 20 px de largura as estrelas e a faixa
 * "Ordem e Progresso" viram ruído. Proporção 3:2 nas duas, para o botão não
 * mudar de forma ao trocar de idioma. */
const CLASSE_DA_BANDEIRA = 'w-5 h-auto rounded-[2px] ring-1 ring-black/10 dark:ring-white/20'

function BandeiraDosEua() {
  const faixa = 20 / 13
  return (
    <svg viewBox="0 0 30 20" className={CLASSE_DA_BANDEIRA} aria-hidden focusable="false">
      <rect width="30" height="20" fill="#fff" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} y={i * 2 * faixa} width="30" height={faixa} fill="#b22234" />
      ))}
      <rect width="12" height={7 * faixa} fill="#3c3b6e" />
    </svg>
  )
}

function BandeiraDoBrasil() {
  return (
    <svg viewBox="0 0 30 20" className={CLASSE_DA_BANDEIRA} aria-hidden focusable="false">
      <rect width="30" height="20" fill="#009c3b" />
      <path d="M15 2.5 27 10 15 17.5 3 10Z" fill="#ffdf00" />
      <circle cx="15" cy="10" r="4.2" fill="#002776" />
    </svg>
  )
}
