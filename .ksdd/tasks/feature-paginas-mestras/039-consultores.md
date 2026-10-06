---
id: 039
title: Montar /consultores pela página-mestra (topo, textos e SEO)
status: concluída
feature: paginas-mestras
area: frontend
priority: P1
estimate: M
depends_on: [035]
feature_refs:
  - ".ksdd/features/FEATURE-paginas-mestras.md#2-escopo"
  - ".ksdd/features/FEATURE-paginas-mestras.md#2.2-o-que-fica-pra-depois"
  - ".ksdd/features/FEATURE-paginas-mestras.md#9-dependencias-e-riscos"
spec_refs:
  - ".ksdd/specs/SPEC.md#77-institucional-e-conversão"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-009--componente-não-conhece-o-cms-mappers-como-fronteira-regra-3"
---

# 039 — Montar /consultores pela página-mestra (topo, textos e SEO)

## Objetivo
Deixar editáveis o topo, os textos principais e o SEO de Consultores, mantendo no código a lista de perfis, o carrinho e o formulário (decisão de 05/10).

## Escopo
- Topo pela página (selo, etiqueta, título, destaque, descrição); as métricas do topo continuam calculadas dos dados.
- "Lista da seção" de consultores envolve lista, diferenciais, carrinho (`ProvedorDaSolicitacao`) e formulário, funcionando como hoje.
- SEO pela página; conteúdo inicial PT/EN literal; remover `META`/`TEXTOS` do topo.

## Fora de escopo
- Os ~50 textos da lista, dos diferenciais e do formulário (fase 2).

## Critérios de aceitação
- [ ] Visual igual ao de hoje.
- [ ] e2e de consultores (`e2e/consultores.spec.ts`) verde: filtro, carrinho e pedido.
- [ ] Editar o título do topo no admin muda a página.

## Notas técnicas
Tudo vive dentro de um contexto cliente; o bloco precisa envolver o conjunto. O 99,4% fixo no código fica como está (fora de escopo).

## Riscos / dependências externas

