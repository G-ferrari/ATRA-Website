---
id: 041
title: Criar as páginas-mestras por migração de dados e no seed
status: em revisão
feature: paginas-mestras
area: backend
priority: P0
estimate: M
depends_on: [036, 037, 038, 039, 040]
feature_refs:
  - ".ksdd/features/FEATURE-paginas-mestras.md#2-escopo"
  - ".ksdd/features/FEATURE-paginas-mestras.md#6-impacto-no-modelo-de-dados"
  - ".ksdd/features/FEATURE-paginas-mestras.md#10-criterios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#4-modelo-de-dados"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-002--postgresql--drizzle-migração-versionada-com-push-false-d-01-d-21"
---

# 041 — Criar as páginas-mestras por migração de dados e no seed

## Objetivo
Fazer as 8 páginas-mestras nascerem nos ambientes que já existem (homologação, produção) e no banco novo do CI, com os textos de hoje, e marcar Carreiras e Insights.

## Escopo
- Migração de dados com trava: cria a página-mestra de cada seção só se não existir (pela seção e pelo slug); PT e EN com os slugs de `lib/routes.ts`; publicada.
- Marca `carreiras` e `insights` como páginas-mestras sem tocar no conteúdo delas; converte a Insights para as faixas automáticas.
- Seed chama a mesma função (banco do CI).
- `pnpm migrate` num banco zerado passa.

## Fora de escopo
- Reescrever texto (D-22).

## Critérios de aceitação
- [ ] Na homologação simulada (banco com as 2 páginas existentes editadas), a migração cria as 8, marca as 2 e não altera o conteúdo delas.
- [ ] Rodar de novo não muda nada.
- [ ] Banco zerado: migrate + seed deixam as 10 páginas-mestras.

## Notas técnicas
Conteúdo em `src/migrations/arquivos/paginas-mestras/` (um módulo por seção, escrito nas tasks 036–040), lido pela migração e pelo seed — o padrão de `rc18-conteudo.ts`.

## Riscos / dependências externas
A homologação pode ter edições no admin em Carreiras/Insights: a trava é não tocar no layout delas além do bloco da Insights.
