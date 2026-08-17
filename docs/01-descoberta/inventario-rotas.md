---
status: rascunho
atualizado_em: 2026-08-17
depende_de: []
---

# Inventário de rotas

20 rotas declaradas em `legacy/src/App.tsx:2602-2631`. Todas client-side
(react-router `BrowserRouter`), sem SSR, sem `<meta>` por rota, sem 404.

`/chat` é declarada em um `<Routes>` separado (`App.tsx:2602-2604`) porque usa
layout de altura fixa sem `Footer` — ver `App.tsx:2596-2606`.

## Tabela

| Rota | Arquivo de origem | Seções da página | Componentes usados | Conteúdo consumido | Compl. | Observações |
|---|---|---|---|---|---|---|
| `/` | `App.tsx:2612` → `Home` (`App.tsx:2540`) | Hero+Clients, Stats, Features, Partners, CustomerStories, Testimonials, BlogSection, CTA | `AetherFlowHero`, `GlowCard`, `LogoCloudSwap`, `Tech*`, `HomeParallaxDecorations` | 5 cases, 4 features, 4 depoimentos, 7 logos cliente, 9 parceiros, 4 stats, 5 cards de blog fake | **alta** | Maior página do site; 8 seções, todas com dado hardcoded no mesmo arquivo |
| `/sobre` | `pages/About.tsx` | Hero+marquee, Stats(5), Quem Somos, Valores, Parceiros, Soluções, Por que escolher, CTA | `GlowCard`, `TechCornerBraces`, `StatusBadge`, `MetricChip`, `AnimatedCounter` | 5 fotos de evento, 3 valores, listas via i18n | média | Stats divergem da home — ver [debito-tecnico](debito-tecnico.md#inconsistências-de-conteúdo) |
| `/consultores` | `pages/Consultants.tsx` (1057L) | Hero, métricas, filtros, grid de perfis, diferenciais, formulário | `StatusBadge`, `MetricChip`, `Tech*` | `SPECIALIST_ROLES` (`:61`), `SPECIALTIES` (`:50`), `SENIORITIES` (`:59`), `DIFFERENTIALS` (`:272`) | **alta** | Bloco de contato é cópia literal do da home — comentário admite em `:685` |
| `/carreiras` | `pages/Careers.tsx` (621L) | Hero, menu sticky, Jeito ATRA, Premiações, Processo seletivo, Vagas+form, Vantagens, Trainee | `Tech*`, `GlowCard` | 6 seções via i18n (`careers.m1..m6`), selos GPTW/LIPT | média | Formulário de vaga sem destino (`:487`) |
| `/glossario` | `pages/Glossary.tsx` | Hero+busca, filtro alfabético, índice, termos agrupados | `GlowCard`, `TechCornerBraces`, `StatusBadge`, `MetricChip` | 17 termos em `glossaryTerms` (`:11-29`) | baixa | Estrutura mais limpa do projeto; candidata natural a collection |
| `/solucoes` | `pages/SolutionAI.tsx` (873L) | Hero, menu sticky, Como funciona, Benefícios, Para quem, Como fazemos | `StatusBadge`, `Tech*`, `GlowCard` | Quase todo via i18n (`solution.*`) | **alta** | ⚠️ Renderiza o **mesmo componente** de `/solucoes/inteligencia-artificial` |
| `/solucoes/inteligencia-artificial` | `pages/SolutionAI.tsx` | idem | idem | idem | — | Rota duplicada: `App.tsx:2617` e `:2618` apontam ao mesmo elemento |
| `/parceiros/google-cloud` | `pages/PartnerGoogleCloud.tsx` (81L) | delegado a `PartnerPageBase` | `PartnerPageBase` (346L) | badges 2018-2025 (`:9`), specs (`:30`), textos via `partner.*` | baixa | Página fina sobre base genérica — padrão a repetir para outros parceiros |
| `/cases-de-sucesso` | `pages/SuccessStories.tsx` | FeaturedHero, busca, chips de categoria, grid 2col | `FeaturedHero`, `StatusBadge`, `MetricChip` | `successStories` (`:16-61`), `CATEGORIES` (`:63`) | média | **Fatia vertical de referência** |
| `/cases-de-sucesso/marketplace-governanca-dados` | `pages/cases/MarketplaceGovernance.tsx` (36L) | delegado a `CaseDetailBase` | `CaseDetailBase` | props inline (`:7-31`) | baixa | 4 arquivos idênticos em forma, só props mudam |
| `/cases-de-sucesso/migracao-legado-gcp` | `pages/cases/LegacyMigration.tsx` (36L) | idem | `CaseDetailBase` | props inline | baixa | idem |
| `/cases-de-sucesso/eficiencia-processos-risco` | `pages/cases/RiskEfficiency.tsx` (36L) | idem | `CaseDetailBase` | props inline | baixa | idem |
| `/cases-de-sucesso/dashboards-estrategicos` | `pages/cases/StrategicDashboards.tsx` (30L) | idem | `CaseDetailBase` | props inline; sem `testimony` | baixa | Único sem depoimento — campo é opcional (`CaseDetailBase.tsx:16`) |
| `/insights` | `pages/Insights.tsx` (692L) | Hero, pills de categoria, destaques, filtros, grid, portais, newsletter | `GlowCard`, `Tech*`, `StatusBadge`, `AnimatedCounter` | `INSIGHTS_ITEMS` (`:76-218`, 10 itens), `CATEGORIES` (`:55`), `TOPICS` (`:64`) | **alta** | Hub que **reescreve** conteúdo das outras 5 páginas — ver [inventario-conteudo](inventario-conteudo.md#duplicação-entre-hub-e-listagens) |
| `/blog` | `pages/Blog.tsx` | FeaturedHero, busca, categorias, grid, paginação, destaque webinars | `FeaturedHero`, `StatusBadge`, `MetricChip` | `blogPosts` (`:11-60`, 6 posts), `CATEGORIES` (`:62`) | média | Paginação é decorativa (`:245-278`); posts não têm página de detalhe |
| `/relatorios` | `pages/Reports.tsx` (102L) | FeaturedHero, grid 3col | `FeaturedHero` | `reports` (`:10-35`, 3 itens) | baixa | Quase idêntica a `/ebooks` e `/webinars` |
| `/webinars` | `pages/Webinars.tsx` (100L) | FeaturedHero, grid 2col | `FeaturedHero` | `webinars` (`:9-34`, 3 itens) | baixa | idem |
| `/ebooks` | `pages/Ebooks.tsx` (83L) | FeaturedHero, grid 3col | `FeaturedHero` | `ebooks` (`:9-34`, 3 itens) | baixa | idem |
| `/chat` | `pages/Chat.tsx` (393L) | Header, sugestões, thread, input | `ChatGenerativeUI` (`ContactCard`, `ServiceCard`, `PartnerBadge`, `ChartCard`) | `SUGGESTED_PROMPTS` (`:59-84`); respostas via `POST /api/chat` | **alta** | Única rota com backend real; UI generativa por tags — ver [debito-tecnico](debito-tecnico.md#rota-chat) |
| `/design-system` | `pages/DesignSystem.tsx` (1141L) | 7+ seções: cores, tipografia, ícones, botões, badges, componentes, UI generativa | todos os componentes de `ui/` | tokens e amostras hardcoded | média | Página interna linkada no rodapé (`App.tsx:2532`) |

## Rotas ausentes que o código referencia

| Link | Origem | Situação |
|---|---|---|
| `/contato` | `components/CaseDetailBase.tsx:211` | **Link quebrado** — rota não existe no router |
| `/#fale-conosco` | `App.tsx:428`, `:1079`, `:1589` | Âncora para `CTA` (`App.tsx:2287`); só funciona a partir da home |
| `#` (placeholder) | `App.tsx:58,69,75,86,92,109-116`; `Blog.tsx:229` | 12+ links de solução/parceiro/artigo sem destino |

> [!DECISÃO PENDENTE] `/contato` vira rota própria no site novo, ou o CTA da home
> continua sendo o único ponto de contato (âncora)?

> [!DECISÃO PENDENTE] `/solucoes` e `/solucoes/inteligencia-artificial` devem ser
> a mesma página (redirect 301 de uma para a outra) ou `/solucoes` vira índice das
> 6 soluções do mega-menu, das quais só 1 tem página hoje?

> [!DECISÃO PENDENTE] Blog, relatórios, ebooks e webinars não têm página de detalhe
> hoje (o card não leva a lugar nenhum). O site novo cria `/blog/[slug]` etc.?
> Isso muda o modelo de conteúdo e o mapa de redirects.

## Estratégia de renderização sugerida (entrada para o mapa de migração)

| Grupo | Rotas | Sugestão |
|---|---|---|
| Institucional estático | `/`, `/sobre`, `/solucoes*`, `/parceiros/*`, `/carreiras` | `static` + revalidate via webhook do Payload |
| Listagens com filtro | `/cases-de-sucesso`, `/blog`, `/insights`, `/relatorios`, `/webinars`, `/ebooks`, `/glossario` | `static` com filtro client-side (mesmo comportamento de hoje) |
| Detalhe | `/cases-de-sucesso/[slug]` | `generateStaticParams` + ISR |
| Interativo | `/chat` | `dynamic` — já depende de rota de API |
| Interno | `/design-system` | fora do sitemap; `noindex` |
