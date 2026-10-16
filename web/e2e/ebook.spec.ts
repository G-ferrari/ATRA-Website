import { expect, test } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'
import { EBOOK_COM_PDF } from './support/rotas'

/* Task 046 — na página do e-book, o formulário de download fica **depois do
 * texto** e antes de "Entre em contato" (pedido da Taci, 14/10), e o botão do
 * herói leva até ele.
 *
 * ⚠️ Precisa do seed com `SEED_FIXTURES=1`, que dá um PDF a este e-book: sem
 * PDF a página não mostra formulário (MIG-104). O CI liga; num banco sem as
 * fixtures o teste reprova dizendo isso, em vez de passar sem medir nada.
 *
 * ⚠️ Não envia o formulário. O teto de 5 envios por IP por hora é um só para
 * todos os formulários, e a suíte já gasta 4 no desktop (ver a nota em
 * `smoke.spec.ts`); um quinto não deixaria folga para o retry. O envio é
 * coberto pelo teste da action (`actions/materiais.test.ts`). Rodar aqui nos
 * três tamanhos é de graça, porque nada é gravado. */

test.describe('/ebooks/[slug] — formulário depois do texto (task 046)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${NEXT_URL}${EBOOK_COM_PDF}?e2e=1`)
    await expect(
      page.locator('#baixar form'),
      `o e-book ${EBOOK_COM_PDF} precisa de PDF — rode o seed com SEED_FIXTURES=1`,
    ).toHaveCount(1)
  })

  test('o formulário vem depois do texto e antes de "Entre em contato"; o herói não tem formulário', async ({
    page,
  }) => {
    const heroi = page.locator('main > section').first()
    await expect(heroi.locator('form')).toHaveCount(0)

    const ordem = await page.evaluate(() => {
      const [, corpo] = document.querySelectorAll('main > section')
      const formulario = document.querySelector('#baixar')
      const chamada = [...document.querySelectorAll('h2')].find((h) => h.textContent?.trim() === 'Entre em contato')
      const antes = (a: Element | null | undefined, b: Element | null | undefined) =>
        Boolean(a && b && a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
      return { textoAntes: antes(corpo, formulario), chamadaDepois: antes(formulario, chamada) }
    })
    expect(ordem).toEqual({ textoAntes: true, chamadaDepois: true })
  })

  test('o botão do herói rola até o formulário, sem o cabeçalho fixo por cima', async ({ page }) => {
    const titulo = page.locator('#baixar-titulo')
    await expect(titulo).not.toBeInViewport()

    await page.getByRole('link', { name: 'Baixar E-book agora' }).click()
    await expect(page).toHaveURL(/#baixar$/)
    await expect(titulo).toBeInViewport()

    /* O `scroll-mt` da seção: sem ele o título parava atrás do cabeçalho. */
    const topo = await titulo.evaluate((el) => el.getBoundingClientRect().top)
    const cabecalho = await page.evaluate(() => document.querySelector('nav.fixed')?.getBoundingClientRect().bottom)
    expect(cabecalho, 'o cabeçalho fixo (`nav.fixed`) não foi achado').toBeDefined()
    expect(topo).toBeGreaterThanOrEqual(cabecalho!)
  })
})
