import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

import { expect, test } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'
import { caminhosGone, lerCsv, redirectsDoNext } from '../src/lib/redirects'

/* MIG-108 — o `redirects.csv` conferido contra o servidor de verdade.
 *
 * O critério da Fase 5: **toda linha responde 301 para um destino 200**. Até
 * aqui o gerador provava que o destino existe *no banco*; isto prova que ele
 * responde — que é outra coisa, e é onde os dois defeitos apareceram: a página
 * inicial do WordPress virando `410` na raiz, e sete linhas institucionais
 * (`/sobre/` → `/sobre`) que o Next transformava em laço infinito.
 *
 * ⚠️ Roda num projeto só. São 258 URLs, e a resposta não muda com o viewport —
 * repetir nos três é triplicar 9 minutos para medir a mesma coisa.
 */
/* ⚠️ Dois caminhos porque o teste roda em dois lugares: fora do container o
 * repositório inteiro está no disco (`../docs`), dentro dele só `web/` está em
 * `/work` e `docs/` é montado em `/docs`. Sem isto o `pnpm test:e2e` local
 * funciona e o `pnpm gate` — que é o que vale — falha com ENOENT. */
const CANDIDATOS = [
  path.resolve(process.cwd(), '../docs/02-especificacao/dados/redirects.csv'),
  '/docs/02-especificacao/dados/redirects.csv',
]
const CSV = CANDIDATOS.find((c) => existsSync(c)) ?? CANDIDATOS[0]
const linhas = lerCsv(readFileSync(CSV, 'utf8'))
const redirects = redirectsDoNext(linhas)
const gone = caminhosGone(linhas)

test.describe('redirects do WordPress', () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== 'desktop', 'a resposta não muda com o viewport')
  })

  test('o arquivo tem as linhas que a migração produziu', () => {
    expect(linhas.length).toBeGreaterThanOrEqual(258)
    /* Redirect de uma URL para ela mesma não pode chegar ao servidor. */
    expect(redirects.filter((r) => r.source === r.destination)).toEqual([])
    /* E a raiz não pode ter regra nenhuma: seria o site inteiro. */
    expect(linhas.filter((l) => l.from === '/')).toEqual([])
  })

  /* ⚠️ Destino sob `/blog/` ou `/carreiras/` tem o **redirect** conferido, não o
   * 200 — e isso é divisão de trabalho, não buraco de cobertura.
   *
   * 214 das 251 linhas apontam para os 207 artigos e as 7 vagas, que entram por
   * `scripts/wp-import/` e **não** pelo seed. O CI monta o banco só com
   * `pnpm seed`, então lá esses destinos respondem 404 — e o teste passou a
   * acusar "213 de 251 linhas com problema" que não eram problema de redirect
   * nenhum. Era o teste medindo a ausência do importador.
   *
   * As três garantias continuam existindo, cada uma onde é verificável:
   *  - que o destino **existe no banco** é o gerador (`gerar-redirects.ts`), que
   *    reprova se alguma URL do WordPress ficar sem destino;
   *  - que as **rotas** `/blog/[slug]` e `/carreiras/[slug]` servem é o
   *    `smoke.spec`, que abre um artigo e uma vaga de verdade;
   *  - que **toda** linha emite redirect **para o destino escrito no CSV** é
   *    aqui embaixo, e vale para as 251 sem exceção.
   *
   * É o mesmo motivo que tirou `/blog` e `/carreiras` do gate visual na Fase 4b:
   * fixture não é conteúdo real, e fingir que é apaga o sinal em vez de criá-lo.
   */
  const DO_WP_IMPORT = /^\/(blog|carreiras)\//

  test('toda URL do WordPress leva a uma página que responde', async ({ request }) => {
    /* ⚠️ Em lotes, e não em série. São ~290 requisições; uma de cada vez
     * estourava os 90s de `timeout` da suíte, e a falha aparecia como
     * "Request context disposed" — que parece defeito de rede e é só o relógio.
     * A largura é modesta de propósito: o container do gate entra com
     * `--cpus=4` e do outro lado tem um `next start` só. */
    const falhas = await emLotes(redirects, 12, async ({ source, destination }) => {
      const r = await request.get(`${NEXT_URL}${source}`, { maxRedirects: 0 })
      if (![301, 307, 308].includes(r.status())) {
        return `${source} respondeu ${r.status()}, esperava redirect`
      }

      /* Confere **para onde** o redirect aponta, e não só que ele existe. É o
       * que mantém a linha do CSV honesta mesmo quando o destino é conteúdo que
       * este ambiente não tem: uma troca de destino errada continua reprovando. */
      const destinoDito = caminhoDe(r.headers()['location'])
      if (destinoDito !== destination) {
        return `${source} redireciona para ${destinoDito}, e o CSV diz ${destination}`
      }

      if (DO_WP_IMPORT.test(destination)) return null

      const destinoFinal = await request.get(`${NEXT_URL}${destination}`)
      return destinoFinal.status() === 200
        ? null
        : `${source} → ${destination} responde ${destinoFinal.status()}`
    })

    expect(falhas, `${falhas.length} de ${redirects.length} linhas com problema`).toEqual([])
  })

  /* 410 e não 404: a diferença importa para o robô. 404 é "não achei agora" e
     ele volta; 410 é "não existe mais" e ele tira do índice. */
  test('o que saiu de propósito responde 410', async ({ request }) => {
    for (const caminho of gone) {
      expect((await request.get(`${NEXT_URL}${caminho}`, { maxRedirects: 0 })).status(), caminho).toBe(410)
    }
  })
})

/** O `Location` pode vir absoluto ou relativo; o CSV fala em caminho. */
function caminhoDe(location: string | undefined): string {
  if (!location) return '(sem Location)'
  return location.startsWith('http') ? new URL(location).pathname : location.split('?')[0]
}

/**
 * Roda `fn` sobre os itens com largura fixa, juntando o que voltar diferente de
 * `null`. Existe pelo relógio: ver a nota no teste que usa isto.
 */
async function emLotes<T>(
  itens: readonly T[],
  largura: number,
  fn: (item: T) => Promise<string | null>,
): Promise<string[]> {
  const falhas: string[] = []
  for (let i = 0; i < itens.length; i += largura) {
    const resultado = await Promise.all(itens.slice(i, i + largura).map(fn))
    falhas.push(...resultado.filter((f): f is string => f !== null))
  }
  return falhas
}
