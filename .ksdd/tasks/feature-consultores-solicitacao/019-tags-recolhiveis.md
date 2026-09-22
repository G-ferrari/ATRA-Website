---
id: 019
title: Tags recolhíveis no filtro de especialidades e nos cards
status: em revisão
feature: consultores-solicitacao
area: frontend
priority: P1
estimate: S
depends_on: [018]
feature_refs:
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#revisão-de-2109"
spec_refs:
  - ".ksdd/specs/SPEC.md#10-responsividade"
  - ".ksdd/specs/SPEC.md#11-interacoes-e-comportamentos"
arch_refs: []
---

# 019 — Tags recolhíveis no filtro e nos cards

## Objetivo
Pedido de G-ferrari em 22/09: no filtro "Filtre por Especialidade & Tecnologia"
e nos cards dos consultores, a lista de skills **recolhe** quando é extensa. As
que ficam de fora se agrupam numa tag com o número ("+N"); clicar nela (ou na
seta ao lado) abre todas, e é possível fechar de novo.

## Escopo
- **Filtro:** recolhido, uma linha no computador e no tablet e duas no celular,
  com "Todas" à frente e "+N ⌄" no fim. Aberto, todas as tags e "Mostrar
  menos ⌃". Sai a caixa de altura fixa com rolagem interna do protótipo
  (`max-h-28 overflow-y-auto`).
- **Cards:** continuam com 7 tags à mostra; o "+N", hoje só texto, vira o botão
  de abrir e fechar aquele card.
- **Tag marcada no filtro nunca fica escondida** no recolhido — nem no filtro,
  nem nos cards. *(Decisão de implementação: sem isso, marcar uma tag que cai no
  "+N" some com a própria informação que o visitante escolheu.)*
- `pt` e `en`.

## Fora de escopo
- Ordem das tags (segue alfabética, derivada dos perfis).
- Senioridade e o alternador OU|E, que são curtos.

## Critérios de aceitação
- [ ] Filtro recolhido: 1 linha em 768 e 1280, 2 em 375, com o "+N" certo em
      cada largura.
- [ ] Abrir mostra todas; "Mostrar menos" recolhe; o foco fica no controle.
- [ ] Card com mais de 7 tags abre e fecha só ele.
- [ ] Tag marcada aparece no recolhido, no filtro e no card.
- [ ] Controle com `aria-expanded`, nome acessível que contém o texto visível.
- [ ] Contraste nos dois temas; `pnpm lint` e `pnpm typecheck`.

## Notas técnicas
- Quantas cabem por linha muda com a largura, e o servidor não sabe a largura:
  o limite é **por faixa do Tailwind**, em classes (`hidden sm:inline-block`),
  e o "+N" tem um número por faixa. Sem medição em JavaScript, sem salto de
  layout na hidratação, e o gate captura sempre o mesmo.
- ⚠️ As classes por faixa têm de estar escritas por extenso no código: o
  Tailwind gera CSS só do que acha no fonte, e `${faixa}:hidden` montado em
  tempo de execução não gera nada.
