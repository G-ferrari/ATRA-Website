'use client'

import { ChevronDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { hreflangDe } from '@/lib/seo'
import { isLocale, LOCALES, localePrefix, type Locale } from '@/lib/locales'
import { TEXTOS_CASCA } from '@/lib/navegacao'
import { cn } from '@/lib/utils'

/* Seletor de idioma do cabeçalho: PT, EN e ES com bandeira (D-77, pedido do
 * Leonardo, 28/10), no `DropdownMenu` do shadcn/ui. Até aqui era um botão que
 * só alternava entre dois (D-74). O legado tinha o seletor só na gaveta do
 * celular (`App.tsx:1046`), e o porte não o trouxe.
 *
 * O destino é a **mesma página** no idioma escolhido, quando ela tem par, e a
 * inicial do idioma quando não tem. Quem sabe o par é a própria página: o
 * `<link rel="alternate" hreflang>` que o `metadataDe` põe no `<head>`, com o
 * slug de cada idioma (D-07) e o critério do sitemap. Ler de lá, na hora da
 * escolha, evita repetir no cabeçalho a consulta que a página já fez — e a
 * navegação do Next troca esses links a cada rota. Sem par declarado não há
 * versão de verdade no outro idioma, e mandar para a mesma rota mostraria o
 * português pelo fallback.
 *
 * O gatilho guarda o tamanho do botão de antes (o do WhatsApp), com a bandeira
 * do idioma **atual**: no celular o cabeçalho não tem espaço para o nome. */

const NOMES: Record<Locale, string> = { pt: 'Português', en: 'English', es: 'Español' }

function irPara(destino: Locale) {
  const par = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflangDe(destino)}"]`)
  /* Só o caminho: o `href` do `<head>` é absoluto, com a origem de produção,
     e em homologação ou no dev levaria para fora do ambiente. */
  const caminho = par?.href ? new URL(par.href) : null
  window.location.assign(caminho ? caminho.pathname + caminho.search : localePrefix(destino) || '/')
}

export function AlternadorDeIdioma({ locale, className }: { locale: Locale; className?: string }) {
  const t = TEXTOS_CASCA[locale]

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={`${t.idioma}: ${NOMES[locale]}`}
        title={t.idioma}
        className={cn(
          'h-9 px-2 gap-1 rounded-[6px] items-center justify-center shrink-0 border border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/10 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-white/10 transition-colors active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-primary',
          className,
        )}
      >
        <Bandeira locale={locale} />
        <ChevronDown className="size-3 text-text-muted" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuRadioGroup value={locale} onValueChange={(v) => isLocale(v) && v !== locale && irPara(v)}>
          {LOCALES.map((l) => (
            <DropdownMenuRadioItem key={l} value={l} lang={hreflangDe(l)}>
              <Bandeira locale={l} />
              {NOMES[l]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* Bandeiras em SVG e não em emoji: o Windows não desenha emoji de bandeira,
 * mostra as letras "US"/"BR". Desenho simplificado, de propósito: a 20 px de
 * largura as estrelas, a faixa "Ordem e Progresso" e o brasão da Espanha viram
 * ruído. Proporção 3:2 nas três, para o gatilho não mudar de forma ao trocar de
 * idioma.
 * - Inglês é a dos EUA porque a tradução é para inglês americano (`lib/traducao.ts`).
 * - Espanhol é a da Espanha, embora a tradução seja para o espanhol neutro da
 *   América Latina: nenhum país latino-americano representa os outros, e a da
 *   Espanha é a que se lê como "espanhol". */
const CLASSE_DA_BANDEIRA = 'w-5 h-auto shrink-0 rounded-[2px] ring-1 ring-black/10 dark:ring-white/20'

function Bandeira({ locale }: { locale: Locale }) {
  return (
    <svg viewBox="0 0 30 20" className={CLASSE_DA_BANDEIRA} aria-hidden focusable="false">
      {locale === 'pt' ? <DoBrasil /> : locale === 'en' ? <DosEua /> : <DaEspanha />}
    </svg>
  )
}

function DosEua() {
  const faixa = 20 / 13
  return (
    <>
      <rect width="30" height="20" fill="#fff" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} y={i * 2 * faixa} width="30" height={faixa} fill="#b22234" />
      ))}
      <rect width="12" height={7 * faixa} fill="#3c3b6e" />
    </>
  )
}

function DoBrasil() {
  return (
    <>
      <rect width="30" height="20" fill="#009c3b" />
      <path d="M15 2.5 27 10 15 17.5 3 10Z" fill="#ffdf00" />
      <circle cx="15" cy="10" r="4.2" fill="#002776" />
    </>
  )
}

function DaEspanha() {
  return (
    <>
      <rect width="30" height="20" fill="#aa151b" />
      <rect y="5" width="30" height="10" fill="#f1bf00" />
    </>
  )
}
