'use client'

import { useEffect } from 'react'

import { aoMudarConsentimento, lerConsentimento } from '@/lib/consentimento'
import { congelado } from '@/lib/e2e'

/* D-54 — o "código de monitoramento" do RD Station Marketing: acompanha a
 * navegação do visitante entre páginas (cookies `rdtrk` e `__trf.src`) e, na
 * conversão, amarra o lead ao caminho que ele fez. O id vem do admin (global
 * `tracking`), e o que o RD manda colar é só `<script async src=".../
 * loader-scripts/<id>-loader.js">` — o componente monta a URL.
 *
 * ⚠️ Categoria **marketing**, não estatística: é rastreamento de pessoa para
 * nutrição e venda, e é marketing que o visitante aceita ou recusa por ele.
 * Subir `VERSAO_DE_CONSENTIMENTO` para 3 foi o que fez o aviso perguntar de
 * novo a quem já tinha aceitado marketing quando ele era UTM + Lusha.
 *
 * Mesmo contrato do `Gtm` e da `Lusha`: o script **nem existe no DOM** antes
 * do aceite, e revogar depois não o descarrega — só impede que entre na
 * próxima página. Sem id ou sob `?e2e=1`, é um nulo inerte.
 *
 * ⚠️ Os leads dos formulários **não** dependem deste script: eles vão ao RD
 * pelo servidor (`lib/rd-marketing.ts`). O que ele acrescenta é a atribuição
 * de navegação do lado do RD. */

const BASE = 'https://d335luupugsy2.cloudfront.net/js/loader-scripts/'

export function RdStation({ loaderId }: { loaderId: string | null }) {
  useEffect(() => {
    if (!loaderId || congelado()) return

    const injetar = () => {
      if (document.getElementById('rd-station')) return
      const s = document.createElement('script')
      s.id = 'rd-station'
      s.async = true
      s.src = `${BASE}${loaderId}-loader.js`
      document.head.appendChild(s)
    }

    if (lerConsentimento()?.marketing) injetar()

    return aoMudarConsentimento((c) => {
      if (c.marketing) injetar()
    })
  }, [loaderId])

  return null
}
