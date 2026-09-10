<!--
Salvar em: .ksdd/specs/architecture.md (default v0.6.0+)
-->

# Architecture — ATRA (site institucional Next.js + Payload)

**Versão:** 1.0
**Última atualização:** 28/08/2026
**Status:** Aprovado
**Origem:** Reverse-engineered via `/ksdd:setup` em 28/08/2026 (stack lida de `web/package.json`/`pnpm-lock.yaml`, `Dockerfile`, `.github/workflows/ci.yml`, `web/src/payload.config.ts` e `docs/04-infra/`).
**Aviso:** Artefato gerado automaticamente. A stack e as versões são detectadas do código e são confiáveis; os ADRs carregam nível de confiança. Revise antes de usar como contrato.

---

## 1. Visão Geral da Arquitetura

Monólito **Next.js + Payload no mesmo processo** (um único servidor Node serve o site público, o admin do CMS e as APIs), com Postgres e S3 como dependências, atrás do Caddy, numa VPS.

```
                          ┌─────────────────────── VPS Hostinger KVM2 (2 vCPU / 8 GB) ───────────────────────┐
[Visitante] ─┐            │                                                                                    │
             ├─► [Caddy 2] ─► [ Next.js 16 + Payload 3  (Node 22, output: standalone) ]                       │
[Editor]  ───┘   TLS auto  │      │  app/(frontend) — site público SSR/SSG (PT raiz, EN /en, proxy.ts)         │
   (Basic Auth  zstd/gzip  │      │  app/(payload)  — admin do CMS (Live Preview, drafts, i18n pt)            │
    no staging) headers    │      │  app/api        — /api/chat, /api/health, Server Actions, REST+GraphQL     │
                           │      ▼                                                                            │
                           │  [ PostgreSQL 17 ] ◄── Drizzle ORM (adapter @payloadcms/db-postgres, push:false)  │
                           │  [ S3: MinIO ]  atra-media (público) + atra-privado (URL assinada: CV, gated)     │
                           └──────────────────────────────────────────────────────────────────────────────────┘
                                        ▲                         │                         │
   Deploy: git push origin migracao ────┘        [Google Gemini]──┘   [Resend e-mail]───────┘   [RD Station CRM]
   → GitHub Actions (lint/types/gate) → rsync+ssh → deploy.sh (migrate, build, healthcheck, rollback)
```

**Traços definidores:**
- **Build lê o banco real.** `generateStaticParams` consulta collections, então as páginas de conteúdo são pré-renderizadas contra o Postgres populado — o build roda **na VPS pós-migração**, não gera imagem de produção no CI.
- **Publicar no CMS atualiza o site sem deploy** (MIG-143): hook chama `revalidatePath` **em processo** (sem endpoint HTTP nem segredo).
- **i18n desde a fundação:** PT na raiz, EN sob `/en` com slugs traduzidos; `proxy.ts` (o antigo `middleware.ts`, renomeado no Next 16) reescreve/redireciona/canoniza e responde 410 para URLs aposentadas.

---

## 2. Stack Tecnológica

### 2.1 Frontend
- **Framework:** Next.js **16.3.1** (App Router, Turbopack por padrão, `output: 'standalone'`) — `web/package.json:41`, `web/next.config.ts`. ⚠️ Versão com breaking changes vs. treino comum: `middleware.ts`→`proxy.ts`, Request APIs assíncronas, `next/root-params` (ver `web/AGENTS.md`).
- **Linguagem:** TypeScript 5 (5.9.3 no lock), `strict: true`, `moduleResolution: bundler`, target ES2022.
- **UI/render:** React **19.2.8** / react-dom **19.2.8** (pin exato). Server Components resolvem dados e passam props para ilhas cliente.
- **Styling:** Tailwind CSS **4** via `@tailwindcss/postcss`; `clsx` + `tailwind-merge` para compor classes. Tokens em `@theme` (ver [DESIGN.md](DESIGN.md)).
- **Animação/ícones:** `motion` 12.34.3; `lucide-react` + `@iconify/react`.
- **Build/dev:** `next build`/`next dev` (Turbopack); workers de build limitados a `cpus/2` e `staticPageGenerationTimeout` estendido (`next.config.ts`) — nove instâncias do Payload disputavam a VPS com o Postgres.

