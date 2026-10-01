---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [ambientes.md]
---

# Docker

## Decisão: em desenvolvimento, só as dependências vão para container

O compose de desenvolvimento sobe **Postgres e storage S3-compatível**. O Next
roda **nativo** na máquina, com `pnpm dev`.

### Por quê

| | Next nativo | Next em container |
|---|---|---|
| Hot reload | Instantâneo | Precisa de bind mount + polling; no macOS o file watching em volume é lento e falha |
| Consumo | Baixo | Docker Desktop no macOS roda uma VM: mais RAM, mais CPU, bateria |
| Depuração | Debugger do editor conecta direto | Precisa expor porta e mapear source | 
| Fidelidade com produção | Menor | Maior |

A perda de fidelidade é aceitável porque **o que varia entre máquinas é a
dependência, não o runtime**: Postgres e storage são exatamente os que precisam
ser idênticos entre desenvolvedores, e são justamente os que ficam em container.

Já sentimos o custo do caminho oposto: o legado roda em container e precisou de
`CHOKIDAR_USEPOLLING` e da porta 24678 exposta só para o HMR funcionar.

Em **produção** é o inverso: tudo em container, imagem multi-stage.

## Compose de desenvolvimento

```yaml
# docker-compose.yml (raiz)
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: atra
      POSTGRES_PASSWORD: atra
      POSTGRES_DB: atra
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U atra"]
      interval: 5s
      retries: 10

  minio:
    image: pgsty/minio:RELEASE.2026-08-04T00-00-00Z   # fork; ver nota abaixo
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: atra
      MINIO_ROOT_PASSWORD: atra12345
    ports: ["9000:9000", "9001:9001"]
    volumes: [minio:/data]

  createbucket:            # cria o bucket na primeira subida
    image: pgsty/minio:RELEASE.2026-08-04T00-00-00Z   # a mesma imagem traz o mc
    depends_on: [minio]
    entrypoint: >
      /bin/sh -c "
      mc alias set local http://minio:9000 atra atra12345 &&
      mc mb --ignore-existing local/atra-media &&
      mc anonymous set download local/atra-media"

volumes:
  pgdata:
  minio:
```

MinIO em vez de S3 real no desenvolvimento: mesma API, sem custo, sem
credencial de nuvem na máquina de ninguém, e funciona offline.

⚠️ A imagem é `pgsty/minio`, não `minio/minio`: em set/2026 o MinIO tirou as
imagens públicas do Docker Hub e do quay.io. O fork é do mesmo código e traz o
`mc`, então o `createbucket` usa a mesma imagem. O `docker-compose.yml` real
prende também o digest. Produção (`docker-compose.prod.yml` e
`infra/backup/backup.sh`) ainda aponta para `minio/minio:latest` e
`minio/mc:latest`, que só existem no cache da VPS — ver P-32.

## Dockerfile de produção

Multi-stage, com `output: 'standalone'` no `next.config.ts` — a imagem final leva
só o necessário, não o `node_modules` inteiro.

```dockerfile
FROM node:22-bookworm-slim AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm payload generate:types && pnpm build

FROM base AS runner
ENV NODE_ENV=production
RUN groupadd -r app && useradd -r -g app app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
```

Pontos que não são detalhe:

| Item | Razão |
|---|---|
| `pnpm install --frozen-lockfile` | Falha se o lock estiver fora de sync. É exatamente o problema do legado, onde `npm ci` quebrou e tivemos que cair para `npm install` |
| `pnpm lock` versionado e único | Um gerenciador só. O legado tem `bun.lock` e `package-lock.json` divergentes |
| Usuário não-root | Container rodando como root é acesso ao host se houver escape |
| `HEALTHCHECK` | A plataforma de deploy usa isso para saber quando trocar o tráfego |
| `output: 'standalone'` | Imagem de ~200 MB em vez de ~1 GB |
| `generate:types` no build | Falha o build se o tipo estiver defasado do schema |

⚠️ **`sharp` é dependência nativa.** Em `bookworm-slim` funciona com o binário
pré-compilado; se o build falhar por arquitetura (Mac ARM → servidor x86),
buildar com `--platform=linux/amd64` no CI, não localmente.

## Compose de produção

```yaml
services:
  web:
    image: ghcr.io/<org>/atra-website:${TAG}
    restart: unless-stopped
    env_file: [.env.production]
    depends_on:
      postgres: { condition: service_healthy }
    healthcheck: *health

  postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck: *pgready

  # storage: volume local servido pela plataforma, ou S3 externo — ver deploy-vps.md
```

O proxy reverso e o TLS **não** estão aqui: quem cuida disso é a plataforma de
deploy ([deploy-vps](deploy-vps.md)).

## Custo de CPU da otimização de imagem

`next/image` otimiza sob demanda, na primeira requisição de cada combinação
tamanho×formato. Numa VPS pequena, um crawler passando em 200 páginas com imagem
nova pode saturar a CPU e derrubar o tempo de resposta do site inteiro.

**Como este projeto evita o problema:**

1. **Payload já gera os tamanhos no upload** (`thumbnail`, `card`, `hero`). O
   trabalho pesado acontece uma vez, quando o editor sobe a imagem — não a cada
   visitante.
2. O componente de imagem usa **loader customizado** apontando para o tamanho
   pronto do S3, em vez de passar pelo otimizador do Next.
3. Formato moderno (WebP/AVIF) gerado **no upload**, junto com os tamanhos.
4. Se o proxy da Cloudflare for ligado (P-21), o cache de borda absorve o resto.

Ou seja: a otimização sai do caminho da requisição. É a diferença entre CPU
proporcional ao **tráfego** e CPU proporcional ao **número de uploads**.

## Sobre o compose do legado

`legacy/docker-compose.yml` continua existindo e funcionando durante toda a
migração — é o gabarito da regressão visual. Precisa mudar para a **porta 3001**
na Fase 1, senão conflita com o app novo (MIG-001).

Sai do repositório junto com `legacy/` na Fase 8.
