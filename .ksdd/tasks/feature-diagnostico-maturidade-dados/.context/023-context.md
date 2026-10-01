# Contexto de implementação — Task 023

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/54
**Branch:** `feature/diagnostico-maturidade-dados/023-modelo` → PR para `feature/diagnostico-maturidade-dados/integracao`

## 1. Task em uma página

```yaml
id: 023
title: Modelo de dados — kind data-maturity-diagnostic, grupo do diagnóstico e global de textos
area: data-model · priority: P0 · estimate: M · depends_on: []
```

**Objetivo.** Dar ao lead do diagnóstico um lugar estruturado no banco (a "visão dos clientes" da D-35) e ao marketing um lugar no admin para os textos e o link de agenda.

**Critérios de aceitação**
- [ ] `pnpm payload migrate:create` gera só `ALTER TYPE … ADD VALUE`, colunas novas e o global; nada é removido.
- [ ] No admin, um envio `data-maturity-diagnostic` mostra o grupo do diagnóstico legível; `rc18-diagnostic` não aparece como opção nova.
- [ ] `lib/crm.ts` trata o kind novo como comercial (teste unitário).
- [ ] Global editável com Live Preview/revalidação padrão (ADR-007).
- [ ] `lint`, `typecheck`, testes verdes.

## 2. Feature spec relevante (§6)

| Entidade | Alteração | Migração |
|---|---|---|
| `FormSubmissions` | `kind`: novo valor `data-maturity-diagnostic`; `rc18-diagnostic` fica, escondido no admin | aditiva (valor de enum) |
| `FormSubmissions` | grupo `diagnostic`: setor, porte, cargo, média, nível, notas por pilar e por área DAMA, gaps por regulação e top 3, respostas (id, pilar, nota, tags, texto), roadmap, versão do questionário, duração; `resultSentAt` | aditiva (colunas / JSON) |
| `FormSubmissions` → CRM | o novo kind é comercial e sincroniza; a nota da negociação leva nível, pilares e top 3 de gaps | não |
| Global `data-maturity-diagnostic` (novo) | título, texto de abertura, texto da conclusão, assunto e abertura do e-mail, `agendaUrl` (opcional), `whatsappUrl` — localizados onde é texto | aditiva |

## 3. SPEC relevante (§4.3, §4.4) e arquitetura (§3.3, §3.4, ADR-002)

- **FormSubmissions** — "dado pessoal LGPD: `create: () => false` (só Server Action grava), `delete: isAdmin` … **Sem IP/user-agent gravado.**"
- **Globals** — Contact "não localizado de propósito"; AtraAi com texto localizado. Todo global recebe `revalidarSite` no `afterChange` por `payload.config.ts` (lista `globals`).
- **ADR-002** — "schema muda só por `migrate:create`+`migrate` … o servidor nunca trava num prompt interativo do Drizzle e a mudança é revisável em PR."

## 4. Plano de implementação

1. `src/collections/FormSubmissions.ts`
   - `kind`: opção `data-maturity-diagnostic` ("Diagnóstico de maturidade"); `filterOptions` esconde `rc18-diagnostic`, **exceto** no documento que já é `rc18-diagnostic` (registro antigo segue legível). Comentário citando D-35.
   - grupo `diagnostic` (label "Diagnóstico de maturidade"), `admin.condition` só para o kind novo, campos `readOnly`: `sector`, `size`, `role` (texto — códigos do motor), `average` (number), `level` (text), `pillars`/`dama`/`gaps`/`answers` (json), `topGaps` (textarea), `roadmap` (textarea), `version` (text), `durationSeconds` (number).
   - `resultSentAt` (date, readOnly, sidebar, mesma condição) — "vazio = o lead não recebeu o resultado".
2. `src/lib/crm.ts`: `data-maturity-diagnostic` em `KINDS_COMERCIAIS`, rótulo em `ROTULO`; a nota da negociação ganha nível, média, pilares e top 3 quando o grupo existir. Teste em `crm.test.ts`.
3. `src/globals/DiagnosticoDeMaturidade.ts` (slug `data-maturity-diagnostic`, grupo "Configuração", `access.read: () => true`): `title`, `intro`, `doneMessage`, `emailSubject`, `emailIntro` (localizados; `defaultValue` com o texto do HTML do Roger onde houver), `agendaUrl` (text, opcional), `whatsappUrl` (text, `defaultValue` = o link da RC18). Registrar em `payload.config.ts` (herda `revalidarSite`).
4. Tipo de apresentação em `types/content.ts` + mapper `lib/mappers/diagnostico.ts` + leitor `lib/diagnostico.ts` com `cache()` (padrão `lib/contato.ts`).
5. `pnpm payload generate:types` → `migrate:create add_data_maturity_diagnostic` → **ler o SQL** (só ADD VALUE / ADD COLUMN / CREATE TABLE do global) → `migrate`.

**Riscos específicos**
- Adicionar valor de enum no Postgres dentro de transação: o Payload gera `ALTER TYPE … ADD VALUE`, que já foi feito no repo (consultant-request, rc18-diagnostic) sem problema.
- Campos de mesmo rótulo em outras collections/blocos: editar por trecho exato (armadilha do CLAUDE.md) e conferir o `ALTER TABLE`.

## 5. Quality gates
- [ ] `pnpm payload migrate:create` revisado + `migrate` local
- [ ] `pnpm test`, `pnpm lint`, `pnpm typecheck`
- [ ] Build — coberto pelo CI no PR final para `migracao`
- [ ] E2E — não se aplica
- [ ] Security — FormSubmissions é PII: conferir que nada novo guarda IP/UA e que o grupo é só leitura no admin
