import { describe, expect, it } from 'vitest'

import {
  lerDuracao,
  lerModelo,
  lerPerfisPedidos,
  MAX_PERFIS_POR_ENVIO,
  MAX_PESSOAS_POR_PERFIL,
  resumoDaSolicitacao,
} from './solicitacao-consultores'

const json = (v: unknown) => JSON.stringify(v)

describe('lerPerfisPedidos (o que o cliente manda em `perfis`)', () => {
  it('lê slug e quantidade', () => {
    expect(lerPerfisPedidos(json([{ slug: '12', quantidade: 3 }, { slug: '4', quantidade: 1 }]))).toEqual([
      { id: 12, quantidade: 3 },
      { id: 4, quantidade: 1 },
    ])
  })

  it('preserva a ordem de escolha', () => {
    expect(lerPerfisPedidos(json([{ slug: '9' }, { slug: '2' }, { slug: '5' }])).map((p) => p.id)).toEqual([9, 2, 5])
  })

  /* O slug é o id da collection. Qualquer outra coisa nem chega à consulta. */
  it('descarta slug que não é id numérico', () => {
    const entrada = [
      { slug: '12', quantidade: 1 },
      { slug: 'Data Engineer', quantidade: 1 },
      { slug: '1; DROP TABLE form_submissions', quantidade: 1 },
      { slug: '', quantidade: 1 },
      { slug: 12, quantidade: 1 },
      { slug: '9999999999999', quantidade: 1 },
    ]
    expect(lerPerfisPedidos(json(entrada)).map((p) => p.id)).toEqual([12])
  })

  it('prende a quantidade em 1..20 e trunca fração', () => {
    const r = lerPerfisPedidos(
      json([
        { slug: '1', quantidade: 0 },
        { slug: '2', quantidade: -4 },
        { slug: '3', quantidade: 500 },
        { slug: '4', quantidade: 2.9 },
      ]),
    )
    expect(r.map((p) => p.quantidade)).toEqual([1, 1, MAX_PESSOAS_POR_PERFIL, 2])
  })

  it('quantidade ausente, não numérica ou infinita vira 1', () => {
    const r = lerPerfisPedidos(
      json([{ slug: '1' }, { slug: '2', quantidade: 'muitas' }, { slug: '3', quantidade: null }]),
    )
    expect(r.map((p) => p.quantidade)).toEqual([1, 1, 1])
    expect(lerPerfisPedidos('[{"slug":"7","quantidade":1e999}]')[0].quantidade).toBe(1)
  })

  it('slug repetido fica só na primeira ocorrência', () => {
    expect(lerPerfisPedidos(json([{ slug: '5', quantidade: 2 }, { slug: '5', quantidade: 9 }]))).toEqual([
      { id: 5, quantidade: 2 },
    ])
  })

  /* O catálogo tem 8 perfis; o teto impede que um JSON forjado vire uma consulta
     com milhares de ids. */
  it('corta no teto de perfis por envio', () => {
    const muitos = Array.from({ length: 500 }, (_, i) => ({ slug: String(i + 1), quantidade: 1 }))
    expect(lerPerfisPedidos(json(muitos))).toHaveLength(MAX_PERFIS_POR_ENVIO)
  })

  it('entrada que não é array de objetos vira lista vazia, sem lançar', () => {
    for (const bruto of ['', 'não é json', '{"slug":"1"}', '"texto"', '42', 'null', '[1,2,3]', '[null]']) {
      expect(lerPerfisPedidos(bruto), bruto).toEqual([])
    }
  })
})

describe('lerDuracao', () => {
  it('aceita meses inteiros de 1 a 60', () => {
    expect(lerDuracao('1')).toBe(1)
    expect(lerDuracao('6')).toBe(6)
    expect(lerDuracao('60')).toBe(60)
  })

  /* Fora da faixa vira ausência, e não o limite: "999 meses" não é estimativa
     que valha gravar como 60. */
  it('fora da faixa, fracionário ou não numérico vira null', () => {
    for (const bruto of ['', '   ', '0', '-3', '61', '999', '2.5', 'seis', 'NaN', 'Infinity']) {
      expect(lerDuracao(bruto), bruto).toBeNull()
    }
  })
})