### 2.2 Backend
- **Runtime:** Node.js **22** (Docker `node:22-bookworm-slim`, CI `NODE_VERSION: 22`); mínimo declarado `>=20.9.0`.
- **CMS/framework:** Payload CMS **3.88.0** embarcado no Next (`payload`, `@payloadcms/next`, `@payloadcms/richtext-lexical`, `@payloadcms/translations`, todos 3.88.0).
- **Auth:** autenticação nativa do Payload sobre a collection `Users` (`admin.user: Users.slug`). Staging protegido por **Basic Auth no Caddy** + `noindex`.
- **API style:** REST + GraphQL do Payload (`graphql` 16.14.2), **Server Actions** do Next para formulários, rotas de API (`/api/chat`, `/api/health`), proxy de borda em `proxy.ts`.

### 2.3 Dados
- **Banco principal:** PostgreSQL **17** (`postgres:17-alpine`).
- **ORM/adapter:** `@payloadcms/db-postgres` 3.88.0 sobre **Drizzle ORM 0.45.2** (drizzle-kit 0.31.7, driver `pg` 8.20.0). **`push: false`** — schema muda só por migração versionada (D-21); há **46 arquivos de migração** em `web/src/migrations/` + `index.ts` como manifesto.
- **Cache:** revalidação de páginas estáticas por **hook em processo** (`revalidatePath`, MIG-143); `Cache-Control immutable` de 1 ano para `/api/media/file` e `next/image`.
- **Search:** **nenhum motor externo** (sem Elastic/Algolia/Meilisearch) — busca via Postgres.
- **Storage:** **S3** via `@payloadcms/storage-s3` 3.88.0, **dois buckets** — `atra-media` (download anônimo) e `atra-privado` (CV/gated, só URL assinada, via `@aws-sdk/s3-request-presigner`). `forcePathStyle: true` para MinIO.

