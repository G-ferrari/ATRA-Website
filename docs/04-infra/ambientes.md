---
status: rascunho
atualizado_em: 2026-08-25
depende_de: [../00-contexto/decisoes.md]
---

# Ambientes

## Os três ambientes

| | Local | Staging *(no ar desde 24/08)* | Produção |
|---|---|---|---|
| URL | `http://localhost:3000` | `https://srv1927832.hstgr.cloud` — vira `staging.atra.com.br` quando o registro A existir (P-23); o Caddy já aceita os dois | `https://www.atra.com.br` |
| Next | nativo (`pnpm dev`) | container (imagem por SHA, trocada pela esteira) | container |
| Postgres | container | container no mesmo host, só em 127.0.0.1 | container no mesmo host |
| Storage | MinIO em container | MinIO em container, sem porta pública — R2 segue recomendado (deploy-vps.md) | idem, até P-21/R2 |
| Dado | seed determinístico | **real** — 207 posts, 7 vagas, mídia do WP; zero fixture | real |
| Acesso | — | senha (Basic Auth) + `noindex` + robots bloqueando | público |
| E-mail | logado no console | sem chave: lead grava e `notified` fica falso | Resend |
| Sentry | desligado | pendente (MIG-122, espera conta) | `environment: production` |

⚠️ Automatizar contra a **API do CMS** no staging: autenticar por **cookie**, não
por header — o Basic do Caddy já ocupa o `Authorization`. A nota completa está
no runbook (seção do Ensaio).

**Onde fica a credencial do Basic Auth:** na própria VPS. O repositório e o
`.env.prod` guardam só o **hash bcrypt** (irreversível); o usuário e a senha em
texto estão anotados na VPS. Perdeu? Não se recupera — troca-se: `caddy
hash-password` gera o hash novo, que substitui o antigo no `.env.prod` **por
edição de texto** (nunca `source` — o `$$` do bcrypt vira PID no bash), e o
Caddy é recriado.

**Staging não é opcional.** É onde o ensaio de cutover roda (MIG-132) e onde o
`redirects.csv` é validado antes de valer para o Google.

⚠️ Staging **precisa** de `X-Robots-Tag: noindex` e `robots.txt` bloqueando tudo.
Um staging indexado compete com a produção pelo mesmo conteúdo — e como ele terá
conteúdo idêntico, o estrago é real.

## Estado atual da infraestrutura da ATRA

Levantado em 17/08/2026, por DNS e headers públicos:

| Item | Situação | Implicação |
|---|---|---|
| DNS | **Cloudflare** (`watson`/`izabella.ns.cloudflare.com`) | A troca do cutover é feita lá; TTL é controlável |
| Proxy Cloudflare | **Aparentemente desligado** — o A responde `172.237.63.136` (IP de origem, não da Cloudflare) e não há header `cf-ray` | CDN, cache e WAF estão disponíveis mas não em uso |
| Origem do WP | `server: nginx-rc` (RunCloud) | VPS gerenciado; segue vivo 30 dias após o cutover, fora do DNS |
| E-mail | **Google Workspace** (`aspmx.l.google.com`) | ⚠️ **Não tocar nos MX no cutover.** Mexer em DNS e derrubar o e-mail da empresa é o erro clássico |
| Resíduo | MX `ms10756889.msv1.invalid` com prioridade 32767 | Sobra de Microsoft 365; inofensivo, mas vale limpar |

> [!DECISÃO PENDENTE] **P-21** — ligar o proxy da Cloudflare (nuvem laranja) no
> site novo? Ganha CDN, cache de estático, WAF e proteção de DDoS de graça, e
> ajuda no custo de CPU de imagem. Custa: uma camada a mais para depurar e regras
> de cache que precisam entender o Next. Recomendação: ligar **depois** do cutover
> estabilizar, não junto — uma variável de cada vez.

## Variáveis de ambiente

