import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ESPERA_MS, estadoDoIndice, garantirIndiceEmDia, marcarIndiceDesatualizado, reiniciarAgendaDoIndice } from './agenda'

describe('agenda do índice', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    reiniciarAgendaDoIndice()
  })
  afterEach(() => {
    reiniciarAgendaDoIndice()
    vi.useRealTimers()
  })

  it('o processo nasce desatualizado: a primeira conversa sincroniza, a segunda não', async () => {
    const sincronizar = vi.fn(async () => {})
    garantirIndiceEmDia(sincronizar)
    await vi.runAllTimersAsync()
    garantirIndiceEmDia(sincronizar)
    await vi.runAllTimersAsync()
    expect(sincronizar).toHaveBeenCalledTimes(1)
    expect(estadoDoIndice().desatualizado).toBe(false)
  })

  it('uma leva de publicações sincroniza uma vez, depois da espera', async () => {
    const sincronizar = vi.fn(async () => {})
    garantirIndiceEmDia(sincronizar)
    await vi.runAllTimersAsync()

    marcarIndiceDesatualizado()
    await vi.advanceTimersByTimeAsync(ESPERA_MS - 1000)
    marcarIndiceDesatualizado()
    marcarIndiceDesatualizado()
    expect(sincronizar).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(ESPERA_MS)
    expect(sincronizar).toHaveBeenCalledTimes(2)
  })

  it('a conversa não antecipa uma sincronização que já está esperando', async () => {
    const sincronizar = vi.fn(async () => {})
    garantirIndiceEmDia(sincronizar)
    await vi.runAllTimersAsync()
    marcarIndiceDesatualizado()
    garantirIndiceEmDia(sincronizar)
    expect(sincronizar).toHaveBeenCalledTimes(1)
    expect(estadoDoIndice().esperando).toBe(true)
  })

  it('mudança durante uma sincronização pede outra logo depois', async () => {
    let terminar = () => {}
    const sincronizar = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          terminar = resolve
        }),
    )
    garantirIndiceEmDia(sincronizar)
    marcarIndiceDesatualizado()
    await vi.advanceTimersByTimeAsync(ESPERA_MS)
    expect(sincronizar).toHaveBeenCalledTimes(1)
    terminar()
    await vi.advanceTimersByTimeAsync(0)
    expect(sincronizar).toHaveBeenCalledTimes(2)
  })

  it('falha deixa desatualizado, e a conversa seguinte tenta de novo', async () => {
    const erro = vi.spyOn(console, 'error').mockImplementation(() => {})
    const sincronizar = vi.fn().mockRejectedValueOnce(new Error('Gemini fora')).mockResolvedValue(undefined)
    garantirIndiceEmDia(sincronizar)
    await vi.runAllTimersAsync()
    expect(estadoDoIndice().desatualizado).toBe(true)
    garantirIndiceEmDia(sincronizar)
    await vi.runAllTimersAsync()
    expect(sincronizar).toHaveBeenCalledTimes(2)
    expect(estadoDoIndice().desatualizado).toBe(false)
    erro.mockRestore()
  })

  it('fora do Next ninguém registrou: marcar não agenda nada', () => {
    marcarIndiceDesatualizado()
    expect(estadoDoIndice().esperando).toBe(false)
  })
})
