import { describe, expect, it } from 'vitest'

import { lerPerfisPedidos, MAX_PERFIS_POR_ENVIO, resumoDaSolicitacao } from './solicitacao-consultores'

const json = (v: unknown) => JSON.stringify(v)

describe('lerPerfisPedidos (o que o cliente manda em `perfis`)', () => {
  it('lê os slugs escolhidos', () => {
    expect(lerPerfisPedidos(json(['12', '4']))).toEqual([12, 4])
  })

  it('preserva a ordem de escolha', () => {
    expect(lerPerfisPedidos(json(['9', '2', '5']))).toEqual([9, 2, 5])
  })

  /* O slug é o id da collection. Qualquer outra coisa nem chega à consulta. */
  it('descarta slug que não é id numérico', () => {
    const entrada = ['12', 'Data Engineer', '1; DROP TABLE form_submissions', '', 12, '9999999999999', null]
    expect(lerPerfisPedidos(json(entrada))).toEqual([12])
  })

  /* ⚠️ O caso que a primeira versão deixava passar: 10 a 12 dígitos cabiam na
     regex e estouravam o `integer` do Postgres na consulta, derrubando o pedido
     inteiro. O limite é o do tipo. */
  it('descarta id acima do integer do Postgres, e aceita o próprio limite', () => {
    expect(lerPerfisPedidos(json(['2147483647', '2147483648', '9999999999', '0', '12']))).toEqual([2147483647, 12])
  })

  it('slug repetido fica só na primeira ocorrência', () => {
    expect(lerPerfisPedidos(json(['5', '5', '7']))).toEqual([5, 7])
  })

  /* O catálogo tem 8 perfis; o teto impede que um JSON forjado vire uma consulta
     com milhares de ids. */
  it('corta no teto de perfis por envio', () => {
    const muitos = Array.from({ length: 500 }, (_, i) => String(i + 1))
    expect(lerPerfisPedidos(json(muitos))).toHaveLength(MAX_PERFIS_POR_ENVIO)
  })

  it('entrada que não é array de slugs vira lista vazia, sem lançar', () => {
    for (const bruto of ['', 'não é json', '{"slug":"1"}', '"texto"', '42', 'null', '[1,2,3]', '[null]']) {
      expect(lerPerfisPedidos(bruto), bruto).toEqual([])
    }
  })

  /* ⚠️ O formato antigo, `[{ slug, quantidade }]`, saiu na task 020. Uma aba
     aberta desde antes do deploy manda o formato velho: melhor o pedido chegar
     sem perfis — e com a descrição — do que o envio estourar. */
  it('formato antigo, com objetos, não quebra: vira lista vazia', () => {
    expect(lerPerfisPedidos(json([{ slug: '12', quantidade: 2 }]))).toEqual([])
  })
})

describe('resumoDaSolicitacao (o que o comercial lê)', () => {
  it('lista os perfis com o nível', () => {
    const r = resumoDaSolicitacao({
      descricao: '',
      perfis: [
        { cargo: 'Data Engineer', nivel: 'Senior' },
        { cargo: 'Cloud Architect', nivel: 'Lead / Principal' },
      ],
    })
    expect(r).toContain('Perfis solicitados:')
    expect(r).toContain('- Data Engineer (Senior)')
    expect(r).toContain('- Cloud Architect (Lead / Principal)')
  })

  /* Veio pelo "Não encontrou um consultor nesta lista?": o comercial precisa
     saber que não é um formulário vazio por engano. */
  it('sem perfis, diz isso explicitamente e traz a descrição', () => {
    const r = resumoDaSolicitacao({ perfis: [], descricao: '  Especialista em SAP com Databricks  ' })
    expect(r).toContain('Nenhum perfil do catálogo selecionado')
    expect(r).toContain('Descrição do visitante:\nEspecialista em SAP com Databricks')
  })

  it('separa os blocos com linha em branco', () => {
    const r = resumoDaSolicitacao({ perfis: [{ cargo: 'A', nivel: 'B' }], descricao: 'contexto' })
    expect(r.split('\n\n')).toHaveLength(2)
  })

  it('sem descrição, o resumo é só o bloco dos perfis', () => {
    const r = resumoDaSolicitacao({ perfis: [{ cargo: 'A', nivel: 'B' }], descricao: '   ' })
    expect(r).toBe('Perfis solicitados:\n- A (B)')
  })
})
