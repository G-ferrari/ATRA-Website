'use client'

import { useEffect } from 'react'

import { aoMudarConsentimento, lerConsentimento } from '@/lib/consentimento'
import { congelado } from '@/lib/e2e'

/* D-40 — Lusha Website Visitors: identifica a empresa de onde vem a visita,
 * pelo IP, sem formulário. Pedido da Karen em 22/09.
 *
 * ⚠️ Categoria **marketing**, não estatística. É identificação de conta para
 * prospecção, não medição anônima de uso — e é marketing que o visitante
 * aceita ou recusa por ela no aviso de cookies. Subir a versão do
 * consentimento (`VERSAO_DE_CONSENTIMENTO`) foi o que fez o aviso perguntar de
 * novo a quem já tinha aceitado marketing quando ela era só a UTM.
 *
 * Mesmo contrato do `Gtm`: o script **nem existe no DOM** antes do aceite, e
 * revogar depois não o descarrega — só impede que entre na próxima página.
 * Sem id (global `tracking` vazio) ou sob `?e2e=1`, é um nulo inerte.
 *
 * O carregamento é o do snippet oficial da Lusha, reescrito sem `eval` de
 * string: o `nocache` aleatório é deles — o caminho é `latest/`, e o
 * parâmetro garante a versão corrente em vez da que o cache guardou. */

const SCRIPT = 'https://static-packages-prod.lusha.com/website-visitor-pixel/latest/insights.min.js'

declare global {
  interface Window {
    trackingLusha?: { onLoad: (opcoes: { siteId: string }) => void }
  }
}

export function Lusha({ siteId }: { siteId: string | null }) {
  useEffect(() => {
    if (!siteId || congelado()) return

    const injetar = () => {
      if (document.getElementById('lusha')) return
      const s = document.createElement('script')
      s.id = 'lusha'
      s.async = true
      s.defer = true
      s.src = `${SCRIPT}?nocache=${Math.random().toString(36).slice(2, 9)}`
      s.onload = () => window.trackingLusha?.onLoad({ siteId })
      document.head.appendChild(s)
    }

    if (lerConsentimento()?.marketing) injetar()

    return aoMudarConsentimento((c) => {
      if (c.marketing) injetar()
    })
  }, [siteId])

  return null
}
