---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [roadmap.md, ../02-especificacao/mapa-de-migracao.md]
---

# Backlog

Cada task cabe em **uma sessão de Claude Code** e vira **uma PR**. Ordenadas por
dependência: nenhuma task aparece antes das suas.

Estimativas em horas de sessão assistida, não de trabalho humano solo.

Status: `todo` · `wip` · `done` · `blocked`

## Fase 1 — Fundação

| ID | Título | Arquivos | Dep. | Critério de aceite | Est. | Status |
|---|---|---|---|---|---|---|
| MIG-001 | Scaffold do projeto Next em `web/` | `web/package.json`, `web/next.config.ts`, `web/tsconfig.json` | — | `pnpm dev` sobe em :3000 com página em branco; typecheck passa | 1h | **done** |
| MIG-002 | Payload 3 + adapter Postgres | `web/src/payload.config.ts`, `web/src/collections/Users.ts` | 001 | `/admin` abre e cria o 1º usuário; tabelas criadas no Postgres | 2h | **done** |
| MIG-003 | Localization `pt`/`en` no Payload | `payload.config.ts` | 002 | Admin mostra seletor de locale; campo localizado grava nos dois | 1h | **done** |
| MIG-004 | docker-compose de dev (Postgres + MinIO) | `docker-compose.yml`, `.env.example` | 002 | `docker compose up -d` sobe os dois; Payload conecta em ambos | 1.5h | **done** |
| MIG-005 | Storage S3-compatível para Media | `payload.config.ts`, `collections/Media.ts` | 004 | Upload pelo admin cai no MinIO e é servido de volta | 1.5h | **done** |
| MIG-006 | Roteamento `[locale]` + **`proxy.ts`** | `web/src/app/[locale]/layout.tsx`, `web/src/proxy.ts` | 003 | `/` serve PT, `/en` serve EN, `/xx` cai em 404 | 2h | **done** |
| MIG-007 | Tokens de design + Tailwind v4 | `web/src/app/globals.css` | 001 | Tokens de `legacy/src/index.css:6-30` disponíveis; tema claro/escuro alterna | 2h | **done** |
| MIG-070 | **Recuperar as 30 imagens corrompidas** do build publicado (`atra-website.ai.studio`), conferindo contra os gêmeos internos | `legacy/public/**`, `legacy/src/assets/**` | — | `file -b` reporta imagem em 100%; hash bate com o gêmeo onde existir | 1.5h | **done** |
| ~~MIG-008~~ | ~~Mona Sans no app legado~~ | — | — | ❌ **Cancelada.** O legado já carrega Mona Sans via `@import` do Google Fonts (`index.css:1`); não há o que corrigir — ver D-16 | — | n/a |
| MIG-009 | Mona Sans via **`next/font/google`** (D-16) | `web/src/app/[locale]/layout.tsx` | 007 | Largura de texto idêntica à do legado (±0,1%) nos pesos 300–900 | 0.5h | **done** |
| MIG-010 | CI: lint, typecheck, build | `.github/workflows/ci.yml` | 001 | PR com erro de tipo reprova; PR limpa passa | 1.5h | **done** |
| MIG-011 | Playwright + harness de regressão visual | `web/playwright.config.ts`, `web/e2e/visual.spec.ts` | 006, 010, **070** | Suíte vazia roda no CI; captura do legado e do novo lado a lado | 3h | **done** |
| MIG-013 | **Papéis `editor`/`admin` + access control** (D-18) | `web/src/access/*`, `collections/Users.ts` | 002 | Editor não edita globals nem `ai-assistant`; editor não consegue se promover a admin | 2h | **done** |
| MIG-014 | **Admin em português** (`i18n` com `pt`) | `web/src/payload.config.ts` | 002 | Interface do admin em PT-BR; conteúdo segue editável nos dois idiomas | 0.5h | **done** |
| MIG-012 | **Piloto de conversão HTML → Lexical** (10 posts) | `web/scripts/wp-import/pilot.ts` | 002 | Relatório com o que converteu e o que quebrou nos 10; decisão registrada | 3h | **done** |

