import { expect, test } from '@playwright/test'

import { LEGACY_URL, NEXT_URL } from '../playwright.config'
import { visit } from './support/stability'

/* Regressão visual: compara cada rota portada com a mesma rota do legado.
 *
 * A lista está vazia porque nenhuma rota foi portada ainda — a primeira entra
 * em MIG-030, com a fatia vertical de Cases. O harness abaixo já é o que aquela
 * task vai usar; o teste de mecanismo garante que ele funciona antes de haver
 * o que comparar. */

type Rota = { path: string; nome: string }
const ROTAS_COM_GABARITO: Rota[] = [
  // { path: '/cases-de-sucesso', nome: 'cases-listagem' },   ← MIG-030
]

for (const { path, nome } of ROTAS_COM_GABARITO) {
  for (const tema of ['dark', 'light'] as const) {
    test(`${nome} (${tema}) mantém paridade com o legado`, async ({ page }, info) => {
      await visit(page, LEGACY_URL, path, tema)
      const gabarito = await page.screenshot({ fullPage: true })

      await visit(page, NEXT_URL, path, tema)
      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
        `${nome}-${tema}-${info.project.name}.png`,
      )
      // O gabarito vai como anexo para a revisão humana comparar lado a lado.
      await info.attach(`${nome}-${tema}-legado`, { body: gabarito, contentType: 'image/png' })
    })
  }
}

test('harness: captura os dois apps lado a lado', async ({ page }, info) => {
  /* Não compara — as duas páginas ainda são diferentes por natureza. Verifica
   * que o mecanismo funciona: estabilizar, navegar nos dois alvos, capturar e
   * anexar. É o critério de aceite de MIG-011. */
  await visit(page, LEGACY_URL, '/')
  const legado = await page.screenshot({ fullPage: true })
  expect(legado.byteLength).toBeGreaterThan(1000)
  await info.attach('legado-home', { body: legado, contentType: 'image/png' })

  await visit(page, NEXT_URL, '/')
  const novo = await page.screenshot({ fullPage: true })
  expect(novo.byteLength).toBeGreaterThan(1000)
  await info.attach('novo-home', { body: novo, contentType: 'image/png' })
})

test('captura é determinística: duas execuções seguidas são idênticas', async ({ page }) => {
  /* O teste que protege o teste. Se a captura não for reprodutível, a
   * regressão visual vira ruído e é ignorada em duas semanas.
   *
   * O hero entra mascarado por um motivo medido: ele é a ÚNICA fonte de
   * instabilidade da home legada. Gira a palavra do título por setInterval
   * (aether-flow-hero.tsx:13) e desenha partículas animadas, então duas
   * capturas saem com texto diferente. Com ele mascarado, as duas capturas são
   * byte-idênticas — os três carrosséis, os contadores e o resto da página já
   * ficam estáveis com o que `stabilize()` faz.
   *
   * MIG-030 decide entre manter a máscara ou congelar o hero no app por flag
   * `?e2e=1`. Congelar é melhor: máscara cega justamente a primeira dobra. */
  const capturar = async () => {
    await visit(page, LEGACY_URL, '/')
    return page.screenshot({ fullPage: true, mask: [page.locator('main > *').first()] })
  }
  expect(Buffer.compare(await capturar(), await capturar()), 'capturas do mesmo alvo diferiram').toBe(0)
})
