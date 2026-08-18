import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Migrações são geradas pelo Payload — não editar nem lintar.
    "src/migrations/**",
    // Saída do Playwright: o relatório HTML embute JS minificado, e lintá-lo
    // produzia 3.031 problemas em código de terceiros. Só aparecia depois de
    // rodar a suíte, por isso o CI (que linta antes) nunca viu.
    "playwright-report/**",
    "e2e/.artifacts/**",
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
