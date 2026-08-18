import { expect, test } from '@playwright/test'

import { LEGACY_URL, NEXT_URL } from '../playwright.config'

/* Smoke: barato, roda em toda PR, pega o modo de falha mais provável de uma
 * fábrica de 20 rotas — "quebrou porque alguém renomeou um slug". */

/* Cresce a cada rota portada na Fase 3.
 *
 * Listado por idioma em vez de montado com prefixo: o inglês usa **slugs
 * traduzidos** (D-07), então `/en` + `/cases-de-sucesso` não é uma URL válida —
 * é `/en/success-stories`, e é justamente essa tradução que precisa ser testada. */
const ROTAS_PORTADAS = {
  pt: ['/', '/cases-de-sucesso', '/glossario', '/relatorios', '/ebooks', '/webinars', '/blog'],
  en: ['/en', '/en/success-stories', '/en/glossary', '/en/reports', '/en/ebooks', '/en/webinars', '/en/blog'],
} as const

test.describe('app novo', () => {
  for (const [idioma, rotas] of Object.entries(ROTAS_PORTADAS)) {
    for (const rota of rotas) {
      test(`${idioma} ${rota} responde 200`, async ({ request }) => {
        const r = await request.get(`${NEXT_URL}${rota}`)
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

  /* `/blog/[slug]` **não existe no legado** (os cards apontam para `#`), então
   * não há gabarito e a regressão visual não cobre esta rota. Estas asserções
   * são o que sobra de rede de segurança — ver a nota no topo da página. */
  test.describe('/blog/[slug] — rota sem gabarito', () => {
    const COM_SLUG = '/blog/squad-gerenciada-como-estruturar-equipes-de-ti-mais-eficientes'

    test('artigo existente responde 200 nos dois idiomas', async ({ request }) => {
      for (const url of [`${NEXT_URL}${COM_SLUG}`, `${NEXT_URL}/en${COM_SLUG}`]) {
        expect((await request.get(url)).status(), url).toBe(200)
      }
    })

    test('slug inexistente responde 404', async ({ request }) => {
      const r = await request.get(`${NEXT_URL}/blog/slug-que-nao-existe`)
      expect(r.status()).toBe(404)
    })

    /* A preocupação de D-08 — página magra prejudica o domínio — aplicada em
     * código: enquanto o corpo estiver vazio o artigo não é indexável. Os 6
     * posts do protótipo estão nesse estado de propósito (fixture do porte). */
    test('artigo sem corpo sai com noindex', async ({ request }) => {
      const r = await request.get(`${NEXT_URL}${COM_SLUG}`)
      expect(await r.text()).toContain('noindex')
    })
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
