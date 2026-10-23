# Contexto de implementação — 049

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/160
**Branch:** `feature/criador-de-formularios/049-envio-do-formulario` (a partir da branch da 048, PR #158; PR para a `migracao`, mesclar depois do #158 — mesmo arranjo da pilha do RD)
**Task:** `.ksdd/tasks/feature-criador-de-formularios/049-envio-do-formulario.md`

## Task em uma página

- **Objetivo:** o envio de um formulário do admin, conferido no servidor contra o formulário publicado, gravado antes de tudo e avisado ao time pela regra de hoje.
- **Critérios:** testes da validação (obrigatório, e-mail, opção inexistente, campo intruso, teto); rascunho ou apagado recusa sem gravar; envio válido grava kind novo, formulário, colunas padrão, respostas, origem e UTM; regra do aviso; robô recebe sucesso falso; nada pessoal no log; formulários atuais intactos.
- **Fora de escopo:** o corpo da conversão no RD (050) e o desenho (051).

## Feature spec relevante (FEATURE-criador-de-formularios.md, 4.2)

> 1. Anti-spam; o servidor confere os campos contra o formulário publicado.
> 2. Grava em `form-submissions` (tipo "Formulário do admin", com o formulário, a página de origem e a UTM).
> 4. RD aceitou → o site não avisa. RD não aceitou → e-mail do site aos endereços do formulário.
> 5. O visitante vê a mensagem ou vai para a página escolhida.
> Erro: campo obrigatório vazio ou e-mail inválido → mensagem no formulário, nada gravado. Formulário despublicado ou apagado → envio recusado com a mensagem genérica, nada gravado.

## Estado atual do código

- `actions/formularios.ts` — o modelo: `conferir` (isca + carimbo) e `excedeuPorIp` → `payload.create` → `rdJaAvisou` (releitura do `rd`) → `enviarAviso` → `notified` com `skipRdSync`. `semDadoPessoal` no log.
- `lib/email.ts` — `Aviso.para` é um endereço só; o formulário do admin pode ter vários.
- `lib/mappers/form.ts` (048) — `toConfigDoFormulario` (servidor) e `toFormularioDoAdmin` (depois do envio).
- `hooks/sincronizar-rd.ts` — roda no `create`; o kind novo ainda não vai ao RD (050), então hoje o aviso do site sempre sai.
- Nenhuma migração de dados lê `form-submissions` pela Local API: sem antecipada.

## Plano de implementação

- `lib/formularios-do-admin.ts`: `conferirEnvio(config, ler, locale)` — pura: valida cada campo do formulário publicado e devolve respostas, campos padrão e consentimento, ou os erros por campo.
- `collections/FormSubmissions.ts`: kind `custom-form`; `form` (relação), `answers` (array somente leitura: id do campo, rótulo, valor), `communicationConsent`. Migração gerada.
- `actions/formularios-do-admin.ts` (novo): a action. Ida para a página escolhida por `redirect()`, fora de `try` (funciona sem JavaScript).
- `lib/email.ts`: `para` aceita lista.
- Testes: `lib/formularios-do-admin.test.ts` (conferência) e `actions/formularios-do-admin.test.ts` (action, com os mesmos dublês de `formularios.test.ts`).

## Quality gates

- [ ] `typecheck` · `lint` · `test`
- [ ] Migração em banco zerado; `migrate:create` sem diferença
- [ ] Envio de verdade pela Local API num banco de teste (grava e lê de volta)
- [ ] Revisão de código (agente)
