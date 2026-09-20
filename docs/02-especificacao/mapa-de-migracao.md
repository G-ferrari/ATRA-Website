---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [modelo-de-conteudo.md, blocos.md, contratos-de-dados.md]
---

# Mapa de migração

Contrato que a fase de implementação executa. Uma linha por rota; **uma PR por
linha**.

Caminhos novos são relativos a `web/src/app/[locale]/`. Todas as rotas existem em
PT (raiz) e EN (`/en/...`) por D-07 — o segmento `[locale]` cuida disso, então a
coluna "Rota Next" mostra só o caminho canônico em PT.

Legenda de renderização: **S** = estático (`generateStaticParams` + revalidate por
webhook) · **ISR** = incremental · **D** = dinâmico.

## Rotas com equivalente no legado

| # | Rota legada | Arquivo legado | Rota Next | Arquivo Next | Rend. | Collections | Componentes reaproveitados | Novos | Riscos |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `/cases-de-sucesso` | `pages/SuccessStories.tsx` | `/cases-de-sucesso` | `cases/page.tsx` | S | `cases`, `topics` | `FeaturedHero`, `StatusBadge`, `MetricChip` | `ContentCard`, `TopicFilter`, `SearchInput`, `EmptyState` | **Fatia vertical** — define o padrão das outras 19 |
| 2 | `/cases-de-sucesso/[4 slugs]` | `pages/cases/*.tsx` | `/cases-de-sucesso/[slug]` | `cases/[slug]/page.tsx` | S | `cases`, `testimonials`, `partners` | `CaseDetailBase` → `CaseLayout` | — | 4 arquivos viram 1 rota; `CaseDetailBase.tsx:167` tem lista fixa que vira `topics` |
| 3 | `/` | `App.tsx:2540` (`Home`) | `/` | `page.tsx` | S | `pages(home)` + 6 collections via blocos | `AetherFlowHero`, `GlowCard`, `LogoCloudSwap`, `Tech*` | 9 blocos | Maior página; 8 seções; extrair 11 componentes presos em `App.tsx` |
| 4 | `/sobre` | `pages/About.tsx` | `/sobre` | `sobre/page.tsx` | S | `pages`, `site-settings`, `partners` | `AnimatedCounter`, `GlowCard`, `TechCornerBraces` | `stickyPageNav`, `valueCards` | Métricas divergem da home (**P-01**) |
| 5 | `/carreiras` | `pages/Careers.tsx` | `/carreiras` | `carreiras/page.tsx` | S | `pages`, `jobs?`, `site-settings` | `Tech*`, `GlowCard` | `processSteps` | **P-02** — sem resposta, a seção de vagas não existe |
| 6 | `/consultores` | `pages/Consultants.tsx` | `/consultores` | `consultores/page.tsx` | S | `specialist-roles`, `topics` | `StatusBadge`, `MetricChip` | `TopicFilter`, `ctaContact` | Bloco de contato é cópia da home (`Consultants.tsx:685`) — usar o mesmo bloco |
| 7 | `/glossario` | `pages/Glossary.tsx` | `/glossario` | `glossario/page.tsx` | S | `glossary-terms`, `topics` | `GlowCard`, `StatusBadge` | `AlphabetFilter` | Baixo risco; melhor candidata a segunda rota portada |
| 8 | `/insights` | `pages/Insights.tsx` | `/insights` | `insights/page.tsx` | S | `cases`, `posts`, `resources`, `webinars`, `topics` | `GlowCard`, `AnimatedCounter` | `ContentCard`, `TopicFilter` | **Deixa de ter lista própria** — passa a consultar as collections. Paridade visual sim, paridade de conteúdo não |
| 9 | `/blog` | `pages/Blog.tsx` | `/blog` | `blog/page.tsx` | S | `posts`, `topics` | `FeaturedHero` | `ContentCard`, paginação real | Paginação do legado é decorativa (`Blog.tsx:245`) — a nova funciona de verdade |
| 10 | `/relatorios` | `pages/Reports.tsx` | `/relatorios` | `relatorios/page.tsx` | S | `resources(report)` | `FeaturedHero` | `ContentCard` | Três listagens quase idênticas viram um `ResourceListPage` |
| 11 | `/ebooks` | `pages/Ebooks.tsx` | `/ebooks` | `ebooks/page.tsx` | S | `resources(ebook)` | `FeaturedHero` | idem | idem |
| 12 | `/webinars` | `pages/Webinars.tsx` | `/webinars` | `webinars/page.tsx` | S | `webinars` | `FeaturedHero` | idem | `"45:00"`/`"HD"` fixos viram campo (D-11) |
| 13 | `/solucoes` | `pages/SolutionAI.tsx` | `/solucoes` | `solucoes/page.tsx` | S | `solutions` | `StatusBadge`, `Tech*` | índice novo | **Muda de comportamento**: era cópia da página de IA, vira índice (D-09) |
| 14 | `/solucoes/inteligencia-artificial` | `pages/SolutionAI.tsx` | `/solucoes/[slug]` | `solucoes/[slug]/page.tsx` | S | `solutions` | `GlowCard`, `Tech*` | `processSteps`, `iconCardGrid` | Único com conteúdo real; vira template das outras 5 |
| 15 | `/parceiros/google-cloud` | `pages/PartnerGoogleCloud.tsx` | `/parceiros/[slug]` | `parceiros/[slug]/page.tsx` | S | `partners` | `PartnerPageBase` → blocos | — | Baixo risco; página já é fina sobre base genérica |
| 16 | `/chat` | `pages/Chat.tsx` | `/chat` | `chat/page.tsx` + `api/chat/route.ts` | D | `ai-assistant` | `ChatGenerativeUI` (4 componentes) | rate limit, budget guard | **D-12**; não portar o `define` do `vite.config.ts:12` |
| 17 | `/design-system` | `pages/DesignSystem.tsx` | `/design-system` | `design-system/page.tsx` | S | — | todos os `ui/*` | — | Portar **por último**; `noIndex`; reconstruir dos tokens reais, não repetir valores |

