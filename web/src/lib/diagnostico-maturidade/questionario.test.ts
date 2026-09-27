import { describe, expect, it } from 'vitest'

import { SETORES, perguntasDoSetor, type Setor } from '.'
import {
  estadoInicial,
  etapaAtual,
  indiceDaTecla,
  podeAvancar,
  progresso,
  questionario,
  rotuloDaEtapa,
  type AcaoDoQuestionario,
  type EstadoDoQuestionario,
} from './questionario'

const aplicar = (estado: EstadoDoQuestionario, ...acoes: AcaoDoQuestionario[]) => acoes.reduce(questionario, estado)

/** Perfil completo e "Começar" — a pessoa na primeira pergunta. */
function comecado(setor: Setor = 'saude'): EstadoDoQuestionario {
  return aplicar(
    estadoInicial(setor),
    { tipo: 'preencher', campo: 'porte', valor: '1_5bi' },
    { tipo: 'preencher', campo: 'cargo', valor: 'cio_cto_cdo' },
    { tipo: 'avancar' },
  )
}

/** Responde a pergunta da tela com a alternativa `indice` e avança. */
function responderEAvancar(estado: EstadoDoQuestionario, indice = 0): EstadoDoQuestionario {
  const etapa = etapaAtual(estado)
  if (etapa.tipo !== 'pergunta') throw new Error(`esperava pergunta, veio ${etapa.tipo}`)
  return aplicar(estado, { tipo: 'responder', perguntaId: etapa.pergunta.id, indice }, { tipo: 'avancar' })
}

describe('perfil', () => {
  it('abre com o setor que veio da URL e sem erros', () => {
    const estado = estadoInicial('saude')
    expect(estado.perfil).toEqual({ setor: 'saude', porte: null, cargo: null })
    expect(etapaAtual(estado)).toEqual({ tipo: 'perfil' })
    expect(rotuloDaEtapa(etapaAtual(estado))).toBe('Perfil')
    expect(estado.invalidos).toEqual([])
  })

  it('valor fora da lista — inclusive o "Selecione…" — vira vazio', () => {
    const estado = aplicar(
      estadoInicial('saude'),
      { tipo: 'preencher', campo: 'setor', valor: 'xpto' },
      { tipo: 'preencher', campo: 'porte', valor: '' },
      { tipo: 'preencher', campo: 'cargo', valor: 'constructor' },
    )
    expect(estado.perfil).toEqual({ setor: null, porte: null, cargo: null })
  })

  it('"Começar" sem os três não sai do perfil e aponta o que falta, na ordem do HTML', () => {
    const estado = aplicar(estadoInicial(null), { tipo: 'preencher', campo: 'porte', valor: '1_5bi' }, { tipo: 'avancar' })
    expect(estado.passo).toBe(0)
    expect(estado.invalidos).toEqual(['setor', 'cargo'])
  })

  it('preencher um campo apaga só o erro dele', () => {
    const estado = aplicar(estadoInicial(null), { tipo: 'avancar' }, { tipo: 'preencher', campo: 'cargo', valor: 'outro' })
    expect(estado.invalidos).toEqual(['setor', 'porte'])
  })

  it('com os três, "Começar" vai para a primeira pergunta do setor', () => {
    const estado = comecado('financeiro')
    const etapa = etapaAtual(estado)
    expect(estado.passo).toBe(1)
    expect(estado.invalidos).toEqual([])
    expect(etapa.tipo === 'pergunta' && etapa.pergunta.id).toBe(perguntasDoSetor('financeiro')[0].id)
  })
})

describe('perguntas', () => {
  it('guarda o índice da alternativa, e não avança sozinho', () => {
    const estado = comecado()
    const etapa = etapaAtual(estado)
    if (etapa.tipo !== 'pergunta') throw new Error('esperava pergunta')
    const depois = questionario(estado, { tipo: 'responder', perguntaId: etapa.pergunta.id, indice: 2 })
    expect(depois.respostas).toEqual({ [etapa.pergunta.id]: 2 })
    expect(depois.passo).toBe(1)
  })

  it('"Próxima" só anda com a pergunta respondida', () => {
    const estado = comecado()
    expect(podeAvancar(estado)).toBe(false)
    expect(questionario(estado, { tipo: 'avancar' })).toBe(estado)
    expect(responderEAvancar(estado).passo).toBe(2)
  })

  it('ignora resposta de outra pergunta e índice fora das alternativas', () => {
    const estado = comecado()
    const outra = perguntasDoSetor('saude')[5].id
    for (const acao of [
      { tipo: 'responder', perguntaId: outra, indice: 0 },
      { tipo: 'responder', perguntaId: perguntasDoSetor('saude')[0].id, indice: 4 },
      { tipo: 'responder', perguntaId: perguntasDoSetor('saude')[0].id, indice: -1 },
      { tipo: 'responder', perguntaId: perguntasDoSetor('saude')[0].id, indice: 1.5 },
    ] as const) {
      expect(questionario(estado, acao).respostas, JSON.stringify(acao)).toEqual({})
    }
  })

  it('no perfil, resposta nenhuma entra', () => {
    const estado = estadoInicial('saude')
    expect(questionario(estado, { tipo: 'responder', perguntaId: 'gov_estrategia', indice: 0 })).toBe(estado)
  })

  it('avanço automático agendado numa tela não empurra outra', () => {
    const naPrimeira = comecado()
    const etapa = etapaAtual(naPrimeira)
    if (etapa.tipo !== 'pergunta') throw new Error('esperava pergunta')
    const respondida = questionario(naPrimeira, { tipo: 'responder', perguntaId: etapa.pergunta.id, indice: 1 })

    // A pessoa voltou ao perfil antes dos 350 ms: a ordem velha não vale.
    const voltou = questionario(respondida, { tipo: 'voltar' })
    expect(questionario(voltou, { tipo: 'avancar', de: 1 })).toBe(voltou)

    // Na mesma tela, vale.
    expect(questionario(respondida, { tipo: 'avancar', de: 1 }).passo).toBe(2)
  })
})

