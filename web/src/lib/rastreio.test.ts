import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  COOKIE_DE_CONSENTIMENTO,
  VERSAO_DE_CONSENTIMENTO,
} from './consentimento'
import { definirContainer, rastrear } from './rastreio'

/* `rastrear` decide por duas chaves: o container do GTM (que o `Gtm` define,
 * D-40) e o consentimento de estatística (cookie). A matriz aqui é a política
 * inteira — os pontos de instrumentação não conferem nada. */

const consentimento = (analytics: boolean) =>
  `${COOKIE_DE_CONSENTIMENTO}=${encodeURIComponent(
    JSON.stringify({ v: VERSAO_DE_CONSENTIMENTO, analytics, marketing: false, ts: 1 }),
  )}`

describe('rastrear', () => {
  const janela: { dataLayer?: Record<string, unknown>[] } = {}
  const documento = { cookie: '' }

  beforeEach(() => {
    janela.dataLayer = undefined
    documento.cookie = ''
    vi.stubGlobal('window', janela)
    vi.stubGlobal('document', documento)
    definirContainer(true)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    definirContainer(false)
  })

  it('com id e consentimento, empurra o evento no dataLayer', () => {
    documento.cookie = consentimento(true)
    rastrear('form_submit', { form_type: 'contact' })
    expect(janela.dataLayer).toEqual([{ event: 'form_submit', form_type: 'contact' }])
  })

  it('sem consentimento de estatística, é no-op', () => {
    documento.cookie = consentimento(false)
    rastrear('chat_started')
    expect(janela.dataLayer).toBeUndefined()
  })

  it('sem resposta ao banner, é no-op', () => {
    rastrear('video_play')
    expect(janela.dataLayer).toBeUndefined()
  })

  it('sem container de GTM, é no-op mesmo com consentimento', () => {
    definirContainer(false)
    documento.cookie = consentimento(true)
    rastrear('outbound_click', { url: 'https://wa.me/x' })
    expect(janela.dataLayer).toBeUndefined()
  })

  it('nunca lança, mesmo sem DOM', () => {
    vi.stubGlobal('document', undefined)
    expect(() => rastrear('resource_download')).not.toThrow()
  })
})