| Variável | Local | Staging/Prod | Segredo |
|---|---|---|---|
| `DATABASE_URI` | `.env.local` | gerenciador do host | **sim** |
| `PAYLOAD_SECRET` | `.env.local` | gerenciador do host | **sim** |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | URL do ambiente | não |
| `S3_ENDPOINT` / `S3_BUCKET` | MinIO local | storage do host | não |
| `S3_ACCESS_KEY` / `S3_SECRET_KEY` | `.env.local` | gerenciador do host | **sim** |
| `GEMINI_API_KEY` | `.env.local` | gerenciador do host | **sim** |
| `RESEND_API_KEY` | vazio (loga no console) | gerenciador do host | **sim** |
| `SENTRY_DSN` | vazio | gerenciador do host | não |
| `NEXT_PUBLIC_GTM_ID` | vazio | **reserva** desde a D-40: o id do container mora no admin (Sistema → Rastreamento), que vence. Só vale se o admin estiver vazio; o script continua esperando o aceite de estatística (D-30) | não — id público, aparece no HTML de qualquer site que use GTM |
| `RDSTATION_CRM_TOKEN` | vazio (sincronização inerte, `crm.syncedAt` vazio no admin) | gerenciador do host — **produção só depois de P-14** (D-26/D-29) | **sim** |
| `RDSTATION_CRM_DEAL_STAGE_ID` | vazio (a conta usa a etapa padrão) | id da etapa do funil onde a negociação nasce | não |
| `ATRAIR_API_URL` | `http://localhost:3300` do ATRAIR local (no compose, `http://host.docker.internal:3300`) | **reserva** desde a D-41: o endereço mora no admin (Sistema → Integrações), que vence, e o campo lá **nasce preenchido com esta variável**. ⚠️ Ainda **não provisionada na VPS** — sem ela o campo nasce com o endereço de dev, o mapper o recusa e a grade de `/carreiras` vem do CMS (estado seguro). Falta a URL do ATRAIR no Cloud Run | não |
| `ATRAIR_API_KEY` | vazio (candidatura fica só no admin, falta aparece no log) | gerenciador do host — mesma `TALENT_POOL_API_KEY` configurada no ATRAIR (MIG-102). ⚠️ **Fica no ambiente de propósito** (D-41): é credencial, e credencial em coluna do Postgres entra no backup e aparece no admin. É a **segunda tranca** — as chaves do CMS ligadas sem ela seguem inertes | **sim** |
| `ENABLE_CHAT_LEAD` | ausente | `1` liga o convite de lead no chat (D-29) — as outras duas chaves são o toggle e o `consentNotice` no CMS; **produção só depois de P-14** | não |
| ~~`RC18_LEAD_EMAIL`~~ | — | — | ✅ **Removida (D-35, task 028 de `diagnostico-maturidade-dados`).** Saiu com o diagnóstico RC18, que era quem a lia; `/diagnostico-rc18` redireciona para `/diagnostico-maturidade?setor=financeiro`, cujo aviso vai para o `email` do global `contact`. A caixa própria (P-29) segue pendente para o diagnóstico novo |
| `S3_PRIVATE_BUCKET` | `atra-privado` | idem | não — nome de bucket; o segredo é a credencial |
| `ENABLE_JOB_APPLICATIONS` | ausente | `1` **só depois de P-17** — liga o formulário de candidatura; exige rebuild, de propósito | não |
| ~~`REVALIDATE_SECRET`~~ | — | — | ✅ **Removida (MIG-143).** A revalidação virou hook em processo (`hooks/revalidar.ts`): o Payload roda dentro do Next e chama `revalidatePath` direto — não há endpoint HTTP, logo não há segredo |
| `CRON_SECRET` | `.env.local` | gerenciador do host | **sim** |

### Onde os segredos vivem

- **Local:** `.env.local`, fora do git (o `.gitignore` da raiz já cobre `.env*`).
- **Staging/Produção:** no gerenciador de variáveis da plataforma de deploy —
  ver [deploy-vps](deploy-vps.md). Nunca em arquivo no servidor, nunca no repo.
- **CI:** GitHub Actions Secrets. O CI **não precisa** de `GEMINI_API_KEY` nem
  `RESEND_API_KEY` — os testes não chamam serviço externo.

