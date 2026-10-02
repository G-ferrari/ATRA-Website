import { describe, expect, it } from 'vitest'

import { juntarLinksDePoliticas, renomear } from './rodape-legal'

/* A migração reescreve o rodapé no deploy. O risco é apagar link que o
 * marketing pôs à mão, ou mexer num rodapé que já foi arrumado no admin. */

const legal = () => ({
  id: 'col-legal',
  title: 'Legal',
  kind: 'links',
  links: [
    { id: 'l1', label: 'Privacidade', href: '/politicas-e-termos' },
    { id: 'l2', label: 'Termos de Uso', href: '/politicas-e-termos' },
    { id: 'l3', label: 'Cookies', href: '/politicas-e-termos' },
  ],
})

const solucoes = () => ({
  id: 'col-solucoes',
  title: 'Soluções',
  kind: 'links',
  links: [
    { id: 's1', label: 'Inovação & IA', href: '/solucoes' },
    { id: 's2', label: 'Governança & Cultura', href: '/solucoes' },
  ],
})

describe('juntarLinksDePoliticas', () => {
  it('os três links legais viram um, com o id do primeiro', () => {
    const { colunas, mantidos } = juntarLinksDePoliticas([solucoes(), legal()], 'Políticas e Termos')
    expect(colunas[1]).toEqual({
      id: 'col-legal',
      title: 'Legal',
      kind: 'links',
      links: [{ id: 'l1', label: 'Políticas e Termos', href: '/politicas-e-termos' }],
    })
    expect(mantidos).toEqual(['l1'])
  })

  /* Os três links de solução também apontam todos para o mesmo lugar, e ficam:
     a trava é o destino da página de políticas, não "destino repetido". */
  it('não toca em coluna que repete outro destino, nem na de contato', () => {
    const contato = { id: 'col-contato', title: 'Fale Conosco', kind: 'contact', links: [] }
    const { colunas } = juntarLinksDePoliticas([solucoes(), contato, legal()], 'Políticas e Termos')
    expect(colunas[0]).toEqual(solucoes())
    expect(colunas[1]).toEqual(contato)
  })

  it('link para outro lugar na mesma coluna fica onde está', () => {
    const coluna = legal()
    coluna.links.splice(1, 0, { id: 'x1', label: 'Canal de ética', href: '/canal-de-etica' })
    const { colunas } = juntarLinksDePoliticas([coluna], 'Políticas e Termos')
    expect(colunas[0].links).toEqual([
      { id: 'l1', label: 'Políticas e Termos', href: '/politicas-e-termos' },
      { id: 'x1', label: 'Canal de ética', href: '/canal-de-etica' },
    ])
  })

  /* Rodar de novo, ou chegar depois de alguém ter arrumado no admin: um link só
     já é o estado final, e o rótulo que estiver lá é de quem editou. */
  it('com um link só para a página, não há o que juntar', () => {
    const arrumado = { id: 'col-legal', title: 'Legal', kind: 'links', links: [{ id: 'l1', label: 'Privacidade e termos', href: '/politicas-e-termos' }] }
    const { colunas, mantidos } = juntarLinksDePoliticas([arrumado], 'Políticas e Termos')
    expect(colunas).toEqual([arrumado])
    expect(mantidos).toEqual([])
  })

  it('rodapé vazio ou coluna sem links passa sem erro', () => {
    expect(juntarLinksDePoliticas([], 'Políticas e Termos')).toEqual({ colunas: [], mantidos: [] })
    expect(juntarLinksDePoliticas([{ id: 'c', links: null }], 'Políticas e Termos').mantidos).toEqual([])
  })

  it('não altera o que recebeu', () => {
    const original = [legal()]
    juntarLinksDePoliticas(original, 'Políticas e Termos')
    expect(original).toEqual([legal()])
  })
})

describe('renomear', () => {
  it('troca o rótulo só do link que ficou — é o inglês da mesma linha', () => {
    const ingles = [
      { id: 'col-sobre', links: [{ id: 'a1', label: 'About', href: '/sobre' }] },
      { id: 'col-legal', links: [{ id: 'l1', label: 'Privacy', href: '/politicas-e-termos' }] },
    ]
    expect(renomear(ingles, ['l1'], 'Policies and Terms')).toEqual([
      { id: 'col-sobre', links: [{ id: 'a1', label: 'About', href: '/sobre' }] },
      { id: 'col-legal', links: [{ id: 'l1', label: 'Policies and Terms', href: '/politicas-e-termos' }] },
    ])
  })
})
