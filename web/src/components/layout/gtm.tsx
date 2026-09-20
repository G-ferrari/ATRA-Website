'use client'

import { useEffect } from 'react'

import { aoMudarConsentimento, lerConsentimento, type Consentimento } from '@/lib/consentimento'
import { congelado } from '@/lib/e2e'

/* MIG-153 (D-30) — GTM com Consent Mode v2, atrás da dupla chave.
 *
 * ⚠️ "Nenhum script não essencial antes do aceite" (MIG-109) é propriedade do
 * sistema aqui, não configuração: o script do GTM **nem existe no DOM** até o
 * visitante consentir estatística. O Consent Mode é a segunda camada — o
 * `consent default denied` entra no dataLayer antes de qualquer script, então
 * mesmo uma tag mal configurada no container nasce negada.
 *
 * ⚠️ A ordem importa e é a do contrato do Google: `default` → (aceite) →
 * `update` → injeção do script. Revogar depois vira `update` negado — o
 * script já carregado obedece; não dá para descarregá-lo, e é por isso que a
 * primeira camada (não injetar) é a que vale antes do aceite.
 *
 * Sem `NEXT_PUBLIC_GTM_ID` (P-19 aberta) o componente é um nulo inerte. */

const ID = process.env.NEXT_PUBLIC_GTM_ID

export function Gtm() {
  useEffect(() => {
    if (!ID || congelado()) return

    window.dataLayer = window.dataLayer ?? []
    /* O Consent Mode lê `arguments`, não um objeto nem um array — é o formato
       do snippet oficial. Por isso `function` (arrow não tem `arguments`); o
       `void args` só marca o parâmetro como usado para o lint. */
    function gtag(...args: unknown[]) {
      void args
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments as unknown as Record<string, unknown>)
    }

    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })

    const atualizar = (c: Consentimento) => {
      gtag('consent', 'update', {
        analytics_storage: c.analytics ? 'granted' : 'denied',
        ad_storage: c.marketing ? 'granted' : 'denied',
        ad_user_data: c.marketing ? 'granted' : 'denied',
        ad_personalization: c.marketing ? 'granted' : 'denied',
      })
    }

    const injetar = () => {
      if (document.getElementById('gtm')) return
      window.dataLayer!.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
      const s = document.createElement('script')
      s.id = 'gtm'
      s.async = true
      s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(ID!)}`
      document.head.appendChild(s)
    }

    const atual = lerConsentimento()
    if (atual?.analytics) {
      atualizar(atual)
      injetar()
    }

    return aoMudarConsentimento((c) => {
      atualizar(c)
      if (c.analytics) injetar()
    })
  }, [])

  return null
}
