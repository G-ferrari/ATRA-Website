import { describe, expect, it } from 'vitest'

import { toIntegracaoAtrair } from './integracao'
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
