import { describe, expect, it, vi } from 'vitest'

const find = vi.fn()
vi.mock('@/lib/payload', () => ({ getPayload: async () => ({ find }) }))

import { calcular, perguntasDoSetor } from '@/lib/diagnostico-maturidade'
import { novoTokenDoResultado } from '@/lib/diagnostico-maturidade/link-do-resultado'
import { lerResultadoPeloToken, resultadoGravado } from './resultado-do-diagnostico'

const calculo = calcular(
  'financeiro',
  Object.fromEntries(perguntasDoSetor('financeiro').map((q) => [q.id, 1])),
)

const gravado = {
  name: '  Ana Maria Souza ',
  diagnostic: {
    sector: 'financeiro',
    size: '1_5bi',
    average: calculo.media,
    level: calculo.nivel,
    pillars: calculo.pilares,
    dama: calculo.damas,
    gaps: calculo.gaps,
    topGaps: calculo.topGaps.join(' | '),
    locale: 'es',
  },
}

describe('resultadoGravado', () => {
  it('devolve o cálculo como foi gravado, com o primeiro nome e o idioma', () => {
    expect(resultadoGravado(gravado)).toEqual({
      primeiroNome: 'Ana',
      setor: 'financeiro',
      porte: '1_5bi',
      calculo,
      idioma: 'es',
    })
  })

  it('não devolve e-mail, telefone nem empresa, mesmo que venham no documento', () => {
    const r = resultadoGravado({
      ...gravado,
      email: 'ana@exemplo.com.br',
      phone: '11999990000',
      company: 'Empresa Exemplo',
    } as never)
    expect(JSON.stringify(r)).not.toMatch(/exemplo|9999/i)
  })

  it('perfil ou média faltando: null, e a página dá 404', () => {
    expect(resultadoGravado({ diagnostic: { ...gravado.diagnostic, sector: 'xyz' } })).toBeNull()
    expect(resultadoGravado({ diagnostic: { ...gravado.diagnostic, average: null } })).toBeNull()
    expect(resultadoGravado({ diagnostic: null })).toBeNull()
  })

  it('descarta nota que não é número e pilar que não existe', () => {
    const r = resultadoGravado({
      diagnostic: { ...gravado.diagnostic, pillars: { Governança: 'x', Qualidade: 3, Outro: 2 } },
    })
    expect(r?.calculo.pilares).toEqual({ Qualidade: 3 })
  })

  it('lead de antes de 28/10, sem idioma: null', () => {
    expect(resultadoGravado({ diagnostic: { ...gravado.diagnostic, locale: null } })?.idioma).toBeNull()
  })
})

describe('lerResultadoPeloToken', () => {
  it('token malformado nem chega ao banco', async () => {
    for (const t of ['', '1', 'a'.repeat(42), 'a'.repeat(44), `${'a'.repeat(42)}/`]) {
      expect(await lerResultadoPeloToken(t)).toBeNull()
    }
    expect(find).not.toHaveBeenCalled()
  })

  it('busca pelo token inteiro e pelo kind, trazendo só nome e diagnóstico', async () => {
    const token = novoTokenDoResultado()
    find.mockResolvedValueOnce({ docs: [gravado] })
    expect(await lerResultadoPeloToken(token)).toMatchObject({ primeiroNome: 'Ana' })
    expect(find.mock.calls[0][0]).toMatchObject({
      collection: 'form-submissions',
      where: {
        and: [{ kind: { equals: 'data-maturity-diagnostic' } }, { 'diagnostic.resultToken': { equals: token } }],
      },
      select: { name: true, diagnostic: true },
      limit: 1,
    })
  })

  it('token que não existe: null', async () => {
    find.mockResolvedValueOnce({ docs: [] })
    expect(await lerResultadoPeloToken(novoTokenDoResultado())).toBeNull()
  })
})
