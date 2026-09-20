import { describe, expect, it } from 'vitest'

import {
  COOKIE_DE_CONSENTIMENTO,
  consentimentoDeCookieString,
  VERSAO_DE_CONSENTIMENTO,
} from './consentimento'

const cookieDe = (valor: unknown) => `${COOKIE_DE_CONSENTIMENTO}=${encodeURIComponent(JSON.stringify(valor))}`

describe('consentimentoDeCookieString', () => {
  it('lê um consentimento válido, mesmo no meio de outros cookies', () => {
    const c = { v: VERSAO_DE_CONSENTIMENTO, analytics: true, marketing: false, ts: 1_800_000_000_000 }
    expect(consentimentoDeCookieString(`outro=1; ${cookieDe(c)}; mais=2`)).toEqual(c)
  })

  it('sem o cookie, devolve null — o banner pergunta', () => {
    expect(consentimentoDeCookieString('')).toBeNull()
    expect(consentimentoDeCookieString('outro=1; qualquer=2')).toBeNull()
  })

  /* Versão diferente = a pergunta mudou. Consentimento dado para outra
     pergunta não vale para a nova, então o banner reaparece. */
  it('versão diferente invalida o consentimento', () => {
    const velho = { v: VERSAO_DE_CONSENTIMENTO + 1, analytics: true, marketing: true, ts: 1 }
    expect(consentimentoDeCookieString(cookieDe(velho))).toBeNull()
  })

  it('conteúdo fora do contrato devolve null, nunca lança', () => {
    expect(consentimentoDeCookieString(`${COOKIE_DE_CONSENTIMENTO}=nao-e-json`)).toBeNull()
    expect(consentimentoDeCookieString(cookieDe({ v: VERSAO_DE_CONSENTIMENTO, analytics: 'sim' }))).toBeNull()
    expect(consentimentoDeCookieString(cookieDe({ v: VERSAO_DE_CONSENTIMENTO, analytics: true }))).toBeNull()
  })

  it('ts ausente vira 0, não erro — o resto do consentimento vale', () => {
    const semTs = { v: VERSAO_DE_CONSENTIMENTO, analytics: false, marketing: true }
    expect(consentimentoDeCookieString(cookieDe(semTs))).toEqual({ ...semTs, ts: 0 })
  })
})
