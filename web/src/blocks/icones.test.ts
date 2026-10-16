import { describe, expect, it } from 'vitest'

import { DESCRICAO_DOS_ICONES, GRUPOS_DE_ICONES, ICONES, OPCOES_DE_ICONE } from './icones'

describe('catálogo de ícones', () => {
  it('não repete nome', () => {
    expect(new Set(ICONES).size).toBe(ICONES.length)
  })

  /* A ordem é a do enum no Postgres: nome novo entra no fim, por `ADD VALUE`.
   * Reordenar ou renomear um destes pede reescrever o enum de dezenas de
   * tabelas, e é isso que este teste segura. */
  it('mantém os 35 de antes de 15/10 no começo, na mesma ordem', () => {
    expect(ICONES.slice(0, 35)).toEqual([
      'sparkles', 'target', 'shield', 'rocket', 'users', 'database', 'cloud', 'brain', 'chart',
      'lock', 'workflow', 'award', 'app', 'search', 'settings', 'zap', 'cpu', 'shield-check',
      'trending-up', 'arrow-up-right', 'star', 'file-text', 'newspaper', 'video', 'book',
      'briefcase', 'graduation-cap', 'heart', 'info', 'user-check', 'building', 'coffee', 'server',
      'code', 'headset',
    ])
  })

  it('todo ícone está num grupo do seletor, e nenhum grupo fica vazio', () => {
    const grupos = new Set<string>(GRUPOS_DE_ICONES.map((g) => g.id))
    for (const nome of ICONES) expect(grupos, nome).toContain(DESCRICAO_DOS_ICONES[nome].grupo)
    for (const g of GRUPOS_DE_ICONES) {
      expect(ICONES.some((nome) => DESCRICAO_DOS_ICONES[nome].grupo === g.id), g.id).toBe(true)
    }
  })

  it('oferece no select exatamente a lista, com o nome em português', () => {
    expect(OPCOES_DE_ICONE.map((o) => o.value)).toEqual([...ICONES])
    expect(OPCOES_DE_ICONE.find((o) => o.value === 'lock')?.label).toEqual({ pt: 'Cadeado', en: 'lock' })
  })
})
