# Imagem de produção do site novo. Ver docs/04-infra/docker.md.
#
# ⚠️ O contexto de build é a **raiz do repositório**, não `web/`:
#
#     docker build -t atra-website:<sha> .
#
# O motivo é o `redirects.csv`, que mora em `docs/` de propósito (é
# especificação, não código) e é lido **duas vezes**: pelo `next.config.ts` no
# build e pelo `proxy.ts` na inicialização do processo. Com o contexto em `web/`
# o arquivo fica fora do alcance do COPY e o site sobe **sem** os 261 redirects
# do WordPress — sem erro nenhum, porque `lerRedirects` avisa no log e devolve
# lista vazia. É a mesma armadilha que já pôs o serviço `web` do compose de
# desenvolvimento em laço de reinício.
#
# ⚠️ O build **exige um Postgres migrado e acessível**. Não é opcional: as 491
# páginas são pré-renderizadas, `generateStaticParams` consulta as collections,
# e com `push: false` (D-21) o schema só existe se as migrações rodaram. Sem
# isso o build morre em `select ... from "cases"` — a armadilha que o CI já
# pagou. Na VPS, com o Postgres do compose publicando 5432 no host:
#
#     docker build --network=host \
#       --build-arg DATABASE_URI=postgres://atra:atra@localhost:5432/atra \
#       -t atra-website:<sha> .

FROM node:22-bookworm-slim AS base
RUN corepack enable
WORKDIR /app

# ── dependências ──────────────────────────────────────────────────────────────
# Estágio próprio para o cache do Docker sobreviver a mudança de código: só
# invalida quando o manifesto muda, não a cada edição de componente.
FROM base AS deps
# ⚠️ `pnpm-workspace.yaml` junto — esquecê-lo custou três builds.
#
# É dele que sai o `allowBuilds`, e sem o arquivo aqui o pnpm 11 reprova a
# instalação com `ERR_PNPM_IGNORED_BUILDS`: `strictDepBuilds` vem ligado por
# padrão e transforma "dependência com script de instalação não decidido" em
# erro. Quem desenvolve nunca vê isso, porque nunca instala do zero — o
# `node_modules` já está lá. A imagem de produção é a primeira instalação limpa
# que este repositório faz.
COPY web/package.json web/pnpm-lock.yaml web/pnpm-workspace.yaml ./
# --frozen-lockfile falha se o lock estiver fora de sync. É a mesma regra do CI,
# e é o que quebrou o `npm ci` no legado.
RUN pnpm install --frozen-lockfile

# ── build ─────────────────────────────────────────────────────────────────────
# Este estágio guarda o `node_modules` completo e o CLI do Payload. O compose de
# staging usa ele como alvo (`target: build`) para rodar as migrações antes de o
# site subir — o `runner` não serve para isso, ver o comentário lá embaixo.
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY web/ ./
# `docs/` em `/docs`, que é o segundo caminho que `next.config.ts` e `proxy.ts`
# procuram quando `../docs` não existe. No container só `web/` é a raiz do app,
# então é sempre este que resolve.
COPY docs/ /docs/

ENV NEXT_TELEMETRY_DISABLED=1

# O único que precisa de valor real: o build lê o banco.
ARG DATABASE_URI
ENV DATABASE_URI=$DATABASE_URI

# ⚠️ Valores de fachada, de propósito. O build **lê** dado, não assina sessão
# nem sobe arquivo, e `buildConfig` recusa subir sem `secret`. Os segredos de
# verdade entram como variável de ambiente do container em execução — nunca como
# `--build-arg`, que fica gravado em `docker history` para sempre.
ENV PAYLOAD_SECRET=nao-usado-no-build
ENV S3_ACCESS_KEY=nao-usado-no-build
ENV S3_SECRET_KEY=nao-usado-no-build

ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ARG S3_ENDPOINT
ENV S3_ENDPOINT=$S3_ENDPOINT
ARG S3_BUCKET
ENV S3_BUCKET=$S3_BUCKET

