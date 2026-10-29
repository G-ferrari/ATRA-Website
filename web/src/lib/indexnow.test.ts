import { afterEach, describe, expect, it, vi } from 'vitest'

import { avisarIndexNow, chaveDoIndexNow, indexNowLigado, pedidoDoIndexNow, urlsDoItem } from './indexnow'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('IndexNow', () => {
  it('chave fora do formato do protocolo é chave nenhuma', () => {
    vi.stubEnv('INDEXNOW_KEY', 'curta')
    expect(chaveDoIndexNow()).toBeNull()
    vi.stubEnv('INDEXNOW_KEY', 'a1b2c3d4e5f6a7b8')
    expect(chaveDoIndexNow()).toBe('a1b2c3d4e5f6a7b8')
  })

  /* A origem dos testes é localhost: avisar o Bing de homologação ou de dev
     seria pedir que ele indexe o que não deve. */
  it('fora da produção não liga, mesmo com chave', () => {
    vi.stubEnv('INDEXNOW_KEY', 'a1b2c3d4e5f6a7b8')
    expect(indexNowLigado()).toBe(false)
    const envio = vi.spyOn(globalThis, 'fetch')
    avisarIndexNow(['http://localhost:3000/blog/x'])
    expect(envio).not.toHaveBeenCalled()
  })

  it('um endereço por idioma com slug gravado, traduzido (D-07)', () => {
    expect(urlsDoItem('cases', { pt: 'meu-case', en: 'my-case', es: null })).toEqual([
      'http://localhost:3000/cases-de-sucesso/meu-case',
      'http://localhost:3000/en/success-stories/my-case',
    ])
  })

  it('o corpo do pedido segue o protocolo', () => {
    expect(pedidoDoIndexNow(['http://localhost:3000/blog/x'], 'chave1234')).toEqual({
      host: 'localhost',
      key: 'chave1234',
      keyLocation: 'http://localhost:3000/indexnow-key.txt',
      urlList: ['http://localhost:3000/blog/x'],
    })
  })
})
