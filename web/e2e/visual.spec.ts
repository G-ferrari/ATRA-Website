import { expect, test } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'
import { ALVO, COR_DA_MASCARA, MASCARA, ROTAS_COM_GABARITO } from './support/rotas'
import { visit } from './support/stability'

/* Regressão visual: cada rota portada contra o gabarito do legado.
 *
 * O gabarito vive em e2e/baseline.spec.ts-snapshots/ e é gerado por
 * `pnpm baseline`. O legado roda com `?e2e=1`, que congela rotação de palavra,
 * carrosséis e partículas (legacy/src/lib/e2e.ts).
 *
 * Limite de 0,1% de pixels diferentes — ver estrategia-de-testes.md. */

for (const { nome, caminho } of ROTAS_COM_GABARITO) {
  test(`${nome}: paridade com o legado`, async ({ page }) => {
    await visit(page, NEXT_URL, caminho)
    await expect(page.locator(ALVO)).toHaveScreenshot(`${nome}.png`, {
      mask: [page.locator(MASCARA)],
      maskColor: COR_DA_MASCARA,
    })
  })
}
