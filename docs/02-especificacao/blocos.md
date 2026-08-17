---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [modelo-de-conteudo.md, ../01-descoberta/inventario-componentes.md]
---

# Blocos flexíveis

Usados em `pages.layout`, `solutions.layout` e `partners.layout`. Cada bloco
corresponde a uma seção que **já existe** no legado — nenhum bloco foi inventado.

## Catálogo

| Bloco | Origem no legado | Usado por | Campos |
|---|---|---|---|
| `hero` | `aether-flow-hero.tsx:91` + `Clients` (`App.tsx:2051`) | home | `headline` (loc), `rotatingWords[]` (loc), `subheadline` (loc), `showAiPrompt` (bool), `backgroundStyle: aether \| gradient \| plain` |
| `pageHero` | `About.tsx:150`, `Glossary.tsx:71`, `Careers.tsx:99` | páginas internas | `badge` (loc), `chip` (loc), `title` (loc), `description` (loc), `ctas[]`, `mediaMode: none \| image \| marquee`, `images[] → media` |
| `statsGrid` | `Stats` (`App.tsx:1131`), `About.tsx:236` | home, sobre | `variant: bento \| compact`, `source: siteSettings \| custom`, `customItems[]{ value, suffix, label (loc), icon }` |
| `sealsBanner` | `App.tsx:1217-1295`, `Careers.tsx:306` | home, carreiras, sobre | `title` (loc), `description` (loc), `seals` (de `site-settings`) |
| `featureTabs` | `Features` (`App.tsx:1437`) | home | `eyebrow` (loc), `title` (loc), `description` (loc), `items[]{ badge, title, description, icon, image → media }`, `autoRotateSeconds` |
| `logoMarquee` | `LogoCloudSwap` (`App.tsx:1428`), `ClientCarousel` (`App.tsx:1859`) | home, sobre | `title` (loc), `source: partners \| clients`, `filterFeatured` (bool) |
| `caseCarousel` | `CustomerStories` (`App.tsx:1603`) | home | `eyebrow` (loc), `title` (loc), `description` (loc), `mode: featured \| manual`, `cases[] → cases`, `ctaLabel` (loc) |
| `testimonialCarousel` | `Testimonials` (`App.tsx:1919`) | home | `title` (loc), `mode: featured \| manual`, `testimonials[] → testimonials` |
| `contentTeaser` | `BlogSection` (`App.tsx:2166`) | home, sobre | `eyebrow` (loc), `title` (loc), `description` (loc), `sources[]: posts \| cases \| resources \| webinars`, `limit`, `showNewsletter` (bool) |
| `richTextSection` | `About.tsx:291`, `SolutionAI.tsx:218` | todas | `eyebrow` (loc), `title` (loc), `body` richText (loc), `image → media`, `imagePosition: left \| right \| none` |
| `iconCardGrid` | `About.tsx:403`, `:434`, `SolutionAI.tsx:252` | sobre, soluções | `eyebrow` (loc), `title` (loc), `columns: 2..4`, `items[]{ icon, title (loc), description (loc) }` |
| `valueCards` | `About.tsx:351` | sobre | `title` (loc), `items[]{ icon, glowColor, title (loc), description (loc) }` |
| `processSteps` | `Careers.tsx:362`, `SolutionAI.tsx:395` | carreiras, soluções | `title` (loc), `steps[]{ number, title (loc), description (loc), icon }` |
| `stickyPageNav` | `About.tsx:258`, `Careers.tsx:159`, `SolutionAI.tsx:180` | páginas longas | `items[]{ label (loc), anchor }` — **gerado dos blocos com `anchor` preenchido** |
| `partnerShowcase` | `About.tsx:376` | sobre, soluções | `title` (loc), `partners[] → partners`, `grayscale` (bool) |
| `ctaContact` | `CTA` (`App.tsx:2284`), `Consultants.tsx:685` | home, contato, consultores | `title` (loc), `subtitle` (loc), `formId`, `showContactCard` (bool), `backgroundImage → media` |
| `ctaBanner` | `CaseDetailBase.tsx:185`, `About.tsx:456` | fim de página | `title` (loc), `description` (loc), `cta{ label (loc), href }`, `variant: primary \| subtle` |
| `resourceList` | `SuccessStories.tsx:90`, `Blog.tsx:93` | índices | `source`, `showSearch` (bool), `showTopicFilter` (bool), `pageSize` |
| `videoEmbed` | novo (D-11) | webinars | `url`, `caption` (loc) |

## Composição das páginas iniciais

Reproduz a ordem exata do legado — requisito de paridade visual (D-15).

| Página | Blocos, em ordem |
|---|---|
| `home` | `hero` → `statsGrid` → `sealsBanner` → `featureTabs` → `logoMarquee`(partners) → `caseCarousel` → `testimonialCarousel` → `contentTeaser` → `ctaContact` |
| `sobre` | `pageHero` → `statsGrid` → `stickyPageNav` → `richTextSection` → `valueCards` → `partnerShowcase` → `iconCardGrid` → `iconCardGrid` → `ctaBanner` |
| `carreiras` | `pageHero` → `stickyPageNav` → `iconCardGrid` → `sealsBanner` → `processSteps` → `ctaContact` → `iconCardGrid` |
| `contato` (nova, D-10) | `pageHero` → `ctaContact` |
| `solucoes/[slug]` | `pageHero` → `stickyPageNav` → `iconCardGrid` → `processSteps` → `richTextSection` → `ctaBanner` |
| `parceiros/[slug]` | `pageHero` → `richTextSection` → `iconCardGrid` → `iconCardGrid` → `ctaBanner` |

## Regras de bloco

1. **Bloco não busca dado.** Recebe tudo por props, resolvidas na page server
   component. Ver [contratos-de-dados](contratos-de-dados.md).
2. **Todo bloco aceita `anchor` (`text`) e `theme` (`surface-1 | surface-2`).**
   O `anchor` alimenta o `stickyPageNav`; o `theme` reproduz a alternância de
   fundo que o legado faz seção a seção.
3. **Bloco novo exige justificativa** no PR: por que nenhum dos existentes serve.
   É o que impede 20 rotas virarem 20 dialetos.
4. **`mode: featured | manual`** é o padrão para blocos que listam conteúdo:
   `featured` consulta a collection por `featured: true`; `manual` recebe uma
   seleção explícita. Evita duplicar conteúdo como o hub `/insights` faz hoje.

> [!DECISÃO PENDENTE] `iconCardGrid` aparece duas vezes seguidas em `sobre`,
> `carreiras` e `parceiros` com conteúdos distintos ("Soluções" e "Por que
> escolher"). Funciona, mas o editor vê dois blocos de mesmo nome na lista. Vale
> criar variantes nomeadas (`solutionsGrid`, `benefitsGrid`) para clareza no
> admin, ao custo de mais tipos no schema?
