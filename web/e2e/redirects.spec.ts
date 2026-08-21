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

  test('toda URL do WordPress leva a uma página que responde', async ({ request }) => {
    const falhas: string[] = []

    for (const { source, destination } of redirects) {
      const r = await request.get(`${NEXT_URL}${source}`, { maxRedirects: 0 })
      if (![301, 307, 308].includes(r.status())) {
        falhas.push(`${source} respondeu ${r.status()}, esperava redirect`)
        continue
      }
      const destinoFinal = await request.get(`${NEXT_URL}${destination}`)
      if (destinoFinal.status() !== 200) falhas.push(`${source} → ${destination} responde ${destinoFinal.status()}`)
    }

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
