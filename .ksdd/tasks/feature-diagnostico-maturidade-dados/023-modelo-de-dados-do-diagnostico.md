---
id: 023
title: Modelo de dados — kind data-maturity-diagnostic, grupo do diagnóstico e global de textos
status: concluída
feature: diagnostico-maturidade-dados
area: data-model
priority: P0
estimate: M
depends_on: []
feature_refs:
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#6-impacto-no-modelo-de-dados"
spec_refs:
  - ".ksdd/specs/SPEC.md#43-sistema--dados-sensiveis"
  - ".ksdd/specs/SPEC.md#44-globals"
arch_refs:
  - ".ksdd/specs/architecture.md#33-sistema--dados-sensiveis-acesso-restrito"
  - ".ksdd/specs/architecture.md#34-globals"
  - ".ksdd/specs/architecture.md#adr-002--postgresql--drizzle-migracao-versionada-com-push-false-d-01-d-21"
---

# 023 — Modelo de dados — kind data-maturity-diagnostic, grupo do diagnóstico e global de textos

## Objetivo
Dar ao lead do diagnóstico um lugar estruturado no banco (a "visão dos clientes" da D-35) e ao marketing um lugar no admin para os textos e o link de agenda.

## Escopo
- `FormSubmissions`:
  - novo valor de `kind`: `data-maturity-diagnostic`, classificado como **comercial** em `lib/crm.ts` (sincroniza com o RD Station CRM, D-29);
  - `rc18-diagnostic` **fica no enum**, escondido das opções do admin (filtro/condição), com os registros antigos legíveis;
  - grupo `diagnostic` (visível só para esse kind, somente leitura no admin): setor, porte, cargo, média, nível, pilares, áreas DAMA, gaps, top 3, respostas (JSON), roadmap (texto), versão, duração em segundos;
  - `resultSentAt` (data) — quando o resultado saiu para o lead.
- Global `data-maturity-diagnostic` ("Diagnóstico de maturidade"): título e texto de abertura, texto da conclusão, assunto e abertura do e-mail (localizados), `agendaUrl` (opcional; vazio = sem botão), `whatsappUrl` (padrão: o do "Falar com especialista" da RC18).
- Mapper para tipo de apresentação em `types/content.ts` (regra 3) e leitor com `cache()` como `lib/contato.ts`.
- Migração versionada **aditiva** (D-21), conferida antes de aplicar (armadilha do campo em tabela errada, CLAUDE.md).

## Fora de escopo
- Remover `rc18-diagnostic` do enum (destrutivo — CLAUDE.md).
- A action que grava (task 025).

## Critérios de aceitação
- [ ] `pnpm payload migrate:create` gera só `ALTER TYPE … ADD VALUE`, colunas novas e o global; nada é removido.
- [ ] No admin, um envio `data-maturity-diagnostic` mostra o grupo do diagnóstico legível; `rc18-diagnostic` não aparece como opção nova.
- [ ] `lib/crm.ts` trata o kind novo como comercial (teste unitário).
- [ ] Global editável com Live Preview/revalidação padrão (ADR-007).
- [ ] `lint`, `typecheck`, testes verdes.

## Notas técnicas
- Precedente de kind novo: task 011 da feature `consultores-solicitacao` (enum, migração, classificação no CRM).
- JSON no Payload/Postgres: campo `json` para respostas; o resto como colunas tipadas para permitir filtro por setor e nível no admin.
- LGPD: **não** criar campos de IP nem user agent.

## Riscos / dependências externas
- Nenhum.
