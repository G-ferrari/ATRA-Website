import { describe, expect, it } from 'vitest'

import type { ConteudoRecomendavel } from '@/types/content'

import { resolverReferencias } from './referencias-da-ia'

/* D-60 — o que estes testes protegem: nada chega à tela como cartão ou link sem
 * estar no catálogo. O modelo pode errar o código, inventar endereço ou seguir
 * o manual antigo; a resposta sai limpa do mesmo jeito. */

const CATALOGO: ConteudoRecomendavel[] = [
  { codigo: 'S12', tipo: 'solucao', titulo: 'Customer 360', resumo: 'Visão única do cliente.', href: '/solucoes/customer-360' },
  { codigo: 'S7', tipo: 'solucao', titulo: 'Governança de Dados', resumo: 'Políticas e papéis.', href: '/solucoes/governanca-de-dados' },
  { codigo: 'G3', tipo: 'segmento', titulo: 'Bancos', resumo: 'Para o setor financeiro.', href: '/segmentos/bancos' },
  { codigo: 'A128', tipo: 'artigo', titulo: 'O que é Data Mesh', resumo: 'Introdução ao conceito.', href: '/blog/o-que-e-data-mesh' },
  { codigo: 'P-CONTATO', tipo: 'pagina', titulo: 'Fale com a ATRA', resumo: '', href: '/contato' },
]
const ORIGENS = ['https://atra-hmg.duckdns.org', 'atra.com.br']

describe('etiqueta de conteúdo', () => {
  it('código do catálogo fica, e a referência leva título, resumo e endereço do CMS', () => {
    const r = resolverReferencias('Veja esta solução:\n[UI_CONTEUDO:S12]\nFaz sentido?', CATALOGO)
    expect(r.texto).toBe('Veja esta solução:\n[UI_CONTEUDO:S12]\nFaz sentido?')
    expect(r.referencias).toEqual({
      S12: { tipo: 'solucao', titulo: 'Customer 360', resumo: 'Visão única do cliente.', href: '/solucoes/customer-360' },
    })
  })

  it('código que não existe some, sem deixar buraco no texto', () => {
    const r = resolverReferencias('Antes.\n\n[UI_CONTEUDO:S999]\n\nDepois.', CATALOGO)
    expect(r.texto).toBe('Antes.\n\nDepois.')
    expect(r.referencias).toEqual({})
  })

  it('aceita a caixa, o acento e o espaço que o modelo troca', () => {
    const r = resolverReferencias('[UI_CONTEÚDO: s12 ] e [ui_conteudo:p-contato]', CATALOGO)
    expect(r.texto).toBe('[UI_CONTEUDO:S12] e [UI_CONTEUDO:P-CONTATO]')
    expect(Object.keys(r.referencias)).toEqual(['S12', 'P-CONTATO'])
  })

  /* O admin desligou um tipo: a rota passa o catálogo já filtrado, e a etiqueta
     de um item desligado é tratada como a de um item que não existe. */
  it('item fora do catálogo recebido não vira cartão', () => {
    const semArtigos = CATALOGO.filter((item) => item.tipo !== 'artigo')
    expect(resolverReferencias('[UI_CONTEUDO:A128]', semArtigos)).toEqual({ texto: '', referencias: {} })
  })
})

