import { expect, test } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'

/* Cards com "camada esticada": o link do card estende um `::after` por cima do
 * card inteiro, e qualquer ponto dele leva ao item.
 *
 * ⚠️ 15/10 — o card de e-book clicava só no botão. O link tinha
 * `active:scale-98`: no mousedown ele encolhe, a camada encolhe junto (o
 * elemento transformado vira o bloco de contenção do próprio `::after`), e o
 * mouseup cai fora do link — o navegador não dispara o clique. O cursor seguia
 * como mãozinha, então o defeito não aparece olhando.
 *
 * Por isso o clique aqui é com `page.mouse` no meio da capa: `locator.click()`
 * miraria o centro do botão, que sempre funcionou. */
test('/ebooks: clicar na capa do card abre o e-book', async ({ page }) => {
  await page.goto(`${NEXT_URL}/ebooks?e2e=1`)
  const link = page.getByRole('link', { name: /Baixar agora/ }).first()
  const destino = await link.getAttribute('href')
  expect(destino).toMatch(/^\/ebooks\/.+/)

  const capa = link.locator('xpath=..').locator('img').first()
  await capa.scrollIntoViewIfNeeded()
  const caixa = await capa.boundingBox()
  if (!caixa) throw new Error('a capa do card não está visível')

  await page.mouse.click(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2)
  await expect(page).toHaveURL(new RegExp(`${destino}$`))
})
