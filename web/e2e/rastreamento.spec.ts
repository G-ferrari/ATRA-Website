import { expect, test, type Page } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'
import { GTM_ID_DE_TESTE, LUSHA_SITE_ID_DE_TESTE, RD_LOADER_ID_DE_TESTE } from '../scripts/seed/fixtures-de-rastreamento'
import { COOKIE_DE_CONSENTIMENTO, EVENTO_CONSENTIMENTO, VERSAO_DE_CONSENTIMENTO } from '../src/lib/consentimento'

/* D-40 — GTM e Lusha com o id vindo do admin, cada um atrás da sua categoria;
 * D-54 acrescenta o monitoramento do RD Station Marketing, sob marketing.
 *
 * Exige os ids de teste do global `tracking`, que o seed só grava com
 * `SEED_FIXTURES=1` (`scripts/seed/rastreamento.ts`) — o CI liga a chave.
 *
 * ⚠️ O ambiente do gate não tem aviso de cookies (P-14), então o
 * consentimento entra direto como cookie, no formato que o aviso grava.
 * E sem `?e2e=1`: sob a flag os dois componentes ficam inertes de propósito.
 *
 * Nenhum pedido sai para o Google, para a Lusha ou para o RD: os três scripts
 * são interceptados e trocados por um stub que só registra que rodou.
 *
 * Só no desktop: é comportamento de script, não de layout, e a largura não
 * muda nada nele. */

type Janela = Window & {
  dataLayer?: IArguments[]
  __lushaSiteId?: string
}

const GTM = 'https://www.googletagmanager.com/'
const LUSHA = 'https://static-packages-prod.lusha.com/'
const RD = 'https://d335luupugsy2.cloudfront.net/'

async function prepararPagina(page: Page, consentimento?: { v?: number; analytics: boolean; marketing: boolean }) {
  const pedidos: string[] = []
  page.on('request', (r) => {
    if (r.url().startsWith(GTM) || r.url().startsWith(LUSHA) || r.url().startsWith(RD)) pedidos.push(r.url())
  })
  await page.route(`${GTM}**`, (r) => r.fulfill({ contentType: 'text/javascript', body: '' }))
  await page.route(`${RD}**`, (r) => r.fulfill({ contentType: 'text/javascript', body: '' }))
  await page.route(`${LUSHA}**`, (r) =>
    r.fulfill({
      contentType: 'text/javascript',
      body: 'window.trackingLusha = { onLoad: function (o) { window.__lushaSiteId = o.siteId } }',
    }),
  )
  if (consentimento) {
    const valor = { v: VERSAO_DE_CONSENTIMENTO, ...consentimento, ts: 1 }
    await page.context().addCookies([
      { name: COOKIE_DE_CONSENTIMENTO, value: encodeURIComponent(JSON.stringify(valor)), url: NEXT_URL },
    ])
  }
  await page.goto(`${NEXT_URL}/`)
  /* O `Gtm` põe o `consent default` no dataLayer assim que recebe um id, com
     ou sem aceite. Vê-lo prova duas coisas antes das asserções negativas: o id
     veio do admin até o cliente, e os efeitos já rodaram — a `Lusha` é irmã
     do `Gtm` no layout e roda no mesmo commit. */
  await page.waitForFunction(() =>
    ((window as Janela).dataLayer ?? []).some((e) => e[0] === 'consent' && e[1] === 'default'),
  )
  return pedidos
}

test.describe('rastreamento pelo admin (D-40)', () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== 'desktop', 'comportamento de script; ver o topo do arquivo')
  })

  test('sem resposta ao aviso, nem GTM, nem Lusha, nem RD entram, e nenhum pedido sai', async ({ page }) => {
    const pedidos = await prepararPagina(page)
    await expect(page.locator('script#gtm')).toHaveCount(0)
    await expect(page.locator('script#lusha')).toHaveCount(0)
    await expect(page.locator('script#rd-station')).toHaveCount(0)
    expect(pedidos).toEqual([])
  })

  test('só estatística: o GTM entra com o id do admin, a Lusha e o RD não', async ({ page }) => {
    const pedidos = await prepararPagina(page, { analytics: true, marketing: false })
    await expect(page.locator('script#gtm')).toHaveAttribute('src', new RegExp(`id=${GTM_ID_DE_TESTE}$`))
    await expect(page.locator('script#lusha')).toHaveCount(0)
    await expect(page.locator('script#rd-station')).toHaveCount(0)
    expect(pedidos.every((url) => url.startsWith(GTM))).toBe(true)
  })

  test('só marketing: a Lusha entra e recebe o siteId do admin, o GTM não', async ({ page }) => {
    await prepararPagina(page, { analytics: false, marketing: true })
    await expect.poll(() => page.evaluate(() => (window as Janela).__lushaSiteId)).toBe(LUSHA_SITE_ID_DE_TESTE)
    await expect(page.locator('script#gtm')).toHaveCount(0)
  })

  test('só marketing: o monitoramento do RD entra com o id do admin na URL (D-54)', async ({ page }) => {
    const pedidos = await prepararPagina(page, { analytics: false, marketing: true })
    await expect(page.locator('script#rd-station')).toHaveAttribute(
      'src',
      `${RD}js/loader-scripts/${RD_LOADER_ID_DE_TESTE}-loader.js`,
    )
    await expect.poll(() => pedidos.some((url) => url.startsWith(RD))).toBe(true)
  })

  test('aceite de marketing da versão anterior não vale para a Lusha nem para o RD', async ({ page }) => {
    /* A v2 perguntava por marketing quando ele era UTM + Lusha. Quem respondeu
       aquilo não respondeu sobre o RD acompanhar a navegação (D-54) — e a v1,
       sobre identificar a empresa (D-40). */
    await prepararPagina(page, { v: VERSAO_DE_CONSENTIMENTO - 1, analytics: true, marketing: true })
    await expect(page.locator('script#lusha')).toHaveCount(0)
    await expect(page.locator('script#rd-station')).toHaveCount(0)
    await expect(page.locator('script#gtm')).toHaveCount(0)
  })

  test('aceitar marketing depois injeta a Lusha sem recarregar', async ({ page }) => {
    await prepararPagina(page)
    await expect(page.locator('script#lusha')).toHaveCount(0)
    /* O mesmo anúncio que o aviso faz ao salvar (`anunciarConsentimento`). */
    await page.evaluate(
      ({ evento, v }) =>
        window.dispatchEvent(new CustomEvent(evento, { detail: { v, analytics: false, marketing: true, ts: 2 } })),
      { evento: EVENTO_CONSENTIMENTO, v: VERSAO_DE_CONSENTIMENTO },
    )
    await expect.poll(() => page.evaluate(() => (window as Janela).__lushaSiteId)).toBe(LUSHA_SITE_ID_DE_TESTE)
  })
})
