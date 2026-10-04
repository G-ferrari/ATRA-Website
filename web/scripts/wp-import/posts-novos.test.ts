import { describe, expect, it } from 'vitest'

import { soOsNovos } from './posts-novos'

describe('soOsNovos (import-posts --so-novos)', () => {
  const wp = [{ slug: 'governanca-de-dados' }, { slug: 'rc-18-2025-da-tecnologia-a-governanca-da-informacao' }]

  it('deixa passar só o que ainda não está no site', () => {
    expect(soOsNovos(wp, ['governanca-de-dados'])).toEqual([{ slug: 'rc-18-2025-da-tecnologia-a-governanca-da-informacao' }])
    expect(soOsNovos(wp, [])).toEqual(wp)
    expect(soOsNovos(wp, wp.map((p) => p.slug))).toEqual([])
  })

  /* O post com "²" no slug é gravado como `-c2-b2`. Comparado pelo slug bruto
     ele pareceria novo a cada rodada — e seria regravado, que é justamente o
     que a chave existe para impedir. */
  it('compara pelo slug normalizado, como o importador grava', () => {
    expect(soOsNovos([{ slug: 'area-em-m%c2%b2' }], ['area-em-m-c2-b2'])).toEqual([])
  })
})
