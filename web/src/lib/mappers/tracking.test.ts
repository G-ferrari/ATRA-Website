import { describe, expect, it } from 'vitest'

import { ehGtmId, ehLushaSiteId } from '@/lib/formatos-de-rastreamento'

import { toRastreamento } from './tracking'

/* O que estes testes protegem: o id vai parar na URL de um script. Um valor
 * fora do formato — colado com lixo, vindo do ambiente sem validação — não
 * pode chegar à página, e o vazio tem que desligar o script, não quebrá-lo. */

const LUSHA = '6edbd0a7-0cda-4da6-83c4-6aad885fa31e'

describe('ehGtmId', () => {
  it.each(['GTM-KR2VWNK', 'GTM-TESTE', 'GTM-ABC123'])('aceita %s', (id) => {
    expect(ehGtmId(id)).toBe(true)
  })

  it.each([
    ['minúsculas', 'gtm-kr2vwnk'],
    ['sem prefixo', 'KR2VWNK'],
    ['o id do GA4 no lugar', 'G-619E22CJKE'],
    ['espaço', ' GTM-KR2VWNK'],
    ['script colado', 'GTM-KR2VWNK"><script>'],
    ['curto demais', 'GTM-AB'],
  ])('recusa %s', (_, id) => {
    expect(ehGtmId(id)).toBe(false)
  })
})

describe('ehLushaSiteId', () => {
  it('aceita o UUID do painel, em maiúsculas ou minúsculas', () => {
    expect(ehLushaSiteId(LUSHA)).toBe(true)
    expect(ehLushaSiteId(LUSHA.toUpperCase())).toBe(true)
  })

  it.each([
    ['sem hífens', LUSHA.replaceAll('-', '')],
    ['snippet inteiro', `window.trackingLusha.onLoad({siteId:"${LUSHA}"})`],
    ['um caractere a menos', LUSHA.slice(1)],
  ])('recusa %s', (_, id) => {
    expect(ehLushaSiteId(id)).toBe(false)
  })
})

describe('toRastreamento', () => {
  it('leva os ids do admin, aparados', () => {
    expect(toRastreamento({ gtmId: ' GTM-KR2VWNK ', lushaSiteId: `${LUSHA}\n` })).toEqual({
      gtmId: 'GTM-KR2VWNK',
      lushaSiteId: LUSHA,
    })
  })

  it('global vazio é "não configurado", não string vazia', () => {
    expect(toRastreamento({ gtmId: null, lushaSiteId: null })).toEqual({ gtmId: null, lushaSiteId: null })
    expect(toRastreamento({ gtmId: '', lushaSiteId: '  ' })).toEqual({ gtmId: null, lushaSiteId: null })
  })

  it('o admin vence a reserva do ambiente', () => {
    expect(toRastreamento({ gtmId: 'GTM-ADMIN1' }, { gtmId: 'GTM-AMBIENTE' }).gtmId).toBe('GTM-ADMIN1')
  })

  it('com o admin vazio, o GTM usa a reserva do ambiente', () => {
    expect(toRastreamento({ gtmId: null }, { gtmId: 'GTM-AMBIENTE' }).gtmId).toBe('GTM-AMBIENTE')
  })

  it('valor fora do formato não chega à página, venha de onde vier', () => {
    expect(toRastreamento({ gtmId: 'G-619E22CJKE', lushaSiteId: 'lusha' })).toEqual({
      gtmId: null,
      lushaSiteId: null,
    })
    expect(toRastreamento({ gtmId: null }, { gtmId: 'gtm-errado' }).gtmId).toBeNull()
  })
})
