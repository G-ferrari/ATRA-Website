import { describe, expect, it } from 'vitest'

import { BLOCOS, grupoDe, rotuloPt } from './index'

/* O que estes testes protegem (seletor-de-secoes, task 031): o drawer
 * "Adicionar Seção" mostra os blocos na ordem de `BLOCOS`. Bloco sem grupo cai
 * solto no fim, e ordem errada volta a esconder o bloco que a editora procura. */

describe('seletor de seções', () => {
  it('todo bloco tem grupo', () => {
    const semGrupo = BLOCOS.filter((b) => !b.admin?.group).map((b) => b.slug)
    expect(semGrupo).toEqual([])
  })

  it('os grupos aparecem em blocos contínuos, sem se repetir', () => {
    const sequencia = BLOCOS.map((b) => grupoDe(b))
    const vistos = sequencia.filter((g, i) => g !== sequencia[i - 1])
    expect(new Set(vistos).size).toBe(vistos.length)
  })

  it('dentro de cada grupo, a ordem é alfabética pelo rótulo em português', () => {
    for (let i = 1; i < BLOCOS.length; i++) {
      const [a, b] = [BLOCOS[i - 1], BLOCOS[i]]
      if (grupoDe(a) !== grupoDe(b)) continue
      expect(rotuloPt(a).localeCompare(rotuloPt(b), 'pt'), `${rotuloPt(a)} antes de ${rotuloPt(b)}`).toBeLessThan(0)
    }
  })

  it('nenhum bloco some nem repete ao ordenar', () => {
    const slugs = BLOCOS.map((b) => b.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs).toContain('highlightCarousel')
    expect(slugs).toHaveLength(28)
  })
})
