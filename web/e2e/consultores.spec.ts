import { expect, test, type Page } from '@playwright/test'

import { NEXT_URL } from '../playwright.config'

/* /consultores — comportamento (feature consultores-solicitacao, task 016).
 *
 * ⚠️ **Esta rota saiu da regressão visual** em 24/09 (D-34): ela diverge do
 * protótipo de propósito desde a 014, e comparar com um gabarito que mostra o
 * desenho antigo não prova nada. O que cobre a página agora é este arquivo — o
 * filtro, o carrinho, a aba e o envio — mais o `smoke.spec.ts`.
 *
 * Os números vêm dos 8 perfis semeados (`scripts/seed/consultores.ts`) e são os
 * mesmos que `lib/consultores.test.ts` fixa no unitário. Aqui o que se testa é
 * a **ilha montada**: o que o unitário calcula chegando à tela e voltando.
 *
 * `?e2e=1` congela carrossel e rotação (`lib/e2e.ts`). */

const MODO_E = 'Todas estas'

/** Abre a lista de especialidades, que nasce recolhida (task 019). */
async function abrirEspecialidades(page: Page) {
  const caixa = page.getByRole('button', { name: 'Todas', exact: true }).locator('xpath=..')
  const controle = caixa.locator(':scope > button[aria-expanded="false"]')
  if (await controle.count()) await controle.click()
}

async function irParaConsultores(page: Page) {
  await page.goto(`${NEXT_URL}/consultores?e2e=1`)
  await expect(page.getByRole('heading', { name: 'Perfis Especializados Disponíveis' })).toBeVisible()
}

/** Os cards visíveis, pelo botão "Solicitar: <perfil>" de cada um. */
function cards(page: Page) {
  return page.getByRole('button', { name: /^(Solicitar|Na solicitação): / })
}

test.describe('/consultores — filtro', () => {
  test('modo OU: três tags devolvem a união dos perfis', async ({ page }) => {
    await irParaConsultores(page)
    await abrirEspecialidades(page)
    for (const tag of ['GCP', 'FinOps', 'PySpark']) {
      await page.getByRole('button', { name: tag, exact: true }).click()
    }
    await expect(cards(page)).toHaveCount(4)
  })

  /* ⚠️ O coração da feature: em `E`, cobertura parcial **não esvazia a lista**.
     Com 8 arquétipos, exigir três tags zeraria a maioria das combinações, e um
     beco sem saída no meio do funil é pior que um resultado parcial. */
  test('modo E sem cobertura total: a lista não esvazia e o selo diz quanto cobre', async ({ page }) => {
    await irParaConsultores(page)
    await page.getByRole('button', { name: MODO_E, exact: true }).click()
    await abrirEspecialidades(page)
    for (const tag of ['GCP', 'FinOps', 'PySpark']) {
      await page.getByRole('button', { name: tag, exact: true }).click()
    }

    await expect(page.getByText('Nenhum perfil reúne tudo o que você marcou')).toBeVisible()
    await expect(cards(page)).toHaveCount(4)
    await expect(page.getByText('cobre 2 de 3').first()).toBeVisible()
  })

  test('modo E com cobertura total: quem cobre tudo vai para o topo', async ({ page }) => {
    await irParaConsultores(page)
    await page.getByRole('button', { name: MODO_E, exact: true }).click()
    await abrirEspecialidades(page)
    for (const tag of ['AWS', 'GCP']) {
      await page.getByRole('button', { name: tag, exact: true }).click()
    }

    const nomes = await cards(page).evaluateAll((bs) =>
      bs.map((b) => (b.getAttribute('aria-label') ?? '').replace(/^(Solicitar|Na solicitação): /, '')),
    )
    expect(nomes.slice(0, 2)).toEqual(['Cloud Architect', 'FinOps & Cloud Cost Specialist'])
    /* Os parciais continuam listados, embaixo da faixa. */
    expect(nomes.length).toBeGreaterThan(2)
  })

  test('senioridade multi-seleção devolve a união', async ({ page }) => {
    await irParaConsultores(page)
    const so = async (nivel: string) => {
      await page.getByRole('button', { name: nivel, exact: true }).click()
      const n = await cards(page).count()
      await page.getByRole('button', { name: nivel, exact: true }).click()
      return n
    }
    const senior = await so('Senior')
    const lead = await so('Lead / Principal')

    await page.getByRole('button', { name: 'Senior', exact: true }).click()
    await page.getByRole('button', { name: 'Lead / Principal', exact: true }).click()
    await expect(cards(page)).toHaveCount(senior + lead)
  })
})

