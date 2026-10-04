'use client'

import type { ReactNode } from 'react'
import { useSyncExternalStore } from 'react'

import { CHAVE_DO_TEMA, temaInicial, type Tema } from '@/lib/tema'

/* O tema do site, no navegador (D-48): a escolha de quem visita, senão o tema
 * do sistema. Uma fonte só, lida por dois componentes — o `<html>`, que leva a
 * classe, e o alternador, que mostra o ícone e troca.
 *
 * ⚠️ O `<html>` é desenhado **daqui**, por um componente de cliente, e não pelo
 * layout de servidor. Não é enfeite: o `SCRIPT_DO_TEMA` acerta a classe antes da
 * primeira pintura, mas o React é dono do `<html>`. Quando uma hidratação falha
 * em qualquer ponto da página — e em dev ela falha com `?e2e=1`, pelos
 * contadores —, ele remonta a árvore inteira e regrava a `class` com o que o
 * componente manda. Vindo do servidor, mandava sempre `dark`, e quem abriu no
 * claro voltava ao escuro meio segundo depois (medido em 02/10). Lendo daqui, o
 * React regrava o tema certo.
 *
 * O script continua necessário: sem ele a página abriria no `dark` do servidor
 * e só trocaria depois da hidratação — o piscar que ele existe para evitar. */

const SISTEMA_CLARO = '(prefers-color-scheme: light)'

/* Com o armazenamento bloqueado (modo privado, cookies desligados) a troca vale
 * só enquanto a página está aberta — é o que esta variável guarda. */
let escolhaDaVisita: Tema | null = null
const ouvintes = new Set<() => void>()

function escolhaSalva(): string | null {
  try {
    return localStorage.getItem(CHAVE_DO_TEMA)
  } catch {
    return null
  }
}

function sistemaPrefereClaro(): boolean {
  try {
    return window.matchMedia(SISTEMA_CLARO).matches
  } catch {
    return false
  }
}

const temaNoNavegador = (): Tema => temaInicial(escolhaDaVisita ?? escolhaSalva(), sistemaPrefereClaro())
/* O servidor não sabe o tema de ninguém: escuro, como o legado. */
const temaNoServidor = (): Tema => 'dark'

function assinar(aoMudar: () => void) {
  ouvintes.add(aoMudar)
  /* Sem escolha salva, o site acompanha o sistema ao vivo: quem deixa o
     computador em "automático" vê o site escurecer junto, ao anoitecer. */
  const sistema = window.matchMedia(SISTEMA_CLARO)
  sistema.addEventListener('change', aoMudar)
  // Outra aba do site trocou o tema: esta acompanha.
  window.addEventListener('storage', aoMudar)
  return () => {
    ouvintes.delete(aoMudar)
    sistema.removeEventListener('change', aoMudar)
    window.removeEventListener('storage', aoMudar)
  }
}

export const useTema = (): Tema => useSyncExternalStore(assinar, temaNoNavegador, temaNoServidor)

/** Grava a escolha de quem visita. Daqui em diante o sistema deixa de mandar. */
export function escolherTema(tema: Tema) {
  escolhaDaVisita = tema
  try {
    localStorage.setItem(CHAVE_DO_TEMA, tema)
  } catch {
    // Sem armazenamento a troca vale só para esta visita, como era antes da D-48.
  }
  for (const avisar of ouvintes) avisar()
}

/**
 * O `<html>` do site, com a classe do tema.
 *
 * `suppressHydrationWarning` porque o script troca a `class` antes da
 * hidratação e o React acusaria a diferença. Vale só para os atributos deste
 * elemento, não para os filhos.
 */
export function HtmlComTema({ lang, classeBase, children }: { lang: string; classeBase: string; children: ReactNode }) {
  const tema = useTema()
  return (
    <html suppressHydrationWarning lang={lang} className={`${classeBase} ${tema}`}>
      {children}
    </html>
  )
}
