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
  /* Compila as rotas antes de qualquer teste — ver support/aquecimento.ts. */
  globalSetup: './e2e/support/aquecimento.ts',
  /* Gabarito e comparação usam o MESMO diretório de snapshots: um é gravado a
   * partir do legado, o outro compara o app novo contra ele. */
  snapshotPathTemplate: '{testDir}/gabarito/{arg}-{projectName}{ext}',
  outputDir: './e2e/.artifacts',
  fullyParallel: true,
  /* A suíte roda contra o servidor de **desenvolvimento**, que compila sob
   * demanda: com os 5 workers do padrão, a mesma rota levava de 8s a 70s e os
   * timeouts apareciam como falha de paridade. Dois workers mantêm o tempo
   * previsível.
   *
   * A correção durável é comparar contra um build de produção — é o que vai ao
   * ar, e não recompila. Registrado como MIG-035. */
  workers: 2,
  /* 30s não bastava: `settle()` rola a página em passos de 80ms, e uma rota de
   * 4.600px no mobile leva ~5s só nisso, com três workers disputando o mesmo
   * servidor de dev. Timeouts apareciam como falha de paridade e mascaravam o
   * número real. */
  timeout: 90_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  expect: {
    /* Orçamento de **captura**, não de correção. O padrão de 5s é apertado:
     * `toHaveScreenshot` repete a captura até dois quadros saírem iguais, e uma
     * página de 3.100px numa máquina carregada não fecha nisso. As falhas
     * apareciam sem `-actual.png` nem `-diff.png` — sinal de que nada chegou a
     * ser comparado. Aumentar aqui não afrouxa o limite de 0,1%.
     *
     * ⚠️ Vai em `expect`, não dentro de `toHaveScreenshot`: lá a chave não
     * existe, o TypeScript reprova e o Playwright a **ignora em silêncio** em
     * runtime — a suíte passa a rodar como se nada tivesse mudado. */
    timeout: 20_000,
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
    /* Permite apontar a suíte para um ambiente atrás de senha (o staging na
     * VPS): `E2E_BASIC_AUTH=usuario:senha`. Sem a variável, nada muda — o gate
     * local continua sem credencial nenhuma. */
    httpCredentials: process.env.E2E_BASIC_AUTH
      ? {
          username: process.env.E2E_BASIC_AUTH.split(':')[0],
          password: process.env.E2E_BASIC_AUTH.split(':').slice(1).join(':'),
        }
      : undefined,
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