# Sentry (MIG-122). O DSN do navegador entra no bundle, logo é build-arg; o
# `release` é o SHA do deploy, para o painel ligar erro a commit. Nenhum dos
# dois é segredo — o `SENTRY_DSN` do servidor vem como variável do container.
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ARG SENTRY_RELEASE
ENV SENTRY_RELEASE=$SENTRY_RELEASE

# Os dois geradores antes do build, pelos motivos que o CI já documenta: tipo
# defasado do schema reprova o build, e importMap defasado quebra campo do admin
# **em silêncio**.
RUN pnpm generate:types && pnpm generate:importmap && pnpm build

# ── dependências de produção ──────────────────────────────────────────────────
# O runner copia o node_modules inteiro porque o tracing do standalone não
# funciona com o layout do pnpm (ver o comentário no runner). Mas "inteiro" não
# precisa incluir as dependências de desenvolvimento — Playwright, ESLint e
# afins não servem a nenhuma requisição. `--prod` refaz a instalação só com o
# que o runtime declara.
FROM base AS prod-deps
COPY web/package.json web/pnpm-lock.yaml web/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

# ── migrador ──────────────────────────────────────────────────────────────────
# Código e dependências, **sem** `pnpm build`. Existe por um problema de ordem
# que só aparece no primeiro deploy: o estágio `build` roda `pnpm build`, que
# pré-renderiza 563 páginas lendo o banco, e com `push: false` (D-21) o schema
# só existe depois das migrações. Usar `target: build` para migrar funciona a
# partir do segundo deploy e é impossível no primeiro — o banco está vazio e a
# imagem que migraria ainda não pôde ser construída.
#
# Serve também para o que mais precisa de código e banco sem precisar de site:
# `pnpm seed` e os importadores de `scripts/wp-import/`.
FROM base AS migrator
COPY --from=deps /app/node_modules ./node_modules
COPY web/ ./
COPY docs/ /docs/
ENV NEXT_TELEMETRY_DISABLED=1
CMD ["pnpm", "migrate"]

# ── runtime ───────────────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# O mesmo SHA do estágio de build, lido em tempo de execução pelo SDK do servidor.
ARG SENTRY_RELEASE
ENV SENTRY_RELEASE=$SENTRY_RELEASE

# Container como root é acesso ao host se houver escape do container.
RUN groupadd -r app && useradd -r -g app app

# O `standalone` já traz o `server.js` e só o `node_modules` que o tracing provou
# necessário. `static/` e `public/` ficam de fora dele por design e vão à mão.
COPY --from=build --chown=app:app /app/.next/standalone ./
# ⚠️ O `node_modules` **completo** por cima do que o `standalone` trouxe, e isto
# é deliberado: o rastreamento de arquivos do Next não funciona com o layout do
# pnpm. Ele copia o symlink de `.pnpm/` sem o destino, e copia pacote pela
# metade — `@swc/helpers` veio só com `cjs/`, sem o `esm/` que o código pede.
# Cada pacote consertado à mão revelava o próximo (`@swc/helpers` → `@next/env`),
# e nenhum deles aparece antes de o container subir, porque em desenvolvimento o
# `node_modules` inteiro está no disco.
#
# As dependências vêm do estágio `prod-deps` — a mesma instalação, sem as de
# desenvolvimento. O layout do pnpm é determinístico para o mesmo lockfile,
# então os caminhos dentro de `.pnpm/` que o código compilado gravou continuam
# resolvendo.
COPY --from=prod-deps --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public

# ⚠️ `docs/` também no runtime, e não é redundância: o `proxy.ts` lê o CSV na
# inicialização do processo para saber quais URLs respondem 410. O tracing do
# Next não enxerga esse caminho — ele é montado com `existsSync` em tempo de
# execução —, então nenhum COPY automático traria o arquivo.
COPY --from=build --chown=app:app /docs /docs

USER app
EXPOSE 3000
# O server do standalone escuta em localhost por padrão, o que de dentro de um
# container significa "ninguém alcança".
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# ⚠️ `start-period` alto de propósito: a primeira requisição instancia o Payload
# e abre o pool do Postgres. Um período curto derruba o container durante a
# própria subida, e a plataforma interpreta como deploy quebrado.
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
