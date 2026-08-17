---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [inventario-rotas.md]
---

# Inventário de componentes

24 componentes exportados em `legacy/src/components/`, mais 11 componentes de
seção **não exportados**, definidos dentro de `legacy/src/App.tsx`.

Total: 12.093 linhas em `src/`, das quais 2.668 (22%) estão em `App.tsx`.

## Componentes de `components/ui/` — base do design system

| Componente | Caminho | Linhas | Usado em | Natureza | DS? |
|---|---|---|---|---|---|
| `GlowCard` | `ui/spotlight-card.tsx:28` | 190 | Home, About, Glossary, Insights, Careers, DesignSystem | apresentacional | **sim** |
| `StatusBadge` | `ui/badge-status.tsx:15` | 109 (com MetricChip) | SuccessStories, Blog, Glossary, About, Insights, Consultants, SolutionAI | apresentacional | **sim** |
| `MetricChip` | `ui/badge-status.tsx:79` | — | idem | apresentacional | **sim** |
| `AnimatedCounter` | `ui/animated-counter.tsx:15` | 60 | About, Insights, Consultants | apresentacional | **sim** |
| `TabFilter` | `ui/tab-filter.tsx:20` | 81 | apenas DesignSystem | apresentacional | **sim** (ver nota) |
| `LogoCloudSwap` | `ui/logo-clouds.tsx:191` | 268 | Home (`App.tsx:1428`), DesignSystem | apresentacional | **sim** |

> `TabFilter` só é usado na vitrine `/design-system` (`DesignSystem.tsx:62`) —
> as demais páginas reimplementam chips de filtro à mão. Ver duplicações abaixo.

## Componentes de `components/`

| Componente | Caminho | Linhas | Usado em | Natureza | Observação |
|---|---|---|---|---|---|
| `AetherFlowHero` | `aether-flow-hero.tsx:91` | 535 | Home (`App.tsx:2544`) | apresentacional + `ROTATING_WORDS` (`:13`) | Hero animado; maior componente isolado |
| `CaseDetailBase` | `CaseDetailBase.tsx:24` | 222 | 4 páginas de case | **contém dado** (`:167` lista de áreas fixa) | Template de detalhe; contrato já bem definido em `:6-22` |
| `PartnerPageBase` | `PartnerPageBase.tsx:72` | 346 | `/parceiros/google-cloud` | apresentacional | Mesma estratégia do `CaseDetailBase`, para parceiros |
| `FeaturedHero` | `FeaturedHero.tsx:24` | 193 | Blog, SuccessStories, Reports, Webinars, Ebooks (**5 rotas**) | apresentacional | Carrossel de destaque; contrato `FeaturedItem` (`:7-17`) já é quase um schema de CMS |
| `ChatGenerativeUI` | `ChatGenerativeUI.tsx` | 192 | Chat | apresentacional | 4 exports: `ContactCard:7`, `ServiceCard:49`, `PartnerBadge:87`, `ChartCard:109` |
| `TechHorizontalLine` | `TechDetails.tsx:17` | 289 (arquivo) | Home, Blog, Insights, Consultants, SolutionAI, Careers | decorativo | Recebe `sectionName` textual (ex.: `"STATS_METRICS"`) |
| `TechVerticalLine` | `TechDetails.tsx:103` | — | idem | decorativo | |
| `TechCornerBraces` | `TechDetails.tsx:185` | — | About, Glossary, Insights | decorativo | |
| `TechSectionBoundary` | `TechDetails.tsx:243` | — | **nenhum** | decorativo | ⚠️ Código morto |
| `BackgroundDecorations` | `Decorations.tsx:29` | 170 (arquivo) | About, Insights | decorativo | |
| `HomeParallaxDecorations` | `Decorations.tsx:102` | — | Home (`App.tsx:2543`) | decorativo | |
| `RoundedDiamond` | `Decorations.tsx:4` | — | importado em `App.tsx:9`, nunca renderizado | decorativo | ⚠️ Import morto |
| `ScrollParallaxShape` | `Decorations.tsx:64` | — | interno de `HomeParallaxDecorations` | decorativo | |
| `SmoothScroll` | `SmoothScroll.tsx:4` | 63 | `App.tsx:2608` | comportamento | Envolve todas as rotas menos `/chat` |
| `ScrollToTop` | `ScrollToTop.tsx:4` | 18 | `App.tsx:2664` | comportamento | Substituível por comportamento nativo do Next |

## Componentes de seção presos dentro de `App.tsx`

Nenhum é exportado. Todos misturam markup e dado no mesmo bloco — é aqui que
está a maior parte do trabalho de extração.

