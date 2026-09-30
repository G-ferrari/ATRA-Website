import { describe, expect, it } from 'vitest'

import { FIM_PT, jaTemOFimPadrao, semAncoraDeContato, trocarOFim } from './fim-das-paginas'

/* O que estes testes protegem: a migração reescreve o fim de 23 páginas no
 * deploy, e o erro de formato só apareceria lá — página sem faixa, faixa
 * duplicada ou botão levando a uma âncora que não existe mais. */

const heroi = { blockType: 'pageHero', id: 'h', ctas: [{ label: 'Quero saber mais', href: '#contato' }] }
const faixa = { blockType: 'ctaBanner', id: 'f', variant: 'dark', title: 'Entre em contato com nossa equipe', cta: { label: 'Quero saber mais', href: '#contato' } }
const formulario = { blockType: 'ctaContact', id: 'c', anchor: 'contato' }

describe('trocarOFim', () => {
  it('solução e segmento do WordPress: tira faixa e formulário, põe a faixa padrão', () => {
    const r = trocarOFim([heroi, faixa, formulario])
    expect(r.motivo).toBeNull()
    expect(r.layout!.map((b) => b.blockType)).toEqual(['pageHero', 'ctaBanner'])
    expect(r.layout!.at(-1)).toMatchObject({ variant: 'dark-centered', cta: { href: '/contato' }, secondaryCta: { href: '/chat' } })
  })

  it('IA, RC18 e /sobre: troca só a faixa final', () => {
    const r = trocarOFim([heroi, { blockType: 'accordionSteps', id: 'a' }, faixa])
    expect(r.layout!.map((b) => b.blockType)).toEqual(['pageHero', 'accordionSteps', 'ctaBanner'])
  })

  /* Bloco novo: com o id da faixa antiga, /en seguiria mostrando o texto inglês antigo. */
  it('a faixa nova entra sem id', () => {
    expect(trocarOFim([heroi, faixa]).layout!.at(-1)).not.toHaveProperty('id')
  })

  it('o botão que ia para o formulário passa a ir para /contato', () => {
    const r = trocarOFim([heroi, faixa, formulario])
    expect((r.layout![0] as typeof heroi).ctas[0].href).toBe('/contato')
  })

  it('não mexe em página editada no admin nem em página já trocada', () => {
    expect(trocarOFim([heroi, { blockType: 'richTextSection', id: 'r' }]).motivo).toBe('termina em richTextSection')
    expect(trocarOFim([heroi, formulario, faixa]).motivo).toBe('tem formulário no meio')
    expect(trocarOFim([]).motivo).toBe('termina em nada')

    const trocada = trocarOFim([heroi, faixa]).layout!
    expect(jaTemOFimPadrao(trocada)).toBe(true)
    expect(trocarOFim(trocada).motivo).toBe('já tem o fim padrão')
  })

  it('não altera o conteúdo padrão entre uma página e outra', () => {
    const a = trocarOFim([heroi, faixa]).layout!.at(-1)!
    ;(a.cta as { href: string }).href = '/outro'
    expect(FIM_PT.cta.href).toBe('/contato')
  })
})

describe('semAncoraDeContato', () => {
  it('só troca `href` exatamente igual a #contato', () => {
    expect(
      semAncoraDeContato({ href: '#contato', label: '#contato', outro: { href: '#contatos' }, lista: [{ href: '#contato' }] }),
    ).toEqual({ href: '/contato', label: '#contato', outro: { href: '#contatos' }, lista: [{ href: '/contato' }] })
  })
})
