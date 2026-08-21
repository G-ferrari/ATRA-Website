import { describe, expect, it } from 'vitest'

import { conteudoDeSegmento, conteudoDeSolucao, iconeDeItem } from './paginas-wp'

/* Reproduz o molde das 8 páginas: manchete, chamada, cabeçalho da grade, os
   cards e o rodapé do template. */
const PAGINA = `
<div class="elementor">
  <h2>saúde e ciências da vida</h2>
  <p>Integre dados clínicos de forma eficiente, agregando mais eficiência ao atendimento.</p>
  <h2>Produtos e Soluções para empresas de Saúde</h2>
  <p>Descubra nossas soluções em dados.</p>
  <h2>Análises críticas</h2>
  <p>Garanta o apoio a descobertas de informações clínicas.</p>
  <h2>Conectividade na Nuvem</h2>
  <p>Habilite os administradores do Salesforce.</p>
  <h2>Governança de Dados</h2>
  <p>Abasteça seu diretor executivo de dados com dados confiáveis.</p>
  <h3>Somos parceiros das maiores empresas de tecnologia</h3>
  <img src="/logo.png" alt="" />
  <h2>Entre em contato com nossa equipe de especialistas</h2>
  <p>Fale com a gente.</p>
</div>`

describe('conteudoDeSegmento', () => {
  const c = conteudoDeSegmento(PAGINA)

  it('separa manchete e chamada', () => {
    expect(c.manchete).toBe('saúde e ciências da vida')
    expect(c.chamada).toBe('Integre dados clínicos de forma eficiente, agregando mais eficiência ao atendimento.')
  })

  it('lê o cabeçalho da grade', () => {
    expect(c.grade).toEqual({
      titulo: 'Produtos e Soluções para empresas de Saúde',
      intro: 'Descubra nossas soluções em dados.',
    })
  })

  it('junta os cards em pares título + parágrafo', () => {
    expect(c.itens.map((i) => i.titulo)).toEqual(['Análises críticas', 'Conectividade na Nuvem', 'Governança de Dados'])
    expect(c.itens[2].texto).toBe('Abasteça seu diretor executivo de dados com dados confiáveis.')
  })

  /* O rodapé é o mesmo em toda página do site: entraria como card em todas as
     8 verticais, e o "Fale com a gente" viraria a descrição dele. */
  it('para no rodapé do template', () => {
    const tudo = JSON.stringify(c)
    expect(tudo).not.toMatch(/Somos parceiros|Entre em contato|Fale com a gente/)
  })

  it('não estoura em página fora do molde', () => {
    expect(conteudoDeSegmento('<div></div>')).toEqual({ manchete: '', chamada: '', grade: null, itens: [] })
  })
})

describe('iconeDeItem', () => {
  it.each([
    ['Governança de Dados', 'shield'],
    ['Conectividade na Nuvem', 'cloud'],
    ['Análises críticas', 'chart'],
    ['Mitigação de Fraude', 'lock'],
    ['Engajamento de pacientes', 'users'],
    ['Smart Meter Operations', 'workflow'],
  ])('lê %j como %j', (titulo, icone) => expect(iconeDeItem(titulo, 'heart')).toBe(icone))

  /* Sem palavra reconhecida, repete o ícone da vertical em vez de sortear um. */
  it('cai no ícone da vertical quando o título não diz nada', () => {
    expect(iconeDeItem('Intercâmbio', 'heart')).toBe('heart')
  })
})

/* A página de solução tem outra forma: cabeçalho de seção seguido de
   parágrafos soltos. 8 das 13 estão assim. */
const PAGINA_DE_SOLUCAO = `
<div class="elementor">
  <h2>CUSTOMER 360º</h2>
  <p>Tome decisões fundamentadas em dados confiáveis dos seus clientes em tempo real</p>
  <h2>Saiba tudo sobre seu cliente num único lugar</h2>
  <p>Dados dos clientes em um único local.</p>
  <p>Dados dos clientes em tempo real e confiável.</p>
  <ul><li>Visão única do cliente</li></ul>
  <h3>Somos parceiros das maiores empresas de tecnologia</h3>
  <h2>Entre em contato com nossa equipe de especialistas</h2>
</div>`

describe('conteudoDeSolucao', () => {
  const c = conteudoDeSolucao(PAGINA_DE_SOLUCAO)

  it('usa o primeiro parágrafo como chamada e descarta a manchete repetida', () => {
    expect(c.chamada).toBe('Tome decisões fundamentadas em dados confiáveis dos seus clientes em tempo real')
    expect(c.corpo).not.toMatch(/CUSTOMER 360/)
  })

  /* O ponto da função: sem par título+texto, o texto solto tem que sobreviver.
     Uma grade de cards devolveria zero itens e jogaria os parágrafos fora. */
  it('preserva os parágrafos soltos e as listas', () => {
    expect(c.corpo).toMatch(/Saiba tudo sobre seu cliente/)
    expect(c.corpo).toMatch(/Dados dos clientes em tempo real/)
    expect(c.corpo).toMatch(/<ul>/)
  })

  it('corta o rodapé do template', () => {
    expect(c.corpo).not.toMatch(/Somos parceiros|Entre em contato/)
  })
})
