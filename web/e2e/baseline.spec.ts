import { test } from '@playwright/test'

import { LEGACY_URL } from '../playwright.config'
import { ALVO, COR_DA_MASCARA, MASCARA, ROTAS_COM_GABARITO } from './support/rotas'
import { visit } from './support/stability'

/* Gera o gabarito a partir do LEGADO.
 *
 * Rodar com `pnpm baseline`, que passa --update-snapshots. Sem isso este
 * arquivo é pulado: o gabarito não deve ser regravado por engano numa execução
 * comum — atualizar snapshot exige justificativa no PR. */
test.skip(!process.env.GRAVAR_GABARITO, 'gabarito só é gravado por `pnpm baseline`')

for (const { nome, caminho } of ROTAS_COM_GABARITO) {
  test(`gabarito: ${nome}`, async ({ page }) => {
    await visit(page, LEGACY_URL, caminho)
    // `toHaveScreenshot` repete a captura até dois quadros saírem iguais —
    // é a estabilização embutida do Playwright.
    await test.expect(page.locator(ALVO)).toHaveScreenshot(`${nome}.png`, {
      mask: [page.locator(MASCARA)],
      maskColor: COR_DA_MASCARA,
    })
  })
}
