---
id: 020
title: Pedido enxuto — sem quantidade, menos campos, confirmação na aba
status: em revisão
feature: consultores-solicitacao
area: frontend
priority: P1
estimate: M
depends_on: [018]
feature_refs:
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#revisão-de-2209"
spec_refs:
  - ".ksdd/specs/SPEC.md#11-interacoes-e-comportamentos"
arch_refs:
  - ".ksdd/specs/architecture.md#4-server-actions"
---

# 020 — Pedido enxuto

## Objetivo
Pedido de G-ferrari em 22/09, olhando a aba: tirar a quantidade de pessoas,
trocar o "X" por uma lixeira, enxugar o formulário e confirmar o envio num
aviso modal.

## Escopo
- **Sem quantidade por perfil.** Some o stepper; cada perfil entra uma vez. O
  cabeçalho da aba diz só "2 perfis", e o lead que chega ao comercial lista os
  perfis sem "2×". *(Escolhido entre as duas leituras possíveis do pedido —
  quantas pessoas de cada perfil vira assunto da conversa comercial.)*
- **Lixeira** no lugar do "X" em cada perfil.
- **Formulário:** nome, e-mail, telefone e "Descreva brevemente o projeto
  (opcional)". Saem empresa, modelo de alocação e duração estimada. Ficam a
  linha da política de privacidade e o campo escondido dos perfis.
- **Botão** passa a ser "Enviar solicitação".
- **Confirmação** ocupa a aba inteira depois do envio aceito — a aba já é modal,
  então é o aviso modal pedido. Some quando o visitante fecha.
- `pt` e `en`.

## Fora de escopo
- Campos novos, ou mudança nas barreiras anti-spam.
- Texto institucional da página (D-22).

## Critérios de aceitação
- [ ] Sem stepper; cada perfil aparece uma vez, com lixeira para remover.
- [ ] Cabeçalho e barra dizem "N perfis", sem pessoas.
- [ ] Formulário com 4 campos, na ordem pedida, e botão "Enviar solicitação".
- [ ] Descrição obrigatória só quando não há perfil escolhido — e aí o rótulo
      não diz "(opcional)".
- [ ] Enviar mostra a confirmação na aba; fechar limpa o carrinho e volta ao
      formulário vazio.
- [ ] O lead gravado lista os perfis sem quantidade; sem perfil, traz a
      descrição (conferido no Postgres).
- [ ] Envio sem JavaScript continua gravando e mostrando a confirmação.
- [ ] `pnpm lint`, `pnpm typecheck` e `pnpm test`.

## Notas técnicas
- A quantidade sai **de ponta a ponta**: carrinho (`Escolhidos` vira conjunto),
  o que o cliente manda (`perfis` é JSON de slugs), o que o servidor confere e o
  resumo do comercial. Com os campos, saem `lerDuracao`, `lerModelo`, `MODELOS`
  e `MAX_MESES` — código sem quem o alimente.
- ⚠️ Aba aberta desde antes do deploy manda o formato antigo
  (`[{ slug, quantidade }]`): `lerPerfisPedidos` devolve lista vazia em vez de
  estourar, e o pedido chega pela descrição. Tem teste.
- ⚠️ O carrinho esvazia na **aba**, não no formulário: com o envio aceito o
  formulário desmonta no mesmo render, e efeito de componente que desmonta não
  roda.
