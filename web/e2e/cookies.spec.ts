import { expect, test } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'

/* MIG-152 (D-30) — o banner de consentimento de cookies.
 *
 * ⚠️ O ambiente do gate roda com o global `cookie-consent` **vazio** (o seed
 * nunca preenche `bannerMessage` — texto jurídico é da ATRA, P-14), e é isso
 * que mantém o gabarito das 13 rotas válido. O primeiro teste protege essa
 * premissa e roda sempre; o caminho feliz exige as duas pontas: textos
 * preenchidos à mão no admin e `E2E_COOKIES=1` no executor. */
test.describe('consentimento de cookies (MIG-152)', () => {
  test('sem texto no CMS não há banner nem cookie — a premissa do gate', async ({ page }) => {
    await page.goto(`${NEXT_URL}/?e2e=1`)
    await expect(page.getByTestId('aviso-de-cookies')).toHaveCount(0)
    const cookies = await page.context().cookies()
    expect(cookies.find((c) => c.name === 'atra-consent')).toBeUndefined()
  })

  test.describe('com o banner ligado', () => {
    test.skip(process.env.E2E_COOKIES !== '1', 'exige textos no admin + E2E_COOKIES=1 — ver o topo do arquivo')

    test('primeira visita mostra o banner, com recusar tão visível quanto aceitar', async ({ page }) => {
      await page.goto(`${NEXT_URL}/`)
      const banner = page.getByTestId('aviso-de-cookies')
      await expect(banner).toBeVisible()

      /* A spec exige recusar tão visível quanto aceitar: mesma altura de caixa
         e os dois no viewport — não é estilo, é requisito. */
      const botoes = banner.getByRole('button')
      const aceitar = botoes.first()
      const recusar = botoes.nth(1)
      await expect(aceitar).toBeInViewport()
      await expect(recusar).toBeInViewport()
      const [caixaAceitar, caixaRecusar] = [await aceitar.boundingBox(), await recusar.boundingBox()]
      expect(Math.abs((caixaAceitar?.height ?? 0) - (caixaRecusar?.height ?? 0))).toBeLessThanOrEqual(1)
    })

    test('aceitar grava o cookie e o banner não volta no reload', async ({ page }) => {
      await page.goto(`${NEXT_URL}/`)
      const banner = page.getByTestId('aviso-de-cookies')
      await banner.getByRole('button').first().click()
      await expect(banner).toHaveCount(0)

      const cookie = (await page.context().cookies()).find((c) => c.name === 'atra-consent')
      expect(cookie).toBeTruthy()
      expect(JSON.parse(decodeURIComponent(cookie!.value))).toMatchObject({ analytics: true, marketing: true })

      await page.reload()
      await expect(page.getByTestId('aviso-de-cookies')).toHaveCount(0)
    })

    test('recusar também persiste, com tudo desligado', async ({ page }) => {
      await page.goto(`${NEXT_URL}/`)
      await page.getByTestId('aviso-de-cookies').getByRole('button').nth(1).click()
      const cookie = (await page.context().cookies()).find((c) => c.name === 'atra-consent')
      expect(JSON.parse(decodeURIComponent(cookie!.value))).toMatchObject({ analytics: false, marketing: false })
    })

    test('a escolha é revogável por /politicas-e-termos', async ({ page }) => {
      await page.goto(`${NEXT_URL}/`)
      await page.getByTestId('aviso-de-cookies').getByRole('button').first().click() // aceita tudo

      await page.goto(`${NEXT_URL}/politicas-e-termos`)
      await page.getByRole('button').filter({ hasText: /cookie/i }).first().click()
      const painel = page.getByTestId('aviso-de-cookies')
      await expect(painel).toBeVisible()

      /* Desliga as duas categorias e salva: o cookie novo reflete a revogação. */
      for (const chave of await painel.getByRole('switch', { disabled: false }).all()) {
        if ((await chave.getAttribute('aria-checked')) === 'true') await chave.click()
      }
      await painel.getByRole('button').last().click()
      const cookie = (await page.context().cookies()).find((c) => c.name === 'atra-consent')
      expect(JSON.parse(decodeURIComponent(cookie!.value))).toMatchObject({ analytics: false, marketing: false })
    })
  })
})
