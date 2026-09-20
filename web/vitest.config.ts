import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/* Unitário cobre onde há lógica de verdade — mappers, conversor do WordPress,
 * redirects, rate limit. Componente de marketing fica com a regressão visual.
 * Ver docs/03-plano/estrategia-de-testes.md. */
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: { '@': path.resolve(dirname, './src') },
  },
})
