import type { Payload } from 'payload'
import { describe, expect, it, vi } from 'vitest'

import { apagarCandidaturasVencidas, limiteDeRetencao } from './retencao-de-candidaturas'

describe('limiteDeRetencao', () => {
  it('é a mesma data, 6 meses antes', () => {
    expect(limiteDeRetencao(new Date('2026-10-15T12:00:00Z')).toISOString()).toBe('2026-04-15T12:00:00.000Z')
  })

  it('atravessa a virada do ano', () => {
    expect(limiteDeRetencao(new Date('2027-02-10T00:00:00Z')).toISOString()).toBe('2026-08-10T00:00:00.000Z')
  })

  /* 31/08 menos 6 meses não existe (fevereiro): o limite cai no começo de
     março, e a candidatura vive uns dias a mais — nunca a menos. */
  it('em fim de mês, erra para o lado de guardar a mais, não a menos', () => {
    const limite = limiteDeRetencao(new Date('2027-08-31T00:00:00Z'))
    expect(limite.getTime()).toBeGreaterThanOrEqual(new Date('2027-02-28T00:00:00Z').getTime())
    expect(limite.getTime()).toBeLessThanOrEqual(new Date('2027-03-03T00:00:00Z').getTime())
  })
})

/* Um Payload de mentira: o bastante para ver o que a limpeza pede ao banco. */
function payloadFalso(vencidos: { 'form-submissions': number[]; 'private-files': number[] }, falhas: number[] = []) {
  const find = vi.fn(async ({ collection }: { collection: keyof typeof vencidos }) => ({
    docs: vencidos[collection].map((id) => ({ id })),
  }))
  const del = vi.fn(async ({ where }: { where: { id: { in: number[] } } }) => ({
    docs: where.id.in.filter((id) => !falhas.includes(id)).map((id) => ({ id })),
    errors: where.id.in.filter((id) => falhas.includes(id)).map((id) => ({ id, message: 'falhou' })),
  }))
  const logger = { error: vi.fn(), info: vi.fn() }
  return { payload: { find, delete: del, logger } as unknown as Payload, find, del, logger }
}

describe('apagarCandidaturasVencidas', () => {
  it('procura candidatura e currículo pelo tipo e pela data limite', async () => {
    const { payload, find } = payloadFalso({ 'form-submissions': [], 'private-files': [] })
    await apagarCandidaturasVencidas(payload, new Date('2026-10-15T12:00:00Z'))

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'form-submissions',
        where: { kind: { equals: 'job-application' }, createdAt: { less_than: '2026-04-15T12:00:00.000Z' } },
      }),
    )
    /* O material rico também mora em `private-files` e não é de ninguém: só
       `kind: cv` entra. */
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'private-files',
        where: { kind: { equals: 'cv' }, createdAt: { less_than: '2026-04-15T12:00:00.000Z' } },
      }),
    )
  })

  it('não apaga nada quando nada venceu', async () => {
    const { payload, del } = payloadFalso({ 'form-submissions': [], 'private-files': [] })
    expect(await apagarCandidaturasVencidas(payload)).toEqual({ candidaturas: 0, curriculos: 0, falhas: 0 })
    expect(del).not.toHaveBeenCalled()
  })

  it('apaga em lotes de 100', async () => {
    const ids = Array.from({ length: 250 }, (_, i) => i + 1)
    const { payload, del } = payloadFalso({ 'form-submissions': ids, 'private-files': [] })
    const r = await apagarCandidaturasVencidas(payload)
    expect(r.candidaturas).toBe(250)
    expect(del).toHaveBeenCalledTimes(3)
  })

  it('conta e registra a falha sem parar o resto', async () => {
    const { payload, logger } = payloadFalso({ 'form-submissions': [1, 2, 3], 'private-files': [10, 11] }, [2, 11])
    expect(await apagarCandidaturasVencidas(payload)).toEqual({ candidaturas: 2, curriculos: 1, falhas: 2 })
    expect(logger.error).toHaveBeenCalledTimes(2)
  })
})