> MIG-012 é diagnóstico, não entrega. Existe para medir cedo o maior risco
> imprevisto do projeto — ver [roadmap](roadmap.md#fase-4b--migração-do-wordpress-d-17).

## Fase 2 — Fatia vertical

| ID | Título | Arquivos | Dep. | Critério de aceite | Est. | Status |
|---|---|---|---|---|---|---|
| MIG-020 | Collections `media`, `topics` | `collections/Media.ts`, `Topics.ts` | 005 | `alt` obrigatório; 12 topics semeados | 1.5h | **done** |
| MIG-021 | Collection `testimonials` | `collections/Testimonials.ts` | 020 | `photo` opcional (D-14); grava sem foto | 1h | **done** |
| MIG-022 | Collection `partners` | `collections/Partners.ts` | 020 | 9 parceiros cadastráveis; `hasPage` condiciona `layout` | 1.5h | **done** |
| MIG-023 | Collection `cases` + drafts | `collections/Cases.ts` | 021, 022 | Rascunho não aparece em `find` público; preview funciona | 2h | **done** |
| MIG-024 | Componentes-base do DS (parte 1) | `components/ui/{StatusBadge,MetricChip,GlowCard}.tsx` | 007, 009 | Paridade visual com o legado; sem import de `payload-types` | 3h | **done** |
| MIG-025 | Componentes-base do DS (parte 2) | `components/ui/{TabFilter,SearchInput,EmptyState,ContentCard,ChipFilter}.tsx` | 024 | `ChipFilter` unifica as 5 reimplementações de chip das listagens | 3h | **done** |
| MIG-026 | Mappers e tipos de apresentação | `lib/mappers/case.ts`, `types/content.ts` | 023 | `toCaseCard` tipado; relationship não populado morre no mapper | 1.5h | **done** |
| MIG-027 | Rota `/cases-de-sucesso` | `app/[locale]/cases-de-sucesso/page.tsx` | 025, 026 | 200 em PT e EN; busca e filtro por topic funcionando | 3h | **done** |
| MIG-028 | Rota `/cases-de-sucesso/[slug]` | `app/[locale]/cases-de-sucesso/[slug]/page.tsx` | 027 | 4 slugs respondem; `generateStaticParams` cobre os dois locales | 3h | **done** |
| MIG-029 | Seed dos 4 cases | `scripts/seed/cases.ts` | 023 | Roda 2× sem duplicar; imagens íntegras no Media | 2h | **done** |
| MIG-030 | Regressão visual das 2 rotas de case | `e2e/{baseline,visual}.spec.ts`, `e2e/support/*` | 011, 028 | Diferença ≤ 0,1% contra o legado, nos 3 viewports | 2h | **done** |
| MIG-030a | Seções que faltavam no porte: `FeaturedHero`, Solução, depoimento, CTA e barra lateral completa | `components/ui/{featured-hero,contact-cta,quote-block}.tsx`, `components/content/rich-text.tsx` | 030 | As 6 comparações passam | 4h | **done** |
| MIG-032 | **Live Preview + draft mode** (D-20) | `payload.config.ts`, `app/(frontend)/api/preview/route.ts`, `lib/preview.ts` | 028 | Editar um case mostra o resultado ao vivo nos 3 breakpoints, com rascunho | 4h | **done** |
| MIG-033 | Organização do admin: grupos, `useAsTitle`, `defaultColumns`, busca | `collections/*` | 023 | As 6 collections agrupadas; nenhuma lista ambígua (depoimentos ganharam `label` computado) | 2h | **done** |
| MIG-034 | **Casca do site: cabeçalho fixo + rodapé** | `components/layout/{site-header,site-footer,theme-toggle}.tsx`, `lib/navegacao.ts`, `app/(frontend)/[locale]/layout.tsx` | 030 | As 2 rotas de case comparam com `fullPage: true` e fecham em ≤0,1% | 5h | **done** |
| MIG-035 | **Regressão visual determinística**: fonte local no legado + suíte na imagem oficial do Playwright + build de produção | `web/scripts/gate.mjs`, `e2e/support/stability.ts`, `legacy/public/fonts/*`, `.github/workflows/ci.yml` | 034 | Suíte verde 3× seguidas no CI e no macOS **contra o mesmo gabarito** | 5h | **done** |
| MIG-072a | **Painéis do megamenu** (7 categorias) + gaveta mobile, alimentados pelo global `navigation` | `components/layout/site-header.tsx` | 034, 072 | Os 7 painéis abrem com o conteúdo do legado, vindo do CMS | 6h | todo |
| MIG-031 | **`CLAUDE.md` com o padrão consolidado** | `CLAUDE.md` | 030 | Contém exemplo real do código da fatia vertical | 2h | **done** |

> **Padrão de buraco no plano: existem tasks de "semear X" sem a de "criar X".**
> Aconteceu duas vezes. A casca do site (MIG-034) tinha seed de globals e nenhum
> componente que os renderizasse; o global `site-settings` era semeado em
> MIG-072 e consumido em MIG-072a, mas nada o definia — foi criado junto com
> MIG-048, que é quem precisa dele. Ao planejar as fases seguintes, conferir se
> toda task de seed tem uma task de definição antes dela.

> **MIG-034 apareceu durante MIG-030 e não estava no plano.** Nenhuma task
> construía o cabeçalho e o rodapé — os globals eram semeados (MIG-072), mas
> nada os renderizava. Sem a casca, toda rota da Fase 3 nasce incompleta e a
> regressão visual precisa ser recortada no `<main>`, deixando de cobrir a
> moldura. Fica no fim da Fase 2 porque é compartilhada por todas as rotas
> seguintes.

## Fase 3 — Fábrica de rotas

Uma PR por linha. Todas dependem de MIG-031.

| ID | Rota | Dep. extra | Est. |
|---|---|---|---|
| MIG-040 | `/glossario` + collection `glossary-terms` | — | 3h | **done** |
| MIG-041 | `/relatorios` + `/ebooks` + collection `resources` | — | 4h | **done** |
| MIG-042 | `/webinars` + collection `webinars` | — | 3h | **done** |
| MIG-043 | `/blog` + collection `posts` | — | 3h | **done** |
| MIG-044 | `/blog/[slug]` | 043 | 3h | **done** |
| MIG-045 | `/relatorios/[slug]` + `/ebooks/[slug]` | 041 | 2.5h | **done** |
| MIG-046 | `/webinars/[slug]` + player (D-11) | 042 | 3h | **done** |
| MIG-047 | Blocos: `pageHero`, `richTextSection`, `iconCardGrid`, `ctaBanner` + collection `pages` | — | 4h | **done** |
| MIG-048 | Blocos: `statsGrid`, `sealsBanner`, `valueCards`, `stickyPageNav` + global `site-settings` | 047 | 4h | **done** |
| MIG-049 | `/sobre` (a collection `pages` veio em 047) | 048 | 4h | **done** — no gate, ≤0,1% nos 3 viewports |
| MIG-049a | `pageHero.mediaMode`, imagem no `richTextSection`, rampa de colunas por variante, ids de bloco no seed EN, `navLabel`, `logoScale` | 049 | 3h | **done** |
| MIG-050 | `/carreiras` + collection `jobs` + blocos `jobsList`/`sealsBanner`/`processSteps` | 048 | 4h | **done** |
| MIG-051 | `/carreiras/[slug]` (vaga) | 050 | 2h | **done** |
| MIG-052 | `/consultores` + `specialist-roles` | 047 | 4h | **done** |
| MIG-053 | Bloco `ctaContact` + `/contato` (D-10) | 047 | 3h | **done** |
| MIG-054 | `/parceiros/[slug]` | 047 | 3h |
| MIG-055 | `/solucoes` (índice) + collection `solutions` | 047 | 3h |
| MIG-056 | `/solucoes/[slug]` | 055 | 3h |
| MIG-057 | Blocos da home: `hero`, `featureTabs`, `logoMarquee` | 048 | 5h |
| MIG-058 | Blocos da home: `caseCarousel`, `testimonialCarousel`, `contentTeaser` | 057 | 5h |
| MIG-059 | **Rota `/`** | 058 | 5h |
| MIG-060 | `/insights` (agrega 4 collections) | 044, 045, 046 | 4h |
| MIG-061 | `/chat` + `/api/chat` com rate limit (D-12) | 031 | 5h |
| MIG-062 | 404 + `error.tsx` | 031 | 1.5h | **done** |

## Fase 4a — Seed do protótipo

> **MIG-070 saiu desta fase para a Fase 1.** A recuperação das imagens precisa
> anteceder o baseline visual (MIG-011): congelar capturas com duas imagens
> quebradas registraria como "correto" um defeito que não existe no site real.
> Ordem obrigatória: **MIG-070 → MIG-011 (baseline)**. (MIG-008 foi cancelada:
> o legado já carrega a fonte corretamente — ver D-16.)

| ID | Título | Dep. | Critério de aceite | Est. |
|---|---|---|---|---|
| MIG-071 | Seed de glossário, materiais, parceiros, clientes, depoimentos | 070 | Idempotente; roda 2× sem duplicar | 4h |
| MIG-072 | Seed dos globals (`contact`, `navigation`, `footer`, `site-settings`) | 071 | Métricas com placeholder marcado até P-01 | 2h |
| MIG-073 | Baixar os 11 assets hotlinkados do WP para o Media | 070 | Zero URL `wp-content` no banco | 1.5h |

## Fase 4b — Migração do WordPress (D-17)

| ID | Título | Dep. | Critério de aceite | Est. |
|---|---|---|---|---|
| MIG-080 | Cliente da API REST do WP + paginação (**exige user-agent de browser**) | 012 | Traz os 207 posts em JSON, com retry | 2h |
| MIG-081 | Conversor HTML → Lexical + **`EXPERIMENTAL_TableFeature`** | 012 | Passa nos 12 do piloto, nos 4 outliers e em 20 amostrados; tabela vira `table`, não parágrafo | 3h |
| MIG-082 | Importador de mídia (destacada + inline) | 080 | Imagem baixada, com `alt` vindo do WP | 3h |
| MIG-083 | Importação dos 207 posts | 081, 082, 043 | 207 publicados, nenhum com corpo vazio | 3h |
| MIG-084 | Mapeamento de categorias do WP → `topics` | 083 | Todo post com ao menos 1 topic | 1.5h |
| MIG-085 | Importação das 6 vagas | 051 | 6 vagas publicadas com URL 1:1 | 2h |
| MIG-086 | Geração do `redirects.csv` dos posts | 083 | 207 linhas, todas validadas contra staging | 2h |

## Fase 4c — Conteúdo novo (D-17)

| ID | Título | Dep. | Critério de aceite | Est. |
|---|---|---|---|---|
| MIG-090 | Collection `segments` + template | 047 | Modelo conforme spec; admin utilizável | 3h |
| MIG-091 | `/segmentos` + `/segmentos/[slug]` | 090 | 200 nas 11 rotas | 4h |
| MIG-092 | Migrar as 10 páginas de segmento do WP | 091 | 10 publicadas com conteúdo real | 5h |
| MIG-093 | Expandir `solutions` de 6 para 13 | 056 | 13 publicadas; mega-menu comporta | 5h |
| MIG-094 | `/politicas-e-termos` + links do rodapé | 049 | Os 3 links legais deixam de apontar para `#` | 2h |

## Fase 5 — Formulários, SEO e analytics

| ID | Título | Dep. | Critério de aceite | Est. |
|---|---|---|---|---|
| MIG-100 | `form-submissions` + Server Action de contato | 053 | Envio grava no banco e dispara e-mail | 4h |
| MIG-101 | Anti-spam (honeypot, time trap, rate limit) | 100 | Bot simulado é barrado; humano passa | 2h |
| MIG-102 | Formulário de candidatura + upload de CV | 100, 051 | PDF em storage privado, URL assinada | 3h |
| MIG-103 | Newsletter com double opt-in | 100 | Confirmação por e-mail antes de ativar | 3h |
| MIG-104 | Download gated de material | 100, 045 | Formulário libera arquivo por URL assinada | 2.5h |
| MIG-105 | `generateMetadata` em todas as rotas | Fase 3 | Toda rota com title e description próprios | 3h |
| MIG-106 | `sitemap.ts` + `robots.ts` | 105 | Só publicados; sem locale não traduzido | 2h |
| MIG-107 | JSON-LD | 105 | Rich Results Test valida | 2.5h |
| MIG-108 | `redirects.csv` no `next.config.ts` + teste de CI | 086 | Toda linha: 301 → destino 200 | 3h |
| MIG-109 | GA4/GTM + consentimento de cookies | 105 | Nenhum script não essencial antes do aceite | 3h |
| MIG-110 | Budget guard da ATRA AI | 061 | Teto atingido degrada com mensagem, não com 500 | 2h |

## Fase 6 — Endurecimento

| ID | Título | Dep. | Critério de aceite | Est. |
|---|---|---|---|---|
| MIG-120 | Otimização de imagem e LCP | Fase 3 | Lighthouse ≥ 90 nas 5 rotas mais vistas | 4h |
| MIG-121 | axe no CI, reportando (D-13) | 010 | Relatório publicado por PR | 2h |
| MIG-122 | Sentry | 010 | Erro de teste chega no painel | 2h |
| MIG-123 | Backup `pg_dump` + **teste de restore** | Fase 4 | Restore em base limpa, verificado | 3h |
| MIG-124 | Uptime e alerta | 122 | Alerta dispara em queda simulada | 1.5h |
| MIG-125 | `/design-system` com `noIndex` | 025 | Reconstruído dos tokens reais | 4h |
| MIG-126 | **Guia do editor** (D-20) | Fase 4 | Cobre entrar, criar case, imagem+alt, preview, publicar, corrigir métrica | 4h |
| MIG-127 | **Teste do objetivo com o marketing** (D-20) | 126, 032 | Alguém do marketing executa os 6 passos sem ajuda; o que travar vira correção | 2h |
| MIG-128 | Sessão de handoff gravada | 127 | Marketing + RH treinados; gravação arquivada | 2h |

## Fase 7 — Cutover · Fase 8 — Limpeza

| ID | Título | Dep. | Critério de aceite | Est. |
|---|---|---|---|---|
| MIG-130 | Staging com dado de produção | Fase 6 | URL protegida, conteúdo real | 2h |
| MIG-131 | Redução de TTL do DNS (48 h antes) | 130 | TTL ≤ 300 s confirmado por `dig` | 0.5h |
| MIG-132 | Ensaio de cutover em staging | 130 | Checklist do runbook executado ponta a ponta | 3h |
| MIG-133 | Cutover | 132 | `atra.com.br` no site novo, TLS válido | 3h |
| MIG-134 | Monitoramento pós-cutover (30 dias) | 133 | Sem pico de 404; Search Console estável | — |
| MIG-135 | Remover `legacy/` | 134 | Repositório sem o app antigo | 1h |
| MIG-136 | Desativar o WordPress | 134 | Hospedagem encerrada | 0.5h |

---

## Totais

| Fase | Tasks | Horas |
|---|---|---|
| 1 Fundação | 14 | ~23h |
| 2 Fatia vertical | 14 | ~32h |
| 3 Fábrica de rotas | 23 | ~78h |
| 4a Seed | 3 | ~7,5h |
| 4b Migração WP | 7 | ~20h |
| 4c Conteúdo novo | 5 | ~19h |
| 5 Formulários/SEO | 11 | ~30h |
| 6 Endurecimento | 9 | ~25h |
| 7–8 Cutover/limpeza | 7 | ~10h |
| **Total** | **93** | **~244h** |

⚠️ Estas horas cobrem **engenharia**. Não cobrem: curadoria editorial de
`segments` e `solutions` (Fase 4c), redação dos 9 materiais sem corpo (P-07),
revisão da tradução EN (P-08) nem o dimensionamento de traduzir ~50 itens de
conteúdo para inglês — todos fora da engenharia e no caminho crítico do cutover.
