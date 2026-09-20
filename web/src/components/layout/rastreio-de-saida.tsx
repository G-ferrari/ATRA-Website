'use client'

import { useEffect } from 'react'

import { rastrear } from '@/lib/rastreio'

/* MIG-156 (D-30) — `outbound_click` (WhatsApp, LinkedIn, qualquer saída).
 *
 * Um listener delegado no documento, e não `onClick` em cada link: os links
 * externos moram em Server Components (rodapé, CTAs) e em conteúdo vindo do
 * CMS — instrumentar um a um transformaria a casca inteira em cliente e
 * perderia os links que o editor criar amanhã.
 *
 * ⚠️ Só origem+caminho vão no evento, nunca a query string — parâmetro de URL
 * alheia pode carregar identificador. Não desenha nada; com `rastrear` em
 * no-op (sem GTM ou sem consentimento) o listener é inerte. */
export function RastreioDeSaida() {
  useEffect(() => {
    const aoClicar = (e: MouseEvent) => {
      const alvo = e.target instanceof Element ? e.target.closest('a[href]') : null
      if (!(alvo instanceof HTMLAnchorElement)) return
      try {
        const url = new URL(alvo.href)
        if (!/^https?:$/.test(url.protocol) || url.origin === window.location.origin) return
        rastrear('outbound_click', { url: `${url.origin}${url.pathname}` })
      } catch {
        /* href relativo ou inválido: não é saída */
      }
    }
    document.addEventListener('click', aoClicar, { capture: true })
    return () => document.removeEventListener('click', aoClicar, { capture: true })
  }, [])

  return null
}
