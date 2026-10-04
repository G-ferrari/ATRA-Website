import { describe, expect, it } from 'vitest'

import type { ConversionPanel } from '@/payload-types'

import { toPainelDeConversao, type CaseDoPainel } from './conversion-panel'

const capa = (id: number) => ({ id, url: `/api/media/file/capa-${id}.webp`, alt: `Capa ${id}`, width: 1200, height: 800 })

const caso = (id: number, extra: Partial<CaseDoPainel> = {}): CaseDoPainel =>
  ({ id, title: `Case ${id}`, slug: `case-${id}`, client: 'Banco ABC', heroImage: capa(id), ...extra }) as CaseDoPainel

/* Do mais novo para o mais antigo, como a consulta do layout entrega. */
const CASES = [caso(4), caso(3), caso(2), caso(1)]

const global = (extra: Partial<ConversionPanel> = {}): ConversionPanel =>
  ({
    id: 1,
    title: 'Por onde começar?',
    intro: 'Escolha o caminho.',
    paths: [
      { id: 'p1', icon: 'chart', title: 'Decidir mais rápido com dados', description: 'Transforme dados em decisões.', href: '/diagnostico-maturidade' },
      { id: 'p2', icon: 'sparkles', title: 'Colocar IA no negócio', description: null, href: '/diagnostico-maturidade' },
    ],
    ctaLabel: 'Falar com um especialista',
    ctaHref: '/contato',
    proof: [
      { id: 'n1', value: '140+', label: 'especialistas' },
      { id: 'n2', value: 'Parceira', label: 'Google Cloud' },
    ],
    cases: { innovationAi: [], dataBi: [2, 4], governanceCulture: [1] },
    ...extra,
  }) as ConversionPanel

const mapear = (g: ConversionPanel | null, cases = CASES, prefixo = '') =>
  toPainelDeConversao({
    global: g,
    cases,
    hrefLocal: (href) => `${prefixo}${href}`,
    hrefDoCase: (slug) => `${prefixo}/cases-de-sucesso/${slug}`,
  })

describe('toPainelDeConversao', () => {
  /* A trava que deixa o código ir ao ar antes do conteúdo: sem título, o menu
     sai como era. */
  it('sem título — ou sem o global — não há painel', () => {
    expect(mapear(null)).toBeNull()
    expect(mapear(global({ title: null }))).toBeNull()
    expect(mapear(global({ title: '   ' }))).toBeNull()
  })

  it('leva título, abertura, caminhos, botão e prova social', () => {
    const painel = mapear(global())!
    expect(painel.titulo).toBe('Por onde começar?')
    expect(painel.abertura).toBe('Escolha o caminho.')
    expect(painel.caminhos).toEqual([
      { icon: 'chart', title: 'Decidir mais rápido com dados', description: 'Transforme dados em decisões.', href: '/diagnostico-maturidade' },
      { icon: 'sparkles', title: 'Colocar IA no negócio', description: null, href: '/diagnostico-maturidade' },
    ])
    expect(painel.cta).toEqual({ label: 'Falar com um especialista', href: '/contato' })
    expect(painel.provas).toEqual([
      { value: '140+', label: 'especialistas' },
      { value: 'Parceira', label: 'Google Cloud' },
    ])
  })

  it('em inglês os destinos ganham o prefixo do idioma', () => {
    const painel = mapear(global(), CASES, '/en')!
    expect(painel.caminhos[0].href).toBe('/en/diagnostico-maturidade')
    expect(painel.cta?.href).toBe('/en/contato')
    expect(painel.cases['governance-culture'][0].href).toBe('/en/cases-de-sucesso/case-1')
  })

  it('botão sem texto ou sem destino não é desenhado', () => {
    expect(mapear(global({ ctaLabel: '' }))!.cta).toBeNull()
    expect(mapear(global({ ctaHref: null }))!.cta).toBeNull()
  })

  it('cada aba mostra os cases escolhidos para ela, na ordem do admin', () => {
    const painel = mapear(global())!
    expect(painel.cases['data-bi'].map((c) => c.slug)).toEqual(['case-2', 'case-4'])
    expect(painel.cases['governance-culture'].map((c) => c.slug)).toEqual(['case-1'])
  })

  /* D-52: a 4ª aba entrou depois do painel, com campo próprio no global. */
  it('a aba de Serviços Especializados tem a sua própria escolha', () => {
    const painel = mapear(global({ cases: { specializedServices: [3] } }))!
    expect(painel.cases['specialized-services'].map((c) => c.slug)).toEqual(['case-3'])
  })

  it('aba sem case escolhido mostra os 3 mais recentes', () => {
    expect(mapear(global())!.cases['innovation-ai'].map((c) => c.slug)).toEqual(['case-4', 'case-3', 'case-2'])
  })

  /* A lista que chega só tem publicado: case escolhido e depois despublicado
     some do menu, e a aba que ficou sem nenhum cai nos mais recentes. */
  it('case escolhido que não está publicado não aparece', () => {
    const painel = mapear(global({ cases: { innovationAi: [], dataBi: [2, 99], governanceCulture: [99] } }))!
    expect(painel.cases['data-bi'].map((c) => c.slug)).toEqual(['case-2'])
    expect(painel.cases['governance-culture'].map((c) => c.slug)).toEqual(['case-4', 'case-3', 'case-2'])
  })

  it('aceita o relacionamento populado, e não só o id', () => {
    const painel = mapear(global({ cases: { dataBi: [caso(3) as never] } }))!
    expect(painel.cases['data-bi'].map((c) => c.slug)).toEqual(['case-3'])
  })

  /* O menu inteiro fora do ar por uma capa faltando é troca ruim. */
  it('case sem capa populada vira cartão sem imagem, e não erro', () => {
    const painel = mapear(global({ cases: { dataBi: [1] } }), [caso(1, { heroImage: 7 }), caso(2, { client: '' })])!
    expect(painel.cases['data-bi'][0].image).toBeNull()
    expect(painel.cases['innovation-ai'][1]).toMatchObject({ client: null, image: { url: '/api/media/file/capa-2.webp' } })
  })

  it('sem nenhum case publicado, as abas ficam vazias', () => {
    expect(mapear(global(), [])!.cases).toEqual({
      'innovation-ai': [],
      'data-bi': [],
      'governance-culture': [],
      'specialized-services': [],
    })
  })
})
