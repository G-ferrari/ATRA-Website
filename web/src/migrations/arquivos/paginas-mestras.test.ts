import { describe, expect, it } from 'vitest'

import { PAGINAS_MESTRAS } from '@/lib/paginas-mestras'

import { layoutEmIngles, PAGINAS_MESTRAS_INICIAIS } from './paginas-mestras'

describe('páginas-mestras do dia 1', () => {
  it('cobre as 8 seções que eram código, e só elas', () => {
    const criadas = PAGINAS_MESTRAS_INICIAIS.map((p) => p.secao).sort()
    const jaEramCms = ['carreiras', 'insights']
    const esperadas = PAGINAS_MESTRAS.map((p) => p.id)
      .filter((id) => !jaEramCms.includes(id))
      .sort()
    expect(criadas).toEqual(esperadas)
  })

  it('tem o inglês de cada bloco, na mesma ordem', () => {
    for (const p of PAGINAS_MESTRAS_INICIAIS) expect(p.layoutEn).toHaveLength(p.layout.length)
  })

  it('toda página tem a lista da seção', () => {
    for (const p of PAGINAS_MESTRAS_INICIAIS) expect(p.layout.some((b) => b.blockType === 'sectionListing')).toBe(true)
  })

  it('a meta descrição cabe nos 160 caracteres do campo', () => {
    for (const p of PAGINAS_MESTRAS_INICIAIS) {
      expect(p.seo.pt.metaDescription.length).toBeLessThanOrEqual(160)
      expect(p.seo.en.metaDescription.length).toBeLessThanOrEqual(160)
    }
  })
})

describe('layoutEmIngles', () => {
  it('mantém o id gravado e põe o inglês por cima', () => {
    const gravado = [{ blockType: 'sectionListing', id: 'a1', title: 'Todos os', highlight: 'artigos' }]
    expect(layoutEmIngles(gravado, [{ title: 'All', highlight: 'posts' }])).toEqual([
      { blockType: 'sectionListing', id: 'a1', title: 'All', highlight: 'posts' },
    ])
  })

  it('mescla grupo campo a campo: o destino não localizado fica', () => {
    const gravado = [{ blockType: 'ctaBanner', id: 'b1', cta: { label: 'Fale conosco', href: '/contato' } }]
    const [faixa] = layoutEmIngles(gravado, [{ cta: { label: 'Contact us' } }])
    expect(faixa.cta).toEqual({ label: 'Contact us', href: '/contato' })
  })
})
