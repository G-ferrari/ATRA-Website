# Context — Task 011: kind `consultant-request`

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/15
**Branch:** `feature/consultores-solicitacao/011-kind-consultant-request`
**Base:** `feature/consultores-solicitacao/009-filtro-multiselecao` — ⚠️ empilhada. Os
artefatos KSDD foram commitados na branch da 009 e não existem em `migracao`. O PR
aponta para a 009 e o GitHub reaponta para `migracao` quando ela mergear. Não há
sobreposição de arquivos entre as duas tasks.

---

## 1. Task em uma página

```yaml
id: 011
title: kind consultant-request — enum, migração e classificação comercial no CRM
status: para implementar
area: data-model
priority: P0
estimate: S
depends_on: []
```

**Objetivo.** Dar ao pedido de consultores uma origem própria em `FormSubmissions` e
fazê-lo sincronizar no RD Station CRM como qualquer lead comercial. **Bloqueia a
task 012** (Server Action).

---

## 2. Feature spec relevante (§6.2, colado)

> | `FormSubmissions` | Novo valor no select `kind`: `consultant-request` | **Sim** — fluxo D-21 completo: `generate:types` → `migrate:create add_consultant_request_kind` → conferir o `ALTER TABLE` → `migrate`. ⚠️ Migração **aditiva**; remover valor de enum vira pergunta interativa do drizzle, que não roda sem TTY |

§7.2:

> | `web/src/lib/crm.ts:63` | `consultant-request` entra em `KINDS_COMERCIAIS` — RH continua fora (D-29) |
> | `web/src/lib/crm.ts:102` | Rótulo legível da origem para a negociação no RD Station CRM |
> | `web/src/hooks/sincronizar-crm.ts` | Nenhuma mudança — o hook `afterChange` já cobre todo `kind` comercial |

---

## 3. SPEC / arquitetura relevantes

**SPEC §4.3** — `FormSubmissions` é dado sensível (LGPD, sem IP/UA).
**SPEC §5** — formulários → `FormSubmissions` → e-mail (Resend) → RD Station CRM (D-26).
**architecture.md §5** — RD Station CRM: idempotente (`crmId`), segundo passo depois
de gravar, exige consentimento (P-14).
**ADR-002** — PostgreSQL + Drizzle, migração versionada com `push: false` (D-01, D-21).

---

## 4. Estado atual

`web/src/collections/FormSubmissions.ts:53-66` — select `kind` com 7 valores:
`contact`, `chat-lead`, `newsletter`, `talent-pool`, `job-application`,
`material-download`, `rc18-diagnostic`.

`web/src/lib/crm.ts:63`:
```ts
const KINDS_COMERCIAIS = new Set(['contact', 'chat-lead', 'material-download', 'rc18-diagnostic'])
```
`web/src/lib/crm.ts:98-105` — `ROTULO`, mapa de origem legível para a negociação.

### Precedente exato

`web/src/migrations/20260913_211713_add_rc18_diagnostic_kind.ts` fez a mesma operação
três dias atrás. O `up` que o drizzle gera é uma linha:
```sql
ALTER TYPE "public"."enum_form_submissions_kind" ADD VALUE 'rc18-diagnostic';
```
e o `down` reconstrói o tipo sem o valor. **É este o formato a conferir** antes de
aplicar.

### Lacuna encontrada na leitura

`web/src/lib/crm.test.ts:14-18` itera `['contact', 'chat-lead', 'material-download']`
— **`rc18-diagnostic` nunca entrou na lista**, embora esteja em `KINDS_COMERCIAIS`
desde MIG da RC18. Entra junto nesta task: é a mesma asserção, e deixar a lista
incompleta enquanto se mexe nela seria escolher não ver.

---

## 5. Plano de implementação

| Arquivo | Ação |
|---|---|
| `web/src/collections/FormSubmissions.ts` | + opção `consultant-request` no select `kind` |
| `web/src/migrations/<timestamp>_add_consultant_request_kind.ts` + `.json` | gerados pelo drizzle |
| `web/src/migrations/index.ts` | registro da migração (gerado) |
| `web/src/payload-types.ts` | regenerado |
| `web/src/lib/crm.ts` | + `consultant-request` em `KINDS_COMERCIAIS` e em `ROTULO` |
| `web/src/lib/crm.test.ts` | cobre o kind novo (e fecha a lacuna do `rc18-diagnostic`) |

### Sequência (D-21, na ordem)

```bash
docker compose exec -T web pnpm payload generate:types
docker compose exec -T web pnpm payload migrate:create add_consultant_request_kind
#   ⚠️ LER o ALTER TABLE gerado antes do próximo passo
docker compose exec -T web pnpm payload migrate
```

---

## 6. Quality gates

- [ ] `pnpm payload migrate` limpo em base com dados
- [ ] `pnpm test` (inclui `crm.test.ts`)
- [ ] `pnpm lint` · `pnpm typecheck`
- [ ] `Agent` de revisão independente
- [ ] `security-auditor`: **aplica-se** — `FormSubmissions` é dado pessoal (LGPD) e o
      kind decide o que vai a terceiro (RD Station). Conferir que RH continua fora.

---

## 7. Riscos específicos

- ⚠️ **Migração aditiva, sempre.** Remoção de coluna/valor vira pergunta interativa do
  drizzle, que não roda sem TTY e trava o gerador **sem imprimir nada**.
- ⚠️ **Conferir o `ALTER TABLE` antes de aplicar.** Vários blocos têm campos de mesmo
  rótulo e edição por `replace` já fez migração tocar tabela errada. Se já aplicou,
  `pnpm payload migrate:down` desfaz só a última.
- ⚠️ `push: false`: `pnpm dev` **não** sincroniza schema. Esquecer a migração dá
  `column ... does not exist` em runtime com o servidor de pé.
- Esta task **não** cria lead nenhum — sem a Server Action (012) o kind existe e não é
  usado. É de propósito: o schema entra antes de quem escreve nele.
