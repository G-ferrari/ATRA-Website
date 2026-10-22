---
id: 049
title: Receber o envio de um formulário do admin — validar, gravar e avisar o time
status: em revisão
feature: criador-de-formularios
area: backend
priority: P0
estimate: M
depends_on: [048]
feature_refs:
  - ".ksdd/features/FEATURE-criador-de-formularios.md#21-o-que-entra-v1"
  - ".ksdd/features/FEATURE-criador-de-formularios.md#42-visitante-envia"
  - ".ksdd/features/FEATURE-criador-de-formularios.md#62-alterações-em-entidades-existentes"
  - ".ksdd/features/FEATURE-criador-de-formularios.md#10-critérios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#132-visitante-converte-por-formulário"
  - ".ksdd/specs/SPEC.md#11-interações-e-comportamentos"
arch_refs:
  - ".ksdd/specs/architecture.md#4-apis-e-endpoints"
  - ".ksdd/specs/architecture.md#7-segurança"
---

# 049 — Envio do formulário do admin

## Objetivo
Fazer o formulário criado no admin funcionar como os do site: o envio é conferido no servidor contra o formulário publicado, gravado antes de qualquer coisa e avisado ao time pela regra de hoje.

## Escopo
- Server Action nova (ou ramo novo em `actions/formularios.ts`, se ficar mais simples), que funciona sem JavaScript.
- Ordem de sempre: anti-spam (isca, carimbo, limite por IP) → lê o formulário **publicado** pelo id → valida → grava → aviso.
- Validação no servidor: obrigatório preenchido, e-mail com formato, opção que existe na lista, caixa de marcar só "sim" ou nada, tetos de tamanho (os de `MAX_CAMPO`/`MAX_MENSAGEM`). Campo que não é do formulário é descartado. Formulário em rascunho, despublicado ou apagado → recusa com a mensagem genérica, sem gravar.
- `form-submissions`:
  - `kind` novo, "Formulário do admin";
  - relação com o formulário;
  - nome, e-mail, telefone e empresa nas colunas existentes;
  - as outras respostas num campo próprio (lista de rótulo e valor, somente leitura), legível no admin, com o rótulo do momento do envio;
  - se a caixa de consentimento foi marcada, guardado no envio (para o RD na 050);
  - página de origem e UTM, como hoje.
- Aviso: se o RD aceitou (releitura, como `rdJaAvisou`), nada; senão e-mail do site aos endereços do formulário, ou ao destino geral de contato (`destinoDoAviso`) com a lista vazia; `notified` com `skipRdSync`.
- Resposta para a tela: sucesso com a mensagem ou com o endereço da página de destino (`hrefDe`), erro com a mensagem por campo.
- Migração aditiva de `form-submissions` (com a antecipada, se a armadilha valer).

## Fora de escopo
- O corpo da conversão no RD (050).
- O desenho do formulário e da mensagem (051).

## Critérios de aceitação
- [ ] Teste da validação: obrigatório vazio, e-mail inválido, opção inexistente, campo intruso e texto acima do teto.
- [ ] Teste: formulário em rascunho ou apagado recusa sem gravar.
- [ ] Teste: envio válido grava o kind novo com o formulário, as colunas padrão, as respostas legíveis, a origem e a UTM.
- [ ] Teste da regra do aviso: RD aceitou → nenhum e-mail; RD não aceitou → e-mail para os endereços do formulário (ou o destino geral) e `notified`.
- [ ] Robô (isca ou carimbo) recebe sucesso falso e nada é gravado.
- [ ] Nenhum dado pessoal no log de erro (`semDadoPessoal`).
- [ ] Os formulários atuais seguem com os testes verdes.

## Notas técnicas
- Ler o formulário com a Local API e `where: { _status: { equals: 'published' } }` escrito (regra 4: `overrideAccess` ignora o `access.read`).
- Gravar com o `req` da transação quando houver escrita de resultado no gancho (armadilha da D-62).

## Riscos / dependências externas
- `RESEND_API_KEY` em produção para o aviso do site (dependência da feature do RD).
