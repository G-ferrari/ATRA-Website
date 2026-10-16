import { describe, expect, it } from 'vitest'

import { ehEndpointDeIntegracao, ehIdentificadorDeConversao, ehTagDoRd, normalizarNome } from './formatos-de-integracao'

/* 15/10: o site novo manda ao RD o mesmo nome que o site atual manda, porque
 * é por ele que as automações disparam. O do contato do WordPress tem espaço e
 * acento. */
describe('ehIdentificadorDeConversao', () => {
  it('aceita o nome que o RD já usa, com espaço e acento', () => {
    expect(ehIdentificadorDeConversao('Formulário Home')).toBe(true)
    expect(ehIdentificadorDeConversao('site-contato')).toBe(true)
    expect(ehIdentificadorDeConversao('E-book: Guia do Data Lakehouse (2026)')).toBe(true)
  })

  it('recusa vazio, só espaço e espaço nas pontas', () => {
    expect(ehIdentificadorDeConversao('')).toBe(false)
    expect(ehIdentificadorDeConversao('   ')).toBe(false)
    expect(ehIdentificadorDeConversao(' contato')).toBe(false)
    expect(ehIdentificadorDeConversao('---')).toBe(false)
  })

  it('⚠️ recusa código colado por engano e quebra de linha — o valor vai em JSON para fora', () => {
    expect(ehIdentificadorDeConversao('<script>')).toBe(false)
    expect(ehIdentificadorDeConversao('{"a":1}')).toBe(false)
    expect(ehIdentificadorDeConversao('contato\nhome')).toBe(false)
  })

  it('⚠️ recusa caractere invisível colado junto — o nome pareceria igual ao do RD sem casar', () => {
    expect(ehIdentificadorDeConversao('Formulário​Home')).toBe(false)
    expect(ehIdentificadorDeConversao('Formulário Home‮')).toBe(false)
    expect(ehIdentificadorDeConversao('Formulário Home')).toBe(false)
  })

  it('recusa acima de 100 caracteres', () => {
    expect(ehIdentificadorDeConversao('a'.repeat(100))).toBe(true)
    expect(ehIdentificadorDeConversao('a'.repeat(101))).toBe(false)
  })
})

describe('normalizarNome', () => {
  it('⚠️ acento decomposto (colado do macOS) vira o composto — igual ao digitado', () => {
    const colado = 'Formulário Home'
    expect(colado).not.toBe('Formulário Home')
    expect(normalizarNome(colado)).toBe('Formulário Home')
  })

  it('espaço sem quebra vira espaço comum, e as pontas saem', () => {
    expect(normalizarNome('  Formulário Home ')).toBe('Formulário Home')
  })
})

describe('ehTagDoRd', () => {
  it('aceita a tag da newsletter e nomes com espaço e acento', () => {
    expect(ehTagDoRd('newsletter')).toBe(true)
    expect(ehTagDoRd('lead site novo')).toBe(true)
    expect(ehTagDoRd('candidato-dados')).toBe(true)
  })

  it('recusa vazio, código e acima de 50 caracteres', () => {
    expect(ehTagDoRd('')).toBe(false)
    expect(ehTagDoRd('<b>')).toBe(false)
    expect(ehTagDoRd('a'.repeat(51))).toBe(false)
  })
})

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
