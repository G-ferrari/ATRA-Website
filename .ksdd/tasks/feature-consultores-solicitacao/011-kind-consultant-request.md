---
id: 011
title: kind consultant-request — enum, migração e classificação comercial no CRM
status: concluída
feature: consultores-solicitacao
area: data-model
priority: P0
estimate: S
depends_on: []
feature_refs:
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#62-alteracoes-em-entidades-existentes"
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#72-endpoints-modificados"
spec_refs:
  - ".ksdd/specs/SPEC.md#4-modelo-de-dados"
  - ".ksdd/specs/SPEC.md#5-fontes-de-dados"
arch_refs:
  - ".ksdd/specs/architecture.md#3-modelo-de-dados-schemas"
  - ".ksdd/specs/architecture.md#5-integracoes-externas"
---

# 011 — kind consultant-request: enum, migração e classificação comercial no CRM

## Objetivo
Dar ao pedido de consultores uma origem própria em `FormSubmissions` e fazê-lo
sincronizar no RD Station CRM como qualquer lead comercial.

## Escopo
- Acrescentar `{ value: 'consultant-request', label: { pt: 'Solicitação de
  consultores', en: 'Consultant request' } }` ao select `kind` em
  `web/src/collections/FormSubmissions.ts:53-66`.
- Rodar o fluxo D-21 completo:
  `pnpm payload generate:types` →
  `pnpm payload migrate:create add_consultant_request_kind` →
  **conferir o `ALTER TABLE` gerado** → `pnpm payload migrate`.
- Incluir `consultant-request` em `KINDS_COMERCIAIS`
  (`web/src/lib/crm.ts:63`) — RH continua fora (D-29).
- Acrescentar o rótulo legível da origem no mapa de `web/src/lib/crm.ts:102`,
  para a negociação no CRM.

## Fora de escopo
- Server Action e gravação do lead (task 012).
- Campo estruturado `requestedProfiles` — v1 usa `message` (FEATURE §2.2).
- Qualquer mudança em `hooks/sincronizar-crm.ts`: o `afterChange` já cobre todo
  kind comercial.

## Critérios de aceitação
- [ ] `consultant-request` aparece no select "Origem" do admin, em PT e EN.
- [ ] A migração é **aditiva** e o `ALTER TABLE` foi lido antes de aplicar.
- [ ] `pnpm payload migrate` roda limpo em base com dados.
- [ ] `payload-types.ts` regenerado e commitado.
- [ ] `ehComercial` classifica `consultant-request` como comercial e o rótulo da
      origem aparece no payload enviado ao CRM.
- [ ] `pnpm typecheck` e `pnpm test` passam.

## Notas técnicas
- ⚠️ **Migração aditiva, sempre.** Remover valor de enum vira pergunta
  interativa do drizzle, que não roda sem TTY e trava o gerador sem imprimir
  nada.
- ⚠️ Conferir o `ALTER TABLE` **antes** de aplicar: vários blocos têm campos com
  o mesmo rótulo, e edição por `replace` já fez migração tocar tabela errada. Se
  já aplicou, `pnpm payload migrate:down` desfaz só a última.
- `push: false` é o padrão do projeto (D-21): `pnpm dev` **não** sincroniza
  schema. Esquecer a migração produz `column ... does not exist` em runtime com o
  servidor de pé.
- Build do CI falha em `select from "cases"` quando o Postgres está vazio: rodar
  `pnpm payload migrate` antes.

## Riscos / dependências externas
- Nenhuma. `RDSTATION_CRM_TOKEN` ausente deixa o hook inerte com
  `crm.syncedAt` vazio, que é o comportamento desejado (D-29).
