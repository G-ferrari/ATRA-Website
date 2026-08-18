import type { Locale } from './locales'

/* Conteúdo da casca do site: menu e rodapé.
 *
 * No legado vem de `src/locales/{pt,en}.json` via i18next, com os destinos
 * escritos no JSX (`App.tsx:378` e `:2489`). Aqui fica num módulo só, até o
 * global `navigation` existir (MIG-072) — mesmo caminho de `contato.ts` e
 * `areas.ts`. Trocar a origem não muda nenhum componente.
 *
 * ⚠️ Vários destinos ainda não existem: as rotas nascem na Fase 3. No legado
 * eles já apontam para páginas que existem lá, então o link é o mesmo — só o
 * outro lado é que ainda não foi portado. */

type Item = { href: string; label: Record<Locale, string> }

/** As 7 categorias da fileira central, na ordem do legado (`App.tsx:365`). */
export const CATEGORIAS: Item[] = [
  { href: '#', label: { pt: 'Soluções', en: 'Solutions' } },
  { href: '/consultores', label: { pt: 'Consultores', en: 'Consultants' } },
  { href: '/insights', label: { pt: 'Insights', en: 'Insights' } },
  { href: '#', label: { pt: 'Parceiros', en: 'Partners' } },
  { href: '/carreiras', label: { pt: 'Carreiras', en: 'Careers' } },
  { href: '/sobre', label: { pt: 'Sobre', en: 'About' } },
  { href: '/glossario', label: { pt: 'Glossário', en: 'Glossary' } },
]

export const RODAPE = {
  solucoes: [
    { pt: 'Inovação & IA', en: 'Innovation & AI' },
    { pt: 'Dados, BI & Advanced Analytics', en: 'Data, BI & Advanced Analytics' },
    { pt: 'Governança & Cultura', en: 'Governance & Culture' },
  ],
  institucional: [
    { href: '/consultores', label: { pt: 'Consultores', en: 'Consultants' } },
    { href: '/cases-de-sucesso', label: { pt: 'Insights', en: 'Insights' } },
    { href: '/parceiros/google-cloud', label: { pt: 'Parceiros', en: 'Partners' } },
    { href: '/carreiras', label: { pt: 'Carreiras', en: 'Careers' } },
    { href: '/sobre', label: { pt: 'Sobre', en: 'About' } },
    { href: '/glossario', label: { pt: 'Glossário', en: 'Glossary' } },
  ] satisfies Item[],
  /* Os 3 links legais apontam para `#` no legado. `/politicas-e-termos` existe
   * no WordPress e entra em MIG-094. */
  legal: [
    { pt: 'Privacidade', en: 'Privacy' },
    { pt: 'Termos de Uso', en: 'Terms of Use' },
    { pt: 'Cookies', en: 'Cookies' },
  ],
}

export const TEXTOS_CASCA = {
  pt: {
    menu: 'Menu',
    faleConosco: 'Fale Conosco',
    fecharMenu: 'Fechar menu',
    abrirMenu: 'Abrir menu',
    logo: 'ATRA Logo',
    sobreATRA:
      'Com mais de 20 anos de experiência, ajudamos organizações a migrar, modernizar e inovar na nuvem, unindo nossa expertise à tecnologia do Google.',
    tituloSolucoes: 'Soluções',
    tituloSobre: 'Sobre',
    tituloContato: 'Fale Conosco',
    tituloLegal: 'Legal',
    direitos: '© 2026 ATRA. Todos os direitos reservados.',
    designSystem: 'Design System',
    alternarTema: 'Alternar tema',
  },
  en: {
    menu: 'Menu',
    faleConosco: 'Contact Us',
    fecharMenu: 'Close menu',
    abrirMenu: 'Open menu',
    logo: 'ATRA Logo',
    sobreATRA:
      "With over 20 years of experience, we help organizations migrate, modernize, and innovate in the cloud, uniting our expertise with Google's technology.",
    tituloSolucoes: 'Solutions',
    tituloSobre: 'About',
    tituloContato: 'Contact Us',
    tituloLegal: 'Legal',
    direitos: '© 2026 ATRA. All rights reserved.',
    designSystem: 'Design System',
    alternarTema: 'Toggle theme',
  },
} as const

/* Hotlink do WordPress, igual ao do legado (`App.tsx:333` e `:2460`).
 * Mantido para os dois renderizarem o mesmo arquivo; entra na migração de
 * mídia junto com os outros 32 hotlinks (MIG-071). */
export const LOGO_ATRA =
  'https://www.atra.com.br/wp-content/uploads/2025/08/atra_horizontal_cor-2048x1134.png'
