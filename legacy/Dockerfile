FROM node:22-bookworm-slim AS base

# better-sqlite3 é uma dependência nativa: precisa de toolchain caso não haja prebuild
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ---------- deps ----------
FROM base AS deps
# O package-lock.json versionado está fora de sync com o package.json
# (o repo usa bun.lock), então usamos `npm install` em vez de `npm ci`.
COPY package.json ./
RUN npm install --no-audit --no-fund

# ---------- dev ----------
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------- build ----------
FROM base AS build
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- prod ----------
FROM base AS prod
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
EXPOSE 3000
CMD ["npm", "run", "start"]
