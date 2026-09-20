import { expect, test } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'

/* MIG-150 (D-29) — o convite de lead dentro do chat.
 *
 * ⚠️ O container do gate roda com a feature **escura** (sem `ENABLE_CHAT_LEAD`),
 * e é isso que mantém o gabarito de `/chat` válido. O primeiro teste protege
 * exatamente essa premissa e roda sempre; o caminho feliz só roda onde a
 * feature está ligada — em homologação, ou localmente com as duas pontas:
 * `ENABLE_CHAT_LEAD=1` no servidor e `E2E_CHAT_LEAD=1` no executor. */
test.describe('convite de lead no chat (MIG-150)', () => {
  test('o estado vazio do chat não tem o convite — a premissa do gate', async ({ page }) => {
    await page.goto(`${NEXT_URL}/chat?e2e=1`)
    await expect(page.getByRole('heading', { name: 'Como podemos impulsionar sua empresa hoje?' })).toBeVisible()
    await expect(page.getByTestId('convite-lead')).toHaveCount(0)
  })

  test('após 2 mensagens do visitante o convite aparece, com a isca escondida', async ({ page }) => {
    test.skip(process.env.E2E_CHAT_LEAD !== '1', 'feature escura neste ambiente — ver o topo do arquivo')

    await page.goto(`${NEXT_URL}/chat?e2e=1`)
    const caixa = page.getByRole('textbox', { name: 'O que você deseja construir hoje?' })

    /* Duas mensagens DO VISITANTE. Sem `GEMINI_API_KEY` a rota degrada (503) e
       a mensagem do usuário fica no estado — o gatilho conta exatamente isso,
       de propósito: é quando a IA não responde que capturar o contato mais
       importa. */
    for (const texto of ['Quero modernizar o BI da minha empresa', 'Quanto custa um projeto típico?']) {
      await caixa.fill(texto)
      await page.getByRole('button', { name: 'Enviar mensagem' }).click()
      await expect(caixa).toBeEnabled({ timeout: 15000 })
    }

    const convite = page.getByTestId('convite-lead')
    await expect(convite).toBeVisible()

    /* O mesmo par do formulário de contato: a isca existe e está fora do
       alcance de gente (MIG-101). */
    const isca = convite.locator('input[name="website"]')
    await expect(isca).toHaveCount(1)
    await expect(isca).not.toBeInViewport()

    /* O recorte de P-20 viaja no envio: só o que o visitante digitou. */
    await expect(convite.locator('input[name="chatContext"]')).toHaveValue(/Quanto custa um projeto típico\?/)

    /* Dispensável: o X esconde o cartão sem enviar nada. */
    await convite.getByRole('button', { name: 'Dispensar convite' }).click()
    await expect(convite).toHaveCount(0)
  })
})
