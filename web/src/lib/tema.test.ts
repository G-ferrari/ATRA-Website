import { describe, expect, it } from 'vitest'

import { CHAVE_DO_TEMA, SCRIPT_DO_TEMA, temaInicial } from './tema'

describe('temaInicial', () => {
  it('a escolha salva vence o sistema', () => {
    expect(temaInicial('light', false)).toBe('light')
    expect(temaInicial('dark', true)).toBe('dark')
  })

  it('sem escolha salva, vale o sistema', () => {
    expect(temaInicial(null, true)).toBe('light')
    expect(temaInicial(null, false)).toBe('dark')
  })

  /* Valor estranho na chave (outra versão do site, alguém mexendo) não é escolha. */
  it('valor inválido salvo é ignorado', () => {
    expect(temaInicial('azul', true)).toBe('light')
    expect(temaInicial('', false)).toBe('dark')
  })
})

/* Roda o texto do `<script>` com `localStorage`, `matchMedia` e `document` de
   mentira e devolve as classes que ele deixou no `<html>`. */
function rodarScript(opcoes: { salvo: string | null; sistemaClaro: boolean; storageBloqueado?: boolean; semMatchMedia?: boolean }) {
  const classes = new Set(['dark'])
  const document = {
    documentElement: {
      classList: { toggle: (c: string, ligar: boolean) => (ligar ? classes.add(c) : classes.delete(c)) },
    },
  }
  const localStorage = {
    getItem: (chave: string) => {
      if (opcoes.storageBloqueado) throw new Error('SecurityError')
      return chave === CHAVE_DO_TEMA ? opcoes.salvo : null
    },
  }
  const window = opcoes.semMatchMedia ? {} : { matchMedia: () => ({ matches: opcoes.sistemaClaro }) }
  new Function('document', 'localStorage', 'window', SCRIPT_DO_TEMA)(document, localStorage, window)
  return [...classes]
}

describe('SCRIPT_DO_TEMA', () => {
  /* A regra existe duas vezes: em TypeScript e neste texto. Não podem divergir. */
  it('decide o mesmo que `temaInicial`, em todas as combinações', () => {
    for (const salvo of ['light', 'dark', 'azul', '', null]) {
      for (const sistemaClaro of [true, false]) {
        expect(rodarScript({ salvo, sistemaClaro }), `${salvo} / ${sistemaClaro}`).toEqual([temaInicial(salvo, sistemaClaro)])
      }
    }
  })

  it('com o armazenamento bloqueado, segue o sistema em vez de quebrar', () => {
    expect(rodarScript({ salvo: 'dark', sistemaClaro: true, storageBloqueado: true })).toEqual(['light'])
    expect(rodarScript({ salvo: 'light', sistemaClaro: false, storageBloqueado: true })).toEqual(['dark'])
  })

  it('sem `matchMedia`, fica no escuro, que é o que o servidor mandou', () => {
    expect(rodarScript({ salvo: null, sistemaClaro: true, semMatchMedia: true })).toEqual(['dark'])
  })
})
