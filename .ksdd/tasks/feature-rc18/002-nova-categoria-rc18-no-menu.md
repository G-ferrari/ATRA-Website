---
id: 002
title: Adicionar categoria/aba "RC18" ao mega-menu de Soluções
status: para implementar
feature: rc18
area: data-model
priority: P0
estimate: M
depends_on: []
feature_refs:
  - ".ksdd/features/FEATURE-rc18.md#5-impacto-em-telas-existentes"
  - ".ksdd/features/FEATURE-rc18.md#6-impacto-no-modelo-de-dados"
spec_refs:
  - ".ksdd/specs/SPEC.md#71-navegacao-global"
  - ".ksdd/specs/SPEC.md#74-solucoes-solucoes-slug"
arch_refs:
  - ".ksdd/specs/architecture.md#31-conteudo-com-pagina-propria"
  - ".ksdd/specs/architecture.md#adr-002-postgresql-drizzle-migracao-versionada-com-push-false-d-01-d-21"
---

# 002 — Adicionar categoria/aba "RC18" ao mega-menu de Soluções

## Objetivo
Criar a 4ª categoria de solução, `rc18`, para que ela apareça como uma aba própria no
painel de Soluções (desktop e gaveta mobile) e no índice `/solucoes`, ao lado de
Inovação & IA, Dados/BI e Governança & Cultura — atendendo ao "ao lado dos outros submenus".

## Escopo
- Adicionar a opção `rc18` (label PT "RC18" / EN "RC18") ao select `category` em
  `web/src/collections/Solutions.ts:51-59`.
- Adicionar a categoria ao array `GRUPOS` em `web/src/lib/mappers/navigation.ts:33-37`
  (id `rc18` + labels PT/EN), na ordem desejada (após governance-culture).
- Adicionar a categoria ao array `CATEGORIAS` em
  `web/src/app/(frontend)/[locale]/solucoes/page.tsx:59-63` (mesmo id/labels) para o
  índice agrupar corretamente.
- Rodar o fluxo D-21: `pnpm payload generate:types` → `pnpm payload migrate:create add_rc18_category`
  → **conferir o ALTER** da migração → `pnpm payload migrate`.
- Garantir que a aba RC18 com um único item `hasPage` renderize o card em destaque
  linkando direto a `/solucoes/rc18` (ajustar `PainelDeSolucoes` em
  `web/src/components/layout/mega-menu.tsx:220-286` se o comportamento de tab não passar
  a sensação de "levar direto à página").

## Fora de escopo
- Criar o documento/conteúdo da solução RC18 (é a task 003).
- Alterar a estrutura do global `Navigation` (as abas de Soluções vêm de
  `Solutions.category`, não do global — ver mapa de código).
- Remover ou renomear categorias existentes.

## Critérios de aceitação
- [ ] O select `Solutions.category` aceita `rc18` no admin.
- [ ] A migração criada é **aditiva** (`ALTER TYPE ... ADD VALUE`), versionada em
      `web/src/migrations/` e listada no `index.ts`; nenhuma remoção de coluna.
- [ ] `pnpm payload migrate` aplica sem prompt interativo; `pnpm typecheck` e `pnpm lint` verdes.
- [ ] Com um doc de solução `category: rc18, hasPage: true` publicado, a aba "RC18"
      aparece no painel de Soluções (desktop) e na gaveta mobile, e no índice `/solucoes`.
- [ ] O item RC18 dentro da aba é um `<Link>` para `/solucoes/rc18` (só quando `hasPage`).

## Notas técnicas
- As três "abas" do painel de Soluções são os valores de `Solutions.category`, hardcoded
  em **três** lugares (collection, `GRUPOS`, `CATEGORIAS`) — os três precisam do novo id
  ou a categoria some de uma das telas.
- Payload materializa `select` como enum Postgres; adicionar valor é aditivo e seguro,
  mas o gerador pode montar o ALTER num ponto inesperado — conferir antes de aplicar
  (armadilha registrada no `CLAUDE.md`).
- Grupos com 0 itens são filtrados (`mappers/navigation.ts:55`), então a aba só surge
  quando existir o doc da task 003 — validar as duas juntas no fim.

## Riscos / dependências externas
- Migração de enum: se o Drizzle transformar em pergunta interativa (não deveria por ser
  aditiva), refundir como migração aditiva manual. Nunca remover valor de enum aqui.
