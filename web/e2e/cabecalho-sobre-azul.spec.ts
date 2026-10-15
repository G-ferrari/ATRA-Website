import { expect, test, type Page } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'

/* 15/10 — cabeçalho legível sobre herói azul. No topo das páginas de e-book,
 * webinar, artigo e case, o herói é `bg-primary`, e o cabeçalho transparente
 * desenhava logo, "Fale Conosco" e WhatsApp em azul e verde sobre azul. A
 * variante `sobre-azul` (globals.css) dá à barra a cor do tema, translúcida e
 * com desfoque, enquanto ela está no topo de uma página com `data-heroi-azul`;
 * as peças ficam com as cores de sempre.
 *
 * O sinal medido é o desfoque da barra: é o único que não depende de como o
 * navegador escreve a cor (o Tailwind 4 sai em `oklab()`). */
const EBOOK = 'o-guia-definitivo-do-data-lakehouse-para-executivos'

const barra = (page: Page) => page.locator('nav > div').first()
const desfoque = (page: Page) => barra(page).evaluate((el) => getComputedStyle(el).backdropFilter)
const filtroDoLogo = (page: Page) => page.locator('nav img').first().evaluate((img) => getComputedStyle(img).filter)

test('no topo de um herói azul a barra ganha fundo translúcido, e volta ao rolar', async ({ page }) => {
  await page.goto(`${NEXT_URL}/ebooks/${EBOOK}?e2e=1`)
  await expect(page.locator('[data-heroi-azul]')).toHaveCount(1)
  await expect.poll(() => desfoque(page)).not.toBe('none')
  /* As peças não mudam: a primeira versão escurecia o logo, e foi recusada. */
  expect(await filtroDoLogo(page)).toBe('none')

  /* Rolou: o cabeçalho ganha o fundo sólido de sempre, sem desfoque. */
  await page.mouse.wheel(0, 600)
  await expect.poll(() => desfoque(page)).toBe('none')
})

test('em página sem herói azul o cabeçalho não muda', async ({ page }) => {
  await page.goto(`${NEXT_URL}/solucoes?e2e=1`)
  await expect(page.locator('[data-heroi-azul]')).toHaveCount(0)
  await expect.poll(() => desfoque(page)).toBe('none')
})
