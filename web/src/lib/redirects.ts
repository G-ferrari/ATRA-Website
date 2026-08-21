import { readFileSync } from 'node:fs'

/* Leitura do `redirects.csv` para o `next.config.ts` (MIG-108).
 *
 * O arquivo é gerado por `scripts/wp-import/gerar-redirects.ts` e versionado em
 * `docs/02-especificacao/dados/`. Aqui só se lê e converte — a curadoria e a
 * validação ficam no gerador, que é quem tem o WordPress e o banco à mão.
 *
 * Módulo separado do `next.config.ts` porque tem lógica, e lógica tem teste. */

export type LinhaDeRedirect = { from: string; to: string; status: number; note: string }

/**
 * Uma linha por vez, porque o formato é CSV **sem aspas**.
 *
 * ⚠️ `split(',')` cru quebraria a `note`: ela é texto livre e o gerador já
 * reprova vírgula lá dentro justamente por isso. Aqui a divisão é limitada às
 * 3 primeiras vírgulas, e o que sobra é a justificativa inteira — se um dia
 * alguém editar o arquivo à mão e puser vírgula, a linha continua válida.
 */
export function lerCsv(conteudo: string): LinhaDeRedirect[] {
  const linhas = conteudo.split('\n').slice(1)

  return linhas.flatMap((linha) => {
    if (!linha.trim()) return []
    const [from, to, status, ...resto] = linha.split(',')
    if (!from?.startsWith('/')) return []
    return [{ from, to: to ?? '', status: Number(status) || 301, note: resto.join(',') }]
  })
}

/**
 * O que o Next chama de `redirects()`.
 *
 * ⚠️ **410 não passa por aqui.** O `redirects()` do Next só emite 307/308 —
 * `permanent: true` vira 308, não 301 — e não sabe responder "Gone". As 3
 * linhas de 410 do arquivo são servidas pelo `proxy.ts`, que pode devolver
 * qualquer status. Tratá-las aqui as transformaria em redirect para `undefined`,
 * que o Next aceita e serve como redirect para a raiz.
 */
export function redirectsDoNext(linhas: LinhaDeRedirect[]) {
  return linhas
    .filter((l) => l.status !== 410 && l.to)
    .map((l) => ({
      source: l.from.replace(/\/$/, ''),
      destination: l.to,
      /* 308 e não 301: é o que o Next emite para `permanent`, e os dois dizem
       * "movido permanentemente". A diferença é que 308 preserva o método. */
      permanent: true,
    }))
    /* ⚠️ **Redirect de uma URL para ela mesma é laço infinito**, e sete linhas
     * do arquivo são exatamente isso: `/sobre/` → `/sobre`, `/blog/` → `/blog`,
     * `/contato/`, `/carreiras/`, `/solucoes/`, `/segmentos/` e
     * `/politicas-e-termos/`. São rotas que o WordPress e o site novo servem no
     * mesmo endereço, e o CSV as registra porque **é especificação**: "esta URL
     * do WP tem destino" é informação, mesmo quando o destino é ela própria.
     *
     * O que não pode é virar regra de servidor. Com `trailingSlash: false` — o
     * padrão do Next — a barra final já é normalizada antes, então a linha
     * viraria `/sobre` → `/sobre` e o navegador daria ERR_TOO_MANY_REDIRECTS
     * nas sete páginas institucionais. Medido: 50 saltos até o curl desistir. */
    .filter((r) => r.source !== r.destination)
}

/** As URLs que saem de propósito, para o `proxy.ts` responder 410. */
export function caminhosGone(linhas: LinhaDeRedirect[]): string[] {
  return linhas.filter((l) => l.status === 410).map((l) => l.from.replace(/\/$/, ''))
}

export function lerRedirects(caminho: string): LinhaDeRedirect[] {
  return lerCsv(readFileSync(caminho, 'utf8'))
}
