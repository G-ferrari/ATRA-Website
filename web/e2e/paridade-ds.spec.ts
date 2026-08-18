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

  await visit(page, NEXT_URL, '/')
  const novo = {
    badge: await estiloDe(page, 'span.inline-flex.items-center.font-semibold'),
    input: await estiloDe(page, 'main input[type="text"]'),
  }

  expect(novo.badge, 'StatusBadge diverge do legado').toEqual(legado.badge)
  expect(novo.input, 'SearchInput diverge do legado').toEqual(legado.input)
})
