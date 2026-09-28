# Contexto de implementação — Task 031

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/77
**Branch:** `feature/seletor-de-secoes/031-grupos-e-ordem` → PR para `feature/seletor-de-secoes/integracao`

## 1. Task em uma página

```yaml
id: 031 · area: frontend · priority: P0 · estimate: S · depends_on: []
```

**Objetivo:** no drawer "Adicionar Seção", grupos com título e ordem alfabética (rótulo PT) dentro de cada grupo.

**Critérios de aceitação**
- [ ] Drawer mostra os grupos com título e ordem alfabética dentro de cada um.
- [ ] `migrate:create --skip-empty` não gera migração.
- [ ] `generate:types` sem mudança de campo.
- [ ] Teste reprova bloco sem `admin.group`.
- [ ] `lint`, `typecheck`, `test` verdes.

## 2. Feature spec relevante (§2.1)

Grupos propostos (aprovados por G-ferrari com o FEATURE em 27/09):
- **Abertura e navegação** — Abertura de página, Abertura de parceiro, Herói da home, Menu da página
- **Texto e cards** — Texto com imagem, Grade de cards, Cards de valores, Cards de metodologia, Grade bento, Para quem é, Abas de destaque
- **Etapas** — Etapas de processo, Etapas em acordeão
- **Prova: números, selos e parceiros** — Números, Faixa de selos, Grade de imagens, Vitrine de parceiros, Faixa de logos, Seção de parceiro
- **Carrosséis e vitrines** — Carrossel de destaques, Carrossel de cases, Carrossel de depoimentos, Vitrine de conteúdo, Hub de insights, Bento da home
- **Chamadas e contato** — Faixa de chamada, Contato com formulário, Lista de vagas

§6.2: reordenar `BLOCOS` não pode gerar migração (tabelas de bloco são por slug).

## 3. Arquitetura relevante

ADR-002 — PostgreSQL + Drizzle, migração versionada com `push: false` (D-01, D-21): toda mudança de schema passa por `migrate:create`; aqui a expectativa é **nenhuma**.

## 4. Payload 3.88 (lido em `node_modules`)

- `Block.admin.group?: Record<string, string> | string` — o `BlockSelector` (`@payloadcms/ui/.../BlockSelector/index.js`) agrupa por rótulo traduzido, na **ordem de chegada** do array; não ordena.
- A busca "Procurar bloco" (`BlockSearch`) filtra pelo rótulo e convive com grupos.

## 5. Plano de implementação

- `web/src/blocks/index.ts`: tabela `GRUPOS` (ordem dos grupos + rótulos PT/EN) e `GRUPO_DO_BLOCO` (slug → grupo), com `satisfies` para o TypeScript reprovar bloco esquecido. `BLOCOS` passa a ser montado aplicando `admin.group` e ordenando por (ordem do grupo, rótulo PT com `localeCompare('pt')`).
- `web/src/blocks/index.test.ts`: todo bloco tem grupo; a ordem é por grupo e alfabética dentro dele; nenhum slug sem grupo.
- Conferir `migrate:create --skip-empty` e `generate:types`.
- Conferir no admin local (drawer) com captura.

## 6. Quality gates
- [ ] `pnpm lint` · `pnpm typecheck` · `pnpm test`
- [ ] `pnpm payload migrate:create --skip-empty` sem arquivo novo
- [ ] Drawer conferido no admin local
- [ ] CI (build de produção + e2e)
