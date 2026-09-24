---
id: 021
title: Aba de pedido no visual da home
status: em revisão
feature: consultores-solicitacao
area: design
priority: P1
estimate: S
depends_on: [018, 015]
feature_refs:
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#revisão-de-2209"
spec_refs:
  - ".ksdd/specs/DESIGN.md#overview"
arch_refs: []
---

# 021 — Aba de pedido no visual da home

## Objetivo
Pedido de G-ferrari em 23/09, ao decidir a referência visual da página: manter a
página como está no geral e **retrabalhar a aba lateral usando a home como
gabarito** — que é o que o DESIGN.md já diz ("a home é a lei; o resto deriva
dela").

## Escopo
- Só a aba de pedido e a barra minimizada. O resto da página não muda.
- Medidas copiadas da home, não inventadas: título em peso 300 com a linha de
  apoio leve; ladrilho recuado `rounded-[6px] px-4 py-3` com rótulo micro em
  caixa-alta espaçada sobre o valor em negrito; quadrado de ícone `w-9 h-9`;
  botão principal branco no escuro e azul no claro; respiro no lugar de linha
  divisória.
- O formulário já era o da home desde a 013 (`CAMPO` é a mesma string).

## Fora de escopo
- Comportamento, copy, e o resto da página.

## Critérios de aceitação
- [ ] Aba e barra falam a língua da home nos dois temas.
- [ ] Abrir, minimizar, expandir, remover e enviar seguem funcionando.
- [ ] Contraste nos dois temas; `paridade-ds` e `contraste` verdes.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`.

## Notas técnicas
- A linha sob o cabeçalho fica: o cabeçalho é fixo enquanto o corpo rola. As
  outras divisórias saíram — a home separa por espaço.
