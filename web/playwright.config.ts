import { defineConfig, devices } from '@playwright/test'

/* Regressão visual como teste principal do projeto — a pergunta que ele
 * responde é "esta página continua igual à que está no ar?".
 * Ver docs/03-plano/estrategia-de-testes.md.
 *
 * Dois alvos ao mesmo tempo:
 *   NEXT_URL   :3000  app novo
 *   LEGACY_URL :3001  app legado, o gabarito (sai do repo só na Fase 8)
 */
export const NEXT_URL = process.env.NEXT_URL ?? 'http://localhost:3000'
export const LEGACY_URL = process.env.LEGACY_URL ?? 'http://localhost:3001'

const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 900 },
} as const

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.artifacts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  expect: {
    toHaveScreenshot: {
      // Limite de 0,1%, como definido na estratégia de testes.
      maxDiffPixelRatio: 0.001,
      // Tolera ruído de antialiasing sem mascarar diferença real de layout.
      threshold: 0.15,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },

  use: {
    baseURL: NEXT_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    colorScheme: 'dark',
    /* `reducedMotion` não é opção de topo do `use` nesta versão — vai em
     * contextOptions. O typecheck pegou; os testes passavam mesmo assim,
     * silenciosamente sem reduzir animação nenhuma. */
    contextOptions: { reducedMotion: 'reduce' },
  },

  projects: (['mobile', 'tablet', 'desktop'] as const).map((name) => ({
    name,
    use: { ...devices['Desktop Chrome'], viewport: VIEWPORTS[name] },
  })),
})
