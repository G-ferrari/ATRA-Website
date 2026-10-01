---
id: 007
title: Captura de lead do diagnóstico (kind + Server Action + CRM)
status: cancelada
feature: rc18
area: backend
priority: P0
estimate: M
depends_on: [006]
feature_refs:
  - ".ksdd/features/FEATURE-rc18.md#7-impacto-na-api"
  - ".ksdd/features/FEATURE-rc18.md#41-da-campanha-ao-lead-qualificado-fluxo-principal"
spec_refs:
  - ".ksdd/specs/SPEC.md#5-fontes-de-dados"
  - ".ksdd/specs/SPEC.md#43-sistema-dados-sensiveis"
arch_refs:
  - ".ksdd/specs/architecture.md#4-apis-e-endpoints"
  - ".ksdd/specs/architecture.md#5-integracoes-externas"
---

# 007 — Captura de lead do diagnóstico (kind + Server Action + CRM)

> **Cancelada.** Substituída pela feature `diagnostico-maturidade-dados` (D-35, 26/09/2026).

## Objetivo
Persistir o lead do diagnóstico com o resumo do resultado e sincronizá-lo no CRM como
oportunidade comercial, seguindo o contrato de formulários do projeto.

## Escopo
- Adicionar `rc18-diagnostic` ao select `kind` de
  `web/src/collections/FormSubmissions.ts:53-66` e rodar o fluxo D-21
  (`generate:types` → `migrate:create add_rc18_diagnostic_kind` → conferir ALTER → `migrate`).
- Criar `web/src/actions/diagnostico-rc18.ts` (`'use server'`), modelada em
  `web/src/actions/formularios.ts` e `web/src/actions/chat-lead.ts`:
  anti-spam (`conferir`, honeypot + carimbo; robô recebe sucesso falso) → IP throttle →
  `payload.create({ collection: 'form-submissions', data: { kind: 'rc18-diagnostic', ... } })`
  → notifica (`enviarAviso`) → marca `notified`. Cortar campos no servidor
  (`MAX_CAMPO`/`MAX_MENSAGEM`).
- Recalcular o índice **no servidor** via `lib/diagnostico-rc18.ts` (task 005) a partir das
  respostas enviadas (não confiar no número do cliente) e gravar um **resumo legível**
  (índice + respostas por dimensão) em `message`, dentro de `MAX_MENSAGEM=5000`.
- Incluir `rc18-diagnostic` na classificação **comercial** do CRM
  (`web/src/hooks/sincronizar-crm.ts` / `web/src/lib/crm.ts`, D-29) — RH continua fora.
- Ligar o `<form>` da ilha (task 006) a esta action via `useActionState`.

## Fora de escopo
- UI/cálculo no cliente (tasks 005–006).
- Relatório do diagnóstico por e-mail (v2 — FEATURE §2.2).
- Alterar `enviarFormulario` (o contato usa `kind: contact`, task 004).

## Critérios de aceitação
- [ ] Enviar o diagnóstico grava `FormSubmissions` com `kind: rc18-diagnostic`, contato e o
      resumo (índice + por dimensão) em `message`.
- [ ] O índice gravado é **recalculado no servidor** (cliente não é fonte de verdade).
- [ ] Robô (honeypot/carimbo) recebe sucesso falso e não grava; limite por IP ativo.
- [ ] Com `RDSTATION_CRM_TOKEN`, o lead sincroniza no CRM como comercial; sem token, grava e
      fica pendente (`crm.syncedAt` vazio) — o CRM/aviso nunca derruba a gravação.
- [ ] A migração do enum `kind` é aditiva e versionada; `pnpm typecheck`, `pnpm lint` e
      `pnpm test` verdes.

## Notas técnicas
- `FormSubmissions` tem `create: () => false` (só a Server Action grava, via `overrideAccess`)
  e `afterChange: [sincronizarComCrm]` — respeitar esse caminho.
- **Sem IP/user-agent** gravado (LGPD, SPEC §4.3). IP só para throttle, via `lib/ip`
  (`X-Real-Ip` do Caddy, nunca `x-forwarded-for` primeiro).
- Contrato grava-antes-de-avisar: a ordem importa (lead perdido não volta).

## Riscos / dependências externas
- Consentimento/LGPD (P-14) — mesmo gate dos demais formulários; não bloqueia a gravação,
  mas a captura de UTM/marketing segue as regras de consentimento (D-30).
- Migração de enum `kind`: aditiva; conferir o ALTER antes de aplicar.