| Componente | Linha | Aprox. | Dado embutido |
|---|---|---|---|
| `PartnersDropdown` | `:123` | 35L | usa `partnersDropdownData` (`:107`) |
| `InsightsDropdown` | `:160` | 35L | usa `insightsData` (`:99`) |
| `MegaMenu` | `:199` | 76L | usa `solutionsData` (`:45`) |
| `Navbar` | `:277` | 816L | **7 categorias de menu com textos inline** (`:604-899`) |
| `Counter` | `:1095` | 34L | — (utilitário; duplica `AnimatedCounter`) |
| `Stats` | `:1131` | 261L | 4 métricas + 3 cards de parceiro + selos |
| `Partners` | `:1394` | 41L | `partners[]` (`:1396-1406`) |
| `Features` | `:1437` | 164L | `features[]` (`:1441-1470`) |
| `CustomerStories` | `:1603` | 254L | `stories[]` (`:1609-1670`) |
| `ClientCarousel` | `:1859` | 58L | `clients[]` (`:1860-1868`) |
| `Testimonials` | `:1919` | 130L | `testimonials[]` (`:1922-1947`) |
| `Clients` | `:2051` | 92L | textos inline + caixa de prompt da ATRA AI |
| `BlogCard` | `:2145` | 19L | — |
| `BlogSection` | `:2166` | 116L | 5 cards com títulos e imagens `picsum.photos` |
| `CTA` | `:2284` | 160L | formulário + endereço + telefone + redes sociais |
| `Footer` | `:2446` | 92L | 3 colunas de links + dados de contato |
| `PageLoader` | `:2558` | 8L | — |
| `AppRoutes` | `:2567` | 92L | roteamento + toggle de tema |

## Duplicações detectadas

| # | O que está duplicado | Onde | Encaminhamento |
|---|---|---|---|
| 1 | **Contador animado** — duas implementações independentes | `App.tsx:1095` (`Counter`, aceita `"15+"` string) e `ui/animated-counter.tsx:15` (`AnimatedCounter`, aceita `end`+`suffix`) | Manter `AnimatedCounter`; portar chamadas de `Counter` |
| 2 | **Bloco de contato completo** (form + card de imagem + WhatsApp + redes) | `App.tsx:2284-2444` e `Consultants.tsx:685-880` — o próprio comentário em `Consultants.tsx:685` diz "*Using the EXACT components & layout from the Home page*" | Um `ContactSection` único, alimentado pelo global `contact` |
| 3 | **Página de listagem de recurso** — mesma estrutura, 3 variações | `Reports.tsx` (102L), `Webinars.tsx` (100L), `Ebooks.tsx` (83L) | Um `ResourceListPage` parametrizado por tipo |
| 4 | **Chips de filtro por categoria** | `SuccessStories.tsx:137`, `Blog.tsx:140`, `Insights.tsx:426`, `Consultants.tsx:481`, `Glossary.tsx:125` — 5 reimplementações; `ui/tab-filter.tsx` existe e não é usado | Adotar `TabFilter` nas 5 |
| 5 | **Campo de busca com ícone + botão limpar** | `SuccessStories.tsx:113`, `Blog.tsx:116`, `Insights.tsx:413`, `Glossary.tsx:97`, `Consultants.tsx:449` | Extrair `SearchInput` |
| 6 | **Estado vazio "Nenhum X encontrado"** | `SuccessStories.tsx:154`, `Blog.tsx:157`, `Glossary.tsx:172` | Extrair `EmptyState` |
| 7 | **Lista de parceiros com URL de logo — três cópias** | `App.tsx:107-117` (`partnersDropdownData`, com `desc`/`link`), `App.tsx:1396-1406` (`partners`, só nome+url) e `ui/logo-clouds.tsx:24-125` (`DEFAULT_LOGOS`, 8 logos em JSX inline) | Uma collection `partners`; `LogoCloudSwap` recebe por prop e perde o default |
| 8 | **Imagens dos 4 cases importadas 3x** | `App.tsx:37-40`, `SuccessStories.tsx:10-13`, `Insights.tsx:4-7` | Resolve-se sozinho com Payload Media |
| 9 | **Grid de card de conteúdo** (imagem 16/10 + badge + data + título + tags) | `Blog.tsx:180`, `Reports.tsx:63`, `Insights.tsx:481` | Extrair `ContentCard` |

## Componentes-base a portar primeiro (ordem sugerida)

Antes de qualquer rota, para que a fatia vertical de Cases já nasça no padrão:

1. **Tokens e tema** — `src/index.css:6-30` (`@theme`) e `:148-158` (dark). É a
   fundação de tudo; ver [inventario-assets](inventario-assets.md#fontes).
2. `cn()` — `lib/utils.ts:4` (clsx + tailwind-merge). Copiar como está.
3. `StatusBadge` + `MetricChip` — usados em 7 rotas, sem dependência.
4. `GlowCard` — usado em 6 rotas.
5. `AnimatedCounter` — resolve a duplicação #1 já na origem.
6. `TabFilter` + `SearchInput` + `EmptyState` — resolvem #4, #5 e #6 antes de
   replicá-los 19 vezes.
7. `Tech*` (`TechDetails.tsx`) — puramente decorativos, mas aparecem em 6 rotas;
   portar cedo evita retrabalho visual na comparação de regressão.
8. `FeaturedHero` — porta de entrada de 5 rotas de listagem.
9. `ContentCard` — resolve #9.
10. `CaseDetailBase` → vira o template da fatia vertical.

> [!DECISÃO PENDENTE] Os componentes `Tech*` e `Decorations` são puramente
> decorativos e somam ~460 linhas. Mantemos a identidade visual exatamente como
> está (porte fiel) ou é uma oportunidade de simplificação já no porte? O
> princípio 2 do plano diz porte fiel — confirmar que vale para decoração também.