## Rotas novas (sem baseline legado)

Critério de aceite destas é **funcional**, não comparativo — não existe captura de
referência para comparar.

| # | Rota Next | Arquivo | Rend. | Collections | Origem da decisão | Riscos |
|---|---|---|---|---|---|---|
| 18 | `/blog/[slug]` | `blog/[slug]/page.tsx` | ISR | `posts` | D-08 | ⚠️ 6 posts sem corpo — nascem rascunho |
| 19 | `/relatorios/[slug]` | `relatorios/[slug]/page.tsx` | ISR | `resources(report)` | D-08 | ⚠️ 3 sem corpo |
| 20 | `/ebooks/[slug]` | `ebooks/[slug]/page.tsx` | ISR | `resources(ebook)` | D-08 | ⚠️ 3 sem corpo |
| 21 | `/webinars/[slug]` | `webinars/[slug]/page.tsx` | ISR | `webinars` | D-08 + D-11 | ⚠️ 3 sem corpo; player novo |
| 22 | `/contato` | `contato/page.tsx` | S | `pages`, `contact` | D-10 | Conserta o link quebrado de `CaseDetailBase.tsx:211` |
| 23 | `/solucoes/[slug]` × 5 | (mesma rota da linha 14) | S | `solutions` | D-09 | ⚠️ **conteúdo não existe** — 5 soluções só têm título e descrição de menu |
| 24 | `/admin/*` | Payload | D | — | D-04 | Fora do sitemap; `noIndex` |
| 25 | `not-found` | `not-found.tsx` | S | — | débito 🟡 | Legado não tem 404 — hoje devolve 200 |
| 26 | `/sitemap.xml`, `/robots.txt` | `sitemap.ts`, `robots.ts` | S | todas | débito 🔴 | Ver [seo-e-redirects](seo-e-redirects.md) |

## Ordem de execução

Deriva das dependências, não do valor de negócio.

| Fase | Rotas | Por quê nesta ordem |
|---|---|---|
| **1 — Fundação** | nenhuma | Payload + Postgres + CI + Playwright + **Mona Sans no legado** (D-16) |
| **2 — Fatia vertical** | 1, 2 | Cases ponta a ponta define o padrão; documentar em `CLAUDE.md` ao final |
| **3a — Listagens simples** | 7, 10, 11, 12, 9 | Mesmo formato da fatia vertical; validam `ContentCard` e `TopicFilter` |
| **3b — Detalhes** | 18, 19, 20, 21 | Reusam o layout de detalhe da fatia vertical |
| **3c — Institucionais** | 4, 5, 6, 15, 22 | Dependem dos blocos, que dependem do padrão consolidado |
| **3d — Soluções** | 13, 14, 23 | Índice + template; conteúdo novo |
| **3e — Home** | 3 | Maior e mais arriscada; entra depois que todos os blocos existem |
| **4 — Agregação** | 8 | `/insights` consulta tudo — só faz sentido com as collections povoadas |
| **5 — Interativo** | 16 | Chat com rate limit e budget guard |
| **6 — Endurecimento** | 17, 25, 26 | Design system, 404, sitemap |

**A home entra tarde de propósito.** É a página mais visível e a mais complexa
(8 seções, 11 componentes a extrair); portá-la antes de o padrão estar firme
significa refazê-la.

## Riscos transversais

| Risco | Mitigação |
|---|---|
| Fonte muda o layout ao carregar de verdade (D-16) | Carregar Mona Sans no legado **antes** de qualquer captura; tratar as quebras que aparecerem como bug do legado, não do porte |
| PR de rota crescendo além de ~400 linhas | Sinal de que refactor entrou junto com o porte — reverter a melhoria e registrar em `debito-tecnico.md` |
| Componente divergindo entre rotas | `CLAUDE.md` prescritivo + revisão de que a rota usa os componentes do DS |
| Conteúdo voltando hardcoded | Se o modelo não cobre, **voltar ao spec e adicionar o campo** — nunca contornar no código |
| `/insights` sem paridade de conteúdo | Combinar com o marketing que o hub passa a refletir o acervo real; não é regressão |
