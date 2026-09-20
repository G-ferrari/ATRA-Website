# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Editor de marketing (usuário primário do CMS, papel `editor`).** Cria, edita e publica todo o conteúdo em português, com Live Preview, sem etapa de aprovação e **sem depender de desenvolvedor**. É o usuário cujo sucesso *define* a migração (`docs/README.md:16`, verificado em MIG-127).
- **Decisor B2B (visitante primário do site).** Gerente/diretor de dados ou TI em setor regulado (banco, seguradora, saúde, varejo) avaliando uma consultoria de Dados/IA/Cloud. Chega majoritariamente por busca orgânica — por isso SSR/metadata importam.
- **Secundários (confirmados):** `admin` do CMS (navegação, rodapé, prompt da IA, usuários, dado pessoal de terceiros — D-18); RH (publica as 7 vagas como páginas, sem ATS); candidatos a vaga; leitores de blog/materiais/glossário; parceiros de tecnologia.

## Product Purpose

Site institucional da **ATRA**, consultoria de Dados & IA. A migração leva o site de um **WordPress público** (`atra.com.br`, ~259 URLs) somado a um **protótipo React sem SSR** (`legacy/`) para **Next.js 16 + Payload CMS 3 + PostgreSQL**, com dois objetivos declarados (`docs/README.md:13-14`): o marketing publica cases, blog e materiais **sem depender de dev**, e o domínio ganha o **SSR/SEO que hoje não existe**. Sucesso = uma pessoa de marketing cria+publica um case e corrige um número institucional, sem ajuda; e **paridade de SEO no cutover** (sem pico de 404, 301s intactos).

## Positioning

Não é um produto de mercado — é um site institucional com uma **tese metodológica** que um vizinho não copiaria de graça:

- **Porte fiel do legado como contrato** — regressão visual pixel a pixel (0,1%, 3 viewports, 13 rotas sob gate); o gabarito é `legacy/`.
- **Separação estrita migração × conteúdo** (D-22) — quem migra não consolida vocabulário, não reescreve texto, não escolhe categorias; isso é do marketing, via CMS.
- **Infra reproduzível no git** (D-28) — Compose + Caddy, deploy por `git push` com healthcheck e rollback provado.
- **Publicar atualiza o site sem deploy** (MIG-143).

A ATRA em si: consultoria de Dados & IA e parceira do Google Cloud; portfólio em **Inovação & IA**, **Dados/BI/Advanced Analytics** e **Governança & Cultura**; atende verticais reguladas.

## Operating Context

- **Dois públicos operando:** editores no admin do Payload (pt) e visitantes no site público (PT na raiz, EN em `/en` com slugs traduzidos via `proxy.ts`).
- **Gabarito:** o protótipo `legacy/` é a fonte visual de verdade. **Deploy = `git push origin migracao`** → CI (lint/types/`pnpm gate`) → VPS rebuilda/migra/troca com healthcheck e rollback.
- **Estado:** no ar em **homologação** numa VPS (atrás de senha + `noindex`), com todo o conteúdo real. O caminho crítico até o cutover é **decisão e acesso** (Cloudflare P-23, números institucionais P-01, revisão EN P-08), não engenharia.
- **Verificação visual:** `pnpm gate` (Playwright na imagem oficial, macOS == CI). ⚠️ MX do Google Workspace **intocáveis** no cutover.

## Capabilities and Constraints

**Capacidades confirmadas:** 19 collections + 5 globals no Payload; páginas por **blocos** (26); i18n PT/EN com slugs traduzidos; Live Preview + drafts + versionamento; formulários por Server Action (contato/newsletter/banco-de-talentos/candidatura/download) → Postgres + Resend + **RD Station CRM** com UTM; chat **ATRA AI** (Gemini) com rate-limit por IP + teto de custo; 207 posts do WP migrados; 261 redirects 301; SEO (metadata/sitemap/JSON-LD); revalidação em processo ao publicar.

**Constraints técnicas duráveis (do repositório — preservar):**
- Schema muda só por **migração versionada** (D-21, `push:false`).
- **Nenhum segredo com prefixo `NEXT_PUBLIC_`** (o CI reprova).
- Upload de mídia **sem SVG** (MIG-144); tudo convertido para WebP.
- **LGPD:** `FormSubmissions` sem IP/UA; bucket privado para CV/gated; política de privacidade é pré-requisito dos formulários (P-14).
- IP confiável via `lib/ip` (nunca `x-forwarded-for` primeiro).
- **Toda mudança de UI regrava o gabarito visual** (`pnpm gate --baseline`, com justificativa no PR) — consequência mecânica, independente da postura de design.

