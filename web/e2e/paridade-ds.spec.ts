import { expect, test } from '@playwright/test'

import { LEGACY_URL, NEXT_URL } from '../playwright.config'
import { visit } from './support/stability'

/* Compara estilo computado dos componentes portados contra o legado.
 * Mais confiável que inspeção manual: mede o que o navegador realmente aplica. */

const PROPS = [
  'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
  'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
  'borderRadius', 'borderWidth', 'backgroundColor', 'color', 'borderColor',
  'display', 'alignItems', 'gap',
] as const

type Estilo = Record<string, string>

async function estiloDe(page: import('@playwright/test').Page, seletor: string): Promise<Estilo | null> {
  return page.evaluate(
    ([sel, props]) => {
      const el = document.querySelector(sel as string)
      if (!el) return null
      const cs = getComputedStyle(el)
      return Object.fromEntries((props as string[]).map((p) => [p, cs[p as never] as string]))
    },
    [seletor, PROPS as unknown as string[]] as const,
  )
}

test('StatusBadge, MetricChip e SearchInput batem com o legado', async ({ page }) => {
  // Gabarito: /cases-de-sucesso do legado tem os três componentes.
  await visit(page, LEGACY_URL, '/cases-de-sucesso')
  const legado = {
    badge: await estiloDe(page, 'span.inline-flex.items-center.font-semibold'),
    input: await estiloDe(page, 'input[type="text"]'),
  }
  expect(legado.badge, 'badge não encontrado no legado').not.toBeNull()

  /* ⚠️ A mesma rota dos dois lados, e não a home.
   *
   * Este teste comparava o legado contra `/` do app novo, que era a bancada de
   * componentes da Fase 2 — uma página que existia só para isso. Com a home
   * real (MIG-059) a bancada saiu, e comparar rotas diferentes já era frágil:
   * agora é o mesmo conteúdo nos dois. */
  await visit(page, NEXT_URL, '/cases-de-sucesso')
  const novo = {
    badge: await estiloDe(page, 'span.inline-flex.items-center.font-semibold'),
    input: await estiloDe(page, 'main input[type="text"]'),
  }

  /* ⚠️ Uma divergência **de propósito**, e fixada aqui: `d785a12` (13/09) tirou
   * o contorno das caixas — badge, chip, campo — aplicando a regra sem-borda do
   * DESIGN.md, e a profundidade passou a sair do tom e da sombra. O legado
   * ainda tem 1px.
   *
   * Fixar, e não deixar de comparar: se o contorno voltar, se o legado mudar de
   * valor, ou se qualquer outra propriedade divergir, este teste fala. Sem
   * isto ele ficou **nove dias vermelho** por uma mudança deliberada — e teste
   * que vive vermelho não avisa mais nada. */
  const SEM_CONTORNO = { borderWidth: '0px' }
  expect(novo.badge, 'StatusBadge diverge do legado').toEqual({ ...legado.badge, ...SEM_CONTORNO })

  /* O campo perdeu a largura **e** a cor da borda no mesmo commit. Sem largura,
   * a cor não pinta nada: cobrá-la seria cobrar um valor que ninguém vê. */
  const semCor = (e: Estilo | null): Estilo => {
    const resto: Estilo = { ...(e ?? {}) }
    delete resto.borderColor
    return resto
  }
  expect(semCor(novo.input), 'SearchInput diverge do legado').toEqual({
    ...semCor(legado.input),
    ...SEM_CONTORNO,
  })
})
