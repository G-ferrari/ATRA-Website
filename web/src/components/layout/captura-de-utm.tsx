'use client'

import { useEffect } from 'react'

import { guardarUtm } from '@/lib/utm'

/* Guarda a atribuição de campanha assim que o visitante chega (D-26).
 *
 * ⚠️ **Mora no layout, e não no formulário**, porque os UTM estão na URL de
 * chegada e o formulário quase nunca está nessa página. Quem entra por
 * `/?utm_source=linkedin` e converte em `/contato` só tem atribuição se alguém
 * tiver guardado na chegada — e a home não tem nada que garanta que o
 * componente do formulário montou.
 *
 * ⚠️ Lê `window.location.search` num efeito, e **não** `useSearchParams()`. O
 * hook obriga a rota a ter fronteira de Suspense e, sem ela, joga a página
 * inteira para renderização no cliente — em 491 páginas pré-renderizadas isso
 * não é um detalhe. O efeito só roda no navegador, onde `location` já existe.
 *
 * Não desenha nada: é `null`, e as rotas com formulário estão sob gate visual.
 */
export function CapturaDeUtm() {
  useEffect(() => {
    guardarUtm(window.location.search)
  }, [])

  return null
}
