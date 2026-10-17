import { describe, expect, it } from 'vitest'

import {
  TIPOS_RECOMENDAVEIS,
  codigoDaPagina,
  deArtigo,
  dePagina,
  deSegmento,
  deSolucao,
  doDiagnostico,
  emUmaLinha,
  tiposLigados,
} from './catalogo-da-ia'

/* D-60 — o catálogo só pode conter endereço que abre. Estes testes fixam as
 * duas regras que garantem isso: solução sem página não entra, e em inglês só
 * entra o que tem slug em inglês. */

const SOLUCAO = { id: 12, title: 'Customer 360', slug: 'customer-360', shortDescription: 'Visão única do cliente.', hasPage: true }

describe('item do catálogo', () => {
  it('solução: código pelo id, endereço por `hrefDe`', () => {
    expect(deSolucao({ pt: SOLUCAO }, 'pt')).toEqual({
      codigo: 'S12',
      tipo: 'solucao',
      titulo: 'Customer 360',
      resumo: 'Visão única do cliente.',
      href: '/solucoes/customer-360',
    })
  })

  it('solução sem página não tem endereço, e não entra', () => {
    expect(deSolucao({ pt: { ...SOLUCAO, hasPage: false } }, 'pt')).toBeNull()
  })

  it('sem slug ou sem título, não entra', () => {
    expect(deSolucao({ pt: { ...SOLUCAO, slug: '' } }, 'pt')).toBeNull()
    expect(deSolucao({ pt: { ...SOLUCAO, title: '  ' } }, 'pt')).toBeNull()
  })

  it('segmento usa `name`; artigo usa `description`', () => {
    expect(deSegmento({ pt: { id: 3, name: 'Bancos', slug: 'bancos', shortDescription: 'Setor financeiro.' } }, 'pt')).toMatchObject({
      codigo: 'G3',
      titulo: 'Bancos',
      href: '/segmentos/bancos',
    })
    expect(deArtigo({ pt: { id: 128, title: 'Data Mesh', slug: 'data-mesh', description: 'Introdução.' } }, 'pt')).toMatchObject({
      codigo: 'A128',
      tipo: 'artigo',
      resumo: 'Introdução.',
      href: '/blog/data-mesh',
    })
  })
})

describe('em inglês', () => {
  /* A rota `/en/solutions/<slug>` consulta o slug na coluna do inglês: sem ele,
     404, mesmo com o fallback ligado. */
  it('sem slug em inglês, o item fica de fora', () => {
    expect(deSolucao({ pt: SOLUCAO }, 'en')).toBeNull()
    expect(deSolucao({ pt: SOLUCAO, en: null }, 'en')).toBeNull()
    expect(deSolucao({ pt: SOLUCAO, en: { id: 12, slug: null, title: 'Customer 360' } }, 'en')).toBeNull()
  })

  it('com slug em inglês, o endereço é o inglês e o código é o mesmo', () => {
    const en = { id: 12, slug: 'customer-360-en', title: 'Customer 360', shortDescription: 'A single view of the customer.' }
    expect(deSolucao({ pt: SOLUCAO, en }, 'en')).toEqual({
      codigo: 'S12',
      tipo: 'solucao',
      titulo: 'Customer 360',
      resumo: 'A single view of the customer.',
      href: '/en/solutions/customer-360-en',
    })
  })

  it('texto que falta no inglês cai no português', () => {
    const item = deSolucao({ pt: SOLUCAO, en: { id: 12, slug: 'customer-360-en', title: null, shortDescription: null } }, 'en')
    expect(item).toMatchObject({ titulo: 'Customer 360', resumo: 'Visão única do cliente.', href: '/en/solutions/customer-360-en' })
  })

  it('o português não depende do inglês', () => {
    expect(deSolucao({ pt: SOLUCAO, en: null }, 'pt')?.href).toBe('/solucoes/customer-360')
  })
})

describe('páginas do site', () => {
  it('página-mestra de seção indicável: endereço da seção, nos dois idiomas', () => {
    const par = { pt: { id: 5, slug: 'solucoes', title: 'Soluções', masterOf: 'solucoes', seo: { metaDescription: 'Tudo o que a ATRA faz.' } } }
    expect(dePagina(par, 'pt')).toEqual({
      codigo: 'P-SOLUCOES',
      tipo: 'pagina',
      titulo: 'Soluções',
      resumo: 'Tudo o que a ATRA faz.',
      href: '/solucoes',
    })
    expect(dePagina(par, 'en')?.href).toBe('/en/solutions')
  })

  it('contato e sobre entram pelo slug', () => {
    expect(dePagina({ pt: { id: 8, slug: 'contato', title: 'Fale com a ATRA' } }, 'pt')).toMatchObject({ codigo: 'P-CONTATO', href: '/contato' })
    expect(dePagina({ pt: { id: 9, slug: 'sobre', title: 'Sobre' } }, 'pt')?.codigo).toBe('P-SOBRE')
  })

  /* Decisão de 09/10: imprensa e vagas desviam a conversa do foco comercial. */
  it('ATRA na mídia, Carreiras e página avulsa ficam de fora', () => {
    expect(dePagina({ pt: { id: 1, slug: 'atra-na-midia', title: 'ATRA na mídia', masterOf: 'midia' } }, 'pt')).toBeNull()
    expect(dePagina({ pt: { id: 2, slug: 'carreiras', title: 'Trabalhe Conosco', masterOf: 'carreiras' } }, 'pt')).toBeNull()
    expect(dePagina({ pt: { id: 3, slug: 'politicas-e-termos', title: 'Políticas' } }, 'pt')).toBeNull()
  })

  it('diagnóstico: rota própria, texto do global', () => {
    expect(doDiagnostico({ titulo: 'Diagnóstico de Maturidade de Dados', resumo: null }, 'pt')).toEqual({
      codigo: codigoDaPagina('diagnostico'),
      tipo: 'pagina',
      titulo: 'Diagnóstico de Maturidade de Dados',
      resumo: '',
      href: '/diagnostico-maturidade',
    })
    expect(doDiagnostico({ titulo: '' }, 'pt')).toBeNull()
  })
})

describe('emUmaLinha', () => {
  it('junta as quebras e os espaços', () => {
    expect(emUmaLinha('  um\n\ndois \t três ')).toBe('um dois três')
  })

  it('corta na palavra e marca o corte', () => {
    const longo = 'palavra '.repeat(60)
    const cortado = emUmaLinha(longo, 50)
    expect(cortado.length).toBeLessThanOrEqual(51)
    expect(cortado.endsWith('…')).toBe(true)
    expect(cortado).not.toMatch(/palavr…$/)
  })

  it('vazio continua vazio', () => {
    expect(emUmaLinha(null)).toBe('')
  })
})

describe('tipos ligados no admin', () => {
  it('cada valor do campo liga um tipo do catálogo', () => {
    expect([...tiposLigados([...TIPOS_RECOMENDAVEIS])].sort()).toEqual(
      ['artigo', 'case', 'ebook', 'pagina', 'segmento', 'solucao', 'webinar'].sort(),
    )
    expect([...tiposLigados(['posts'])]).toEqual(['artigo'])
  })

  /* Vazio é "nada ligado", e não "o padrão": quem desmarca tudo quer o
     assistente sem recomendar conteúdo. */
  it('campo vazio ou ausente não liga nada', () => {
    expect(tiposLigados([]).size).toBe(0)
    expect(tiposLigados(null).size).toBe(0)
    expect(tiposLigados(undefined).size).toBe(0)
  })
})
