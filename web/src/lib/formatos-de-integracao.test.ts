import { describe, expect, it } from 'vitest'

import { ehEndpointDeIntegracao } from './formatos-de-integracao'

/* O endereço deste campo recebe a `ATRAIR_API_KEY` no cabeçalho. Endereço
 * errado não é lista de vagas vazia — é a chave de servidor entregue a quem
 * atender. Daí o formato fechado. */

describe('ehEndpointDeIntegracao', () => {
  it('aceita https, com e sem caminho-base', () => {
    expect(ehEndpointDeIntegracao('https://atrair.exemplo.com.br')).toBe(true)
    expect(ehEndpointDeIntegracao('https://atrair.exemplo.com.br/interno')).toBe(true)
    expect(ehEndpointDeIntegracao('https://atrair.exemplo.com.br:8443')).toBe(true)
  })

  it('⚠️ recusa http para host externo — a chave iria em texto claro', () => {
    expect(ehEndpointDeIntegracao('http://atrair.exemplo.com.br')).toBe(false)
  })

  it('aceita http só para o ATRAIR de desenvolvimento', () => {
    /* `host.docker.internal` porque, de dentro do contêiner, `localhost` é o
       próprio contêiner — ver docker-compose.yml. */
    expect(ehEndpointDeIntegracao('http://localhost:3300')).toBe(true)
    expect(ehEndpointDeIntegracao('http://127.0.0.1:3300')).toBe(true)
    expect(ehEndpointDeIntegracao('http://host.docker.internal:3300')).toBe(true)
  })

  it('recusa o que não é URL absoluta', () => {
    expect(ehEndpointDeIntegracao('')).toBe(false)
    expect(ehEndpointDeIntegracao('atrair.exemplo.com.br')).toBe(false)
    expect(ehEndpointDeIntegracao('/api/public/vagas')).toBe(false)
    expect(ehEndpointDeIntegracao('não é url')).toBe(false)
  })

  it('recusa esquema que não é http(s)', () => {
    expect(ehEndpointDeIntegracao('ftp://atrair.exemplo.com.br')).toBe(false)
    expect(ehEndpointDeIntegracao('javascript:alert(1)')).toBe(false)
    expect(ehEndpointDeIntegracao('file:///etc/passwd')).toBe(false)
  })

  it('⚠️ recusa query e fragmento — some na concatenação da rota', () => {
    /* `https://host?x=1` + `/api/public/vagas` = `https://host?x=1/api/...`,
       que não é o endereço de ninguém. */
    expect(ehEndpointDeIntegracao('https://atrair.exemplo.com.br?x=1')).toBe(false)
    expect(ehEndpointDeIntegracao('https://atrair.exemplo.com.br#topo')).toBe(false)
  })

  it('⚠️ recusa credencial embutida no endereço — vaza no log de erro do fetch', () => {
    expect(ehEndpointDeIntegracao('https://user:senha@atrair.exemplo.com.br')).toBe(false)
  })
})
