import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  COOKIE_DE_CONSENTIMENTO,
  VERSAO_DE_CONSENTIMENTO,
} from './consentimento'
import { rastrear } from './rastreio'

/* `rastrear` decide por duas chaves: o id do GTM (env) e o consentimento de
 * estatística (cookie). A matriz aqui é a política inteira — os pontos de
 * instrumentação não conferem nada. */

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
    vi.stubEnv('NEXT_PUBLIC_GTM_ID', 'GTM-TESTE')
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
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

  it('sem NEXT_PUBLIC_GTM_ID, é no-op mesmo com consentimento', () => {
    vi.stubEnv('NEXT_PUBLIC_GTM_ID', '')
    documento.cookie = consentimento(true)
    rastrear('outbound_click', { url: 'https://wa.me/x' })
    expect(janela.dataLayer).toBeUndefined()
  })

  it('nunca lança, mesmo sem DOM', () => {
    vi.stubGlobal('document', undefined)
    expect(() => rastrear('resource_download')).not.toThrow()
  })
})
