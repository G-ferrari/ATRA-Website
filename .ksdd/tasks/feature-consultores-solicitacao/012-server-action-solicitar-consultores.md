---
id: 012
title: Server Action solicitarConsultores com revalidação no servidor e aviso por e-mail
status: para implementar
feature: consultores-solicitacao
area: backend
priority: P0
estimate: M
depends_on: [011]
feature_refs:
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#71-novos-endpoints"
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#41-do-filtro-ao-pedido-fluxo-principal"
spec_refs:
  - ".ksdd/specs/SPEC.md#13-fluxos-criticos-user-journeys"
  - ".ksdd/specs/SPEC.md#11-interacoes-e-comportamentos"
arch_refs:
  - ".ksdd/specs/architecture.md#4-apis-e-endpoints"
  - ".ksdd/specs/architecture.md#7-seguranca"
---

# 012 — Server Action solicitarConsultores

## Objetivo
Persistir o pedido de consultores com o recorte legível do que foi selecionado, e
avisar o comercial — fechando o *"contato sistêmico com o que foi selecionado
pelo usuário"* pedido no feedback de 20/09.

## Escopo
- Criar `web/src/actions/consultores.ts` (`'use server'`), modelada em
  `web/src/actions/diagnostico-rc18.ts`, no contrato de `architecture.md` §4:
  **anti-spam → grava → avisa → sincroniza**, com aviso e CRM incapazes de
  derrubar a gravação.
  1. Valida e-mail; `conferir({ isca, carimbo })` (robô recebe **sucesso falso**);
     `excedeuPorIp(ipDe(await headers()))`.
  2. **Revalida os perfis no servidor**: lê os slugs recebidos, consulta
     `specialist-roles` e descarta o que não existir. Quantidade por perfil
     saneada para inteiro em `1..20`.
  3. Monta o resumo legível (cargo, nível, quantidade) a partir **do banco**,
     concatena a duração em meses e o texto livre do visitante, e grava em
     `message` dentro de `MAX_MENSAGEM=5000`.
  4. `payload.create({ collection: 'form-submissions', data: { kind:
     'consultant-request', email, name, phone, company, message, source, utm } })`.
  5. `enviarAviso` (`web/src/lib/email.ts`) com o pedido completo — perfis,
     quantidades, duração e texto livre.
- **Recusa** envio sem nenhum perfil **e** sem texto livre, com mensagem clara.
- Corte de campos no servidor: `MAX_CAMPO=200`, `MAX_MENSAGEM=5000`,
  UTM em `MAX_POR_VALOR`.
- Testes unitários da montagem do resumo e do saneamento de quantidade/slug.

## Fora de escopo
- UI e ligação do `<form>` (task 013).
- Sincronização com o CRM: é o hook `afterChange` de `form-submissions`,
  já resolvido na task 011.
- Campo estruturado `requestedProfiles` (FEATURE §2.2).

## Critérios de aceitação
- [ ] Envio válido grava `FormSubmissions` com `kind: consultant-request`,
      contato, `source`, UTM e `message` com perfis + quantidades + duração +
      texto livre.
- [ ] Slug de perfil inexistente é **descartado**, e o resumo sai do banco, não
      do que o cliente mandou.
- [ ] Quantidade fora de `1..20` ou não numérica é saneada, não aceita.
- [ ] Envio sem perfis e sem texto livre retorna erro legível e **não grava**.
- [ ] Honeypot ou carimbo preenchidos → `{ ok: true }` **sem gravar nada**.
- [ ] Estouro do limite por IP → `{ ok: true }` sem gravar.
- [ ] Falha de `enviarAviso` **não** derruba a gravação.
- [ ] Sem `RDSTATION_CRM_TOKEN`, o lead grava e `crm.syncedAt` fica vazio.
- [ ] `pnpm test` cobre resumo e saneamento; `pnpm lint` e `pnpm typecheck` passam.

## Notas técnicas
- ⚠️ **Server Action é endpoint público** (MIG-142): nada do que o cliente manda
  é confiável. Mesmo motivo pelo qual `diagnostico-rc18.ts` recalcula o índice no
  servidor em vez de aceitar o número enviado.
- ⚠️ **Nunca ler `x-forwarded-for` primeiro** — usar `ipDe` de `web/src/lib/ip.ts`
  (MIG-140).
- Destino do aviso: `contact.email` do CMS via `lerContato()`, como fazem os
  demais formulários. Não inventar variável de ambiente nova sem pedido.
- `payload.find` em `specialist-roles` com `depth: 0` e `select` do necessário —
  o adapter Postgres faz `LEFT JOIN LATERAL` por tipo de bloco mesmo com
  `depth: 0`. A collection é `isPublic` e sem drafts, então **não** precisa do
  filtro `_status` da regra 4 — diferente de toda collection com rascunho.
- Robô barrado recebe sucesso: dizer "você foi barrado" entrega o critério.

## Riscos / dependências externas
- **P-14** (política de privacidade) — bloqueia o rollout em **produção**, não a
  implementação nem homologação. Mesmo gate de D-29/D-30.
- `RESEND_API_KEY` ausente: lead grava e fica pendente, por desenho.
