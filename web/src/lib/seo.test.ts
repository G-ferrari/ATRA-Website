import { describe, expect, it } from 'vitest'

import { robotsDeCorpo } from './seo'

describe('robotsDeCorpo', () => {
  it('não põe diretiva quando há corpo — a página é indexável', () => {
    expect(robotsDeCorpo({ root: { children: [{ type: 'paragraph' }] } })).toBeUndefined()
  })

  it.each([null, undefined])('marca noindex quando o corpo é %j (D-08)', (corpo) => {
    expect(robotsDeCorpo(corpo)).toEqual({ index: false, follow: true })
  })

  /* `follow` continua ligado: o robô não indexa a página magra, mas segue os
     links dela. Trocar por `follow: false` isolaria o que estiver linkado. */
  it('segue os links mesmo sem indexar', () => {
    expect(robotsDeCorpo(null)).toMatchObject({ follow: true })
  })
})
