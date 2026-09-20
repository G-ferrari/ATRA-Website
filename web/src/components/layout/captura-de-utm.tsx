'use client'

import { useEffect } from 'react'

import { aoMudarConsentimento } from '@/lib/consentimento'
import { efetivarUtmSeConsentido, guardarUtm, limparUtmGuardado } from '@/lib/utm'

/* Guarda a atribuição de campanha assim que o visitante chega (D-26) — desde
 * D-30, só com consentimento de marketing.
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
 * D-30: a captura fica em memória até o banner responder. O aceite de
 * marketing — na chegada (cookie) ou depois dela (evento) — efetiva a UTM na
 * sessão; a revogação limpa o que estava guardado.
 *
 * Não desenha nada: é `null`, e as rotas com formulário estão sob gate visual.
 */
export function CapturaDeUtm() {
  useEffect(() => {
    guardarUtm(window.location.search)

    return aoMudarConsentimento((c) => {
      if (c.marketing) efetivarUtmSeConsentido()
      else limparUtmGuardado()
    })
  }, [])

  return null
}
