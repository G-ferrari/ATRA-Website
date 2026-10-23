import { describe, expect, it } from 'vitest'

import { caminhoComAlias, hrefNoIdioma, localizarHref } from './routes'

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

  /* `/contato` numa página em inglês leva ao português: de propósito ou por
     descuido, escolher é decisão de conteúdo (D-22). */
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

describe('hrefNoIdioma', () => {
  it('no português, devolve o caminho como o admin guardou', () => {
    expect(hrefNoIdioma('/sobre', 'pt')).toBe('/sobre')
    expect(hrefNoIdioma('/', 'pt')).toBe('/')
  })

  it('no inglês, põe o idioma já com a seção traduzida', () => {
    expect(hrefNoIdioma('/sobre', 'en')).toBe('/en/about')
    expect(hrefNoIdioma('/parceiros/google-cloud', 'en')).toBe('/en/partners/google-cloud')
    expect(hrefNoIdioma('/contato?origem=menu#form', 'en')).toBe('/en/contact?origem=menu#form')
    expect(hrefNoIdioma('/insights', 'en')).toBe('/en/insights')
    expect(hrefNoIdioma('/', 'en')).toBe('/en')
    expect(hrefNoIdioma('/#fale-conosco', 'en')).toBe('/en/#fale-conosco')
  })

  it('âncora solta e endereço externo passam intactos', () => {
    expect(hrefNoIdioma('#', 'en')).toBe('#')
    expect(hrefNoIdioma('https://erp.atra.com.br/', 'en')).toBe('https://erp.atra.com.br/')
    expect(hrefNoIdioma('//atra.com.br/sobre', 'en')).toBe('//atra.com.br/sobre')
  })
})
