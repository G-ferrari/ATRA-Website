import { expect, test } from '@playwright/test'

import { LEGACY_URL, NEXT_URL } from '../playwright.config'

/* Smoke: barato, roda em toda PR, pega o modo de falha mais provável de uma
 * fábrica de 20 rotas — "quebrou porque alguém renomeou um slug". */

// Cresce a cada rota portada na Fase 3.
const ROTAS_PORTADAS = ['/']

test.describe('app novo', () => {
  for (const rota of ROTAS_PORTADAS) {
    for (const [rotulo, prefixo] of [
      ['pt', ''],
      ['en', '/en'],
    ] as const) {
      test(`${rotulo} ${prefixo}${rota} responde 200`, async ({ request }) => {
        const r = await request.get(`${NEXT_URL}${prefixo}${rota}`)
        expect(r.status()).toBe(200)
      })
    }
  }

  test('URL inválida responde 404, não 200', async ({ request }) => {
    // O legado devolve 200 em rota inexistente — ver debito-tecnico.md.
    const r = await request.get(`${NEXT_URL}/rota-que-nao-existe`)
    expect(r.status()).toBe(404)
  })

  test('/pt redireciona para a raiz (sem conteúdo duplicado)', async ({ request }) => {
    const r = await request.get(`${NEXT_URL}/pt/`, { maxRedirects: 0 })
    expect(r.status()).toBe(308)
  })

  test('admin do Payload responde', async ({ request }) => {
    const r = await request.get(`${NEXT_URL}/admin`)
    expect(r.status()).toBe(200)
  })
})

test.describe('legado (gabarito da regressão visual)', () => {
  test('está no ar em :3001', async ({ request }) => {
    const r = await request.get(LEGACY_URL)
    expect(
      r.status(),
      `O legado precisa estar rodando: cd legacy && docker compose up -d`,
    ).toBe(200)
  })
})
