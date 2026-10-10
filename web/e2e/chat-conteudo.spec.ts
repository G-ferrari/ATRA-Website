import { expect, test, type Page } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'

/* D-60 — a ATRA AI recomenda o que está publicado no site, com o link certo.
 *
 * ⚠️ `/api/chat` é **simulada** aqui: o container do gate não tem
 * `GEMINI_API_KEY`, e a rota de verdade responde 503. O que estes testes
 * provam é a metade do navegador — o cartão desenha o que o servidor mandou, é
 * link de verdade e não inventa nada. A outra metade (o servidor só manda o
 * que existe no catálogo) é de `lib/referencias-da-ia.test.ts`. */

type Resposta = { text: string; referencias?: Record<string, { tipo: string; titulo: string; resumo: string; href: string }> }

async function simular(page: Page, resposta: Resposta) {
  await page.route('**/api/chat', (rota) => rota.fulfill({ contentType: 'application/json', body: JSON.stringify(resposta) }))
}

async function perguntar(page: Page, texto: string) {
  const caixa = page.getByRole('textbox', { name: 'O que você deseja construir hoje?' })
  await caixa.fill(texto)
  await page.getByRole('button', { name: 'Enviar mensagem' }).click()
  await expect(caixa).toBeEnabled({ timeout: 15000 })
}

test.describe('ATRA AI: conteúdo do site com o link certo (D-60)', () => {
  test('a etiqueta vira cartão com o endereço do servidor, e o endereço abre em nova aba', async ({ page, context }) => {
    await simular(page, {
      text: 'Para isso, veja:\n\n[UI_CONTEUDO:P-SOLUCOES]\n\nQuer aprofundar em algum ponto?',
      referencias: {
        'P-SOLUCOES': { tipo: 'pagina', titulo: 'Soluções da ATRA', resumo: 'Tudo o que a ATRA faz, por frente.', href: '/solucoes' },
      },
    })
    await page.goto(`${NEXT_URL}/chat?e2e=1`)
    await perguntar(page, 'O que vocês fazem?')

    const cartao = page.getByRole('link', { name: /Soluções da ATRA/ })
    await expect(cartao).toBeVisible()
    await expect(cartao).toHaveAttribute('href', '/solucoes')
    await expect(cartao).toHaveAttribute('target', '_blank')
    await expect(cartao).toContainText('Tudo o que a ATRA faz, por frente.')
    /* A etiqueta nunca aparece crua. */
    await expect(page.getByText('UI_CONTEUDO')).toHaveCount(0)

    const [nova] = await Promise.all([context.waitForEvent('page'), cartao.click()])
    await nova.waitForLoadState('domcontentloaded')
    expect(new URL(nova.url()).pathname).toBe('/solucoes')
    await expect(nova.getByRole('heading', { level: 1 })).toBeVisible()

    /* A conversa vive na memória da página: continua lá, na aba de origem. */
    await expect(page.getByText('Quer aprofundar em algum ponto?')).toBeVisible()
  })

  test('etiqueta sem referência não desenha cartão nem sobra como texto', async ({ page }) => {
    await simular(page, { text: 'Antes.\n\n[UI_CONTEUDO:S999]\n\nDepois.', referencias: {} })
    await page.goto(`${NEXT_URL}/chat?e2e=1`)
    await perguntar(page, 'Teste')

    await expect(page.getByText('Depois.')).toBeVisible()
    await expect(page.getByText('S999')).toHaveCount(0)
    await expect(page.getByText('UI_CONTEUDO')).toHaveCount(0)
  })

  /* O cartão do protótipo dizia "Conhecer solução →" num `div` que não levava a
     lugar nenhum. Continua aparecendo para a etiqueta antiga, mas sem fingir. */
  test('o cartão antigo de serviço não finge mais ser link', async ({ page }) => {
    await simular(page, { text: '[UI_SERVICE:Arquitetura Lakehouse:Centralize seus dados na nuvem.:fluent:cloud-24-regular]' })
    await page.goto(`${NEXT_URL}/chat?e2e=1`)
    await perguntar(page, 'Teste')

    await expect(page.getByRole('heading', { name: 'Arquitetura Lakehouse' })).toBeVisible()
    await expect(page.getByText('Conhecer solução')).toHaveCount(0)
    await expect(page.getByRole('link', { name: /Arquitetura Lakehouse/ })).toHaveCount(0)
  })

  test('link no meio do texto é link, e abre em nova aba', async ({ page }) => {
    await simular(page, { text: 'Temos vários artigos sobre isso no [nosso blog](/blog).' })
    await page.goto(`${NEXT_URL}/chat?e2e=1`)
    await perguntar(page, 'Teste')

    const link = page.getByRole('link', { name: 'nosso blog' })
    await expect(link).toHaveAttribute('href', '/blog')
    await expect(link).toHaveAttribute('target', '_blank')
  })

  /* As referências são do servidor: o navegador as guarda para desenhar, e não
     as devolve como se fossem parte da conversa. */
  test('o histórico volta ao servidor só com papel e texto', async ({ page }) => {
    const corpos: { messages: Record<string, unknown>[] }[] = []
    await page.route('**/api/chat', async (rota) => {
      corpos.push(rota.request().postDataJSON())
      await rota.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          text: '[UI_CONTEUDO:P-BLOG]',
          referencias: { 'P-BLOG': { tipo: 'pagina', titulo: 'Blog da ATRA', resumo: '', href: '/blog' } },
        }),
      })
    })
    await page.goto(`${NEXT_URL}/chat?e2e=1`)
    await perguntar(page, 'Primeira')
    await expect(page.getByRole('link', { name: /Blog da ATRA/ })).toHaveCount(1)
    await perguntar(page, 'Segunda')

    expect(corpos).toHaveLength(2)
    expect(corpos[1].messages).toHaveLength(3)
    for (const mensagem of corpos[1].messages) expect(Object.keys(mensagem).sort()).toEqual(['content', 'role'])
    /* O cartão da primeira resposta continua na tela depois da segunda. */
    await expect(page.getByRole('link', { name: /Blog da ATRA/ })).toHaveCount(2)
  })
})
