import { LOCALES, type Locale } from './locales'
import { hrefDe, type Secao } from './routes'
import { ORIGEM } from './seo'

/* IndexNow (GEO, D-80): avisa o Bing — e os outros buscadores do protocolo —
 * de cada endereço publicado, alterado ou tirado do ar, sem esperar a próxima
 * visita do robô. O Bing alimenta o Copilot, e o post de 2026 dele diz que o
 * IndexNow "mantém a informação atual na busca e nas experiências de IA".
 *
 * Duas trancas, como as outras integrações: a chave no ambiente
 * (`INDEXNOW_KEY`) e a origem de produção. Homologação e dev avisariam o Bing
 * de endereços que ele não deve indexar.
 *
 * A chave não é segredo — o protocolo exige publicá-la em
 * `/indexnow-key.txt` para provar que o site é nosso —, mas fica fora do
 * repositório e sem `NEXT_PUBLIC_`: é por ela que outro site não avisa em nosso
 * nome. */

const ENDPOINT = 'https://api.indexnow.org/indexnow'

/* O protocolo aceita de 8 a 128 caracteres, letras, números e hífen. */
const FORMATO_DA_CHAVE = /^[a-zA-Z0-9-]{8,128}$/

export function chaveDoIndexNow(): string | null {
  const chave = process.env.INDEXNOW_KEY?.trim()
  return chave && FORMATO_DA_CHAVE.test(chave) ? chave : null
}

export function indexNowLigado(): boolean {
  return chaveDoIndexNow() !== null && new URL(ORIGEM).hostname === 'www.atra.com.br'
}

/** Collection com página de item → a seção da URL. As outras não têm endereço. */
export const SECAO_DA_COLECAO = {
  posts: 'blog',
  cases: 'cases',
  solutions: 'solucoes',
  segments: 'segmentos',
  jobs: 'carreiras',
  webinars: 'webinars',
  resources: 'ebooks',
} as const satisfies Record<string, Secao>

export type ColecaoAvisada = keyof typeof SECAO_DA_COLECAO

/** As URLs absolutas do item em cada idioma em que ele tem slug gravado. */
export function urlsDoItem(colecao: ColecaoAvisada, slugs: Partial<Record<Locale, string | null>>): string[] {
  return LOCALES.flatMap((locale) => {
    const slug = slugs[locale]
    return slug ? [`${ORIGEM}${hrefDe(SECAO_DA_COLECAO[colecao], locale, slug)}`] : []
  })
}

/** O corpo do POST, separado para o teste conferir o formato do protocolo. */
export function pedidoDoIndexNow(urls: string[], chave: string) {
  return {
    host: new URL(ORIGEM).hostname,
    key: chave,
    keyLocation: `${ORIGEM}/indexnow-key.txt`,
    urlList: urls,
  }
}

/**
 * Envia sem esperar. ⚠️ Nunca lança: roda dentro do `afterChange` da
 * publicação, e um IndexNow fora do ar não pode desfazer o que a editora
 * publicou. Falha vai para o log, como os avisos do RD.
 */
export function avisarIndexNow(urls: string[], log: (msg: string) => void = console.warn): void {
  const chave = chaveDoIndexNow()
  if (!chave || !indexNowLigado() || urls.length === 0) return

  void fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(pedidoDoIndexNow(urls, chave)),
    signal: AbortSignal.timeout(10_000),
  })
    .then((r) => {
      /* 200 e 202 são sucesso no protocolo (202: chave ainda em validação). */
      if (r.status !== 200 && r.status !== 202) log(`[indexnow] ${r.status} ao avisar ${urls.length} endereço(s)`)
    })
    .catch((erro: unknown) => log(`[indexnow] falhou: ${erro instanceof Error ? erro.message : String(erro)}`))
}
