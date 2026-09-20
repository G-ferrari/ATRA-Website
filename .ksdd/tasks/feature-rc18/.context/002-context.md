# Context — Task 002: categoria/aba "RC18" no mega-menu de Soluções

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/4
**Branch:** feature/rc18 · **Base:** migracao

## 1. Task em uma página

- **id 002** · area `data-model` · P0 · estimate M · depends_on: []
- **Objetivo:** criar a 4ª categoria de solução `rc18`, para aparecer como aba própria no
  painel de Soluções (desktop + gaveta mobile) e no índice `/solucoes`.
- **Escopo:** opção `rc18` no select `Solutions.category`; adicionar aos arrays `GRUPOS`
  (nav mapper) e `CATEGORIAS` (índice); migração aditiva; garantir que a aba com item único
  linke direto a `/solucoes/rc18`.
- **Fora de escopo:** conteúdo/doc da solução (003); estrutura do global `Navigation`.

## 2. Feature spec relevante (FEATURE-rc18 §5, §6)

- As "abas" do painel de Soluções **são** os valores de `Solutions.category`, hardcoded em
  **três** lugares: `collections/Solutions.ts`, `lib/mappers/navigation.ts` (`GRUPOS`),
  `app/(frontend)/[locale]/solucoes/page.tsx` (`CATEGORIAS`). Os três precisam do novo id.
- Migração **aditiva** de enum (`Solutions.category += rc18`). Sem remoção de coluna.
- Grupos com 0 itens são filtrados (`mappers/navigation.ts:55`) → a aba só surge quando o
  doc da 003 existir. Verificar 002+003 juntas no fim.

## 3. SPEC relevante (§7.1, §7.4)

- Header com mega-menu (global `Navigation`; painéis de Soluções alimentados pela collection
  `solutions`). Gaveta mobile. §7.4: índice de soluções + página por `hasPage`.

## 4. Arquitetura relevante (ADR-002, §3.1)

- **ADR-002 — Postgres + Drizzle, `push:false` (D-01/D-21):** schema muda só por
  `migrate:create` + `migrate`. CI roda `payload migrate` antes do build. Consequência: uma
  etapa a mais por mudança de campo; o servidor nunca trava em prompt interativo do Drizzle.
- `Solutions.category` é `select` → enum Postgres. Adição de valor = `ALTER TYPE ... ADD VALUE`.

## 5. Design

- Nenhum token novo. Reusa o componente `mega-menu.tsx` (`PainelDeSolucoes`) e o índice.
  A aba RC18 herda o visual das demais. Cor sempre em par claro/escuro (DESIGN.md).

## 6. Plano de implementação

**Ordem (o tipo gerado precisa existir antes dos arrays compilarem):**
1. `web/src/collections/Solutions.ts` — adicionar `{ value: 'rc18', label: { pt: 'RC18', en: 'RC18' } }`
   ao select; atualizar o comentário que dizia "criar uma quarta muda a navegação" para
   registrar RC18 como 4ª categoria sancionada (feature rc18).
2. `docker compose exec -T web pnpm payload generate:types` → regenera `payload-types.ts`
   (mount `./web:/app` reflete no host). Agora `'rc18'` é tipo válido.
3. `web/src/lib/mappers/navigation.ts` — `GRUPOS += { id: 'rc18', pt: 'RC18', en: 'RC18' }` (após governance-culture).
4. `web/src/app/(frontend)/[locale]/solucoes/page.tsx` — `CATEGORIAS += { id: 'rc18', label: { pt:'RC18', en:'RC18' } }`.
5. `web/src/components/layout/mega-menu.tsx` (`PainelDeSolucoes`) — garantir que a aba RC18,
   com item único `hasPage`, apresente o card linkando direto a `/solucoes/rc18` (ajuste só
   se o comportamento atual não passar a sensação de "levar direto à página").
6. `docker compose exec -T web pnpm payload migrate:create add_rc18_category` → **inspecionar
   o SQL** (esperado: `ALTER TYPE ... ADD VALUE 'rc18'`) antes de aplicar.
7. `docker compose exec -T web pnpm payload migrate`.

**Arquivos:** 3 edições de array + comentário + 1 migração nova em `web/src/migrations/`
(+ entrada no `index.ts`, gerada). Sem testes unitários novos (é config/schema).

**Riscos:** migração interativa (mitigar: aditiva; rodar sem TTY e conferir que não pendura);
enum down migration (Postgres não remove valor de enum facilmente — conferir o down gerado).

## 7. Quality gates

- [ ] `pnpm payload migrate:create` gera ALTER aditivo (inspecionado)
- [ ] `pnpm payload migrate` aplica sem pendurar
- [ ] `pnpm typecheck` verde
- [ ] `pnpm lint` verde
- [ ] code-reviewer (diff pequeno; opcional para config)
