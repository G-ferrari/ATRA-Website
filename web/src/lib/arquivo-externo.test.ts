import { describe, expect, it } from 'vitest'

import { cabecalhosDoArquivoExterno } from './arquivo-externo'

describe('cabecalhosDoArquivoExterno (P-31)', () => {
  /* O caso da homologação: sem o Basic, o Caddy devolve 401 e o editor quebra. */
  it('repassa a senha da homologação (Basic)', () => {
    expect(cabecalhosDoArquivoExterno({ authorization: 'Basic YXRyYTpzZW5oYQ==' })).toEqual({
      authorization: 'Basic YXRyYTpzZW5oYQ==',
    })
  })

  it('não repassa credencial da API do Payload', () => {
    expect(cabecalhosDoArquivoExterno({ authorization: 'JWT abc.def.ghi' })).toEqual({})
    expect(cabecalhosDoArquivoExterno({ authorization: 'users API-Key 123' })).toEqual({})
  })

  it('repassa os cookies, menos os do Payload', () => {
    expect(cabecalhosDoArquivoExterno({ cookie: 'payload-token=segredo; atra-consent=v2; tema=escuro' })).toEqual({
      cookie: 'atra-consent=v2; tema=escuro',
    })
  })

  it('nada a repassar, nada sai — e nenhum outro cabeçalho vaza', () => {
    expect(cabecalhosDoArquivoExterno({ host: 'srv1927832.hstgr.cloud', 'x-real-ip': '1.2.3.4' })).toEqual({})
  })
})
