import { describe, expect, it } from 'vitest'

import {
  PERGUNTAS,
  REGULACOES_PADRAO,
  SETORES,
  TAGS_DO_SETOR,
  calcular,
  impactosDaPergunta,
  impactosNoPerfil,
  perguntasDoSetor,
  resolverRegulacoes,
  type Respostas,
  type Setor,
} from '.'

/* 08/10 — o Roger ditou, setor por setor, o que "Impactos avaliados" mostra.
 * Esta tabela é o pedido dele, na ordem em que falou. ⚠️ Na Educação ele não
 * citou "Marco Legal da IA"; ficou, porque é o setor com mais perguntas sobre
 * IA e a etiqueta vale para todos os outros — a confirmar com ele. */
const DITADO: Record<Setor, string[]> = {
  financeiro: ['BACEN (Banco Central)', 'Open Finance', 'IFRS 9', 'PLD/FT', 'LGPD/ANPD', 'Marco Legal da IA'],
  capitais: ['CVM', 'ANBIMA', 'PLD/FT', 'LGPD/ANPD', 'Marco Legal da IA'],
  seguros: ['SUSEP', 'Open Insurance', 'IFRS 17', 'LGPD/ANPD', 'Marco Legal da IA'],
  saude: ['Anvisa', 'ANS', 'CFM', 'RNDS', 'LGPD/ANPD', 'Marco Legal da IA', 'Reforma Tributária'],
  telecom: ['Anatel', 'ECA Digital', 'Marco Civil da Internet', 'LGPD/ANPD', 'Marco Legal da IA', 'Reforma Tributária'],
  educacao: ['MEC', 'INEP', 'FIES / ProUni', 'ECA Digital', 'LGPD/ANPD', 'Marco Legal da IA', 'Reforma Tributária'],
  varejo: ['CVM', 'LGPD/ANPD', 'Marco Legal da IA', 'Reforma Tributária'],
  outros: ['CVM', 'LGPD/ANPD', 'Marco Legal da IA', 'Reforma Tributária'],
}

const todasAsPiores = (setor: Setor): Respostas => Object.fromEntries(perguntasDoSetor(setor).map((q) => [q.id, 0]))

describe('impactosNoPerfil — a linha que o Roger ditou', () => {
  for (const { valor } of SETORES) {
    it(`${valor}: ${DITADO[valor].join(' · ')}`, () => {
      expect(impactosNoPerfil(valor).map((i) => i.rotulo)).toEqual(DITADO[valor])
    })
  }

  it('nenhuma etiqueta repete, nem no nome nem na chave', () => {
    for (const { valor } of SETORES) {
      const linha = impactosNoPerfil(valor)
      expect(new Set(linha.map((i) => i.tag)).size, valor).toBe(linha.length)
      expect(new Set(linha.map((i) => i.rotulo)).size, valor).toBe(linha.length)
    }
  })
})

describe('a linha é resumo: a conta e as perguntas continuam norma por norma', () => {
  /* A lista padrão tem as mesmas regulações do HTML — só a ordem da Saúde muda. */
  it('a lista padrão é a do questionário, em outra ordem só onde o Roger pediu', () => {
    for (const { valor } of SETORES) {
      expect([...REGULACOES_PADRAO[valor]].sort(), valor).toEqual([...TAGS_DO_SETOR[valor]].sort())
    }
    const fora = SETORES.map((s) => s.valor).filter((s) => REGULACOES_PADRAO[s].join() !== TAGS_DO_SETOR[s].join())
    expect(fora).toEqual(['saude'])
  })

  it('a ordem da lista não muda o resultado', () => {
    for (const { valor } of SETORES) {
      const respostas = todasAsPiores(valor)
      expect(calcular(valor, respostas), valor).toEqual(calcular(valor, respostas, TAGS_DO_SETOR))
    }
  })

  it('a pergunta de um banco ainda diz qual resolução, e a lacuna ainda é dela', () => {
    const daRc18 = PERGUNTAS.filter((q) => impactosDaPergunta(q, 'financeiro').some((i) => i.tag === 'rc18'))
    expect(daRc18.length).toBeGreaterThan(0)
    expect(impactosDaPergunta(daRc18[0], 'financeiro').map((i) => i.rotulo)).toContain('Resolução Conjunta CMN/BCB 18/2025')

    const { gaps } = calcular('financeiro', todasAsPiores('financeiro'))
    expect(gaps.rc18).toBeGreaterThan(0)
    expect(gaps.cmn5274).toBeGreaterThan(0)
    expect(gaps.bcbs239).toBeGreaterThan(0)
  })
})

describe('a lista do admin continua mandando na linha', () => {
  it('o órgão some quando a última norma dele sai do setor', () => {
    const semBacen = resolverRegulacoes({ financeiro: ['openfinance', 'ifrs9', 'pld'] })
    expect(impactosNoPerfil('financeiro', semBacen).map((i) => i.rotulo)).toEqual([
      'Open Finance',
      'IFRS 9',
      'PLD/FT',
      'LGPD/ANPD',
      'Marco Legal da IA',
    ])
  })

  it('…e fica enquanto sobrar uma', () => {
    const soRc18 = resolverRegulacoes({ financeiro: ['openfinance', 'rc18'] })
    expect(impactosNoPerfil('financeiro', soRc18).map((i) => i.rotulo)).toEqual([
      'Open Finance',
      'BACEN (Banco Central)',
      'LGPD/ANPD',
      'Marco Legal da IA',
    ])
  })

  it('a ordem do admin é a da tela', () => {
    const invertida = resolverRegulacoes({ capitais: ['pld', 'anbima', 'cvm244', 'cvm'] })
    expect(impactosNoPerfil('capitais', invertida).map((i) => i.rotulo)).toEqual([
      'PLD/FT',
      'ANBIMA',
      'CVM',
      'LGPD/ANPD',
      'Marco Legal da IA',
    ])
  })

  /* "LGPD (dados de saúde)" entra em LGPD/ANPD, que já está na linha: não
     duplica nem puxa a etiqueta para o meio das do setor. */
  it('norma que cai num órgão de todos não sai do lugar', () => {
    const lgpdNaFrente = resolverRegulacoes({ saude: ['lgpd_saude', 'anvisa'] })
    expect(impactosNoPerfil('saude', lgpdNaFrente).map((i) => i.rotulo)).toEqual([
      'Anvisa',
      'LGPD/ANPD',
      'Marco Legal da IA',
      'Reforma Tributária',
    ])
  })
})
