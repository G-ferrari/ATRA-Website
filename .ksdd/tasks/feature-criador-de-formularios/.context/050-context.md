# Contexto de implementação — 050

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/162
**Branch:** `feature/criador-de-formularios/050-conversao-no-rd` (a partir da branch da 049, PR #161; PR para a `migracao`, mesclar depois do #158 e do #161 — mesmo arranjo da pilha do RD)
**Task:** `.ksdd/tasks/feature-criador-de-formularios/050-conversao-no-rd.md`

## Task em uma página

- **Objetivo:** cada envio de formulário do admin chega ao RD como conversão, com o identificador e as tags do próprio formulário, para as automações do marketing dispararem.
- **Critérios:** corpo com identificador e tags do formulário, campos padrão, `cf_` só com a chave ligada, resposta vazia fora, base legal só com o consentimento marcado; formulário sem identificador não vai e o motivo fica em `rd.error`; os formulários atuais inalterados; formulário apagado depois do envio não derruba a gravação.
- **Fora de escopo:** criar campo personalizado no RD; mudar a conversão dos formulários atuais.

## Feature spec relevante (FEATURE-criador-de-formularios.md, 2.1 e 7.2)

> - **Para onde cada campo vai no RD.** Nome, e-mail, telefone, empresa e cargo vão sempre para os campos padrão do RD (`name`, `email`, `personal_phone`, `company_name`, `job_title`). Os outros tipos escolhem entre **não enviar** e **um campo personalizado** (`cf_…`, digitado exatamente como está no RD). Campo personalizado só vai com a chave "Enviar campos personalizados" ligada em Sistema → Integrações, a mesma regra de hoje.
> - **Consentimento.** Uma caixa de marcar pode ser marcada como **consentimento de comunicação**: marcada pelo visitante, a conversão leva a base legal de consentimento (`legal_bases` e `available_for_mailing`), como a newsletter já faz. Desmarcada ou ausente, o lead vai sem base legal declarada, como os outros formulários.

> | Gancho `afterChange` de `form-submissions` (`hooks/sincronizar-rd.ts`) | o tipo novo lê identificador, tags e mapeamento do próprio formulário |
> | `lib/rd-marketing.ts` | corpo da conversão com os campos mapeados, `job_title`, `cf_` do formulário e base legal pela caixa de consentimento |

## Estado atual do código

- `hooks/sincronizar-rd.ts` — roda no `create` e em toda edição sem `syncedAt`; `comMaterial` é o modelo de leitura de outro documento: `findByID` **sem** o `req` (falha desfaria a transação do lead), `disableErrors`, sem `draft`. O resultado vai por `db.updateOne` **com** o `req`.
- `lib/rd-marketing.ts` — `KINDS_PARA_O_RD`, `identificadorDe` (linha de Sistema → Integrações por kind; o e-book tem o próprio), `montarPayload` (tags por formulário do RD, base legal só da newsletter, `cf_` atrás da chave).
- 049: o envio grava `form` (id), `answers` (`fieldId`, rótulo e valor; caixa de marcar como "Sim"/"Não") e `communicationConsent`. O aviso do site sai quando o RD não aceitou (`rdJaAvisou`).

## Plano de implementação

- `lib/rd-marketing.ts`: `custom-form` em `KINDS_PARA_O_RD`; `LeadParaRd` ganha `answers`, `communicationConsent` e `formulario` (identificador, tags e, por campo, id, tipo e destino); `identificadorDe` e as tags vêm do formulário; `job_title` pela resposta do campo Cargo; `cf_` só os mapeados no formulário, sem resposta vazia, sem caixa desmarcada e sem `cf_quiz_url`; base legal com `communicationConsent`. Motivo próprio em `rd.error` para formulário apagado e para formulário sem identificador.
- `hooks/sincronizar-rd.ts`: `comFormulario`, no molde do `comMaterial`, lendo `forms` em `pt` e passando por `toConfigDoFormulario`.
- `collections/FormSubmissions.ts`: `form`, `answers` e `communicationConsent` sem edição pela API (`access.update`), porque são a prova do consentimento que a edição reenviaria ao RD.
- Testes: `lib/rd-marketing.test.ts` (corpo, identificador, motivo) e `hooks/sincronizar-rd.test.ts` (leitura do formulário, populado ou id, apagado ou ilegível).

## Quality gates

- [ ] `typecheck` · `lint` · `test`
- [ ] `migrate:create` sem diferença (nenhuma coluna nova)
- [ ] Conversão de verdade pela Local API num banco de teste, com o `fetch` do RD falso (corpo, `syncedAt`, envio órfão, edição de editor)
- [ ] Revisão de código (agente)
