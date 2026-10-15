import { expect, test, type Page } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'

/* 15/10 — cabeçalho legível sobre herói azul. No topo das páginas de e-book,
 * webinar, artigo e case, o herói é `bg-primary`, e o cabeçalho transparente
 * desenhava logo, "Fale Conosco" e WhatsApp em azul e verde sobre azul. A
 * variante `sobre-azul` (globals.css) troca tudo para escuro enquanto o
 * cabeçalho está no topo de uma página com `data-heroi-azul`.
 *
 * O sinal medido é o filtro do logo (`brightness(0)`): é o único que não
 * depende de como o navegador escreve a cor (o Tailwind 4 sai em `lab()`). */
const EBOOK = 'o-guia-definitivo-do-data-lakehouse-para-executivos'

const filtroDoLogo = (page: Page) => page.locator('nav img').first().evaluate((img) => getComputedStyle(img).filter)

test('no topo de um herói azul o cabeçalho fica escuro, e volta ao rolar', async ({ page }) => {
  await page.goto(`${NEXT_URL}/ebooks/${EBOOK}?e2e=1`)
  await expect(page.locator('[data-heroi-azul]')).toHaveCount(1)
  await expect.poll(() => filtroDoLogo(page)).toBe('brightness(0)')

  /* Rolou: o cabeçalho ganha fundo próprio, e o logo volta às cores. */
  await page.mouse.wheel(0, 600)
  await expect.poll(() => filtroDoLogo(page)).toBe('none')
})

test('em página sem herói azul o cabeçalho não muda', async ({ page }) => {
  await page.goto(`${NEXT_URL}/solucoes?e2e=1`)
  await expect(page.locator('[data-heroi-azul]')).toHaveCount(0)
  await expect.poll(() => filtroDoLogo(page)).toBe('none')
})
