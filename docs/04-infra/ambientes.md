---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [../00-contexto/decisoes.md]
---

# Ambientes

## Os três ambientes

| | Local | Staging | Produção |
|---|---|---|---|
| URL | `http://localhost:3000` | `https://staging.atra.com.br` | `https://www.atra.com.br` |
| Next | nativo (`pnpm dev`) | container | container |
| Postgres | container | container no mesmo host | container no mesmo host |
| Storage | MinIO em container | volume no host | volume no host |
| Dado | seed determinístico | **cópia da produção**, anonimizada | real |
| Acesso | — | protegido por senha (Basic Auth) + `noindex` | público |
| E-mail | logado no console | Resend em modo teste | Resend |
| Sentry | desligado | `environment: staging` | `environment: production` |

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
| `NEXT_PUBLIC_GTM_ID` | vazio | id do container | não |
| `REVALIDATE_SECRET` | `.env.local` | gerenciador do host | **sim** |
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

O app legado, enquanto existir, sobe em paralelo na porta 3000 — **conflita**.
Rodar o legado em outra porta durante a Fase 3, já que a regressão visual precisa
dos dois no ar ao mesmo tempo:

```bash
cd legacy && docker compose up -d       # ajustar para 3001 na Fase 1
```

## Migrações de banco

Payload gera migração a partir do schema. Regras:

1. Migração **versionada no git**, nunca `push` automático em produção.
2. `pnpm payload migrate` roda no start do container, antes do Next atender.
3. Toda migração destrutiva (drop de coluna) exige backup verificado antes — ver
   [backup-e-observabilidade](backup-e-observabilidade.md).
4. Staging recebe a migração primeiro, com dado real copiado. Se quebrar lá,
   quebraria em produção.
