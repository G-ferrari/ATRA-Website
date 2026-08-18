import type { Locale } from './locales'

/* Áreas de atuação exibidas na barra lateral de todo case.
 *
 * No legado é uma lista literal dentro do JSX, igual em todos os cases
 * (`legacy/src/components/CaseDetailBase.tsx:167`). Fica aqui até o global
 * `site-settings` existir (MIG-072) — mesmo caminho de `contato.ts`.
 *
 * Candidata a virar campo do case: são as áreas do projeto, e hoje todo case
 * mostra as mesmas cinco. Ver debito-tecnico.md. */
export const AREAS_DE_ATUACAO: Record<Locale, string[]> = {
  pt: [
    'Cloud Data Analytics',
    'Governança de Dados',
    'Data Integration',
    'Data Security',
    'Data Management',
  ],
  en: [
    'Cloud Data Analytics',
    'Data Governance',
    'Data Integration',
    'Data Security',
    'Data Management',
  ],
}
