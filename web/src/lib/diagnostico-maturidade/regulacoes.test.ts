import { describe, expect, it } from 'vitest'

import {
  PERGUNTAS,
  REGULACOES_PADRAO,
  SETORES,
  TAGS_UNIVERSAIS,
  calcular,
  impactosDaPergunta,
  impactosDoSetor,
  perguntasDoSetor,
  regulacoesAvaliaveis,
  resolverRegulacoes,
  type Respostas,
} from '.'

/* 07/10 — a lista de regulações de cada setor pode vir do admin. O que estes
 * testes protegem é a promessa da tela: o que aparece em "Impactos avaliados" é
 * o que o diagnóstico mede. */

const todasAsPiores = (setor: Parameters<typeof perguntasDoSetor>[0]): Respostas =>
  Object.fromEntries(perguntasDoSetor(setor).map((q) => [q.id, 0]))

describe('regulacoesAvaliaveis', () => {
  it('começa pela lista do questionário, na ordem dele', () => {
    for (const { valor } of SETORES) {
      const padrao = REGULACOES_PADRAO[valor]
      expect(regulacoesAvaliaveis(valor).slice(0, padrao.length), valor).toEqual(padrao)
    }
  })

  it('nunca oferece as universais nem repete', () => {
    for (const { valor } of SETORES) {
      const opcoes = regulacoesAvaliaveis(valor)
      expect(new Set(opcoes).size, valor).toBe(opcoes.length)
      for (const tag of TAGS_UNIVERSAIS) expect(opcoes, `${valor}: ${tag}`).not.toContain(tag)
    }
  })

  /* O que sai da lista do questionário só é opção se alguma pergunta do setor a
     carrega: senão a etiqueta apareceria na tela sem nunca somar lacuna. */
  it('fora da lista do questionário, só o que alguma pergunta do setor carrega', () => {
    for (const { valor } of SETORES) {
      const carregadas = new Set(perguntasDoSetor(valor).flatMap((q) => q.alternativas.flatMap((a) => a.tags as readonly string[])))
      const extras = regulacoesAvaliaveis(valor).filter((tag) => !REGULACOES_PADRAO[valor].includes(tag))
      for (const tag of extras) expect(carregadas.has(tag), `${valor}: ${tag}`).toBe(true)
    }
  })

  /* Regulação de outro setor, sem pergunta: Anvisa não é opção para gestoras. */
  it('não oferece regulação que nenhuma pergunta do setor avalia', () => {
    expect(regulacoesAvaliaveis('capitais')).not.toContain('anvisa')
    expect(regulacoesAvaliaveis('capitais')).toContain('ifrs9')
  })
})

describe('resolverRegulacoes', () => {
  it('sem nada do admin, é a lista do questionário inteira', () => {
    expect(resolverRegulacoes(undefined)).toEqual(REGULACOES_PADRAO)
    expect(resolverRegulacoes({})).toEqual(REGULACOES_PADRAO)
    expect(resolverRegulacoes({ capitais: [], saude: null })).toEqual(REGULACOES_PADRAO)
  })

  it('respeita a escolha e a ordem do admin, só no setor mexido', () => {
    const r = resolverRegulacoes({ capitais: ['pld', 'cvm'] })
    expect(r.capitais).toEqual(['pld', 'cvm'])
    expect(r.financeiro).toEqual(REGULACOES_PADRAO.financeiro)
  })

  /* A base mudou de versão e um código saiu das opções: some, em vez de virar
     etiqueta com o código cru. Se não sobrar nada, vale a lista do questionário. */
  it('descarta código que não é opção do setor, e repetido', () => {
    expect(resolverRegulacoes({ capitais: ['cvm', 'anvisa', 'cvm', 'inexistente'] }).capitais).toEqual(['cvm'])
    expect(resolverRegulacoes({ capitais: ['anvisa'] }).capitais).toEqual(REGULACOES_PADRAO.capitais)
  })
})

describe('a mesma lista na tela, na pergunta e no resultado', () => {
  const semAnbima = resolverRegulacoes({ capitais: ['cvm', 'cvm244', 'pld'] })

  it('tirar uma regulação do setor tira a etiqueta do perfil', () => {
    expect(impactosDoSetor('capitais').map((i) => i.tag)).toContain('anbima')
    expect(impactosDoSetor('capitais', semAnbima).map((i) => i.tag)).not.toContain('anbima')
    /* As universais continuam na frente. */
    expect(impactosDoSetor('capitais', semAnbima).slice(0, 3).map((i) => i.tag)).toEqual(['lgpd', 'anpd', 'ia'])
  })

  it('…tira a etiqueta "Impacta:" das perguntas', () => {
    const comAnbima = PERGUNTAS.filter((q) => impactosDaPergunta(q, 'capitais').some((i) => i.tag === 'anbima'))
    expect(comAnbima.length).toBeGreaterThan(0)
    for (const q of comAnbima) expect(impactosDaPergunta(q, 'capitais', semAnbima).map((i) => i.tag)).not.toContain('anbima')
  })

  it('…e tira a lacuna do resultado, sem mexer na média', () => {
    const respostas = todasAsPiores('capitais')
    const antes = calcular('capitais', respostas)
    const depois = calcular('capitais', respostas, semAnbima)
    expect(antes.gaps.anbima).toBeGreaterThan(0)
    expect(depois.gaps.anbima).toBeUndefined()
    expect(depois.media).toBe(antes.media)
    expect(depois.gaps.cvm).toBe(antes.gaps.cvm)
  })

  it('incluir uma regulação avaliável passa a somar lacuna para ela', () => {
    const comIfrs9 = resolverRegulacoes({ capitais: [...REGULACOES_PADRAO.capitais, 'ifrs9'] })
    const respostas = todasAsPiores('capitais')
    expect(calcular('capitais', respostas).gaps.ifrs9).toBeUndefined()
    expect(calcular('capitais', respostas, comIfrs9).gaps.ifrs9).toBeGreaterThan(0)
    expect(impactosDoSetor('capitais', comIfrs9).map((i) => i.tag)).toContain('ifrs9')
  })

  /* Sem o parâmetro, é o questionário do Roger — o que `motor.test.ts` compara
     com o HTML original. */
  it('sem lista do admin, nada muda', () => {
    for (const { valor } of SETORES) {
      const respostas = todasAsPiores(valor)
      expect(calcular(valor, respostas, REGULACOES_PADRAO), valor).toEqual(calcular(valor, respostas))
      expect(impactosDoSetor(valor, REGULACOES_PADRAO), valor).toEqual(impactosDoSetor(valor))
    }
  })
})
