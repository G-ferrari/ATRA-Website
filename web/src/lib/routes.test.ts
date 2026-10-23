import { describe, expect, it } from 'vitest'

import { caminhoComAlias, lerCaminhoPortugues, linkNoIdioma, localizarHref, type SlugDoItem } from './routes'

/* #210 (23/10): os links do admin com o caminho português debaixo de `/en`
 * funcionavam, mas cada um custava um 308 do `proxy.ts`. Os oito exemplos são
 * os que apareceram na homologação, no rodapé de `/en`, `/en/solutions`,
 * `/en/segments`, `/en/blog` e `/en/webinars`. */
const OS_OITO_DA_HOMOLOGACAO: [string, string][] = [
  ['/en/solucoes', '/en/solutions'],
  ['/en/sobre', '/en/about'],
  ['/en/parceiros/google-cloud', '/en/partners/google-cloud'],
  ['/en/segmentos', '/en/segments'],
  ['/en/consultores', '/en/consultants'],
  ['/en/cases-de-sucesso', '/en/success-stories'],
  ['/en/carreiras', '/en/careers'],
  ['/en/politicas-e-termos', '/en/privacy-and-terms'],
]

describe('localizarHref', () => {
  it.each(OS_OITO_DA_HOMOLOGACAO)('%s sai como %s', (href, esperado) => {
    expect(localizarHref(href)).toBe(esperado)
  })

  it('preserva a âncora', () => {
    expect(localizarHref('/en/sobre#quem-somos')).toBe('/en/about#quem-somos')
  })

  it('preserva a query, e a âncora depois dela', () => {
    expect(localizarHref('/en/diagnostico-maturidade?setor=financeiro')).toBe(
      '/en/data-maturity-assessment?setor=financeiro',
    )
    expect(localizarHref('/en/cases-de-sucesso/abc?x=1#topo')).toBe('/en/success-stories/abc?x=1#topo')
  })

  it('não toca em link para fora do site', () => {
    for (const href of [
      'https://atra.com.br/en/solucoes',
      '//atra.com.br/en/solucoes',
      'mailto:contato@atra.com.br',
      'https://api.whatsapp.com/send/?phone=5511999999999',
    ]) {
      expect(localizarHref(href)).toBe(href)
    }
  })

  it('não toca em link já em inglês', () => {
    for (const href of ['/en/solutions', '/en/partners/google-cloud', '/en/about#x', '/en', '/en/']) {
      expect(localizarHref(href)).toBe(href)
    }
  })

  it('seção com o mesmo nome nos dois idiomas fica como está', () => {
    expect(localizarHref('/en/blog/um-artigo')).toBe('/en/blog/um-artigo')
    expect(localizarHref('/en/insights')).toBe('/en/insights')
  })

  /* Só o endereço conta aqui: o português sem `/en` depende do idioma da
     página e do banco, e é com `linkNoIdioma` (D-71). */
  it('não toca em link português sem /en', () => {
    for (const href of ['/contato', '/solucoes/rc18', '/sobre#quem-somos', '/', '/#fale-conosco']) {
      expect(localizarHref(href)).toBe(href)
    }
  })

  it('só o primeiro segmento depois do idioma é traduzido, como no proxy', () => {
    expect(localizarHref('/en/solucoes/sobre')).toBe('/en/solutions/sobre')
  })

  it('não toca em âncora solta nem em caminho sem barra', () => {
    expect(localizarHref('#contato')).toBe('#contato')
    expect(localizarHref('en/solucoes')).toBe('en/solucoes')
    expect(localizarHref('')).toBe('')
  })
})

describe('caminhoComAlias', () => {
  /* A regra do 308 do `proxy.ts`: é ela que `localizarHref` usa, e não uma
     segunda tabela. */
  it('é o destino do 308 do proxy', () => {
    expect(caminhoComAlias('/en/cases-de-sucesso/x')).toBe('/en/success-stories/x')
    expect(caminhoComAlias('/en/success-stories/x')).toBeNull()
    expect(caminhoComAlias('/en')).toBeNull()
    expect(caminhoComAlias('/en/')).toBeNull()
    expect(caminhoComAlias('/solucoes')).toBeNull()
    expect(caminhoComAlias('/pt/solucoes')).toBeNull()
  })
})