**Postura de design (decisão do dono, 2026-09-02): melhorias de UI são permitidas agora.** O dono **relaxou** a regra D-15 ("melhoria não entra junto com migração") para o trabalho do Impeccable. Isso **sobrepõe** a convenção de fidelidade documentada no repositório — os docs (`docs/00-contexto/decisoes.md`, D-15) ainda descrevem a política anterior. Consequência prática: mudanças de UI guiadas pelo Impeccable são autorizadas, e cada uma **regrava o gabarito** e leva justificativa no PR.

**Fatos de produto explicitamente em aberto (NÃO inventar):** números institucionais (P-01 — profissionais 150+/140+, clientes 20+/30+, GPTW 5x/4x); telefone oficial (P-09); existência do case "RD Saúde" (P-11); nome real do parceiro cadastrado como "Partner" (P-10); se o conteúdo EN é tradução aprovada ou de máquina (P-08); teto de custo mensal da IA (P-04); corpo dos 9 materiais editoriais (P-07); sinal `ai-train` do robots (P-12).

## Brand Commitments

- **Nome:** ATRA — consultoria de Dados & IA, parceira do Google Cloud.
- **Fonte obrigatória:** **Mona Sans** (SIL OFL 1.1), servida por `next/font/google` — tipografia oficial da marca (D-16), com métrica travada na build do legado. Não trocar a build nem pedir eixos (`wdth`).
- **Logo:** logo da ATRA servido pela mídia do CMS (era hotlink do WP).
- **Redes:** linkedin.com/company/atra-tecnologia · instagram.com/atratecnologia · youtube.com/@atratecnologia.
- **Voz/idioma:** documentação e microcopy do site em **PT-BR**; código, identificadores e commits em **inglês**. Decisão de conteúdo é do marketing (D-22) — não reescrever texto factual nem adicionar claims sem perguntar.

## Evidence on Hand

- **Conteúdo real no CMS:** 4 cases (Banco ABC, Banco Carrefour…), 207 posts de blog (2021–2026), 287 imagens, 7 vagas, 8 segmentos, 18 soluções, depoimentos, glossário, página legal.
- **Clientes citados:** Banco ABC, Banco Carrefour, RD Saúde, ANBIMA, Afya, Oncoclínicas, Icatu, Porto.
- **Parceiros:** Google Cloud, Databricks, Denodo, BigID, Azure, Atlan, IBM, Informatica.
- **Prova social:** selo GPTW (5x/4x sob P-01), selo FEEx, +15 anos, +150 profissionais (números sob P-01).
- **Fontes de verdade no repo:** `legacy/` (gabarito visual), `docs/` (especificação completa), `.ksdd/specs/` (brainstorm/SPEC/architecture/DESIGN gerados nesta sessão).
- **Ausências que o trabalho futuro NÃO pode fabricar:** corpo dos 9 materiais editoriais (só há capa); números institucionais reais (em disputa); retratos dos depoimentos (foto de banco, hoje com marcador/monograma por D-14); algumas capas de material (Unsplash com marcador).

## Product Principles

1. **Conteúdo é do marketing, tecnologia é da migração** — nunca consolidar vocabulário, reescrever copy ou escolher categorias por eles (D-22).
2. **Nada vai ao ar sem corpo** — thin content prejudica o domínio inteiro (D-08).
3. **Publicar não pode exigir desenvolvedor** — a migração falha se exigir (critério de sucesso do README).
4. **Toda mudança visual regrava o gabarito e é justificada no PR** — o gate é a rede de segurança, mesmo com melhorias agora permitidas.
5. **Paridade de SEO é inegociável no cutover** — preservar os 261 redirects; não tocar no MX.

## Accessibility & Inclusion

Política atual (**D-13**, confirmada pelo dono em 2026-09-02): axe roda no CI **reportando, sem reprovar PR**; a dívida de a11y (anel de foco removido, contraste baixo, mega-menu de topo só por hover, `alt` genérico) é rastreada e **deferida para uma fase de a11y própria, pós-cutover**. **Sem meta formal de WCAG como gate de release.** Contraste é medido nos dois temas (`e2e/contraste.spec.ts`).
