---
id: 017
title: Chamada "Não encontrou um consultor?" junto dos diferenciais, em destaque
status: para implementar
feature: consultores-solicitacao
area: frontend
priority: P1
estimate: S
depends_on: [014]
feature_refs:
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#42-não-encontrou-um-consultor-nesta-lista-fluxo-alternativo"
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#revisão-de-2109"
spec_refs:
  - ".ksdd/specs/SPEC.md#9-touchpoints-criticos"
  - ".ksdd/specs/SPEC.md#11-interacoes-e-comportamentos"
arch_refs: []
---

# 017 — Chamada "Não encontrou um consultor?" junto dos diferenciais

## Objetivo
Pedido do dono, repassado por G-ferrari em 21/09: tirar a chamada "Não encontrou
um consultor nesta lista?" do fim da grade e pô-la **num componente junto** da
seção "Por que os maiores players do mercado confiam nos consultores ATRA?", com
um visual **diferente dos demais blocos** da página, para chamar a atenção.

## Escopo
- A seção de diferenciais vira um componente próprio (Server Component) com os
  4 diferenciais **e** a chamada, que ganha tratamento de destaque — fundo e
  borda de marca, ícone, botão sólido —, distinto dos cartões de diferencial e
  de todo o resto da página.
- A chamada **sai do fim da grade**: passou a morar na seção logo abaixo dela.
- A chamada **fica no estado vazio do filtro**. É o beco sem saída exato que a
  014 resolve, e ali o visitante não vê a seção de diferenciais. *(Decisão de
  implementação, reversível — não veio do pedido.)*
- Uma implementação só da chamada: ilha cliente com duas variantes (destaque, na
  seção; discreta, no estado vazio), com o comportamento da 014 — âncora que
  funciona sem JavaScript; com JavaScript centraliza e foca o campo livre, e
  **não mexe no carrinho**. Na 018 o destino passa a ser a aba de pedido.
- Cópia do dono inalterada (D-22), em `pt` e `en`.

## Fora de escopo
- Texto dos diferenciais — decisão de conteúdo é do marketing (D-22).
- A aba de pedido (018).

## Critérios de aceitação
- [ ] A seção mostra os 4 diferenciais e a chamada, e a chamada se distingue
      visualmente deles.
- [ ] A chamada não aparece mais ao fim da grade; continua no estado vazio.
- [ ] Clicar leva ao campo livre focado, sem mexer no carrinho.
- [ ] Contraste nos **dois** temas (`e2e/contraste.spec.ts`).
- [ ] 375 / 768 / 1280 sem corte de texto nem scroll horizontal.
- [ ] `pnpm lint` e `pnpm typecheck` passam.

## Notas técnicas
- **D-31** autoriza a mudança; a regravação do gabarito fica na 016. A §2.3 da
  feature dizia "não alterar a seção de diferenciais" — revista por este pedido.
- Regra 4: a seção é estática e fica no servidor; só o botão da chamada precisa
  de JavaScript e vira ilha.
- ⚠️ Cor em par claro/escuro, valor escuro por último. Nada de `bg-gradient-to-*`
  (Tailwind 4 usa `bg-linear-to-*`; o nome antigo some no tema claro).
- ⚠️ A cópia tem mais de 100 caracteres: nada de `pill-btn-*` (`uppercase
  tracking-wider`) no texto longo — ver a nota em `lista-de-consultores.tsx`.

## Riscos / dependências externas
- Nenhum.