### 2.4 Infraestrutura
- **Hosting:** VPS **Hostinger KVM2** (`srv1927832.hstgr.cloud`, 2 vCPU / 8 GB); build roda na própria VPS contra o banco real.
- **Containerização:** Docker multi-stage (`base/deps/build/prod-deps/migrator/runner`); dev em `docker-compose.yml`, prod/staging em `docker-compose.prod.yml`.
- **Proxy/CDN:** **Caddy 2** (TLS automático Let's Encrypt, zstd/gzip, headers de segurança, Basic Auth+noindex no staging). Cloudflare no DNS, proxy "nuvem laranja" **desligado** (P-21).
- **CI/CD:** **GitHub Actions** (`.github/workflows/ci.yml`) — jobs `verify` (lint, typecheck, `generate:types`/`importmap` check, migrate, vitest, build), `e2e` (`pnpm gate`: smoke + regressão visual), `deploy`. **Deploy = `git push origin migracao`** → rsync+SSH → `infra/deploy/deploy.sh` (migra, builda, troca com healthcheck, rollback por tag de SHA).
- **Observabilidade:** backup diário com restore verificado por contagem (systemd timer). **Sentry, uptime e cópia externa de backup pendentes** (esperam conta/bucket — Fase 6).

---

## 3. Modelo de Dados (Schemas)

Schema gerado pelo Payload/Drizzle a partir das definições de collection (`web/src/collections/`) e materializado em Postgres via as 46 migrações. São **19 collections + 5 globals**. Convenções transversais: campos de texto `localized: true` (PT/EN); collections de conteúdo com `versions.drafts: true`; `access.read` que esconde rascunho do público (exceto as `isPublic`); slug por idioma nas rotas públicas.

### 3.1 Conteúdo com página própria (drafts + slug localizado)
- **Cases** — `title`, `client` (não-loc), `summary`, `heroSubtitle` (cai no summary), `heroImage`→media, `impact`, `challenges[]` (**array localizado**), `solution` (richText), `results[]`, `slug`, `featured`, `publishedAt`; relações `topics` (min 1), `technologies[]`, `partners`, `testimonial`, `clientLogo`.
- **Posts** (blog, 207 do WP) — `title`, `slug`, `description`, `coverImage`, `body` (richText), `tags[]` (texto solto, não relação — P-27), `publishedAt`, `seo`.
- **Solutions** — `title`, `slug`, `category` (3 do mega-menu), `icon`, `shortDescription`, `hasPage` (5 das 6 do legado sem página), `layout` (blocks se hasPage), `order`, `seo`.
- **Segments** — `name`, `slug`, `icon`, `shortDescription`, `layout` (blocks), `relatedSolutions/relatedCases/clients`, `order`, `seo`.
- **Resources** (relatórios + ebooks) — `kind` (report|ebook), `title`, `slug`, `description`, `file`→private-files (download gated), `coverImage`, `tags[]`, `pages` (só ebook), `body`, `publishedAt`, `seo`.
- **Webinars** — `title`, `slug`, `description`, `coverImage`, `dateLabel`, `startsAt` (opcional), `duration`, `videoUrl` (embed YouTube/Vimeo, D-11), `tags[]`, `order`, `seo`.
- **Jobs** (7 do WP) — `title`, `area` (opcional, P-28), `locationType` (remote/hybrid/onsite), `location`, `summary`, `body`, `publishedAt`, `seo`.
- **Partners** — `name`, `slug`, `logo`, `logoScale`, `description`, `tier`, `featured`, `hasPage`, `layout`, `order`, `seo`.
- **Pages** — páginas por blocos (home, /sobre, /carreiras, /contato): `title`, `slug`, `layout` (blocks, min 1), `seo`.

### 3.2 Referência / apoio (isPublic, sem página própria)
- **Media** — `alt`, `caption`, `credit`; upload com mimeTypes enumerados (**sem SVG**, MIG-144), converte tudo para WebP, `imageSizes` thumbnail/card/hero.
- **Topics** — taxonomia controlada: `name`, `slug`, `description`, `showInFilter`, `filterOrder`.
- **Testimonials** — `quote`, `company` (não-loc), `authorName` (opcional→monograma D-14), `authorRole`, `photo` (opcional), `featured`; `label` montado por hook.
- **Clients** — `name`, `logo`, `enlarge`, `order` (esteira da home).
- **GlossaryTerms** — `term`, `slug`, `definition`, `category` (texto, não relação).
- **SpecialistRoles** — `role`, `code`, `level`, `icon`, `gradient`, `tags`, `order` (perfis de cargo, não pessoas).

### 3.3 Sistema / dados sensíveis (acesso restrito)
- **Users** — `name`, `role` (editor|admin); `role` com `access.update` field-level para o editor não se auto-promover (D-18).
- **FormSubmissions** — **dado pessoal LGPD**: `create: () => false` (só Server Action grava), `delete: isAdmin`. `kind` (contact/newsletter/talent-pool/job-application/material-download), `status`, `email`, `confirmationToken`, `confirmedAt`, relações `job`/`cv`/`resource`, `name/phone/company/message`, `source`, `utm` (5 params), `notified`. **Sem IP/user-agent gravado.**
- **PrivateFiles** — CVs e PDFs gated; **bucket S3 privado próprio**, sem leitura anônima.
- **AiUsage** — consumo diário da IA no banco (protege orçamento): `day` (unique), `requests`; `create/update: () => false` (só a rota grava).

### 3.4 Globals
- **Navigation** (isPublic) — `categories[]` (maxRows 8): `label`, `href`, `panel` (solutions/partners/segments das collections | links | split), `links[]`, `intro`, `highlights[]`, `card`.
- **Footer** — `about`, `columns[]` (maxRows 4; links|contact), `copyright`.
- **Contact** — **não localizado** de propósito: `phone`+`phoneWithArea` (dois formatos, D-15), `whatsapp`, `email`, `address`, `social`.
- **SiteSettings** — `logo`, `metrics[]` (maxRows 6, `pending` marca número em disputa P-01), `seals[]`, `foundedYear` (field-level admin).
- **AtraAi** — `enabled`, `systemPrompt` (**localizado**, saiu do código, D-12), `requestsPerHour` (default 20) + teto global diário.

---

## 4. APIs e Endpoints

**Rotas de API (`route.ts`):**
```
POST  /api/chat                     ATRA AI (Gemini). force-dynamic. Rate-limit por IP (memória) + teto diário (AiUsage). Degradação graciosa (nunca 500 sem chave).
GET   /api/health                   Healthcheck do deploy.
GET   /api/newsletter/confirmar     Confirma dupla opt-in (token).
GET   /api/preview                  Draft mode do Live Preview.
*     /api/[...slug] · /api/graphql REST + GraphQL do Payload (admin/autenticado).
```

**Server Actions (`web/src/actions/`)** — contrato comum **anti-spam → grava (Postgres) → avisa (e-mail) → sincroniza (CRM)**; o aviso/CRM nunca derruba a gravação (lead perdido não volta):
- `enviarFormulario` — contact/newsletter/talent-pool. Corta campos no servidor (`MAX_CAMPO=200`, `MAX_MENSAGEM=5000`), honeypot + carimbo, limite por IP. Newsletter = dupla confirmação.
- `enviarCandidatura` — CV→private-files (≤5 MB). **Não montada em página até P-17** (LGPD); gate `ENABLE_JOB_APPLICATIONS=1`.
- `baixarMaterial` — devolve URL pré-assinada (15 min) do bucket privado; robô barrado **não** recebe sucesso.

**Hook:** `revalidarSite()` — `revalidatePath('/', 'layout')` em processo (MIG-143), com try/catch para rodar fora do Next (seed/importadores).

**Roteamento público:** fonte única em `lib/routes.ts` (`hrefDe`, `canonizarSegmento`); `proxy.ts` reescreve raiz→`/pt/*`, redireciona `/pt/*`→raiz (308), traduz segmentos EN, responde **410** para URLs `GONE` do `redirects.csv`.

---

## 5. Integrações Externas

| Serviço | Propósito | Auth | Rate limit / notas |
|---|---|---|---|
| **Google Gemini** (`@google/genai` 2.17.1) | Chat "ATRA AI", UI generativa por tags | `GEMINI_API_KEY` (sem `NEXT_PUBLIC_`) | Rate-limit por IP (memória) + teto diário (AiUsage). Modelo `gemini-3.6-flash` [verificar — literal do código] |
| **Resend** | E-mail transacional de leads | `RESEND_API_KEY` | Via `fetch` HTTP puro (sem SDK). Sem chave, lead grava e fica pendente |
| **RD Station CRM** (D-26) | Destino final dos leads | token | Idempotente (`crmId`); segundo passo após gravar; exige consentimento (P-14) |
| **MinIO → Cloudflare R2** | Storage S3-compatível | chaves S3 | R2 recomendado, **ainda não migrado** |
| **Cloudflare** | DNS (proxy laranja off, P-21) | conta ATRA (P-23) | Trava o cutover se acesso não resolvido |
| **Google Workspace** | E-mail corporativo | — | ⚠️ MX **intocáveis** no cutover |
| **GA4 / GTM** | Analytics (baseline de tráfego) | `NEXT_PUBLIC_GTM_ID` (vazio) | Pendente (P-19) — sem baseline, cutover sem comparação |

> ⚠️ **`web/.env.example` não foi encontrado em disco** [verificar], embora `.dockerignore` e os docs de infra o pressuponham. O inventário de variáveis foi reconstruído de `docs/04-infra/ambientes.md` e dos composes.

---

## 6. Pipelines / Jobs Assíncronos

- **Importação do WordPress** (`web/scripts/wp-import/`) — cliente REST `/wp-json/wp/v2` com paginação/retry; converte HTML→Lexical (`EXPERIMENTAL_TableFeature`), baixa mídia, reescreve links internos, gera `redirects.csv`. Trigger: manual (`pnpm exec tsx ...`). Entrada: 207 posts + 7 vagas; saída: collections + 287 imagens.
- **Seed** (`web/scripts/seed/`) — idempotente; cria fixtures de teste. **Exige `SEED_FIXTURES=1`** (só o CI liga) para não pôr conteúdo inventado no ar; a mesma chave insere as imagens do protótipo (D-27).
- **Backup** (`infra/backup/`) — `pg_dump` diário por systemd timer (03:10 UTC), com **restore verificado por contagem** em base limpa. Cópia externa (R2) pendente.
- **Deploy** (`infra/deploy/deploy.sh`) — disparado por push na `migracao`: migra o banco **antes** de o Next atender, builda contra o banco real, troca com healthcheck, rollback por tag de SHA (acionado 3× em falhas reais de rede).

---

## 7. Segurança

- **Auth/authz:** sessão nativa do Payload; **RBAC `editor`/`admin`** (D-18) — toda collection declara `access` explícito; `role.access.update` restrito a admin. Staging atrás de Basic Auth (Caddy).
- **Segredos:** **nenhum com prefixo `NEXT_PUBLIC_`** para chave/segredo — o CI reprova o padrão `NEXT_PUBLIC_*(KEY|SECRET|TOKEN|PASSWORD)`. Segredos de servidor sem prefixo. O `define` do `vite.config.ts` legado **não é portado** (regra 7).
- **LGPD:** `FormSubmissions` **sem IP/user-agent**; CVs e material gated em **bucket privado** com URL assinada; política de privacidade publicada é **pré-requisito** dos formulários (P-14); retenção de currículo e acesso do RH pendentes (P-17); envio ao CRM exige consentimento.
- **Rate limiting:** chat por IP (janela 1h em memória) + teto de custo diário no banco; formulários por IP + honeypot + carimbo de tempo. **IP confiável** via `lib/ip` — lê `X-Real-Ip` do Caddy, **nunca** `x-forwarded-for` primeiro (`ip.test.ts` cobre XFF forjado).
- **Uploads:** mídia com mimeTypes enumerados, **sem SVG** (MIG-144); tudo convertido para WebP.
- **Cabeçalhos:** headers de segurança no Caddy/Next (MIG-145). **CSP omitida deliberadamente** (nonce por requisição incompatível com página estática) — [verificar] se entra depois.

---

## 8. Observabilidade

- **Backup/restore:** `pg_dump` diário; restore **provado por contagem** em base limpa (não só o dump rodando) — armadilhas do `pg_restore --jobs`/stdin já pagas (`testar-restore.sh`).
- **Erros:** **Sentry pendente** (MIG-122, espera conta).
- **Uptime/alertas:** **pendente** (MIG-124).
- **Acessibilidade:** **axe no CI reportando, sem reprovar PR** (D-13) — relatório torna a dívida visível.
- **Logs:** stdout dos containers via Docker/Caddy [verificar retenção].

---

## 9. Estratégia de Testes

- **Regressão visual é o teste central** (`docs/03-plano/estrategia-de-testes.md`). `pnpm gate`: build de produção em :3100 + Playwright dentro da **imagem oficial** (mesma no macOS e no CI). **3 viewports (375/768/1280), página inteira, tolerância 0,1%** (`maxDiffPixelRatio: 0.001`), **13 rotas** sob gate (rotas que listam conteúdo real — `/blog`, `/carreiras` — saíram, ficam com smoke).
- **E2E (Playwright):** `baseline` (captura o gabarito do legado :3001), `visual` (paridade por rota/viewport), `smoke` (200 por rota/idioma, admin responde), `contraste` (tema claro legível, mede 2 temas), `acessibilidade` (axe), `redirects` (WP→410/redirect, `/pt`→raiz, sitemap), `paridade-ds`.
- **Unit (Vitest):** mappers, anti-spam, ip, chat, seo/sitemap/jsonld, redirects, utm, video (~11 arquivos).
- **Determinismo:** `?e2e=1` congela carrossel/rotação nos dois apps; `stabilize()` troca imagem/IntersectionObserver; mídia entra mascarada (o app novo reencoda por `next/image`).

---

## 10. Decisões Arquiteturais Significativas (ADRs)

> Formato reverse-engineering: **Evidência** (onde a decisão vive no código/docs), **Decisão**, **Confiança**, **Consequência**. Referência canônica: `docs/00-contexto/decisoes.md` (D-01…D-28).

### ADR-001 — Monólito Next + Payload no mesmo processo (D-04)
**Evidência:** `payload.config.ts` importado pelo Next; admin em `app/(payload)/`; hook de revalidação em processo. **Decisão:** CMS embarcado, não headless separado. **Confiança:** alta. **Consequência:** um deploy, um runtime; o CMS compartilha a máquina com o build (custo de CPU gerenciado com `cpus/2`).

### ADR-002 — PostgreSQL + Drizzle, migração versionada com `push: false` (D-01, D-21)
**Evidência:** `payload.config.ts` (adapter db-postgres), 46 migrações em `src/migrations/`, CI roda `payload migrate` antes do build. **Decisão:** schema muda só por `migrate:create`+`migrate`. **Confiança:** alta. **Consequência:** uma etapa a mais por mudança de campo; em troca, o servidor nunca trava num prompt interativo do Drizzle e a mudança é revisável em PR.

### ADR-003 — i18n: PT na raiz, EN em `/en` com slugs traduzidos (D-07)
**Evidência:** localization no `payload.config.ts`, `lib/routes.ts`, `proxy.ts`. **Decisão:** rotas distintas por idioma, slugs localizados. **Confiança:** alta. **Consequência:** todo campo de texto nasce `localized`; cada rota pública tem slug por idioma; `hreflang` recíproco; retrofit seria migração de banco — por isso na fundação.

### ADR-004 — Regressão visual pixel a pixel como contrato (D-15, D-25)
**Evidência:** `playwright.config.ts` (0,001), `pnpm gate`, `e2e/baseline|visual`. **Decisão:** porte fiel inclusive dos defeitos; nada de propriedade tipográfica nova. **Confiança:** alta. **Consequência:** a suíte distingue erro de porte de escolha deliberada; melhoria vira backlog, não entra na migração.

### ADR-005 — Storage S3 com dois buckets (público/privado)
**Evidência:** `payload.config.ts` (storage-s3), `PrivateFiles`, `Resources.file`, presigner AWS SDK. **Decisão:** mídia pública anônima + bucket privado com URL assinada para CV/gated. **Confiança:** alta. **Consequência:** LGPD para dado sensível; MinIO hoje, R2 previsto.

### ADR-006 — Deploy Compose + Caddy por `git push`, não Coolify (D-28)
**Evidência:** `docker-compose.prod.yml`, `Caddyfile`, `infra/deploy/deploy.sh`, job `deploy` do CI. **Decisão:** esteira no GitHub Actions com healthcheck e rollback por tag de SHA. **Confiança:** alta. **Consequência:** tudo que descreve o ambiente vive no git; painel evitado numa máquina de 8 GB que também builda; rollback provado 3×.

### ADR-007 — Revalidação em processo ao publicar (MIG-143)
**Evidência:** `hooks/revalidar.ts`. **Decisão:** `revalidatePath` in-process, sem endpoint/segredo. **Confiança:** alta. **Consequência:** publicar no CMS atualiza o site sem deploy (o objetivo de negócio vira verdade prática); a nota "estático não muda" vale só para `gate --sem-build`.

### ADR-008 — Nenhum segredo com prefixo `NEXT_PUBLIC_` (regra 7)
**Evidência:** grep no CI; `lib/email.ts`; comentário sobre `vite.config.ts:12` não portado. **Decisão:** segredos de servidor sem prefixo; CI reprova o padrão perigoso. **Confiança:** alta. **Consequência:** a chave do Gemini nunca vai ao bundle do cliente.

### ADR-009 — Componente não conhece o CMS: mappers como fronteira (regra 3)
**Evidência:** `lib/mappers/` (único lugar que importa `@/payload-types`), `types/content.ts`, `ConteudoIncompleto`. **Decisão:** Server Component resolve dado, mapper converte, componente recebe props de apresentação. **Confiança:** alta. **Consequência:** trocar nome de campo quebra 1 mapper, não N componentes; rascunho e relacionamento não-populado tratados explicitamente.

### ADR-010 — Chat com rate-limit por IP + teto de custo (D-12)
**Evidência:** `app/api/chat/route.ts`, `lib/chat.ts`, collection `AiUsage`, global `AtraAi` (systemPrompt editável). **Decisão:** limite por IP (memória) + teto diário no banco, degradação graciosa. **Confiança:** alta. **Consequência:** teto real em R$ pendente (P-04); UI generativa fora do teste enquanto testar for gastar cota.

---

## 11. Riscos Técnicos

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Build derruba Postgres por memória na VPS (2 vCPU/8 GB) | Alto | Média | `cpus/2` workers, `staticPageGenerationTimeout`; monitorar no cutover |
| Sem Sentry/uptime até a Fase 6 | Médio | Alta (hoje) | Backup+restore já cobre dado; instalar antes do cutover (MIG-122/124) |
| Cutover trava por acesso Cloudflare (P-23) | Alto | Média | Resolver acesso **antes** do dia; runbook proíbe tocar MX |
| Sem baseline de analytics (P-19) | Médio | Alta | Instalar GA no WP **agora** para ter comparação |
| `gemini-3.6-flash` pode não existir publicamente [verificar] | Médio | Baixa | Confirmar modelo/chave antes de ligar o chat em produção |
| Débito de a11y portado (foco removido, contraste, mega-menu só mouse) | Médio | Alta | Consciente (D-13); axe mede; fase de a11y no backlog |
| MinIO→R2 não migrado | Baixo | Média | Storage funciona; migrar quando o bucket R2 existir |

---

## 12. Roadmap de Implementação

Fases 0–4c **concluídas**; 5–6 em andamento; 7–8 não iniciadas (detalhe e critérios verificáveis em `docs/03-plano/roadmap.md`).

- **Fase 0–1 — Descoberta + Fundação** ✅ — Next+Payload vazios, Postgres, S3, i18n, CI, regressão visual, Mona Sans.
- **Fase 2 — Fatia vertical (Cases)** ✅ — collections base, design system, `/cases-de-sucesso` PT/EN, `CLAUDE.md`.
- **Fase 3 — Fábrica de rotas** ✅ — 20 rotas do protótipo, 15 sob gate.
- **Fase 4a/4b/4c — Seed + WP + conteúdo novo** ✅ — CMS assume todo conteúdo; 207 posts/287 imagens/7 vagas; 8 segmentos, 18 soluções, legal, 261 redirects.
- **Fase 5 — Formulários, SEO, analytics** 🔶 8/12 — falta GA4/Resend (chave) e P-17/P-07 (decisão).
- **Fase 6 — Endurecimento** 🔶 12/17 — staging no ar, deploy/rollback, backup/restore, axe, hardening MIG-140–147. Faltam Sentry, uptime, treinamento.
- **Fase 7 — Cutover** ⬜ — DNS apontado, WP desativado (bloqueado por decisão/acesso, não engenharia).
- **Fase 8 — Limpeza** ⬜ — remover `legacy/`, dívida priorizada, desativar WP.

---

**Próximo passo:** `/ksdd:design` já não é necessário — [DESIGN.md](DESIGN.md) foi gerado neste setup. Revise os ADRs marcados e os `[verificar]` antes de aprovar (mude `Status:` para `Aprovado`).
