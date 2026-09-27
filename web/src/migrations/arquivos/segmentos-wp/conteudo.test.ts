import { describe, expect, it } from 'vitest'

import { ICONES } from '@/blocks/shared'
import { hrefDe } from '@/lib/routes'

import { PAGINAS_DE_SEGMENTO } from './conteudo'

/* Mesma rede de `solucoes-wp/conteudo.test.ts`: o que a migração só
 * descobriria no deploy — ícone inexistente, página repetida — aparece aqui. */

describe('páginas de segmento do WordPress', () => {
  it('são as 8, sem repetir', () => {
    const slugs = PAGINAS_DE_SEGMENTO.map((p) => p.slug)
    expect(slugs).toHaveLength(8)
    expect(new Set(slugs).size).toBe(8)
  })

  it('todo cartão usa um ícone que o bloco aceita', () => {
    const aceitos = new Set<string>(ICONES)
    for (const p of PAGINAS_DE_SEGMENTO)
      for (const g of p.grupos) for (const c of g.cards) expect(aceitos.has(c.icone), `${p.slug}: ${c.icone}`).toBe(true)
  })

  it('o herói de Saúde leva a manchete do WordPress', () => {
    expect(PAGINAS_DE_SEGMENTO.find((p) => p.slug === 'saude')?.titulo).toBe('Saúde e Ciências da Vida')
  })

  it('Bancos leva à RC18, no endereço que as rotas dão a ela (D-37)', () => {
    const bancos = PAGINAS_DE_SEGMENTO.find((p) => p.slug === 'bancos-seguradoras-servicos-financeiros')
    expect(bancos?.ctasExtras).toEqual([{ label: 'Conheça a RC18', href: hrefDe('solucoes', 'pt', 'rc18') }])
  })
})
