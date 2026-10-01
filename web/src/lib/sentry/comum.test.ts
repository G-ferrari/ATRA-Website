import { describe, expect, it } from 'vitest'

import { ambienteDoSentry, semDadoPessoal, vemDeExtensao } from './comum'

describe('ambienteDoSentry', () => {
  it('o domínio real é produção; qualquer outro hostname público é homologação', () => {
    expect(ambienteDoSentry('https://www.atra.com.br')).toBe('producao')
    expect(ambienteDoSentry('https://atra.com.br')).toBe('producao')
    expect(ambienteDoSentry('https://35-211-105-220.sslip.io')).toBe('homologacao')
    expect(ambienteDoSentry('https://srv1927832.hstgr.cloud')).toBe('homologacao')
  })

  it('localhost, vazio e URL inválida são local — nunca contam como produção', () => {
    expect(ambienteDoSentry('http://localhost:3000')).toBe('local')
    expect(ambienteDoSentry(undefined)).toBe('local')
    expect(ambienteDoSentry('isto não é url')).toBe('local')
  })
})

describe('semDadoPessoal', () => {
  it('tira corpo, cookies e os cabeçalhos sensíveis, e deixa o resto', () => {
    const evento = semDadoPessoal({
      request: {
        data: { name: 'Fulano', message: 'segredo' },
        cookies: { 'payload-token': 'x' },
        headers: { cookie: 'a=b', authorization: 'JWT x', 'user-agent': 'ua' },
      },
    })
    expect(evento.request).toEqual({ headers: { 'user-agent': 'ua' } })
  })

  it('evento sem requisição passa intacto', () => {
    expect(semDadoPessoal({ exception: { values: [] } })).toEqual({ exception: { values: [] } })
  })
})

describe('vemDeExtensao', () => {
  const frame = (filename: string) => ({ filename })
  it('só quando todos os frames são de extensão', () => {
    expect(vemDeExtensao({ exception: { values: [{ stacktrace: { frames: [frame('chrome-extension://abc/x.js')] } }] } })).toBe(true)
    expect(
      vemDeExtensao({
        exception: { values: [{ stacktrace: { frames: [frame('chrome-extension://abc/x.js'), frame('https://www.atra.com.br/_next/a.js')] } }] },
      }),
    ).toBe(false)
  })
  it('sem rastro não é extensão', () => {
    expect(vemDeExtensao({})).toBe(false)
  })
})