describe('voltar', () => {
  it('volta uma tela e mantém a resposta dada', () => {
    const naSegunda = responderEAvancar(comecado(), 3)
    const voltou = questionario(naSegunda, { tipo: 'voltar' })
    const etapa = etapaAtual(voltou)
    expect(voltou.passo).toBe(1)
    expect(etapa.tipo === 'pergunta' && etapa.resposta).toBe(3)
  })

  it('no perfil não há para onde voltar', () => {
    const estado = estadoInicial(null)
    expect(questionario(estado, { tipo: 'voltar' })).toBe(estado)
  })
})

describe('trocar de setor', () => {
  it('trocar e começar de novo zera as respostas', () => {
    const respondido = responderEAvancar(responderEAvancar(comecado('saude')))
    expect(Object.keys(respondido.respostas)).toHaveLength(2)

    const noPerfil = aplicar(respondido, { tipo: 'voltar' }, { tipo: 'voltar' }, { tipo: 'voltar' })
    expect(noPerfil.passo).toBe(0)
    const outroSetor = aplicar(
      noPerfil,
      { tipo: 'preencher', campo: 'setor', valor: 'varejo' },
      { tipo: 'avancar' },
    )
    expect(outroSetor.passo).toBe(1)
    expect(outroSetor.setorDasRespostas).toBe('varejo')
    expect(outroSetor.respostas).toEqual({})
  })

  it('ida e volta no select sem começar não perde nada (o HTML só compara no "Começar")', () => {
    const respondido = responderEAvancar(comecado('saude'))
    const mesmoSetor = aplicar(
      respondido,
      { tipo: 'voltar' },
      { tipo: 'voltar' },
      { tipo: 'preencher', campo: 'setor', valor: 'varejo' },
      { tipo: 'preencher', campo: 'setor', valor: 'saude' },
      { tipo: 'avancar' },
    )
    expect(mesmoSetor.passo).toBe(1)
    expect(mesmoSetor.respostas).toEqual(respondido.respostas)
  })
})

describe('as oito rotas do questionário', () => {
  for (const { valor: setor } of SETORES) {
    it(`${setor}: uma tela por pergunta do motor, e o contato é o fim da linha`, () => {
      const total = perguntasDoSetor(setor).length
      let estado = comecado(setor)

      for (let n = 1; n <= total; n++) {
        const etapa = etapaAtual(estado)
        expect(rotuloDaEtapa(etapa)).toBe(`Pergunta ${n} de ${total}`)
        expect(progresso(estado)).toBe(Math.round((n / (total + 2)) * 100))
        estado = responderEAvancar(estado, n % 4)
      }

      expect(etapaAtual(estado)).toEqual({ tipo: 'contato' })
      expect(rotuloDaEtapa(etapaAtual(estado))).toBe('Contato')
      expect(Object.keys(estado.respostas)).toEqual(perguntasDoSetor(setor).map((q) => q.id))
      expect(podeAvancar(estado)).toBe(false)
      // Índice limite: no contato, avançar não passa do fim.
      expect(questionario(estado, { tipo: 'avancar' })).toBe(estado)
      expect(questionario(estado, { tipo: 'voltar' }).passo).toBe(total)
    })
  }

  it('a barra começa em zero no perfil', () => {
    expect(progresso(estadoInicial(null))).toBe(0)
    expect(progresso(estadoInicial('saude'))).toBe(0)
  })
})

describe('conclusão', () => {
  /** Todas as perguntas respondidas: a pessoa no contato. */
  function noContato(setor: Setor = 'saude'): EstadoDoQuestionario {
    let estado = comecado(setor)
    while (etapaAtual(estado).tipo === 'pergunta') estado = responderEAvancar(estado, 1)
    return estado
  }

  it('o contato ainda não é 100%: a barra só enche com o envio aceito', () => {
    for (const { valor: setor } of SETORES) {
      const estado = noContato(setor)
      expect(etapaAtual(estado)).toEqual({ tipo: 'contato' })
      expect(progresso(estado), setor).toBeLessThan(100)
    }
  })

  it('com o envio aceito, é a conclusão: "Concluído" e a barra cheia', () => {
    const estado = noContato()
    expect(etapaAtual(estado, true)).toEqual({ tipo: 'conclusao' })
    expect(rotuloDaEtapa(etapaAtual(estado, true))).toBe('Concluído')
    expect(progresso(estado, true)).toBe(100)
  })

  it('a resposta da action manda sobre o passo — inclusive o perfil do envio sem JavaScript', () => {
    // Sem JS a página volta do servidor com o reducer no estado inicial.
    const inicial = estadoInicial(null)
    expect(etapaAtual(inicial, true)).toEqual({ tipo: 'conclusao' })
    expect(progresso(inicial, true)).toBe(100)
  })
})

describe('atalhos de teclado', () => {
  it('A–E e 1–5, maiúscula ou minúscula', () => {
    expect(['a', 'B', 'c', 'D', 'e'].map(indiceDaTecla)).toEqual([0, 1, 2, 3, 4])
    expect(['1', '2', '3', '4', '5'].map(indiceDaTecla)).toEqual([0, 1, 2, 3, 4])
  })

  it('o resto não é atalho', () => {
    expect(['f', '0', '6', 'Enter', 'ArrowDown', ' ', ''].map(indiceDaTecla)).toEqual([
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ])
  })
})
