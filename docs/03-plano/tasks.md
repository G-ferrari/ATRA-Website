---
status: rascunho
atualizado_em: 2026-08-25
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
| MIG-010 | CI: lint, typecheck, build | `.github/workflows/ci.yml` | 001 | PR com erro de tipo reprova; PR limpa passa | 1.5h | **done** — ✅ **execução verde de verdade em 20/08** ([run 32326603668](https://github.com/G-ferrari/ATRA-Website/actions/runs/32326603668)), nos dois jobs. Até aqui o `e2e` nunca tinha passado: faltava `.env.local` no executor do seed e não havia serviço de storage |
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
| MIG-072a | **Painéis do megamenu** (7 categorias) + gaveta mobile, alimentados pelo global `navigation` | `components/layout/site-header.tsx`, `globals/Navigation.ts`, `components/layout/mega-menu.tsx` | 034, 072 | Os 7 painéis abrem com o conteúdo do legado, vindo do CMS | 6h | **done** — o global `navigation` foi criado junto (era o 3º caso de seed sem definição); Soluções e Parceiros leem as collections |
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
| MIG-050 | `/carreiras` + collection `jobs` + blocos `jobsList`/`sealsBanner`/`processSteps` | 048 | 4h | **done** por MIG-050a — a entrega original saiu a 30% do gabarito |
| MIG-051 | `/carreiras/[slug]` (vaga) | 050 | 2h | **done** |
| MIG-052 | `/consultores` + `specialist-roles` | 047 | 4h | **done** — ⚠️ fechada em MIG-052 com **57% da página faltando** e sem gabarito; refeita e com portão verde nos 3 viewports |
| MIG-053 | Bloco `ctaContact` + `/contato` (D-10) | 047 | 3h | **done** |
| MIG-054 | `/parceiros/[slug]` | 047 | 3h | **done** por MIG-054a — a entrega original saiu a 38% do gabarito |
| MIG-055 | `/solucoes` (índice) + collection `solutions` | 047 | 3h | **done** — sem gabarito (D-09); aceite funcional no smoke |
| MIG-056 | `/solucoes/[slug]` | 055 | ~~3h~~ **~5x maior** | **done** — portão verde nos 3 viewports. A composição prevista não batia com o legado: exigiu 4 blocos novos e 4 variantes. Ver a nota em [blocos.md](../02-especificacao/blocos.md#regras-de-bloco) |
| MIG-050a | **`/carreiras` a 30% do gabarito** — reconstrução | 050 | 6h | ✅ feita |
| MIG-054a | **`/parceiros/[slug]` a 38% do gabarito** — reconstrução | 054 | 4h | ✅ feita |
| MIG-057 | Blocos da home: `homeHero` (com a caixa de IA), `featureTabs`, `logoMarquee` | 048 | 5h | **done** — os três batem exato com o gabarito; a home ainda não entra em `ROTAS_COM_GABARITO`, faltam 5 blocos |
| MIG-058 | Blocos da home: `homeBento`, `caseCarousel`, `testimonialCarousel`, `contentTeaser` + variante `ctaContact: photo` | 057 | 5h | **done** — os 8 blocos batem; a home fecha em 6.860px dos dois lados |
| MIG-059 | **Rota `/`** | 058 | 5h | **done** — a home entrou em `ROTAS_COM_GABARITO`; a bancada do design system saiu |
| MIG-060 | `/insights` — **hub curado**, não agregação | 044, 045, 046 | 4h | **done** — portão verde nos 3 viewports |
| MIG-061 | `/chat` + `/api/chat` com rate limit (D-12) | 031 | 5h | **done** — portão verde nos 3 viewports. ⚠️ Os **números** do limite são provisórios (P-04) e a UI generativa não foi portada; ver debito-tecnico |
| MIG-062 | 404 + `error.tsx` | 031 | 1.5h | **done** |

> **Três rotas foram fechadas sem gabarito e saíram muito curtas.** Medido em
> 19/08, altura de página no desktop contra o legado: `/consultores` 4.975px
> contra 11.696 (**−57%**), `/carreiras` 10.111 contra 14.539 (**−30%**),
> `/parceiros/google-cloud` 5.789 contra 9.317 (**−38%**). As três têm gabarito
> no legado e nenhuma tinha sido registrada em `ROTAS_COM_GABARITO` — passaram
> no aceite só com asserção funcional no smoke.
>
> `/consultores` foi refeita e está verde. As outras duas seguem abertas, e o
> levantamento já está feito:
>
> **MIG-050a — `/carreiras`.** ✅ **Fechada.** A página passou de 10.111px para
> os 14.539px do gabarito, e o `pnpm gate` fecha verde nos três viewports. O
> levantamento previa quatro mudanças de schema; foram sete, porque três
> divergências só apareceram com a página montada e medida:
>
> - `subtitle` e `align` no `pageHero`; `card-centered` no `iconCardGrid`;
>   `headerLayout`/`description`/`subtitle`/`callout` no `richTextSection`;
>   `talentBank` no `jobsList` — as previstas.
> - `variant: expanded` + `highlight` + `bullets` no `valueCards`: a seção
>   "Jeito ATRA de Ser" não é a grade de ícones que MIG-050 usou, e sim os
>   **mesmos três valores de /sobre** num cartão alto, com tagline colorida,
>   divisor e checklist (`Careers.tsx:222`).
> - `spacing` em `camposComuns`: /sobre usa `py-16 md:py-20` nas oito seções e
>   /carreiras usa `py-20 md:py-24` em seis das sete. Eram 384px.
> - `bottomGap` no `stickyPageNav`: /sobre fecha o menu com `mb-8 sm:mb-10` e
>   /carreiras não, embora os dois usem o menu institucional. Eram 40px.
>
> Duas correções de conteúdo saíram de conferir o legado em vez do levantamento:
> a descrição do herói termina em "profissional" (o porte tinha emendado uma
> oração que não existe em `careers.desc`), e a linha de apoio do processo
> seletivo é "Transparência", não "Processo Seletivo" — este é o rótulo do menu.
>
> O aceite também exigiu um conserto no **arnês**: `stabilize()` trocava a mídia
> do app novo por um PNG 1×1 e deixava passar a mídia local do legado, servida
> pelo Vite em `/src/assets/images/`. O selo LIPT, único dos três que vem de
> arquivo local, saía 75×102 de um lado e 1×1 do outro — 7.473 pixels numa
> caixa que a máscara devia ter igualado. O padrão entrou na lista, com guarda
> de `resourceType() === 'image'`: sem ela o stub responde também ao *import de
> módulo* do Vite e a home do legado renderiza vazia.
>
> **MIG-054a — `/parceiros/[slug]`.** ✅ **Fechada.** 3.689px contra 3.689px no
> desktop, e igual nos outros dois viewports — seção a seção.
>
> A medição mostrou que "as cinco seções batem de nome" era o único jeito em que
> batiam. O legado não monta esta página com seções avulsas: tem um componente
> só, `PartnerPageBase.tsx`, que as 8 páginas de parceiro instanciam com props.
> As três seções do meio são **o mesmo esqueleto de duas colunas** — muda só o
> que vai à direita (imagem com etiqueta, lista de conferência, grade de fichas)
> —, e o porte as tinha transformado em grades de ícones, que não têm coluna
> nenhuma. O herói também perdera a faixa dos cinco "Partner of the Year".
>
> Daí os dois blocos novos, `partnerHero` e `partnerSplit` (com `rightColumn`),
> mais a variante `dark-centered` do `ctaBanner`. Dois, e não cinco, porque é
> assim que o legado se organiza — e servem as outras 7 páginas de parceiro sem
> código novo.
>
> O aceite exigiu outro conserto no arnês, irmão do de MIG-050a: o logo do
> parceiro vem do CDN do Google (`gstatic.com`) e não estava na lista de mídia
> stubada, então media uma caixa de um lado e outra do outro.
>
> E os três testes de megamenu que dependiam de `hover` deixaram de ser
> instáveis. O `toPass` que os protegia repetia um gesto que o browser ignorava:
> `hover()` move o ponteiro, e mover para onde ele já está não emite
> `mouseenter`. Agora cada tentativa passa por outra categoria antes, e reabre o
> menu se ele fechou no meio do caminho.
>
> **Regra que sai daqui:** rota com gabarito no legado **entra em
> `ROTAS_COM_GABARITO` na mesma PR que a porta**. Sem isso, "done" não quer
> dizer nada — foram 15.000px de divergência atravessando a Fase 3 sem ninguém
> ver.

## Fase 4a — Seed do protótipo

> **MIG-070 saiu desta fase para a Fase 1.** A recuperação das imagens precisa
> anteceder o baseline visual (MIG-011): congelar capturas com duas imagens
> quebradas registraria como "correto" um defeito que não existe no site real.
> Ordem obrigatória: **MIG-070 → MIG-011 (baseline)**. (MIG-008 foi cancelada:
> o legado já carrega a fonte corretamente — ver D-16.)

| ID | Título | Dep. | Critério de aceite | Est. |
|---|---|---|---|---|
| MIG-071 | Seed de glossário, materiais, parceiros, clientes, depoimentos | 070 | Idempotente; roda 2× sem duplicar | 4h | **done** — `pnpm seed` 2× sem mudar nenhuma contagem; nova collection `clients` (7) e depoimentos 3→7 |
| MIG-072 | Seed dos globals (`contact`, `navigation`, `footer`, `site-settings`) | 071 | Métricas com placeholder marcado até P-01 | 2h | **done** — `contact` e `footer` também precisaram ser **criados**; os 3 números em disputa entram com `pending` marcado |
| MIG-073 | Baixar os 11 assets hotlinkados do WP para o Media | 070 | Zero URL `wp-content` no banco | 1.5h | **done** — restava 1 (o logo); os outros 10 vieram em MIG-071. `pg_dump` + `grep wp-content` = 0 |

> **Dois globals do título de MIG-072 não existiam.** É o terceiro caso do mesmo
> buraco — a task diz "semear X" e nenhuma task cria X (o 1º foi a casca do
> site, MIG-034; o 2º, o `navigation` de MIG-072a). `contact` e `footer` foram
> definidos junto com o seed.
>
> **O que saiu do repositório e virou CMS nesta task:** `lib/contato.ts` (5
> componentes liam a lista escrita à mão), `RODAPE` e `REDES_SOCIAIS` de
> `lib/navegacao.ts`, e o hotlink do logo. O que ficou em `navegacao.ts` é cromo
> de interface — rótulo de botão, `alt`, "Alternar tema". Saiu junto a lista
> `CATEGORIAS`, que **ninguém importava** desde MIG-072a e parecia a fonte dos
> sete itens do topo.
>
> ⚠️ **O e-mail e o endereço do CTA com foto continuam literais** no componente:
> o gabarito parte o e-mail no meio da palavra e o endereço em três linhas, com
> pontuação diferente da string do rodapé, e quebra é pixel. Em
> `debito-tecnico.md`.

## Fase 4b — Migração do WordPress (D-17)

| ID | Título | Dep. | Critério de aceite | Est. |
|---|---|---|---|---|
| MIG-080 | Cliente da API REST do WP + paginação (**exige user-agent de browser**) | 012 | Traz os 207 posts em JSON, com retry | 2h | **done** |
| MIG-081 | Conversor HTML → Lexical + **`EXPERIMENTAL_TableFeature`** | 012 | Passa nos 12 do piloto, nos 4 outliers e em 20 amostrados; tabela vira `table`, não parágrafo | 3h | **done** — verificado nos **207**, não em 36: 100% de retenção, 287/287 imagens, 2/2 tabelas |
| MIG-082 | Importador de mídia (destacada + inline) | 080 | Imagem baixada, com `alt` vindo do WP | 3h | **done** — 287 imagens; `alt` do WP em 47, do título da mídia em 193, do título do artigo em 47 |
| MIG-083 | Importação dos 207 posts | 081, 082, 043 | 207 publicados, nenhum com corpo vazio | 3h | **done** — 207 publicados, 0 sem corpo ou resumo |
| MIG-084 | ~~Mapeamento de categorias do WP → `topics`~~ **sem fonte de dado** | 083 | ⚠️ **Repactuar — ver P-27.** MIG-080 mediu: o WP tem 1 categoria (`uncategorized`, com os 207 posts) e 0 tags. Não há taxonomia para mapear, e classificar é decisão de conteúdo (D-22) | 1.5h |
| MIG-085 | Importação das 6 vagas | 051 | 6 vagas publicadas com URL 1:1 | 2h | **done** — são **7**, não 6; área deduzida do título espera P-28 |
| MIG-086 | Geração do `redirects.csv` dos posts | 083 | 207 linhas, todas validadas contra staging | 2h | **done** — 261 linhas validadas **contra o staging na VPS** em 25/08: cadeia completa seguida (barra final → regra → destino 200), 410s conferidos após a normalização. 261/261 |

> **O que MIG-080 mediu no WP, e que muda as tasks seguintes.** Volumes reais:
> 207 posts · 52 páginas (as 6 vagas de MIG-085 estão entre elas) · 541 mídias
> acessíveis · 1 categoria · 0 tags.
>
> ⚠️ **Em `media` o `X-WP-Total` mente**: diz 562 e entrega 541 — o WP conta
> anexos que depois esconde por permissão do post-mãe. Pior, a **primeira página
> volta com 99 de 100**, então parar a paginação por "lote menor que `per_page`"
> importaria 99 de 541 sem erro nenhum. O cliente para por `X-WP-TotalPages` e
> avisa quando os números divergem; MIG-082 confere por id, nunca pelo total.
>
> ⚠️ **A armadilha do 302 é WAF, não WordPress.** O host roda RunCloud 8G e manda
> user-agent de robô para `/RUNCLOUD-8G-WAF-BLOCKED`. Seguir o redirect entrega
> HTML com status 200, e o erro só apareceria depois, num `JSON.parse` sem
> contexto — por isso o cliente usa `redirect: 'manual'`.
>
> `_fields` **omite** o campo em vez de devolvê-lo vazio: quem precisar de `link`
> (MIG-086) ou `featured_media` (MIG-082) tem que pedir explicitamente.

> **O que a Fase 4b mudou no aceite visual.** `/blog` e `/carreiras` **saíram**
> de `ROTAS_COM_GABARITO`. Não é regressão nem descuido: as duas listam conteúdo,
> e o conteúdo agora é real. O gabarito é uma captura do protótipo mostrando 6
> artigos fictícios e 6 vagas fictícias; a página nova mostra 207 e 7. Nenhuma
> captura do protótipo pode voltar a bater, e regravar o gabarito seria pior —
> apagaria a evidência de regressão do resto da página. As duas continuam
> cobertas por `smoke.spec.ts`. As outras 13 rotas seguem sob o gate.
>
> **A regra de MIG-081 que quase se perdeu de novo.**
> `editorConfigFactory.default({ config })` não devolve o editor do projeto,
> devolve o padrão do Lexical — sem a `EXPERIMENTAL_TableFeature` que o piloto
> mandou ligar. O conversor lê a config do **próprio campo** `posts.body`. O
> teste unitário pegou isso; a métrica de retenção de texto, não — tabela vira
> parágrafo solto com 100% do texto preservado.
>
> ⚠️ **Fixtures do protótipo agora exigem `SEED_FIXTURES=1`.** Os 6 posts e as 6
> vagas fictícias existiam para o gate visual; com `/blog` e `/carreiras` fora
> dele, o que sobrou foi dar ao e2e uma listagem não vazia. Num banco de verdade
> seriam doze itens inventados no ar, assinados pela ATRA — e "não subir isso no
> cutover" era uma linha de runbook. Agora é o código: só o CI liga a variável.
>
> **Duas armadilhas de localização que o smoke pegou.** Os 207 artigos são só em
> português, mas o **slug precisa existir nos dois idiomas**: `fallback: true`
> resolve a leitura, não a consulta — `where: { slug: { equals } }` bate na
> coluna do locale, que ficava nula, e `/en/blog/<slug>` dava 404 nos 207. E o
> post cujo slug tem `%c2%b2` falhava só na gravação do inglês, porque `%` é
> curinga na checagem de `unique`: o valor passa a casar com qualquer linha e o
> campo é recusado como duplicado. Os importadores normalizam o slug antes de
> gravar.
>
> **MIG-084 continua parada em P-27**, como combinado: os 207 entraram com
> `tags` vazio.

## Fase 4c — Conteúdo novo (D-17)

| ID | Título | Dep. | Critério de aceite | Est. |
|---|---|---|---|---|
| MIG-090 | Collection `segments` + template | 047 | Modelo conforme spec; admin utilizável | 3h | **done** — sem `hasPage` (ver a nota na collection); ligações em `collapsible` |
| MIG-091 | `/segmentos` + `/segmentos/[slug]` | 090 | 200 nas 11 rotas | 4h | **done** — índice + 8 detalhes, nos 2 idiomas |
| MIG-092 | Migrar as 10 páginas de segmento do WP | 091 | 10 publicadas com conteúdo real | 5h | **done** — são **8** verticais + 2 índices; 38 cards nos 2 idiomas |
| MIG-093 | Expandir `solutions` de 6 para 13 | 056 | 13 publicadas; mega-menu comporta | 5h | **done** — P-16 respondida em 21/08: publicar. **18 no ar** (as 6 do protótipo + as 12 do WP), 13 com página própria |
| MIG-094 | `/politicas-e-termos` + links do rodapé | 049 | Os 3 links legais deixam de apontar para `#` | 2h | **done** — os 3 apontam para a mesma página, como no WordPress. Destrava a Fase 5 (P-14) |
| MIG-095 | Imagens do protótipo atrás de `SEED_FIXTURES` (D-27) | 070 | Com a chave, os 35 pontos do gabarito; sem ela, marcador. Gate inalterado | 2h | **done** — 33 arquivos, lidos de `legacy/public/imagens/`; origem no campo `credit`. Inclui os 4 retratos de depoimento, que **não** revogam D-14 |

> **MIG-093 — como a task foi escrita, e o que P-16 respondeu.**
>
> "Expandir de 6 para 13" pressupõe que as 13 do WordPress contenham as 6 do
> protótipo. Medido: não contêm. As 6 no ar são consolidadas e assinadas pela
> ATRA — "Engenharia de Dados & Cloud", "Business Intelligence & Advanced
> Analytics", "Cultura de Dados". As 13 do WP são o catálogo anterior, mais fino
> e com vocabulário de fornecedor — "Master Data Management", "Data Discovery",
> "Customer 360", páginas que citam a Informatica no corpo. Uma não é
> subconjunto da outra: são dois jeitos de nomear a mesma oferta, e escolher
> entre eles é posicionamento (D-22).
>
> As 12 (IA fica de fora — o slug já é o da solução portada, a única com página
> e sob gate visual) entraram primeiro como **rascunho**, com o site intacto,
> justamente para que a resposta custasse um `_status` e não uma reimportação.
>
> ✅ **P-16 respondida em 21/08/2026: publicar.** O menu passou a listar **18
> ofertas**, 13 com página própria. Os 13 redirects viraram **1:1 sozinhos** —
> o gerador lê o banco, então responder uma pendência de conteúdo não exigiu
> editar redirect à mão. As 12 linhas curadas continuam no gerador como rede de
> segurança: se alguém despublicar uma, a URL cai no índice em vez de a geração
> reprovar.
>
> **`/segmentos` não está linkado em lugar nenhum**, e é de propósito.
> Acrescentar item ao mega-menu ou ao rodapé muda cromo que aparece nas 13
> rotas sob gate, e obrigaria a regravar os 13 gabaritos. `/solucoes` está na
> mesma situação desde a Fase 3 — o menu abre painel e o rodapé aponta para
> `#`. Ligar as duas é uma decisão de navegação, com regravação justificada, e
> não um efeito colateral desta task.
>
> ⚠️ **Um defeito de meses apareceu porque a 4c criou o primeiro rascunho.**
> A Local API do Payload roda com `overrideAccess: true`, então o `access.read`
> que esconde rascunho do público **não se aplica** às consultas de página. Seis
> consultas estavam sem `where: { _status }` — o mega-menu e as rotas de
> `/solucoes` e `/segmentos` — e nunca deram sintoma porque não havia rascunho
> no banco. No dia em que MIG-093 pôs 12 soluções nesse estado, o índice passou
> a listar 18 e o menu junto. O seed cria uma vertical em rascunho só para o
> smoke provar que não vaza.
>
> ⚠️ **E o gate mediu o build errado por uma corrida inteira.** Um servidor de
> uma execução anterior tinha ficado segurando a :3100; o `next start` novo saiu
> com `EADDRINUSE` e a suíte rodou os 240 testes contra o build velho, com
> falhas plausíveis e nenhum aviso. `scripts/gate.mjs` agora aborta quando a
> porta está ocupada — um gate que mede outra coisa é pior do que gate nenhum.
>
> **O `redirects.csv` fechou o critério da fase**: 261 linhas, e a geração
> **reprova** se alguma página do WordPress ficar sem destino — foi assim que
> `/sample-page/` e `/solucoes-atra/` apareceram, nenhuma das duas listada em
> `seo-e-redirects.md`.

### Ligação de `/segmentos` na navegação

`/segmentos` nasceu em MIG-091 sem link nenhum apontando para ela. Ligar exigiu
uma decisão que não é de engenharia, porque o gabarito da regressão visual **é o
protótipo**: acrescentar a categoria só no site novo faria as 13 rotas nunca
mais baterem, e regravar não resolveria — regravar captura o legado, que
continuaria com 7.

**Decidido (21/08/2026): menu nos dois apps.** "Segmentos" entra como 8ª
categoria, ao lado de Soluções — solução é *o que* a ATRA faz, segmento é *para
quem* — e no rodapé, na coluna institucional. O protótipo recebeu o mesmo item,
com destino `#`, como Soluções e Parceiros já fazem lá: ele não tem a página, e
link para rota inexistente seria pior que nenhum.

Os 13 gabaritos foram regravados. O que a regravação apagou de evidência é
justamente o cabeçalho e o rodapé, que é onde a mudança está.

⚠️ **O painel do menu lê a collection.** `segments` virou o terceiro tipo de
painel que não digita conteúdo no global, junto de `solutions` e `partners` —
digitar as 8 verticais ali recriaria a duplicação que o global existe para
evitar. O valor novo no `select` exigiu migração: `panel` é enum no Postgres, e
`ALTER TYPE ... ADD VALUE` não sai de graça.

⚠️ **`maxRows` do menu subiu de 7 para 8.** O teto não é burocracia: a fileira é
`hidden md:flex` e começa a apertar em 768px. Categoria nova custa largura de
todas as outras, e subir daqui pede olhar os três viewports.

### Ligação de `/solucoes`

Feita logo depois da de `/segmentos`, e saiu **de graça**: mudar `href` troca um
atributo, não a caixa desenhada. Os dois apps renderizam o mesmo `<a>` com as
mesmas classes com ou sem destino — o cabeçalho já fazia
`href={categoria.href ?? '#'}` e o rodapé já escolhia entre `<Link>` e `<a>` com
o mesmo markup. **Gate passou com os 13 gabaritos intactos**, então não houve
regravação e nenhuma evidência de regressão foi apagada.

A diferença para `/segmentos` é o que estava faltando: lá o item **não existia**
e precisou nascer nos dois lados; aqui ele existia e apontava para lugar nenhum.

⚠️ **Parceiros continua sem destino**, e é o estado certo: não há índice de
parceiros, nem no protótipo nem no site novo — só `/parceiros/[slug]`. A
categoria abre o painel, e é o painel que leva a cada parceiro. O smoke agora
afirma essa distinção, que some fácil: as três categorias abrem painel e por
muito tempo as três apontaram para `#`.

## Fase 5 — Formulários, SEO e analytics

| ID | Título | Dep. | Critério de aceite | Est. |
|---|---|---|---|---|
| MIG-100 | `form-submissions` + Server Action de contato | 053 | Envio grava no banco e dispara e-mail | 4h | **done** — home e `/contato`; sem chave de e-mail o lead grava e `notified` fica falso |
| MIG-101 | Anti-spam (honeypot, time trap, rate limit) | 100 | Bot simulado é barrado; humano passa | 2h | **done** — três barreiras, nenhuma delas CAPTCHA |
| MIG-102 | Formulário de candidatura + upload de CV | 100, 051 | PDF em storage privado, URL assinada | 3h | **construída no escuro** — action, validação de PDF (assinatura real, 5 MB), CV em `private-files` (bucket privado, RH lê pelo admin autenticado — dispensa URL assinada). Liga com `ENABLE_JOB_APPLICATIONS=1` quando **P-17** responder |
| MIG-103 | Newsletter com double opt-in | 100 | Confirmação por e-mail antes de ativar | 3h | **done** — token + `/api/newsletter/confirmar` + página de aterrissagem; sem `confirmedAt` não é inscrito. Sem chave do Resend o cadastro fica pendente, visível no admin |
| MIG-104 | Download gated de material | 100, 045 | Formulário libera arquivo por URL assinada | 2.5h | **construída no escuro** — URL pré-assinada de 15 min direto do bucket privado (provada localmente: 200 assinada, 403 sem). **Liga sozinha, material a material**: subir o PDF em `resources.file` é o interruptor (P-07) |
| MIG-105 | `generateMetadata` em todas as rotas | Fase 3 | Toda rota com title e description próprios | 3h | **done** — e o grupo `seo` passou a ser lido; ganhou canônica e `hreflang` |
| MIG-106 | `sitemap.ts` + `robots.ts` | 105 | Só publicados; sem locale não traduzido | 2h | **done** — 270 URLs, só 16 em inglês |
| MIG-107 | JSON-LD | 105 | Rich Results Test valida | 2.5h | **done** — `Organization` no layout, `Article` no artigo, `Service` na solução |
| MIG-108 | `redirects.csv` no `next.config.ts` + teste de CI | 086 | Toda linha: 301 → destino 200 | 3h | **done** — e o teste achou 2 defeitos que derrubariam o site |
| MIG-109 | GA4/GTM + consentimento de cookies | 105 | Nenhum script não essencial antes do aceite | 3h |
| MIG-110 | Budget guard da ATRA AI | 061 | Teto atingido degrada com mensagem, não com 500 | 2h | **done** — teto diário **no banco**; e o global da IA não era localizado |
| MIG-111 | Ícone do site (favicon) | 105 | Aba, atalho de iOS e `/favicon.ico` com a marca da ATRA | 0.5h | **done** — tirado de `atra.com.br`; o protótipo não tem nenhum |

> **O que MIG-105 encontrou: o grupo `seo` nunca tinha sido lido.**
> `fields/seo.ts` põe "Título para buscadores", "Descrição" e "Imagem de
> compartilhamento" em toda collection com URL pública desde a Fase 1, e nenhuma
> rota consultava nada disso — o editor preenchia e o campo não saía do banco. O
> tipo de apresentação `Seo` também estava declarado, sem consumidor. Os
> fallbacks de `seo-e-redirects.md` estavam escritos à mão em quatro rotas, com
> três resultados diferentes (`title`, `ATRA / ${title}`, nada).
>
> Junto vieram **canônica absoluta e `hreflang`**, que não existiam em rota
> nenhuma. Não é enfeite: D-07 dá slug traduzido a cada rota, então `/sobre` e
> `/en/about` são a mesma página em dois idiomas — sem declarar o par, o Google
> escolhe uma e trata a outra como duplicata.
>
> ⚠️ **`undefined` e `null` significam coisas diferentes em `corpo`.** Escrever
> `corpo ?? true` misturava as duas: rota sem campo de corpo não passa `corpo`,
> artigo sem texto passa `null` — e o artigo vazio caía em `true` e era
> indexado, o oposto de D-08. Achado por teste unitário, antes de ir ao ar.

> **MIG-106 mediu que o site em inglês é só navegação.** Os 4 cases têm, no
> locale `en`, o **mesmo texto português**; os 207 artigos têm linha em `en` só
> porque o slug precisa existir nos dois idiomas (senão `/en/blog/<slug>` dá
> 404). Então "existe conteúdo em inglês" é falso para praticamente tudo, e o
> sitemap aplica a regra: URL inglesa só entra quando o texto **existe e difere**
> do português. Resultado: 270 URLs, **16 em inglês** — os 15 índices, cuja
> interface é traduzida de verdade, e um documento. É P-08 medido.

> ⚠️ **MIG-108 achou dois defeitos que derrubariam o site, e nenhum dos dois
> aparecia na conferência anterior.**
>
> O primeiro: a linha `/,,410`. O WordPress devolve `/` como `link` da página
> marcada como **página inicial** (`sample-page`), e o gerador transformou isso
> num "410 Gone" na raiz — o site inteiro fora do ar. A conferência de cobertura
> não pegou porque ela verifica que toda página **tem** destino, não que o
> destino faz sentido.
>
> O segundo: sete linhas institucionais (`/sobre/` → `/sobre`, `/blog/`,
> `/contato/`, `/carreiras/`, `/solucoes/`, `/segmentos/`,
> `/politicas-e-termos/`). Com `trailingSlash: false` — o padrão do Next — a
> barra final é normalizada antes, a regra vira `/sobre` → `/sobre` e o
> navegador desiste com ERR_TOO_MANY_REDIRECTS. Medido: 50 saltos até o curl
> parar. As linhas continuam no CSV porque **é especificação** — "esta URL do WP
> tem destino" é informação mesmo quando o destino é ela própria; o que não pode
> é virar regra de servidor.
>
> ⚠️ **410 não sai do `redirects()` do Next**, que só emite 307/308. As 3 URLs
> que saem de propósito são servidas pelo `proxy.ts`. 410 e não 404 porque a
> diferença importa para o robô: 404 é "não achei agora" e ele volta; 410 é
> "não existe mais" e ele tira do índice.

> ⚠️ **MIG-110 achou que o global da IA nunca foi localizado.** Nenhum campo de
> `atra-ai` tinha `localized: true`, e o seed grava `pt` e depois `en` — na mesma
> coluna. O inglês vencia desde MIG-061, então **todo visitante brasileiro que
> batia no limite lia a mensagem em inglês**. `systemPrompt` e
> `unavailableMessage` passaram a ser localizados; o prompt também, porque é ele
> que manda o modelo responder num idioma.
>
> A rota `/api/chat` vive **fora** do segmento `[locale]` — o proxy nem passa por
> ela — então não há `getLocale()` lá. O idioma vai no corpo do POST, mandado
> pela ilha de conversa, que é quem sabe em qual das duas páginas o visitante
> está.
>
> **O teto de orçamento é outro limite, não o mesmo.** `requestsPerHour` protege
> contra um visitante em laço; `dailyRequestCap` protege o dinheiro — 500 pessoas
> educadas com 1 pergunta cada custam o mesmo que uma abusando 500 vezes. E ele
> conta **no banco**, não em memória como o de IP: contador que zera a cada
> deploy não protege orçamento, bastaria reiniciar. O valor de partida é
> provisório até P-04.

> **MIG-100 — a ordem é a garantia, não o e-mail.** A Server Action faz
> anti-spam → **grava** → avisa. Gravar antes de avisar é o que impede um
> problema no provedor de e-mail de perder o lead, e é o inverso do que parece
> natural. Sem `RESEND_API_KEY` o envio devolve `false`, o lead está no banco e
> `notified` fica falso — a falta aparece no admin em vez de virar silêncio.
>
> ⚠️ **Ligar o formulário somou 24px à altura da home**, e a causa não era o
> formulário: o Tailwind 4 trocou `space-y-*` de `margin-top` em `> * + *` para
> `margin-bottom` em `> :not(:last-child)`. Com os campos escondidos no fim, o
> último campo de verdade deixa de ser o último filho e ganha um espaço que não
> existia. Eles vêm antes. E a primeira tentativa envolvia os campos num
> `<fieldset disabled>` para o envio: com `display: contents` ele parece
> inofensivo, mas o seletor de irmãos anda pelo DOM e não pelo layout — o
> fieldset vira o único filho e o `space-y-6` some inteiro.
>
> **MIG-101 não usa CAPTCHA**, de propósito: ele cobra do visitante honesto o
> preço de um problema que não é dele, e este formulário recebe dezenas de
> envios por mês. As três barreiras — campo isca, armadilha de tempo e limite
> por IP — custam zero para quem preenche à mão. Robô barrado recebe **sucesso**:
> dizer "você foi barrado" entrega o critério de graça.
>
> ⚠️ O carimbo de tempo é gravado no DOM por `ref` **depois da montagem**.
> `Date.now()` no render é função impura e o lint recusa; `setState` em efeito
> dispara render em cascata e o lint também recusa. Sem JavaScript o carimbo
> fica em `0`, que `conferir` trata como ausente e deixa passar — recusar envio
> honesto é pior do que aceitar um automático.

## Fase 6 — Endurecimento

| ID | Título | Dep. | Critério de aceite | Est. |
|---|---|---|---|---|
| MIG-120 | Otimização de imagem e LCP | Fase 3 | Lighthouse ≥ 90 nas 5 rotas mais vistas | 4h | **parcial** — medido no staging (25/08): 73→89 após o cache de mídia (era ttl=0; /sobre saiu de 77 para 89 e o LCP de 5,3s para 3,4s). O que resta não é código: TTFB de ~750ms dominado pelos 156ms de RTT até a VPS (CDN é P-21, pós-cutover), e dois artefatos que somem no domínio real — o `noindex` deliberado (SEO 54–61) e um 307 interno do Chromium em `*.hstgr.cloud` (HSTS pré-carregado). Re-medir no domínio real antes de mexer em mais alguma coisa |
| MIG-121 | axe no CI, reportando (D-13) | 010 | Relatório publicado por PR | 2h | **done** — `acessibilidade.spec.ts` no gate, WCAG A/AA, nunca reprova; `axe.json` sobe como artefato. 1ª medição no staging: **76 ocorrências, todas `color-contrast`** — o contraste do protótipo, portado fiel (D-15) |
| MIG-122 | Sentry | 010 | Erro de teste chega no painel | 2h |
| MIG-123 | Backup `pg_dump` + **teste de restore** | Fase 4 | Restore em base limpa, verificado | 3h | **done** — timer diário na VPS (banco -Fc, mídia, segredos cifrados); restore conferido por contagem em base limpa. Cópia externa espera bucket (R2) |
| MIG-124 | Uptime e alerta | 122 | Alerta dispara em queda simulada | 1.5h |
| MIG-125 | `/design-system` com `noIndex` | 025 | Reconstruído dos tokens reais | 4h | **done** — as cores são **parseadas do `globals.css`** na pré-renderização (sem segunda cópia para envelhecer); componentes do DS em bancada, interativos em ilha cliente; `noindex` + fora do sitemap. Fecha o 404 que o rodapé linkava em todas as páginas |
| MIG-126 | **Guia do editor** (D-20) | Fase 4 | Cobre entrar, criar case, imagem+alt, preview, publicar, corrigir métrica | 4h | **done** — `docs/05-operacao/guia-do-editor.md`, escrito para quem não é técnico; os 6 passos do aceite viram seções. A validação de verdade é MIG-127: alguém do marketing executando sem ajuda |
| MIG-127 | **Teste do objetivo com o marketing** (D-20) | 126, 032 | Alguém do marketing executa os 6 passos sem ajuda; o que travar vira correção | 2h |
| MIG-128 | Sessão de handoff gravada | 127 | Marketing + RH treinados; gravação arquivada | 2h |

### Revisão crítica de 25/08 — segurança, DRY e a lacuna de revalidação

Achados de uma varredura com foco em segurança, reuso e boas práticas, feita
enquanto as tasks bloqueadas esperam decisão. O que a varredura **confirmou
limpo** também vale registro: as 26 consultas com rascunho filtram `_status`,
o JSON-LD escapa `</script>`, nenhum `components/ui` importa `payload-types`,
o `next/image` só otimiza origem própria e o lockout de login está no default.

| ID | Título | Dep. | Critério de aceite | Est. |
|---|---|---|---|---|
| MIG-140 | **IP confiável** nos limites do chat e do formulário | — | `X-Forwarded-For` forjado não contorna limite; helper `ipDe` num lugar só | 1h | **done** — `lib/ip.ts` + Caddy sobrescreve XFF; teste cobre o cenário do contorno |
| MIG-141 | **Tetos de entrada/saída do chat** | — | Histórico, tamanho por mensagem, `role` e `maxOutputTokens` limitados; requisição gigante recusa em 400 | 1h | **done** — `lib/chat.ts`; histórico corta em silêncio (a ilha manda a conversa inteira), mensagem gigante recusa |
| MIG-142 | Teto de tamanho nos campos do formulário | — | Nenhum campo entra no banco sem corte | 0.5h | **done** — 200 por campo, 5000 na mensagem, no helper único |
| MIG-143 | **Revalidação ao publicar** — o CMS passa a atualizar o site | — | Publicar no admin muda a página pública sem deploy; `REVALIDATE_SECRET` deixa de ser segredo morto; guia do editor corrigido | 4h | **done** — hook em processo (`hooks/revalidar.ts`), aplicado central em `payload.config` com 3 exclusões que são correção (`ai-usage` grava a cada chat); o segredo saiu em vez de ganhar endpoint |
| MIG-144 | Mídia sem SVG (`mimeTypes` raster+PDF) | — | Upload de SVG recusado; acervo atual inalterado | 0.5h | **done** — acervo conferido: 100% WebP |
| MIG-145 | Cabeçalhos de segurança no app | — | `nosniff`, `frame-ancestors`, `Referrer-Policy` em toda rota, via `headers()` | 1h | **done** — sem CSP de propósito (nonce por requisição não existe em página estática); é melhoria própria |
| MIG-146 | DRY dos seeds (`midia.ts` + slug compartilhados) | — | 10 cópias de upsert viram 1; `paraSlug` de 5 para 1; seed roda 2× sem mudança de contagem | 2h | **done** — `midia.ts` preserva a **regravação** de sobre.ts/cases.ts como opção explícita; idempotência verificada: 2 corridas, contagens idênticas em 8 collections |
| MIG-147 | `/design-system` via `lib/routes` no rodapé | — | Nenhum href literal fora de `routes.ts` | 0.25h | **done** |

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

| Fase | Tasks | Feitas | Horas |
|---|---|---|---|
| 1 Fundação | 14 | 14 | ~23h |
| 2 Fatia vertical | 18 | 18 | ~51,5h |
| 3 Fábrica de rotas | 26 | 26 | ~94h |
| 4a Seed | 3 | 3 | ~7,5h |
| 4b Migração WP | 6 | 6 | ~15h |
| 4c Conteúdo novo | 6 | 6 | ~21h |
| 5 Formulários/SEO | 12 | 8 | ~30,5h |
| 6 Endurecimento | 17 | 12 | ~34,75h |
| 7–8 Cutover/limpeza | 7 | 0 | ~10h |
| **Total** | **109** | **93 (85%)** | **~287h** |

A Fase 6 cresceu com a revisão crítica de 25/08 (MIG-140–147) e com o que a VPS
exigiu fora do plano: a esteira de deploy com rollback e o backup com restore
provado nasceram ali, sem número de task próprio — estão nos commits
`3d869ce1` e `50b27052`.

⚠️ **A tabela conta as tasks ativas.** Duas foram canceladas por falta de fonte
de dado, não por corte de escopo — MIG-008 (a fonte já carregava, D-16) e
MIG-084 (o WordPress não tem taxonomia para mapear, P-27). São 103 linhas de
backlog no total.

⚠️ Estas horas cobrem **engenharia**. Não cobrem: curadoria editorial de
`segments` e `solutions` (Fase 4c), redação dos 9 materiais sem corpo (P-07),
revisão da tradução EN (P-08) nem o dimensionamento de traduzir ~50 itens de
conteúdo para inglês — todos fora da engenharia e no caminho crítico do cutover.
