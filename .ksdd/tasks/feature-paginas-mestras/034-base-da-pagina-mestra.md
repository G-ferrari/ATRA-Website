---
id: 034
title: Marcar e proteger as páginas-mestras em `pages`, com Live Preview
status: para implementar
feature: paginas-mestras
area: data-model
priority: P0
estimate: M
depends_on: []
feature_refs:
  - ".ksdd/features/FEATURE-paginas-mestras.md#2-escopo"
  - ".ksdd/features/FEATURE-paginas-mestras.md#6-impacto-no-modelo-de-dados"
  - ".ksdd/features/FEATURE-paginas-mestras.md#9-dependencias-e-riscos"
spec_refs:
  - ".ksdd/specs/SPEC.md#2-personas"
  - ".ksdd/specs/SPEC.md#4-modelo-de-dados"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-002--postgresql--drizzle-migração-versionada-com-push-false-d-01-d-21"
  - ".ksdd/specs/architecture.md#adr-007--revalidação-em-processo-ao-publicar-mig-143"
---

# 034 — Marcar e proteger as páginas-mestras em `pages`, com Live Preview

## Objetivo
Dar à collection `pages` a noção de "página-mestra de uma seção", com as travas pedidas (não apagar; endereço travado) e Live Preview — a base que as outras tasks usam.

## Escopo
- Campo "Página-mestra de" em `pages` (select: solucoes, segmentos, consultores, insights, blog, webinars, cases, midia, ebooks, carreiras; vazio = página comum), na barra lateral, só leitura para editor.
- Apagar página-mestra recusado no botão e na API (hook `beforeDelete` ou `access.delete` por documento), com mensagem em português.
- Slug travado quando o campo está preenchido (somente leitura no admin + validação no servidor), com descrição explicando que renomear a seção é pedido ao time técnico (D-43).
- Aviso ao despublicar: descrição visível no documento de página-mestra dizendo que a seção sai do ar e que menu/rodapé seguem apontando para ela.
- Coluna "Página-mestra" na lista de Páginas.
- Live Preview e botão "Visualizar" em `pages`, com URL resolvida pela seção (`hrefDe`) ou pelo slug, no padrão de `lib/preview.ts` dos cases.
- Migração de schema (`pnpm payload migrate:create`) + migração antecipada idempotente datada antes da primeira migração de dados (a armadilha do banco novo).

## Fora de escopo
- Os blocos novos (035).
- Criar os documentos das páginas (041).

## Critérios de aceitação
- [ ] Editor vê o campo mas não altera; admin altera.
- [ ] Apagar uma página-mestra pela UI e pela API retorna erro com a mensagem; página comum continua apagável.
- [ ] Slug de página-mestra não muda nem pela UI nem pela API (PT e EN).
- [ ] Live Preview abre a página certa para página-mestra e para página comum (/sobre).
- [ ] `pnpm migrate` num banco zerado passa.
- [ ] Testes unitários das regras de trava.

## Notas técnicas
Ver `src/collections/Pages.ts`, `src/lib/preview.ts` (`urlDePreview` dos cases) e o precedente das migrações antecipadas (`20260927_215400_partner_showcase_source`, `…_solutions_badge`). Campo novo em `pages` vira coluna lida por toda consulta a páginas — por isso a migração antecipada é obrigatória.

## Riscos / dependências externas
Despublicar continua possível por decisão (05/10); a defesa é o aviso.
