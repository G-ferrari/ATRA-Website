<div align="center">

<img src="web/src/app/icon.png" alt="ATRA" width="72" />

# ATRA — site institucional

**O novo `atra.com.br`: Next.js 16 + Payload CMS 3 + PostgreSQL.**
O marketing publica cases, artigos, materiais e vagas sem depender de dev, e o site ganha SSR, SEO e i18n que o WordPress não entregava.

![Next.js](https://img.shields.io/badge/Next.js-16.3-000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2-149eca?logo=react)
![Payload CMS](https://img.shields.io/badge/Payload_CMS-3.88-000?logo=payloadcms)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169e1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/e2e-Playwright-2ead33?logo=playwright&logoColor=white)

[Site](https://www.atra.com.br) · [Documentação](docs/README.md) · [Decisões](docs/00-contexto/decisoes.md) · [Guia do editor](docs/05-operacao/guia-do-editor.md)

</div>

---

<p align="center">
  <img src="docs/imagens/readme/home-escuro.jpg" alt="Home no tema escuro" width="49%" />
  <img src="docs/imagens/readme/home-desktop.jpg" alt="Home no tema claro" width="49%" />
</p>

## Sumário

- [O que é este projeto](#o-que-é-este-projeto)
- [Tour pelo site](#tour-pelo-site)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Como rodar localmente](#como-rodar-localmente)
- [Comandos do dia a dia](#comandos-do-dia-a-dia)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Estrutura do repositório](#estrutura-do-repositório)
- [As regras que não se quebram](#as-regras-que-não-se-quebram)
- [Testes e qualidade](#testes-e-qualidade)
- [Deploy e infraestrutura](#deploy-e-infraestrutura)
- [Armadilhas comuns](#armadilhas-comuns)
- [Contribuindo](#contribuindo)

---

## O que é este projeto

O site institucional da ATRA (consultoria de dados, analytics e IA), migrado do
WordPress para uma aplicação própria. O repositório guarda três coisas:

| Pasta | O quê |
|---|---|
| [`web/`](web) | **O site novo.** Next.js + Payload CMS na mesma aplicação: o site público e o admin (`/admin`) |
| [`docs/`](docs) | A especificação. Toda decisão vive como `D-xx` em [`decisoes.md`](docs/00-contexto/decisoes.md), toda pendência como `P-xx` |
| [`legacy/`](legacy) | O protótipo React + Vite que serviu de **gabarito visual** do porte. Hoje só é usado quando alguém liga a paridade visual |
| [`infra/`](infra) | Deploy, backup, restore e provisionamento da VM |

**Em números:** 207 artigos e 287 imagens importados do WordPress, 18 soluções,
8 segmentos, 274 redirects do site antigo, PT na raiz e EN em `/en` com slugs
traduzidos, 196 migrações versionadas.

## Tour pelo site

| | |
|:---:|:---:|
| <img src="docs/imagens/readme/solucoes.jpg" alt="Página de soluções" /> | <img src="docs/imagens/readme/cases.jpg" alt="Cases de sucesso" /> |
| **Soluções.** Quatro frentes, montadas no CMS | **Cases de sucesso.** Carrossel e lista vindos da collection `cases` |
| <img src="docs/imagens/readme/diagnostico.jpg" alt="Diagnóstico de maturidade" /> | <img src="docs/imagens/readme/chat.jpg" alt="ATRA AI" /> |
| **Diagnóstico de maturidade.** Questionário por setor e regulação, com resultado e lead | **ATRA AI.** Chat com Gemini que recomenda só o que está publicado no site |

<p align="center">
  <img src="docs/imagens/readme/home-mobile.jpg" alt="Home no celular" width="260" />
  <br /><sub>Responsivo em 375, 768 e 1280px, os três viewports que a suíte testa.</sub>
</p>

**O que o site faz além de mostrar páginas:**

- **CMS em português** com Live Preview, rascunho, versões e páginas montadas por blocos ("Adicionar Seção", com miniatura de cada bloco).
- **Publicar atualiza o site sem deploy.** Um hook chama `revalidatePath` na hora.
- **Leads** de todos os formulários vão para o Postgres e para o **RD Station Marketing** como conversão.
- **Carreiras** lista as vagas do **ATRAIR**, o sistema de R&S da ATRA, e cai para a lista do CMS se ele estiver fora do ar.
- **Consentimento de cookies** em três categorias (essencial, estatística e marketing), com GA4/GTM em Consent Mode v2.
- **SEO**: sitemap, `hreflang`, JSON-LD, metatags Open Graph e 274 redirects 301/410 do WordPress.

---

## Stack

### Aplicação

| Camada | Tecnologia | Para quê |
|---|---|---|
| Runtime | **Node.js 22** · **pnpm 11** | Imagem `node:22-bookworm-slim`; mínimo aceito é Node 20.9 |
| Linguagem | **TypeScript 5** | Tudo tipado, inclusive os tipos gerados do Payload |
| Framework | **Next.js 16.3** (App Router, Turbopack) | SSR/SSG, rotas localizadas, Server Components e Server Actions. O `proxy.ts` faz o papel do middleware |
| UI | **React 19.2** | Server Components por padrão; interatividade em ilhas cliente |
| CMS | **Payload CMS 3.88** | Admin, collections, globals, blocos, rascunho, versões, Live Preview e localização |
| Editor de texto | **Lexical** (`@payloadcms/richtext-lexical`) | Rich text, com tabelas |
| Estilo | **Tailwind CSS 4** · `clsx` · `tailwind-merge` | Tema claro e escuro; Sass só no CSS do admin |
| Animação | **Motion 12** | Entradas, carrosséis e transições |
| Ícones e gráficos | `lucide-react` · `@iconify/react` · **Recharts** | Recharts desenha os gráficos do diagnóstico |
| Markdown | `react-markdown` · `remark-gfm` | Respostas da ATRA AI |
| Imagens | `next/image` · **sharp** | Todo upload é convertido para WebP |
| Tipografia | **Mona Sans** via `next/font` | |

### Dados e armazenamento

| Camada | Tecnologia | Para quê |
|---|---|---|
| Banco | **PostgreSQL 17** | Adapter `@payloadcms/db-postgres` (Drizzle), com migrações versionadas e `push: false` |
| Arquivos | **MinIO** (compatível com S3) via `@aws-sdk/client-s3` | Bucket público `atra-media` para mídia e bucket privado `atra-privado` para currículos (URL assinada) |

### Integrações

| Serviço | Uso | Liga como |
|---|---|---|
| **Google Gemini** (`@google/genai`) | ATRA AI, o chat do site | `GEMINI_API_KEY` |
| **RD Station Marketing** | Leads como conversão, com tags | Chave no ambiente + interruptor no CMS (Sistema → Integrações) |
| **ATRAIR** | Vagas de `/carreiras` e envio de currículo | Chave no ambiente + interruptor e URL no CMS |
| **GA4 / GTM** e **Lusha** | Analytics e enriquecimento | IDs no CMS (Sistema → Rastreamento), só depois do aceite de cookies |
| **Sentry** (`@sentry/nextjs`) | Erros no servidor, no edge e no navegador | `SENTRY_DSN`; sem ele fica inerte |

> Toda integração **nasce desligada** e sem ela o site continua funcionando. A ideia é que nenhum dev precise de credencial de terceiro para rodar o projeto.

### Qualidade, CI e infraestrutura

| Camada | Tecnologia |
|---|---|
| Testes unitários | **Vitest 4** + jsdom |
| Testes e2e | **Playwright 1.62**, dentro da imagem oficial `mcr.microsoft.com/playwright` (igual no macOS e no CI) |
| Acessibilidade | `@axe-core/playwright` |
| Lint e tipos | ESLint 9 (`eslint-config-next`) · `tsc --noEmit` |
| Containers | Docker com Dockerfile multi-stage (`deps` → `build` → `prod-deps` → `migrator` → `runner`) · Docker Compose |
| Proxy e TLS | **Caddy 2** (HTTPS automático com Let's Encrypt) |
| CI/CD | **GitHub Actions**: `ci.yml` (verify → e2e → deploy) e `uptime.yml` |
| Hospedagem | VM Linux no Google Cloud, com backup diário por timer do systemd |

---

## Arquitetura

```mermaid
flowchart LR
    V([Visitante]) -->|HTTPS| C[Caddy 2]
    E([Editor do marketing]) -->|/admin| C
    C --> N

    subgraph N[Next.js 16 · um único processo]
        direction TB
        P[proxy.ts<br/>locale · redirects · 410]
        RSC[Server Components<br/>busca dados e monta props]
        I[Ilhas cliente<br/>recebem tudo pronto]
        A[Admin do Payload<br/>+ Local API]
        P --> RSC --> I
    end

    N --> PG[(PostgreSQL 17)]
    N --> S3[(MinIO / S3<br/>mídia · currículos)]
    N -.->|chat| G[Gemini]
    N -.->|leads| RD[RD Station Marketing]
    N -.->|vagas · currículo| AT[ATRAIR]
    N -.->|erros| SE[Sentry]
```

### Como um dado chega à tela

O componente **nunca conhece o formato do CMS**. Um mapper é o único lugar que
sabe como o Payload guarda o documento:

```mermaid
flowchart LR
    DB[(Payload<br/>Local API)] -->|"doc: Case"| M["lib/mappers/<br/>toCaseCard()"]
    M -->|"CaseCard"| SC[Server Component<br/>page.tsx]
    SC -->|props prontas| IC[Ilha cliente<br/>'use client']
```

- [`web/src/types/content.ts`](web/src/types/content.ts) define os tipos de **apresentação**.
- [`web/src/lib/mappers/`](web/src/lib/mappers) converte do Payload para eles. Trocar o nome de um campo quebra um mapper, não oito componentes.
- Nenhum componente importa `@/payload-types`.
- Relacionamento não populado **derruba com a instrução do conserto**. Campo vazio vira `ConteudoIncompleto`, que o preview mostra.

### Rotas e idiomas

PT fica na raiz e EN em `/en`, **com slugs traduzidos** (`/cases-de-sucesso` ↔
`/en/success-stories`). Nenhuma URL é escrita à mão: tudo passa por
[`lib/routes.ts`](web/src/lib/routes.ts).

```ts
hrefDe('cases', locale, slug)
```

### Páginas-mestras e blocos

Cada seção do site (Soluções, Cases, Blog, Carreiras…) é uma **página do CMS
marcada como página-mestra** (`masterOf`). A rota é uma casca fina, e a parte
automática da página (listas, destaques, grades) é um bloco em
[`components/secoes/`](web/src/components/secoes). O editor monta o resto com os
blocos flexíveis.

---

## Como rodar localmente

### Pré-requisitos

- **Node.js 22** (mínimo 20.9)
- **pnpm 11**: `corepack enable` já resolve
- **Docker** (Docker Desktop no macOS), para o Postgres e o MinIO

### Caminho recomendado: Next nativo, dependências em container

No macOS o hot reload é muito mais rápido com o Next rodando fora do container.
O porquê está em [`docs/04-infra/docker.md`](docs/04-infra/docker.md).

**1. Suba o Postgres e o MinIO**

```bash
docker compose up -d postgres minio createbucket
```

| Serviço | Endereço | Credencial local |
|---|---|---|
| Postgres | `localhost:5432` | `atra` / `atra`, banco `atra` |
| MinIO (API) | `localhost:9000` | `atra` / `atra12345` |
| MinIO (console) | http://localhost:9001 | `atra` / `atra12345` |

O `createbucket` cria os buckets `atra-media` e `atra-privado` e sai.

> ⚠️ Se a porta 5432 já estiver ocupada por outro projeto, o Next conecta no Postgres errado e reclama de tabela inexistente. Confira com `lsof -i :5432`.

**2. Instale as dependências e crie o `.env.local`**

```bash
cd web && pnpm install && cp .env.example .env.local
```

Preencha no `.env.local` o mínimo para rodar:

```dotenv
DATABASE_URI=postgres://atra:atra@localhost:5432/atra
PAYLOAD_SECRET=   # openssl rand -hex 32
NEXT_PUBLIC_SITE_URL=http://localhost:3000
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=atra-media
S3_ACCESS_KEY=atra
S3_SECRET_KEY=atra12345
```

Todo o resto pode ficar vazio: as integrações ficam desligadas e o site funciona.

**3. Crie o schema do banco**

```bash
cd web && pnpm migrate
```

> `pnpm dev` **não** sincroniza o schema (`push: false`). Sem esse passo o servidor sobe e quebra em runtime com `relation "..." does not exist`.

**4. Popule o banco**

O seed cria a estrutura do site (navegação, globais, home, páginas de seção).
Com `SEED_FIXTURES=1` ele também cria cases, vagas e fotos de exemplo, o que
deixa a revisão local legível:

```bash
cd web && SEED_FIXTURES=1 pnpm seed
```

Para ter o **conteúdo real** do WordPress (207 artigos e as vagas):

```bash
cd web && pnpm exec tsx --env-file-if-exists=.env.local scripts/wp-import/import-posts.ts
```

```bash
cd web && pnpm exec tsx --env-file-if-exists=.env.local scripts/wp-import/import-jobs.ts
```

> ⚠️ **Fixtures nunca vão para um ambiente real.** Fora da sua máquina, só o CI liga `SEED_FIXTURES=1`. Sem essa trava, doze itens inventados iriam ao ar assinados pela ATRA.

**5. Rode**

```bash
cd web && pnpm dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin. Com o banco vazio, o Payload pede para criar o primeiro usuário.

### Caminho alternativo: tudo em container

Sobe Postgres, MinIO e o Next (com `Dockerfile.dev`) com um comando. É mais
lento para desenvolver no macOS, mas não exige Node na máquina:

```bash
docker compose up -d
```

O container `web` tem teto de 6 CPUs de propósito: uma compilação a frio chegou
a travar o Mac inteiro sem ele.

---

## Comandos do dia a dia

Todos rodam dentro de `web/`.

| Comando | O que faz |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento em :3000 |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit`. Em árvore limpa, rode `pnpm typegen` antes |
| `pnpm typegen` | Gera os tipos de rota do Next (`PageProps`, `LayoutProps`) |
| `pnpm test` | Testes unitários (Vitest) |
| `pnpm gate` | **O teste que vale**: build de produção em :3100 e a suíte e2e no container do Playwright |
| `pnpm gate --sem-build` | Reaproveita o `.next` existente (não pega mudança de seed) |
| `pnpm seed` | Seed idempotente; fixtures de teste só com `SEED_FIXTURES=1` |
| `pnpm migrate` | Aplica as migrações, com retentativa e prova de sucesso |
| `pnpm payload generate:types` | Regenera `payload-types.ts` depois de mudar um campo |
| `pnpm payload generate:importmap` | Regenera o importMap do admin (campo de rich text sumindo = rodar isto) |

### Mudando o schema

Toda mudança de campo, collection ou bloco passa por **migração versionada**:

```bash
cd web && pnpm payload generate:types && pnpm payload migrate:create nome-da-mudanca && pnpm payload migrate
```

Confira o `ALTER TABLE` gerado **antes** de aplicar, e prefira migração aditiva.
Remoção de coluna vai numa publicação **depois** da que parou de lê-la: o
rollback do deploy volta o código, mas não desfaz a migração.

---

## Variáveis de ambiente

A referência completa, comentada, está em [`web/.env.example`](web/.env.example).

| Variável | Obrigatória | Para quê |
|---|:---:|---|
| `DATABASE_URI` | ✅ | Conexão com o Postgres |
| `PAYLOAD_SECRET` | ✅ | Assinatura de sessão do Payload |
| `NEXT_PUBLIC_SITE_URL` | ✅ | URL pública. Vira `metadataBase`, canônica e `og:image` |
| `S3_ENDPOINT` · `S3_BUCKET` · `S3_ACCESS_KEY` · `S3_SECRET_KEY` | ✅ | Storage de mídia |
| `S3_PRIVATE_BUCKET` | | Bucket dos currículos (padrão `atra-privado`) |
| `GEMINI_API_KEY` | | ATRA AI. Sem ela o chat não responde |
| `RDSTATION_MARKETING_API_KEY` | | Leads no RD. É a **Chave de API** da App Store do RD, não o token da API 1.x |
| `ATRAIR_API_URL` · `ATRAIR_API_KEY` | | Vagas e currículos. A URL é só a reserva, porque o admin vence |
| `SENTRY_DSN` · `NEXT_PUBLIC_SENTRY_DSN` | | Observabilidade |
| `NEXT_PUBLIC_GTM_ID` | | ID público do container do GTM |
| `ENABLE_CHAT_LEAD` | | Liga o convite de lead dentro do chat |

> 🔒 **Nenhum segredo leva o prefixo `NEXT_PUBLIC_`.** O prefixo injeta a variável no bundle do navegador. O CI reprova se `NEXT_PUBLIC_` aparecer junto de `KEY`, `SECRET`, `TOKEN` ou `PASSWORD`.

---

## Estrutura do repositório

```text
.
├── web/                          # o site (Next.js + Payload)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (frontend)/[locale]/   # rotas públicas, PT e EN
│   │   │   ├── (payload)/             # admin e API do Payload
│   │   │   └── api/                   # chat, health
│   │   ├── collections/          # Cases, Posts, Solutions, Jobs, Media, Pages…
│   │   ├── globals/              # Navigation, Footer, AtraAi, Integrations, Tracking…
│   │   ├── blocks/               # blocos flexíveis das páginas
│   │   ├── components/           # ui, layout, blocks, secoes, forms, content, admin
│   │   ├── lib/                  # routes, mappers, seo, redirects, integrações…
│   │   ├── hooks/                # hooks do Payload (revalidar, sincronizar RD…)
│   │   ├── actions/              # Server Actions dos formulários
│   │   ├── migrations/           # migrações versionadas (schema e dados)
│   │   ├── types/content.ts      # tipos de apresentação
│   │   ├── payload.config.ts
│   │   └── proxy.ts              # locale, redirects e 410
│   ├── e2e/                      # suíte Playwright
│   ├── scripts/                  # gate, migrar, seed, wp-import
│   └── public/
├── docs/                         # especificação, decisões, plano, infra, operação
├── infra/                        # deploy, backup, provisionamento, cutover
├── legacy/                       # protótipo React + Vite (gabarito visual)
├── Dockerfile                    # imagem de produção, multi-stage
├── docker-compose.yml            # dev: postgres + minio (+ web opcional)
├── docker-compose.prod.yml       # produção: caddy + web + migrate + postgres + minio
└── Caddyfile
```

---

## As regras que não se quebram

O detalhe e o histórico de cada uma estão em [`CLAUDE.md`](CLAUDE.md).

1. **Conteúdo é decisão do marketing (D-22).** Quem migra não reescreve texto, não consolida vocabulário e não escolhe o que aparece. A ferramenta para mudar fica no CMS.
2. **Componente não conhece o CMS.** Tipos de apresentação em `types/content.ts`, conversão em `lib/mappers/`.
3. **Nenhuma página busca dado dentro de componente.** O Server Component resolve, e a ilha cliente recebe tudo pronto. O modelo é `cases-de-sucesso/lista-de-cases.tsx`.
4. **Toda consulta a collection com rascunho filtra o status.** A Local API roda com `overrideAccess: true`, e o `access.read` não vale ali:
   ```ts
   where: { _status: { equals: 'published' } }
   ```
5. **Schema muda por migração versionada (D-21).** `push: false`, sempre.
6. **URL nunca é escrita à mão.** Use `hrefDe()` de `lib/routes.ts`.
7. **Nenhum segredo com prefixo `NEXT_PUBLIC_`.**
8. **O pixel decide, não a API do browser.** Quando `getComputedStyle` e a captura discordam, vale a captura.
9. **Conteúdo do site mora no CMS.** Lista de conteúdo dentro de `lib/` ou de um bloco é resíduo.

**Idioma:** documentação, comentários e mensagens ao usuário em **português**.
Código, identificadores, campos do Payload e commits em **inglês**. Comentário
explica **por quê**, e o padrão do repositório é registrar a armadilha que
motivou a linha:

```ts
// ⚠️ Não adicionar `axes: ['wdth']`. O site não usa largura condensada, e pedir
// o eixo faz o Google servir outro corte: o itálico fica 3,2% mais largo.
```

---

## Testes e qualidade

```mermaid
flowchart LR
    PR[push / PR] --> V[verify<br/>lint · tipos · build<br/>segredo exposto?<br/>tipos e importMap em dia?]
    V --> E[e2e<br/>pnpm gate]
    E -->|main| D[deploy na VM]
```

`pnpm gate` é o único caminho para o e2e: faz o build de produção, sobe em :3100
e roda a suíte **dentro da imagem oficial do Playwright**, a mesma no macOS e no
CI, para uma falha valer nos dois.

| Suíte | O que garante |
|---|---|
| `smoke` | Toda rota responde, inclusive os 404 e 410 esperados |
| `redirects` | As 274 linhas do `redirects.csv` do WordPress |
| `contraste` | Mede os **dois** temas e reprova o que funciona no escuro e quebra no claro |
| `acessibilidade` | axe em todas as rotas |
| Comportamento | `consultores`, `diagnostico-maturidade`, `chat-lead`, `cookies`, `ebook`, `rastreamento`… |
| Unitários (Vitest) | Mappers, SEO, sitemap, redirects, motor do diagnóstico, integrações |

Para iterar em uma rota só (o gate completo leva minutos):

```bash
cd web && pnpm gate --rota home --viewport desktop
```

**Paridade visual com o protótipo:** `visual.spec.ts` compara 11 rotas, página
inteira, em 3 viewports, com tolerância de 0,1% de pixels. Ela saiu do CI em
27/09 (D-39), porque o site mudou de propósito desde o gabarito. Religue com
`PARIDADE_COM_PROTOTIPO=1 pnpm gate`, com o legado de pé
(`cd legacy && docker compose up -d`, em :3001).

---

## Deploy e infraestrutura

```mermaid
flowchart LR
    M[merge na main] --> CI[GitHub Actions<br/>verify + e2e]
    CI -->|verde| SSH[deploy.sh na VM]
    SSH --> B[build da imagem]
    B --> MG[migrate]
    MG --> T[troca de container]
    T --> H{healthcheck}
    H -->|ok| OK([no ar])
    H -->|falhou| RB([rollback automático])
```

- **`git push` na `main` é o deploy (D-44).** A `main` só recebe merge por PR.
- [`infra/deploy/deploy.sh`](infra/deploy/deploy.sh) rebuilda, migra, troca com healthcheck e volta sozinho se falhar.
- **Publicar no CMS não precisa de deploy.** O hook `revalidar` atualiza as páginas na hora.
- **Conteúdo novo que precisa chegar a um ambiente existente vem por migração de dados com trava**, não por seed: o deploy roda migração, não seed.
- **Backup diário** com restore verificado por contagem ([`infra/backup/`](infra/backup)).
- **Observabilidade:** Sentry nos três lados, `uptime.yml` abre issue com a etiqueta `uptime`, logs dos containers no journald e log de acesso do Caddy.

**Produção:** https://www.atra.com.br. Os outros domínios (`atra.com.br`, `atra.digital`, `atrainformatica.com.br` e a antiga homologação `atra-hmg.duckdns.org`) redirecionam para ele com 301 (D-72).
Detalhes em [`docs/04-infra/`](docs/04-infra): [ambientes](docs/04-infra/ambientes.md),
[deploy](docs/04-infra/deploy-vps.md), [backup](docs/04-infra/backup-e-observabilidade.md)
e o [runbook do cutover](docs/04-infra/runbook-cutover.md).

---

## Armadilhas comuns

As mais frequentes. A tabela completa, com mais de 50 casos já pagos, está em [`CLAUDE.md`](CLAUDE.md#armadilhas-já-pagas).

| Sintoma | Causa e conserto |
|---|---|
| `column ... does not exist` com o servidor de pé | Faltou migração. `pnpm migrate` |
| `Cannot find name 'PageProps'` | Tipos do Next não gerados. `pnpm typegen` |
| `Cannot find module '.../page.js'` depois de mover rota | `.next/types` velho. `rm -rf .next` |
| Campo de rich text some do admin | importMap desatualizado. `pnpm payload generate:importmap` |
| Rascunho aparece no site | Consulta sem `where: { _status: { equals: 'published' } }` |
| `pnpm lint` acusa milhares de erros | Está lintando `playwright-report/` |
| Texto some no tema claro | Cor sem par. O certo é `text-slate-900 dark:text-white` |
| `leading-*` "não pega" | `text-xl` também define entrelinha, e o `tailwind-merge` descarta o `leading` que vem antes. Ponha o tamanho primeiro |
| Gradiente transparente | No Tailwind 4 o nome é `bg-linear-to-*`, não `bg-gradient-to-*` |
| Página estática não muda depois do seed | O HTML é pré-renderizado. Rode o gate inteiro, sem `--sem-build` |
| Gate testa o build errado | Servidor antigo segurando :3100. O script aborta, então feche-o |

---

## Contribuindo

- **Branch nova parte de `origin/main`**, uma task por PR. O backlog está em [`docs/03-plano/tasks.md`](docs/03-plano/tasks.md).
- **Commits em inglês**, no formato Conventional Commits: `fix(careers): revalidate /carreiras every 5 minutes`.
- Antes de escrever código de Next, leia [`web/AGENTS.md`](web/AGENTS.md) e `web/node_modules/next/dist/docs/`: esta versão tem mudanças que contradizem a maior parte da documentação da internet.
- Decisão nova vira `D-xx` em [`decisoes.md`](docs/00-contexto/decisoes.md); dúvida que depende da ATRA vira `P-xx` em [`pendencias.md`](docs/00-contexto/pendencias.md).
- Checklist de PR: [`definicao-de-pronto.md`](docs/03-plano/definicao-de-pronto.md).

<div align="center">
<sub>Feito para a <a href="https://atra.com.br">ATRA</a>, dados, analytics e inteligência artificial.</sub>
</div>
