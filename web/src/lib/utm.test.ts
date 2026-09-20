import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { COOKIE_DE_CONSENTIMENTO, VERSAO_DE_CONSENTIMENTO } from './consentimento'
import {
  CHAVE_DE_SESSAO,
  efetivarUtmSeConsentido,
  esquecerUtmDaChegada,
  guardarUtm,
  lerUtmGuardado,
  limparUtmGuardado,
  utmDaQueryString,
} from './utm'

describe('utmDaQueryString', () => {
  it('extrai os cinco parâmetros', () => {
    const utm = utmDaQueryString(
      '?utm_source=linkedin&utm_medium=cpc&utm_campaign=dados-2026&utm_term=governanca&utm_content=anuncio-b',
    )
    expect(utm).toEqual({
      utm_source: 'linkedin',
      utm_medium: 'cpc',
      utm_campaign: 'dados-2026',
      utm_term: 'governanca',
      utm_content: 'anuncio-b',
    })
  })

  it('devolve vazio quando a URL não tem campanha', () => {
    expect(utmDaQueryString('')).toEqual({})
    expect(utmDaQueryString('?pagina=2&q=governanca')).toEqual({})
  })

  /* Chave presente e vazia é o caso do link montado por ferramenta de campanha
   * que deixou o parâmetro sem valor. Guardar `''` faria a atribuição parecer
   * existir e o CRM registraria origem em branco em vez de "sem origem". */
  it('ignora parâmetro presente mas vazio', () => {
    expect(utmDaQueryString('?utm_source=&utm_medium=email')).toEqual({ utm_medium: 'email' })
  })

  it('descarta espaço em volta', () => {
    expect(utmDaQueryString('?utm_source=%20linkedin%20')).toEqual({ utm_source: 'linkedin' })
  })

  /* A query string é escrita por quem clica no link. Sem teto, um
   * `utm_campaign` de 8 KB entraria inteiro na coluna. */
  it('corta valor absurdamente longo', () => {
    const { utm_campaign: campanha } = utmDaQueryString(`?utm_campaign=${'a'.repeat(5000)}`)
    expect(campanha).toHaveLength(200)
  })

  /* Só as cinco conhecidas. `utm_id`, `gclid` e afins são outra conversa e
   * outro campo — entrar aqui por engano viraria coluna sem dono. */
  it('ignora parâmetro que não é um dos cinco', () => {
    expect(utmDaQueryString('?utm_id=123&gclid=abc&utm_source=google')).toEqual({ utm_source: 'google' })
  })

  /* Repetição acontece com link remontado por encurtador. `URLSearchParams.get`
   * devolve o primeiro, que é o que o clique original carregava. */
  it('fica com a primeira ocorrência quando o parâmetro repete', () => {
    expect(utmDaQueryString('?utm_source=linkedin&utm_source=facebook')).toEqual({ utm_source: 'linkedin' })
  })
})

/* D-30: a captura passou a ser opt-in de marketing. A UTM da chegada espera em
 * memória de módulo e só toca o sessionStorage com o consentimento dado. */
describe('guardarUtm com consentimento (D-30)', () => {
  const armazem = new Map<string, string>()
  const documento = { cookie: '' }

  const consentir = (marketing: boolean) => {
    documento.cookie = `${COOKIE_DE_CONSENTIMENTO}=${encodeURIComponent(
      JSON.stringify({ v: VERSAO_DE_CONSENTIMENTO, analytics: false, marketing, ts: 1 }),
    )}`
  }

  beforeEach(() => {
    armazem.clear()
    documento.cookie = ''
    esquecerUtmDaChegada()
    vi.stubGlobal('sessionStorage', {
      getItem: (k: string) => armazem.get(k) ?? null,
      setItem: (k: string, v: string) => void armazem.set(k, v),
      removeItem: (k: string) => void armazem.delete(k),
    })
    vi.stubGlobal('document', documento)
  })
  afterEach(() => vi.unstubAllGlobals())

  it('sem resposta ao banner, nada toca o armazenamento', () => {
    guardarUtm('?utm_source=linkedin')
    expect(armazem.size).toBe(0)
    expect(lerUtmGuardado()).toEqual({})
  })

  it('com o consentimento já no cookie, a chegada grava direto', () => {
    consentir(true)
    guardarUtm('?utm_source=linkedin&utm_medium=cpc')
    expect(lerUtmGuardado()).toEqual({ utm_source: 'linkedin', utm_medium: 'cpc' })
  })

  /* O caso que a memória de módulo existe para resolver: o visitante chega com
     UTM, navega, e só aceita marketing páginas depois — quando a URL já não
     tem parâmetro nenhum. */
  it('consentimento tardio efetiva a UTM da chegada', () => {
    guardarUtm('?utm_source=linkedin')
    expect(lerUtmGuardado()).toEqual({})

    consentir(true)
    efetivarUtmSeConsentido()
    expect(lerUtmGuardado()).toEqual({ utm_source: 'linkedin' })
  })

  it('recusa de marketing não efetiva nada', () => {
    guardarUtm('?utm_source=linkedin')
    consentir(false)
    efetivarUtmSeConsentido()
    expect(lerUtmGuardado()).toEqual({})
  })

  it('primeiro toque vence, também na memória', () => {
    consentir(true)
    guardarUtm('?utm_source=linkedin')
    guardarUtm('?utm_source=facebook')
    expect(lerUtmGuardado()).toEqual({ utm_source: 'linkedin' })
  })

  it('revogação limpa o guardado', () => {
    consentir(true)
    guardarUtm('?utm_source=linkedin')
    limparUtmGuardado()
    expect(armazem.has(CHAVE_DE_SESSAO)).toBe(false)
  })
})
