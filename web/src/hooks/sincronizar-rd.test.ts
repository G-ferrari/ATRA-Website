import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { sincronizarComRd } from './sincronizar-rd'

/* O gancho que leva o lead ao RD. O que este teste guarda é **como** ele grava
 * o resultado, porque foi aí que a task 044 achou o defeito: sem o `req`, a
 * escrita ia por outra conexão e morria em "NotFound" (a transação do `create`
 * ainda aberta); com `payload.update`, uma falha desfaria a transação do lead.
 * Tem que ser `db.updateOne`, com o `req`. */

type Args = Parameters<typeof sincronizarComRd>[0]

function chamar(doc: Record<string, unknown>, falhaAoGravar = false) {
  const updateOne = vi.fn(async () => {
    if (falhaAoGravar) throw new Error('falha de banco')
    return {}
  })
  const update = vi.fn()
  const req = {
    payload: {
      findGlobal: vi.fn(async () => ({ rdStationMarketing: { enabled: true } })),
      db: { updateOne },
      update,
    },
  }
  const resultado = sincronizarComRd({ doc, req, context: {} } as unknown as Args)
  return { resultado, req, updateOne, update }
}

const contato = { id: 7, kind: 'contact', email: 'lead@empresa.com.br', name: 'Maria' }

describe('sincronizarComRd', () => {
  beforeEach(() => {
    vi.stubEnv('RDSTATION_MARKETING_API_KEY', 'chave-falsa-de-teste')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ event_uuid: 'uuid-1' }), { status: 200 })),
    )
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('⚠️ grava o resultado direto no adaptador, com o mesmo req do create', async () => {
    const { resultado, req, updateOne, update } = chamar(contato)
    await resultado
    expect(update).not.toHaveBeenCalled()
    expect(updateOne).toHaveBeenCalledTimes(1)
    expect(updateOne).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'form-submissions',
        id: 7,
        req,
        data: { rd: expect.objectContaining({ eventUuid: 'uuid-1', syncedAt: expect.any(String), error: null }) },
      }),
    )
  })

  it('falha ao gravar o resultado não derruba o lead (o gancho devolve o doc)', async () => {
    const { resultado } = chamar(contato, true)
    await expect(resultado).resolves.toEqual(contato)
  })

  it('sem chave não chama o RD nem grava nada', async () => {
    vi.stubEnv('RDSTATION_MARKETING_API_KEY', '')
    const { resultado, updateOne } = chamar(contato)
    await resultado
    expect(fetch).not.toHaveBeenCalled()
    expect(updateOne).not.toHaveBeenCalled()
  })

  it('banco de talentos sem aviso registrado não vai ao RD (D-62)', async () => {
    const { resultado, updateOne } = chamar({ id: 8, kind: 'talent-pool', email: 'c@x.com' })
    await resultado
    expect(fetch).not.toHaveBeenCalled()
    expect(updateOne).not.toHaveBeenCalled()
  })
})