test.describe('/consultores — carrinho e aba de pedido', () => {
  const aba = (page: Page) => page.locator('#aba-de-pedido')

  /* ⚠️ A regra da task 018: o **primeiro** "adicionar" abre a aba; os seguintes
     não reabrem, senão escolher três perfis custaria três idas e voltas. */
  test('o primeiro perfil abre a aba, o segundo só atualiza a barra', async ({ page }) => {
    await irParaConsultores(page)
    await cards(page).nth(0).click()
    await expect(aba(page)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Minha solicitação' })).toBeFocused()

    await page.getByRole('button', { name: 'Minimizar' }).click()
    await expect(aba(page)).toBeHidden()
    const barra = page.getByRole('button', { name: /Revisar e enviar/ })
    await expect(barra).toContainText('1 perfil')

    await cards(page).filter({ hasNotText: 'Na solicitação' }).nth(0).click()
    await expect(aba(page)).toBeHidden()
    await expect(barra).toContainText('2 perfis')

    await barra.click()
    await expect(aba(page)).toBeVisible()
    await expect(aba(page).locator('li')).toHaveCount(2)
  })

  test('remover pela lixeira, e o carrinho sobrevive a trocar o filtro', async ({ page }) => {
    await irParaConsultores(page)
    await cards(page).nth(0).click()
    await page.getByRole('button', { name: 'Minimizar' }).click()
    await cards(page).filter({ hasNotText: 'Na solicitação' }).nth(0).click()

    await page.getByRole('button', { name: /Revisar e enviar/ }).click()
    await aba(page).getByRole('button', { name: /^Remover da solicitação/ }).first().click()
    await expect(aba(page).locator('li')).toHaveCount(1)
    await page.getByRole('button', { name: 'Minimizar' }).click()

    /* Trocar o filtro re-renderiza a grade inteira; o carrinho é estado do
       provedor e não pode ir junto. */
    await page.getByRole('button', { name: 'Senior', exact: true }).click()
    await expect(page.getByRole('button', { name: /Revisar e enviar/ })).toContainText('1 perfil')
  })

  test('sem perfil e sem descrição, o navegador barra o envio', async ({ page }) => {
    await irParaConsultores(page)
    /* Pela seção final, que abre a aba com o carrinho vazio. */
    await page.getByRole('button', { name: 'Solicitar consultores' }).click()
    await expect(aba(page)).toBeVisible()

    await aba(page).getByPlaceholder('Nome completo *').fill('Teste e2e')
    await aba(page).getByPlaceholder('E-mail corporativo *').fill('e2e-consultores@exemplo.com.br')
    await aba(page).getByRole('button', { name: 'Enviar solicitação' }).click()

    /* A descrição é obrigatória quando não há perfil escolhido: sem ela o
       formulário nem sai do navegador, e a confirmação não aparece. */
    const descricao = aba(page).getByPlaceholder(/Descreva o profissional/)
    await expect(descricao).toHaveJSProperty('validity.valueMissing', true)
    await expect(aba(page).getByText('Solicitação enviada')).toHaveCount(0)
  })

  /* ⚠️ Só no desktop: o formulário é o mesmo markup em toda largura — o que
   * muda com o viewport é a posição da aba, coberta pelos testes acima. E cada
   * corrida deste teste grava um lead de verdade, com e-mail marcado
   * (`@exemplo.com.br`), na base do ambiente. Rodá-lo nos três viewports
   * triplicaria isso e ainda esbarraria no teto de 5 envios por IP por hora,
   * que responde **sucesso falso** — verde na tela, nada no banco. */
  test('enviar com dois perfis mostra a confirmação e esvazia o carrinho', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', 'o envio roda uma vez; ver a nota acima')
    await irParaConsultores(page)

    await cards(page).nth(0).click()
    await page.getByRole('button', { name: 'Minimizar' }).click()
    await cards(page).filter({ hasNotText: 'Na solicitação' }).nth(0).click()
    await page.getByRole('button', { name: /Revisar e enviar/ }).click()

    await aba(page).getByPlaceholder('Nome completo *').fill('Teste e2e')
    await aba(page).getByPlaceholder('E-mail corporativo *').fill('e2e-consultores@exemplo.com.br')
    await aba(page).getByPlaceholder(/Telefone/).fill('11 99999-0000')

    /* ⚠️ O anti-spam descarta envio com menos de 3s desde a primeira interação
       — e devolve **sucesso falso**, indistinguível na tela. Sem esta espera o
       teste passaria sem nada ser gravado. */
    await page.waitForTimeout(3500)
    await aba(page).getByRole('button', { name: 'Enviar solicitação' }).click()

    await expect(aba(page).getByText('Solicitação enviada')).toBeVisible({ timeout: 20000 })
    await expect(aba(page).locator('li')).toHaveCount(0)

    await aba(page).getByRole('button', { name: 'Fechar' }).click()
    await expect(aba(page)).toBeHidden()
    /* Carrinho vazio: a barra some e os cards voltam a "Solicitar". */
    await expect(page.getByRole('button', { name: /Revisar e enviar/ })).toHaveCount(0)
    await expect(page.getByRole('button', { name: /^Solicitar: / })).toHaveCount(8)
  })
})