describe('etiqueta antiga de serviço', () => {
  it('título de uma solução publicada vira o cartão com link', () => {
    const r = resolverReferencias('[UI_SERVICE:customer 360:Conheça seu cliente.:fluent:cloud-24-regular]', CATALOGO)
    expect(r.texto).toBe('[UI_CONTEUDO:S12]')
    expect(r.referencias.S12.href).toBe('/solucoes/customer-360')
  })

  it('casa sem acento e sem caixa, e também com segmento', () => {
    expect(resolverReferencias('[UI_SERVICE:GOVERNANCA DE DADOS:x:y]', CATALOGO).texto).toBe('[UI_CONTEUDO:S7]')
    expect(resolverReferencias('[UI_SERVICE:bancos:x]', CATALOGO).texto).toBe('[UI_CONTEUDO:G3]')
  })

  it('nome inventado fica como estava: o cartão antigo, sem link', () => {
    const antiga = '[UI_SERVICE:Arquitetura Lakehouse:Centralize seus dados.:fluent:cloud-24-regular]'
    expect(resolverReferencias(antiga, CATALOGO)).toEqual({ texto: antiga, referencias: {} })
  })

  it('não casa com artigo nem com página: a etiqueta antiga só recomendava oferta', () => {
    const antiga = '[UI_SERVICE:O que é Data Mesh:x:y]'
    expect(resolverReferencias(antiga, CATALOGO).texto).toBe(antiga)
  })
})

describe('link escrito pelo modelo', () => {
  it('endereço do catálogo fica, na forma do catálogo', () => {
    const r = resolverReferencias('Leia [este artigo](/blog/o-que-e-data-mesh/?utm=x#topo).', CATALOGO)
    expect(r.texto).toBe('Leia [este artigo](/blog/o-que-e-data-mesh).')
  })

  it('endereço completo do próprio site vira o caminho', () => {
    const r = resolverReferencias('[Customer 360](https://www.atra.com.br/solucoes/customer-360)', CATALOGO, ORIGENS)
    expect(r.texto).toBe('[Customer 360](/solucoes/customer-360)')
    const hmg = resolverReferencias('[Contato](https://atra-hmg.duckdns.org/contato)', CATALOGO, ORIGENS)
    expect(hmg.texto).toBe('[Contato](/contato)')
  })

  it('endereço inventado dentro do site perde o link e mantém o texto', () => {
    expect(resolverReferencias('Veja [nossa página](/solucoes/arquitetura-lakehouse).', CATALOGO).texto).toBe('Veja nossa página.')
  })

  it('endereço de fora perde o link, com ou sem título', () => {
    expect(resolverReferencias('[Google](https://cloud.google.com "Google Cloud")', CATALOGO, ORIGENS).texto).toBe('Google')
    /* Mesmo caminho de um item, em outro host: não é o site. */
    expect(resolverReferencias('[x](https://outro.com/contato)', CATALOGO, ORIGENS).texto).toBe('x')
    expect(resolverReferencias('[x](//outro.com/contato)', CATALOGO, ORIGENS).texto).toBe('x')
  })

  it('esquema que não é http não passa', () => {
    expect(resolverReferencias('[clique](javascript:alert(1))', CATALOGO).texto).not.toContain('javascript:')
    expect(resolverReferencias('[e-mail](mailto:a@b.com)', CATALOGO).texto).toBe('e-mail')
  })

  it('imagem vira só o texto alternativo: o navegador não busca o endereço', () => {
    const r = resolverReferencias('Olha: ![painel](https://rastreio.exemplo/pixel.png?dado=1) pronto.', CATALOGO)
    expect(r.texto).toBe('Olha: painel pronto.')
  })

  it('link não cria referência: cartão é só por etiqueta', () => {
    expect(resolverReferencias('[Contato](/contato)', CATALOGO).referencias).toEqual({})
  })
})

describe('o resto da resposta', () => {
  it('as outras etiquetas e o markdown passam intactos', () => {
    const texto = 'Com o [UI_PARTNER:Google Cloud], **entregamos**.\n\n- um\n- dois\n\n[UI_CHART:FinOps]\n[UI_CONTACT]'
    expect(resolverReferencias(texto, CATALOGO).texto).toBe(texto)
  })

  it('catálogo vazio: nenhuma etiqueta de conteúdo sobrevive', () => {
    expect(resolverReferencias('Oi. [UI_CONTEUDO:S12]', [])).toEqual({ texto: 'Oi.', referencias: {} })
  })
})
