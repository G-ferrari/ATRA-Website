---
id: 014
title: CTA "Não encontrou um consultor nesta lista?"
status: em andamento
feature: consultores-solicitacao
area: frontend
priority: P1
estimate: S
depends_on: [013]
feature_refs:
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#4-fluxos-de-uso"
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#51-telas-modificadas"
spec_refs:
  - ".ksdd/specs/SPEC.md#9-touchpoints-criticos"
  - ".ksdd/specs/SPEC.md#11-interacoes-e-comportamentos"
arch_refs: []
---

# 014 — CTA "Não encontrou um consultor nesta lista?"

## Objetivo
Dar saída a quem não se identifica com nenhum dos 8 arquétipos, em vez de
terminar num beco sem saída — pedido textual do dono no feedback de 20/09.

## Escopo
- CTA em **dois pontos**: no estado vazio do filtro
  (`lista-de-consultores.tsx:231-247`, ao lado de "Resetar Filtros") e **ao fim da
  grade de perfis**.
- Cópia PT tal como veio no feedback: *"Não encontrou um consultor nesta lista?
  Clique aqui e solicite que vamos encontrar um candidato ideal para você."*
  Tradução EN equivalente.
- Leva à seção de solicitação **sem nenhum perfil marcado**, com o campo livre em
  evidência (foco no campo ao chegar).
- Em modo **E** com cobertura só parcial, o CTA acompanha a chamada de combinar
  dois perfis, sem competir com ela.

## Fora de escopo
- Mudar o mecanismo do filtro (task 009) ou o formulário (task 013).
- Texto institucional novo além desta cópia — decisão de conteúdo é do marketing
  (D-22); esta cópia está autorizada porque veio do dono.

## Critérios de aceitação
- [ ] O CTA aparece no estado vazio e ao fim da grade.
- [ ] Clicar leva à seção de solicitação com a lista de perfis vazia e o campo
      livre focado.
- [ ] Enviar a partir daí grava um lead `consultant-request` só com o texto livre.
- [ ] A cópia existe em `pt` e `en`.
- [ ] Contraste do CTA passa nos **dois** temas (`e2e/contraste.spec.ts`).

## Notas técnicas
- Usar `pill-btn-outline` ou `pill-btn-secondary` do `DESIGN.md`, não classes
  soltas.
- Mover foco programaticamente para o campo livre ao chegar; anunciar a chegada
  para leitor de tela sem roubar o foco de quem navega por teclado.
- ⚠️ Cor em par claro/escuro, valor escuro por último.

## Riscos / dependências externas
- Nenhuma.