describe('lerModelo', () => {
  it('aceita só as chaves conhecidas', () => {
    expect(lerModelo('squad')).toBe('squad')
    expect(lerModelo('full-time')).toBe('full-time')
    expect(lerModelo('Modelo: Full-time (Dedicado)')).toBeNull()
    expect(lerModelo('')).toBeNull()
  })

  /* `in` casaria herança do protótipo: "toString" e "constructor" não são
     modelos de alocação. */
  it('não aceita nome herdado do protótipo', () => {
    for (const bruto of ['toString', 'constructor', '__proto__', 'hasOwnProperty']) {
      expect(lerModelo(bruto), bruto).toBeNull()
    }
  })
})

describe('resumoDaSolicitacao (o que o comercial lê)', () => {
  const base = { duracaoMeses: null, modelo: null, descricao: '' } as const

  it('lista perfis com quantidade e nível, e soma as pessoas', () => {
    const r = resumoDaSolicitacao({
      ...base,
      perfis: [
        { cargo: 'Data Engineer', nivel: 'Senior', quantidade: 2 },
        { cargo: 'Cloud Architect', nivel: 'Lead / Principal', quantidade: 1 },
      ],
    })
    expect(r).toContain('Perfis solicitados (3 pessoas):')
    expect(r).toContain('- 2× Data Engineer (Senior)')
    expect(r).toContain('- 1× Cloud Architect (Lead / Principal)')
  })

  it('usa o singular com uma pessoa só', () => {
    const r = resumoDaSolicitacao({ ...base, perfis: [{ cargo: 'ML Engineer', nivel: 'Senior', quantidade: 1 }] })
    expect(r).toContain('Perfis solicitados (1 pessoa):')
  })

  it('traz duração e modelo quando informados', () => {
    const r = resumoDaSolicitacao({
      perfis: [{ cargo: 'Data Engineer', nivel: 'Senior', quantidade: 1 }],
      duracaoMeses: 6,
      modelo: 'squad',
      descricao: '',
    })
    expect(r).toContain('Duração estimada: 6 meses')
    expect(r).toContain('Modelo de alocação: Squad gerenciada ATRA')
    expect(resumoDaSolicitacao({ ...base, perfis: [], duracaoMeses: 1, descricao: 'x' })).toContain(
      'Duração estimada: 1 mês',
    )
  })

  it('omite duração e modelo ausentes em vez de escrever "null"', () => {
    const r = resumoDaSolicitacao({ ...base, perfis: [{ cargo: 'A', nivel: 'B', quantidade: 1 }] })
    expect(r).not.toContain('Duração')
    expect(r).not.toContain('Modelo')
    expect(r).not.toContain('null')
  })

  /* Veio pelo "Não encontrou um consultor nesta lista?": o comercial precisa
     saber que não é um formulário vazio por engano. */
  it('sem perfis, diz isso explicitamente e traz a descrição', () => {
    const r = resumoDaSolicitacao({ ...base, perfis: [], descricao: '  Especialista em SAP com Databricks  ' })
    expect(r).toContain('Nenhum perfil do catálogo selecionado')
    expect(r).toContain('Descrição do visitante:\nEspecialista em SAP com Databricks')
  })

  it('separa os blocos com linha em branco', () => {
    const r = resumoDaSolicitacao({
      perfis: [{ cargo: 'A', nivel: 'B', quantidade: 1 }],
      duracaoMeses: 3,
      modelo: null,
      descricao: 'contexto',
    })
    expect(r.split('\n\n')).toHaveLength(3)
  })
})