describe('lerCaminhoPortugues', () => {
  it('reconhece a página inicial, a seção e o item, com o sufixo à parte', () => {
    expect(lerCaminhoPortugues('/')).toEqual({ tipo: 'inicio', sufixo: '' })
    expect(lerCaminhoPortugues('/#fale-conosco')).toEqual({ tipo: 'inicio', sufixo: '#fale-conosco' })
    expect(lerCaminhoPortugues('/contato?x=1')).toEqual({ tipo: 'secao', secao: 'contato', sufixo: '?x=1' })
    expect(lerCaminhoPortugues('/cases-de-sucesso/abc#topo')).toEqual({
      tipo: 'item',
      secao: 'cases',
      slug: 'abc',
      sufixo: '#topo',
    })
  })

  it('o que a tabela não conhece, ou já tem idioma, não é caminho português', () => {
    for (const href of ['/roadmap', '/blog/pagina/2', '/sobre/x', '/en/sobre', '/pt/sobre', '#x', 'https://x.com', '//x.com']) {
      expect(lerCaminhoPortugues(href)).toBeNull()
    }
  })
})

/* D-71 (23/10): numa página em inglês, o link português sem `/en` vai para o
 * inglês quando a página existe no inglês. */
describe('linkNoIdioma', () => {
  // O banco, de mentira: o case `com-ingles` tem slug inglês; `so-portugues`, não.
  const slugDoItem: SlugDoItem = (secao, slug) =>
    secao === 'cases' && slug === 'com-ingles' ? 'with-english' : secao === 'parceiros' && slug === 'aws' ? 'aws' : null

  it('seção: sempre existe no inglês, porque a rota é traduzida', () => {
    expect(linkNoIdioma('/contato', 'en', slugDoItem)).toBe('/en/contact')
    expect(linkNoIdioma('/chat', 'en', slugDoItem)).toBe('/en/chat')
    expect(linkNoIdioma('/cases-de-sucesso', 'en', slugDoItem)).toBe('/en/success-stories')
    expect(linkNoIdioma('/blog', 'en', slugDoItem)).toBe('/en/blog')
  })

  it('página inicial, com a âncora', () => {
    expect(linkNoIdioma('/', 'en')).toBe('/en')
    expect(linkNoIdioma('/#fale-conosco', 'en')).toBe('/en#fale-conosco')
  })

  it('item com inglês: vai ao slug inglês', () => {
    expect(linkNoIdioma('/cases-de-sucesso/com-ingles', 'en', slugDoItem)).toBe('/en/success-stories/with-english')
    expect(linkNoIdioma('/parceiros/aws', 'en', slugDoItem)).toBe('/en/partners/aws')
  })

  it('item sem inglês: continua levando ao português', () => {
    expect(linkNoIdioma('/cases-de-sucesso/so-portugues', 'en', slugDoItem)).toBe('/cases-de-sucesso/so-portugues')
    expect(linkNoIdioma('/solucoes/rc18', 'en', slugDoItem)).toBe('/solucoes/rc18')
    // Sem quem responda pelo banco (o texto rico), todo item fica em português.
    expect(linkNoIdioma('/cases-de-sucesso/com-ingles', 'en')).toBe('/cases-de-sucesso/com-ingles')
  })

  it('preserva a âncora e a query', () => {
    expect(linkNoIdioma('/diagnostico-maturidade?setor=financeiro', 'en')).toBe(
      '/en/data-maturity-assessment?setor=financeiro',
    )
    expect(linkNoIdioma('/sobre#quem-somos', 'en')).toBe('/en/about#quem-somos')
    expect(linkNoIdioma('/cases-de-sucesso/com-ingles?x=1#topo', 'en', slugDoItem)).toBe(
      '/en/success-stories/with-english?x=1#topo',
    )
    expect(linkNoIdioma('/cases-de-sucesso/so-portugues#topo', 'en', slugDoItem)).toBe('/cases-de-sucesso/so-portugues#topo')
  })

  it('na página em português, nada muda', () => {
    for (const href of ['/contato', '/', '/#fale-conosco', '/cases-de-sucesso/com-ingles', '/diagnostico-maturidade?setor=financeiro']) {
      expect(linkNoIdioma(href, 'pt', slugDoItem)).toBe(href)
    }
  })

  it('/en/<português> sai traduzido nos dois idiomas, como o proxy faria', () => {
    expect(linkNoIdioma('/en/sobre', 'pt')).toBe('/en/about')
    expect(linkNoIdioma('/en/sobre', 'en')).toBe('/en/about')
  })

  it('link externo, já em inglês, âncora solta e endereço desconhecido ficam como estão', () => {
    for (const href of ['https://api.whatsapp.com/send/?phone=5511999999999', '/en/solutions', '#contato', '/roadmap', '/blog/pagina/2']) {
      expect(linkNoIdioma(href, 'en', slugDoItem)).toBe(href)
    }
  })
})
