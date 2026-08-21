import { describe, expect, it } from 'vitest'

import { utmDaQueryString } from './utm'

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
