import { describe, expect, it } from 'vitest'

import { toAparencia } from './appearance'

describe('toAparencia', () => {
  it('traduz cada opção do admin no peso da fonte', () => {
    expect(toAparencia({ headingWeight: 'bold' })).toEqual({ pesoDosTitulos: 600 })
    expect(toAparencia({ headingWeight: 'normal' })).toEqual({ pesoDosTitulos: 400 })
    expect(toAparencia({ headingWeight: 'light' })).toEqual({ pesoDosTitulos: 300 })
  })

  it('cai no Fino, o desenho original, quando o global ainda não foi salvo', () => {
    expect(toAparencia({} as never)).toEqual({ pesoDosTitulos: 300 })
    expect(toAparencia({ headingWeight: 'outro' } as never)).toEqual({ pesoDosTitulos: 300 })
  })
})
