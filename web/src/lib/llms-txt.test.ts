import { describe, expect, it } from 'vitest'

import type { ConteudoRecomendavel } from '@/types/content'

import { MAX_ARTIGOS_NO_LLMS_TXT, montarLlmsTxt } from './llms-txt'

const item = (tipo: ConteudoRecomendavel['tipo'], titulo: string, href: string, resumo = ''): ConteudoRecomendavel => ({
  codigo: `${tipo}-${titulo}`,
  tipo,
  titulo,
  resumo,
  href,
})

describe('llms.txt', () => {
  const texto = montarLlmsTxt({
    origem: 'https://www.atra.com.br',
    resumo: 'Consultoria de Dados e IA.',
    catalogo: [
      item('solucao', 'Governança de Dados', '/solucoes/governanca', 'Políticas e qualidade'),
      item('artigo', 'Um artigo', '/blog/um-artigo'),
      item('segmento', 'Saúde', '/segmentos/saude'),
    ],
  })

  /* O formato: H1 com o nome, citação com o resumo, H2 por grupo. */
  it('abre com o nome e o resumo', () => {
    expect(texto.startsWith('# ATRA\n\n> Consultoria de Dados e IA.\n')).toBe(true)
  })

  it('link absoluto, com o resumo depois de dois-pontos', () => {
    expect(texto).toContain('- [Governança de Dados](https://www.atra.com.br/solucoes/governanca): Políticas e qualidade')
  })

  it('item sem resumo não deixa dois-pontos solto', () => {
    expect(texto).toContain('- [Saúde](https://www.atra.com.br/segmentos/saude)\n')
  })

  it('grupo vazio não aparece', () => {
    expect(texto).not.toContain('## Webinars')
  })

  it('artigos vão em Optional, depois do mapa do site', () => {
    const opcional = texto.slice(texto.indexOf('## Optional'))
    expect(opcional).toContain('sitemap.xml')
    expect(opcional).toContain('[Um artigo]')
    expect(texto.indexOf('[Um artigo]')).toBeGreaterThan(texto.indexOf('## Optional'))
  })

  /* Colchete no título fecharia o texto do link antes da hora. */
  it('tira colchetes e quebras do título', () => {
    const t = montarLlmsTxt({ origem: 'o', resumo: 'r', catalogo: [item('case', 'Case [piloto]\nnovo', '/c')] })
    expect(t).toContain('- [Case piloto novo](o/c)')
  })

  it(`no máximo ${MAX_ARTIGOS_NO_LLMS_TXT} artigos`, () => {
    const muitos = Array.from({ length: MAX_ARTIGOS_NO_LLMS_TXT + 5 }, (_, i) => item('artigo', `A${i}`, `/blog/a${i}`))
    const t = montarLlmsTxt({ origem: 'o', resumo: 'r', catalogo: muitos })
    expect(t.match(/\[A\d+\]/g)).toHaveLength(MAX_ARTIGOS_NO_LLMS_TXT)
  })
})
