import { describe, expect, it } from 'vitest'

import { destinoDoAviso } from './destino-do-aviso'

import type { FormularioComAviso } from '@/types/content'

const semDestinos: Record<FormularioComAviso, string | null> = { contato: null, consultores: null, diagnostico: null, carreiras: null, chat: null }
const contato = (destinos: Partial<Record<FormularioComAviso, string | null>> = {}) => ({
  email: 'negocios@atra.com.br',
  destinos: { ...semDestinos, ...destinos },
})

describe('destinoDoAviso', () => {
  /* É o comportamento de antes do campo existir: nada muda até alguém preencher. */
  it('campo vazio vai para o e-mail geral', () => {
    expect(destinoDoAviso(contato(), 'consultores')).toBe('negocios@atra.com.br')
  })

  it('campo preenchido vence o e-mail geral', () => {
    expect(destinoDoAviso(contato({ consultores: 'alocacao@atra.com.br' }), 'consultores')).toBe('alocacao@atra.com.br')
  })

  it('cada formulário lê o próprio campo', () => {
    const c = contato({ carreiras: 'rh@atra.com.br' })
    expect(destinoDoAviso(c, 'carreiras')).toBe('rh@atra.com.br')
    expect(destinoDoAviso(c, 'contato')).toBe('negocios@atra.com.br')
  })

  /* O diagnóstico já tinha destino pela variável do servidor (P-29). */
  it('a reserva vale quando o campo está vazio, e perde para ele', () => {
    expect(destinoDoAviso(contato(), 'diagnostico', 'rc18@atra.com.br')).toBe('rc18@atra.com.br')
    expect(destinoDoAviso(contato({ diagnostico: 'dados@atra.com.br' }), 'diagnostico', 'rc18@atra.com.br')).toBe('dados@atra.com.br')
  })

  it('espaço em branco conta como vazio', () => {
    expect(destinoDoAviso(contato({ chat: '   ' }), 'chat', '  ')).toBe('negocios@atra.com.br')
  })
})