`.env.example` versionado com todas as chaves e valores vazios, para documentar o
que existe sem vazar nada.

### A regra que não pode ser quebrada

**Nenhum segredo com prefixo `NEXT_PUBLIC_`.** O prefixo injeta a variável no
bundle do cliente. É exatamente a proteção que faltava no protótipo, onde o
`define` do `vite.config.ts:12` faria isso silenciosamente
([debito-tecnico](../01-descoberta/debito-tecnico.md#rota-chat)).

Regra de lint no CI: falhar se `NEXT_PUBLIC_` aparecer junto de `KEY`, `SECRET`,
`TOKEN` ou `PASSWORD`.

## Setup local do zero

```bash
git clone <repo> && cd Atra-Website
cp web/.env.example web/.env.local     # preencher os segredos
docker compose up -d                    # Postgres + MinIO
cd web && pnpm install
pnpm payload migrate                    # cria o schema
pnpm seed                               # conteúdo de desenvolvimento
pnpm dev                                # http://localhost:3000
```

O app legado roda em paralelo, na **porta 3001** — a regressão visual precisa dos
dois no ar ao mesmo tempo. Já configurado assim em `legacy/docker-compose.yml`:

```bash
cd legacy && docker compose up -d       # http://localhost:3001
```

## Migrações de banco

Payload gera migração a partir do schema. Regras:

1. Migração **versionada no git**, nunca `push` automático em produção.
2. `pnpm payload migrate` roda no start do container, antes do Next atender.
3. Toda migração destrutiva (drop de coluna) exige backup verificado antes — ver
   [backup-e-observabilidade](backup-e-observabilidade.md).
4. Staging recebe a migração primeiro, com dado real copiado. Se quebrar lá,
   quebraria em produção.

## Notas do Next 16 (levantadas na Fase 1)

O Next 16 traz mudanças que contradizem o que boa parte da documentação e dos
modelos de linguagem "sabem" sobre Next. Registradas aqui porque afetam tarefas
já planejadas:

| Mudança | Impacto |
|---|---|
| **`middleware.ts` → `proxy.ts`**, e a função exportada passa a se chamar `proxy` | MIG-006. O runtime é `nodejs` e **não é configurável**; quem precisa de `edge` continua em `middleware` |
| **Request APIs assíncronas obrigatórias** — `params`, `searchParams`, `cookies()`, `headers()` | Já previsto nos [contratos de dados](../02-especificacao/contratos-de-dados.md); acesso síncrono foi removido de vez |
| `params` e `id` viram Promise em `icon` e `opengraph-image` | MIG-105/107 |
| **Turbopack é o padrão** | Dispensa a flag `--turbopack` nos scripts |
| Mínimos: Node 20.9+, TypeScript 5.1+ | Atendidos |
| Defaults de `next/image` mudaram (`minimumCacheTTL`, `imageSizes`) | Ver a estratégia de imagem em [docker](docker.md#custo-de-cpu-da-otimização-de-imagem) |

O pacote instala um `AGENTS.md` em `web/` avisando disso e apontando para
`node_modules/next/dist/docs/`. **Ler de lá antes de escrever código de Next** —
é a fonte que acompanha a versão instalada.

### Armadilha: tipos de rota obsoletos após mover arquivos

O Next gera um validador de rotas em `.next/dev/types/validator.ts` a partir da
árvore de `app/`. Ao **mover** um `page.tsx` ou `layout.tsx`, o validador continua
apontando para o caminho antigo e o `tsc --noEmit` falha com
`Cannot find module '.../page.js'` — mesmo com o código correto e a rota
respondendo 200.

Aconteceu duas vezes na Fase 1 (ao criar os grupos `(frontend)`/`(payload)` e ao
introduzir `[locale]`). A correção é sempre a mesma:

```bash
rm -rf .next && pnpm dev
```

Vale para o CI também: build limpo nunca vê o problema, mas quem roda typecheck
local depois de reorganizar rotas vai ver.
