import { describe, expect, it } from 'vitest'

import { CAMINHO_QUE_VIRA_BOTAO, PAINEL, SEGUNDO_BOTAO, semOCaminhoQueViraBotao } from './painel-de-conversao'

/* 06/10: o terceiro caminho do painel vira o segundo botão. A regra precisa
 * tirar só o caminho que a migração de 02/10 gravou — o que o marketing já
 * reescreveu é dele (D-22). */
describe('semOCaminhoQueViraBotao', () => {
  const originais = PAINEL.pt.paths.map((p, i) => ({ id: `p${i}`, ...p }))

  it('tira o terceiro e mantém os outros dois, com os ids', () => {
    expect(CAMINHO_QUE_VIRA_BOTAO).toBe('Cortar custo e risco em nuvem')
    expect(semOCaminhoQueViraBotao(originais)?.map((p) => p.id)).toEqual(['p0', 'p1'])
  })

  it('caminho reescrito no admin fica: não há o que tirar', () => {
    const reescritos = originais.map((p, i) => (i === 2 ? { ...p, title: 'Dados e IA no seu negócio' } : p))
    expect(semOCaminhoQueViraBotao(reescritos)).toBeNull()
    expect(semOCaminhoQueViraBotao([])).toBeNull()
  })

  it('o botão leva ao diagnóstico, como os caminhos levavam', () => {
    expect(SEGUNDO_BOTAO.secondaryCtaHref).toBe(PAINEL.pt.paths[2].href)
    expect(SEGUNDO_BOTAO.pt.secondaryCtaLabel).toBe('Faça seu diagnóstico agora')
  })
})
