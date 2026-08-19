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

  /* A 404 precisa **parecer** o site: sem a rota curinga ela cairia no
   * `not-found` da raiz, fora do grupo (frontend) — sem fonte, sem tema e sem
   * casca. O rodapé é o sinal mais barato de que o layout veio junto. */
  test('a 404 vem com a casca do site nos dois idiomas', async ({ page }) => {
    for (const [url, marca] of [
      [`${NEXT_URL}/rota-que-nao-existe`, 'Esta página não existe'],
      [`${NEXT_URL}/en/does-not-exist`, 'This page does not exist'],
    ] as const) {
      await page.goto(url)
      await expect(page.getByRole('heading', { name: marca })).toBeVisible()
      await expect(page.locator('footer')).toBeVisible()
    }
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

  /* `/relatorios/[slug]` e `/ebooks/[slug]` também não existem no protótipo. */
  test.describe('materiais — rotas sem gabarito', () => {
    const RELATORIO = 'relatorio-anual-de-dados-2025-tendencias-e-projecoes'
    const EBOOK = 'o-guia-definitivo-do-data-lakehouse-para-executivos'

    test('material existente responde 200 nos dois idiomas', async ({ request }) => {
      for (const url of [
        `${NEXT_URL}/relatorios/${RELATORIO}`,
        `${NEXT_URL}/ebooks/${EBOOK}`,
        `${NEXT_URL}/en/reports/${RELATORIO}`,
        `${NEXT_URL}/en/ebooks/${EBOOK}`,
      ]) {
        expect((await request.get(url)).status(), url).toBe(200)
      }
    })

    /* O tipo entra na consulta, não só na rota. Sem isso o mesmo material
     * responderia sob as duas seções e o Google veria conteúdo duplicado. */
    test('slug do outro tipo responde 404', async ({ request }) => {
      for (const url of [`${NEXT_URL}/relatorios/${EBOOK}`, `${NEXT_URL}/ebooks/${RELATORIO}`]) {
        expect((await request.get(url)).status(), url).toBe(404)
      }
    })

    test('material sem corpo sai com noindex', async ({ request }) => {
      const r = await request.get(`${NEXT_URL}/relatorios/${RELATORIO}`)
      expect(await r.text()).toContain('noindex')
    })
  })

  test.describe('/webinars/[slug] — rota sem gabarito', () => {
    const SLUG = 'data-show-como-escalar-seu-data-lakehouse'

    test('webinar existente responde 200 nos dois idiomas', async ({ request }) => {
      for (const url of [`${NEXT_URL}/webinars/${SLUG}`, `${NEXT_URL}/en/webinars/${SLUG}`]) {
        expect((await request.get(url)).status(), url).toBe(200)
      }
    })

    test('slug inexistente responde 404', async ({ request }) => {
      expect((await request.get(`${NEXT_URL}/webinars/nao-existe`)).status()).toBe(404)
    })

    /* D-11 previu os dois estados; nenhum webinar do seed tem vídeo, então é o
     * estado vazio que está no ar. Sem iframe quebrado é o que importa aqui. */
    test('webinar sem vídeo mostra o aviso e não monta iframe', async ({ request }) => {
      const html = await (await request.get(`${NEXT_URL}/webinars/${SLUG}`)).text()
      expect(html).toContain('Gravação em breve')
      expect(html).not.toContain('<iframe')
    })
  })

  test.describe('/carreiras e /contato — páginas de bloco sem gabarito', () => {
    test('a vaga da collection aparece e leva a um detalhe que responde 200', async ({ page }) => {
      await page.goto(`${NEXT_URL}/carreiras`)
      const vaga = page.getByRole('link', { name: /Engenheiro\(a\) de Dados SR/ }).first()
      await expect(vaga).toBeVisible()
      await vaga.click()
      // A vaga leva a /carreiras/[slug] (MIG-051), que precisa **responder**,
      // não só mudar a URL: o link ficou quebrado entre MIG-050 e esta task.
      await expect(page).toHaveURL(/\/carreiras\/.+/)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })

    /* A vaga sem descrição sai com noindex, como o post sem corpo (D-08). */
    test('vaga sem descrição sai com noindex; slug inexistente dá 404', async ({ request }) => {
      const ok = await request.get(`${NEXT_URL}/carreiras/engenheiro-a-de-dados-sr`)
      expect(await ok.text()).toContain('noindex')
      const nope = await request.get(`${NEXT_URL}/carreiras/vaga-que-nao-existe`)
      expect(nope.status()).toBe(404)
    })

    /* O formulário existe mas não envia (P-14, P-18): o botão fica desabilitado
       para não coletar dado pessoal sem política publicada nem destino. */
    test('o formulário de contato está desabilitado', async ({ page }) => {
      await page.goto(`${NEXT_URL}/contato`)
      await expect(page.getByRole('button', { name: 'Enviar' })).toBeDisabled()
      // O e-mail aparece no cartão E no rodapé; o `first()` fica com o do cartão.
      await expect(page.getByRole('link', { name: 'negocios@atra.com.br' }).first()).toBeVisible()
    })
  })

  /* `/consultores` fica fora do gate: o legado tem hero com stats animados,
     modal de detalhe e formulário que não foram portados integralmente. O
     catálogo filtrável, que é o núcleo, é verificado aqui. */
  test('o catálogo de consultores filtra pelo seletor de senioridade', async ({ page }) => {
    await page.goto(`${NEXT_URL}/consultores`)
    // 8 perfis no total, cada um com um botão Solicitar.
    await expect(page.getByRole('link', { name: 'Solicitar' })).toHaveCount(8)
    // Filtrar por "Pleno" reduz a lista sem esvaziá-la.
    await page.getByLabel('Senioridade').selectOption('Lead / Principal')
    const n = await page.getByRole('link', { name: 'Solicitar' }).count()
    expect(n).toBeGreaterThan(0)
    expect(n).toBeLessThan(8)
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
