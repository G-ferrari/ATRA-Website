---
id: 031
title: Agrupar os blocos no seletor e ordenar alfabeticamente dentro de cada grupo
status: em revisão
feature: seletor-de-secoes
area: frontend
priority: P0
estimate: S
depends_on: []
feature_refs:
  - ".ksdd/features/FEATURE-seletor-de-secoes.md#21-o-que-entra-v1"
  - ".ksdd/features/FEATURE-seletor-de-secoes.md#62-alteracoes-em-entidades-existentes"
spec_refs:
  - ".ksdd/specs/SPEC.md#21-marina--editora-de-marketing-usuaria-primaria-do-cms"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-002--postgresql--drizzle-migracao-versionada-com-push-false-d-01-d-21"
---

# 031 — Agrupar os blocos no seletor e ordenar alfabeticamente dentro de cada grupo

## Objetivo
Na tela "Adicionar Seção", a editora encontra o bloco pelo que ele faz: grupos com título e, dentro de cada um, ordem alfabética pelo rótulo em português. Entrega valor sozinha, antes das miniaturas.

## Escopo
- `admin.group` (PT/EN) em cada um dos 28 blocos de `web/src/blocks/index.ts`, com os grupos de FEATURE §2.1 — confirmar a lista com G-ferrari antes de fechar.
- `BLOCOS` exportado em ordem de grupo e, dentro do grupo, alfabética pelo rótulo PT (ordenação no código, não à mão, para bloco novo cair no lugar certo).
- Teste unitário: todo bloco tem grupo; a ordem de `BLOCOS` é a esperada.
- Conferir que a busca "Procurar bloco" continua filtrando com grupos.

## Fora de escopo
- Miniaturas (033).
- Renomear blocos (rótulo é o que a busca usa; mudar nome é outra conversa).

## Critérios de aceitação
- [ ] No admin, o drawer mostra os grupos com título e a ordem alfabética dentro de cada um.
- [ ] `pnpm payload migrate:create --skip-empty` não gera migração depois da reordenação.
- [ ] `pnpm generate:types` sem mudança de campo (só a ordem da união, se houver).
- [ ] Teste reprova bloco sem `admin.group`.
- [ ] `lint`, `typecheck`, `test` verdes.

## Notas técnicas
- Payload 3.88: `admin.group?: Record<string, string> | string`; o `BlockSelector` agrupa por rótulo traduzido e mantém a ordem de chegada — por isso a ordenação é nossa.
- `BLOCOS` é usado por `pages`, `solutions`, `segments` e `partners`; tabelas de bloco são por slug, a ordem não entra no schema — mas conferir, é o risco de FEATURE §9.2.

## Riscos / dependências externas
- Nenhum.
