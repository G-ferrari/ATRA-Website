import { describe, expect, it } from 'vitest'

import { toIntegracaoAtrair, toIntegracaoRd } from './integracao'
import type { Integration } from '@/payload-types'

/* Mapper do global `integrations` (D-41). Dois compromissos: o admin vence o
 * ambiente, e endereço torto vira `null` **aqui** — não só na validação do
 * admin, porque a reserva vem do ambiente, que o admin não valida. */

/* `atrair` é opcional, não nulável: um global sem linha no banco devolve o
 * grupo `undefined` — é esse o estado que os testes de "ainda não gravado"
 * reproduzem. */
const doc = (atrair?: Integration['atrair']): Pick<Integration, 'atrair'> => ({ atrair })

describe('toIntegracaoAtrair', () => {
  it('o admin vence o ambiente', () => {
    const r = toIntegracaoAtrair(doc({ endpoint: 'https://do-admin.exemplo' }), {
      endpoint: 'https://do-ambiente.exemplo',
    })
    expect(r.endpoint).toBe('https://do-admin.exemplo')
  })

  it('campo vazio cai na reserva do ambiente — quem já tinha `ATRAIR_API_URL` não perde a integração no deploy', () => {
    const r = toIntegracaoAtrair(doc({ endpoint: '' }), { endpoint: 'https://do-ambiente.exemplo' })
    expect(r.endpoint).toBe('https://do-ambiente.exemplo')
  })

  it('⚠️ a barra final sai aqui, uma vez — antes cada chamada aparava por conta e uma produzia `//api/...`', () => {
    expect(toIntegracaoAtrair(doc({ endpoint: 'https://atrair.exemplo/' })).endpoint).toBe(
      'https://atrair.exemplo',
    )
    expect(toIntegracaoAtrair(doc({ endpoint: 'https://atrair.exemplo///' })).endpoint).toBe(
      'https://atrair.exemplo',
    )
  })

  it('⚠️ endereço fora do formato vira null mesmo vindo do ambiente', () => {
    /* Um `ATRAIR_API_URL` torto num `.env` não pode virar chave entregue no
       lugar errado — o admin não valida a reserva. */
    expect(toIntegracaoAtrair(doc({}), { endpoint: 'nao-e-url' }).endpoint).toBeNull()
    expect(toIntegracaoAtrair(doc({ endpoint: 'http://externo.exemplo' })).endpoint).toBeNull()
  })

  it('sem endereço em lugar nenhum é null', () => {
    expect(toIntegracaoAtrair(doc({})).endpoint).toBeNull()
    expect(toIntegracaoAtrair(doc(undefined)).endpoint).toBeNull()
  })

  it('⚠️ global ainda não gravado lê as duas chaves como LIGADAS', () => {
    /* O checkbox nasce ligado, mas um global sem linha no banco devolve o
       campo `undefined` em vez do `defaultValue`. Ler isso como "desligado"
       apagaria a grade de vagas de quem só fez o deploy — a D-41 não muda o
       que está no ar. */
    expect(toIntegracaoAtrair(doc(undefined))).toMatchObject({ vagas: true, bancoDeTalentos: true })
    expect(toIntegracaoAtrair(doc({}))).toMatchObject({ vagas: true, bancoDeTalentos: true })
  })

  it('as duas chaves são independentes', () => {
    expect(toIntegracaoAtrair(doc({ jobsFeed: false, talentPool: true }))).toMatchObject({
      vagas: false,
      bancoDeTalentos: true,
    })
    expect(toIntegracaoAtrair(doc({ jobsFeed: true, talentPool: false }))).toMatchObject({
      vagas: true,
      bancoDeTalentos: false,
    })
  })
})

describe('toIntegracaoRd (D-54)', () => {
  const docRd = (rd?: Integration['rdStationMarketing']): Pick<Integration, 'rdStationMarketing'> => ({
    rdStationMarketing: rd,
  })

  it('⚠️ global ainda não gravado lê como LIGADO, sem campos personalizados e com os identificadores padrão', () => {
    /* Ligado por não mudar o que está no ar — sem a chave no ambiente segue
       inerte. Campos personalizados desligados porque um `cf_` inexistente
       derruba a conversão. */
    const r = toIntegracaoRd(docRd(undefined))
    expect(r.ligado).toBe(true)
    expect(r.camposPersonalizados).toBe(false)
    expect(r.conversoes).toEqual({
      contato: 'site-contato',
      chat: 'site-chat',
      newsletter: 'site-newsletter',
      download: 'site-download-material',
      consultores: 'site-solicitacao-consultores',
      diagnostico: 'site-diagnostico-maturidade',
    })
  })

  it('o admin renomeia a conversão sem deploy', () => {
    const r = toIntegracaoRd(docRd({ conversions: { contact: ' fale-conosco ' } }))
    expect(r.conversoes.contato).toBe('fale-conosco')
  })

  it('campo apagado de propósito desliga aquele formulário; os outros seguem no padrão', () => {
    const r = toIntegracaoRd(docRd({ conversions: { contact: '' } }))
    expect(r.conversoes.contato).toBeNull()
    expect(r.conversoes.chat).toBe('site-chat')
  })

  it('⚠️ identificador fora do formato vira null aqui, não só no admin', () => {
    const r = toIntegracaoRd(docRd({ conversions: { contact: 'tem espaço', newsletter: '<script>' } }))
    expect(r.conversoes.contato).toBeNull()
    expect(r.conversoes.newsletter).toBeNull()
  })

  it('as duas chaves são lidas como estão', () => {
    expect(toIntegracaoRd(docRd({ enabled: false, customFields: true }))).toMatchObject({
      ligado: false,
      camposPersonalizados: true,
    })
  })
})
