---
id: 003
title: Criar a página de solução RC18 (blocos CMS + seed idempotente)
status: em revisão
feature: rc18
area: frontend
priority: P0
estimate: L
depends_on: [002]
feature_refs:
  - ".ksdd/features/FEATURE-rc18.md#52-telas-novas"
  - ".ksdd/features/FEATURE-rc18.md#2-escopo"
spec_refs:
  - ".ksdd/specs/SPEC.md#74-solucoes-solucoes-slug"
  - ".ksdd/specs/SPEC.md#8-componentes-globais-reutilizaveis"
arch_refs:
  - ".ksdd/specs/architecture.md#6-pipelines-jobs-assincronos"
  - ".ksdd/specs/architecture.md#adr-009-componente-nao-conhece-o-cms-mappers-como-fronteira-regra-3"
---

# 003 — Criar a página de solução RC18 (blocos CMS + seed idempotente)

## Objetivo
Publicar a página `/solucoes/rc18` como um documento da coleção `Solutions`, montada por
blocos existentes, com conteúdo (rascunho a partir do `RC18_2026.pdf`) que passe o
processo de consultoria — editável depois pelo marketing no CMS (D-22).

## Escopo
- Criar `web/scripts/seed/solucoes-rc18.ts` modelado em `web/scripts/seed/solucao-ia.ts`:
  cria/atualiza (upsert por slug) o doc RC18 com `category: 'rc18'`, `slug: 'rc18'` (PT) e
  slug EN, `hasPage: true`, `icon` (do select fechado), `shortDescription`, `order`, `seo`,
  `_status: 'published'`, e a `layout` de blocos.
- Layout por blocos existentes (ver FEATURE §5.2): `pageHero` → `stickyPageNav` →
  `richTextSection`/`iconCardGrid` ("o que a norma exige") → `bentoGrid`/`iconCardGrid`
  (arquitetura Google Cloud: BigQuery, Knowledge Catalog, Dataform, Datastream+Pub/Sub,
  Looker) → `methodCards`/`accordionSteps` (roadmap 4 fases: Diagnóstico → Fundação →
  Evidência → Sustentação) → `valueCards`/`audienceSplit` ("por que ATRA": 15+ anos, 140+
  profissionais, parceiro oficial Google Cloud) → `ctaBanner` (variante dark, `secondaryCta`
  "Fazer diagnóstico gratuito" → `/diagnostico-rc18`) → `ctaContact` (contato; o cartão vem
  na task 004).
- Escrever PT completo e **EN stub** (herói + nota), preservando ids entre locales com
  `casarIds` (`web/scripts/seed/ids.ts`).
- Registrar o seed no array `SEEDS` de `web/scripts/seed/run.mjs` (não fixture-gated;
  conteúdo real, como `solucao-ia.ts`), idempotente.
- Usar mídia placeholder onde precisar de imagem (`capa-pendente`/monograma, D-27), via
  `scripts/seed/midia.ts`.

## Fora de escopo
- Criar bloco de conteúdo novo (usar variantes de blocos existentes — DESIGN.md "Don'ts").
- Implementar o diagnóstico e a Server Action de lead (tasks 005–007).
- Popular o cartão de contato do `ctaContact` (task 004).
- Tradução EN completa (fica para depois — FEATURE §2.2).

## Critérios de aceitação
- [ ] `pnpm seed` cria/atualiza o doc RC18 de forma idempotente (rodar 2× não duplica).
- [ ] `/solucoes/rc18` responde 200 (PT), renderiza todos os blocos e cobre norma,
      arquitetura Google Cloud, 4 fases e "por que ATRA".
- [ ] O doc aparece na aba RC18 do menu (task 002) e no índice `/solucoes`.
- [ ] A página é editável no admin (Soluções → RC18) e o Live Preview reflete os blocos.
- [ ] O `ctaBanner` tem o botão "Fazer diagnóstico gratuito" apontando para
      `/diagnostico-rc18` (via `hrefDe`).
- [ ] EN resolve (stub), sem 404 nem erro de build; slugs PT/EN gravados nos dois locales.
- [ ] `pnpm typecheck` e `pnpm lint` verdes.

## Notas técnicas
- A rota `[slug]` já filtra `_status: { equals: 'published' }` (regra 4); nada a mudar nela
  para o conteúdo aparecer — só o doc publicado.
- Toda URL vem de `hrefDe('solucoes', locale, slug)` e `hrefDe('diagnosticoRc18', locale)`
  (regra 6) — não escrever URL à mão nos blocos.
- Escrever a `layout` PT e depois EN reenviando **todos** os ids (items/metrics/bullets),
  senão o texto localizado some (armadilha `casarIds`).
- Consulta de índice usa `select` estreito (armadilha do `LEFT JOIN LATERAL` por bloco) —
  não alterar isso.

## Riscos / dependências externas
- **Lista oficial das 12 dimensões da RC 18/2025** (o OCR do one-page do PDF está ilegível):
  confirmar na norma/marketing antes de fixar o texto da seção "o que a norma exige".
- Cópia é rascunho (D-22): marketing consolida no CMS.
