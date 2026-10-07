---
id: 040
title: Tornar a Insights automática: 3 mais recentes por tipo e "Ver todos"
status: concluída
feature: paginas-mestras
area: frontend
priority: P0
estimate: M
depends_on: [035]
feature_refs:
  - ".ksdd/features/FEATURE-paginas-mestras.md#2-escopo"
  - ".ksdd/features/FEATURE-paginas-mestras.md#4.2-insights-se-atualiza-sozinha"
  - ".ksdd/features/FEATURE-paginas-mestras.md#5-impacto-em-telas-existentes"
  - ".ksdd/features/FEATURE-paginas-mestras.md#10-criterios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#76-conteúdo-editorial"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-007--revalidação-em-processo-ao-publicar-mig-143"
---

# 040 — Tornar a Insights automática: 3 mais recentes por tipo e "Ver todos"

## Objetivo
Acabar com a manutenção manual da Insights: uma faixa por tipo (Cases, Blog, Webinars, ATRA na mídia, E-books) com os 3 publicados mais recentes e "Ver todos" para a página-mestra do tipo.

## Escopo
- `insightsHub` passa a montar as faixas automáticas (dados injetados pelo resolvedor, não buscados no componente).
- Os itens digitados à mão, os filtros por tópico e a busca saem; topo, newsletter e fechamento continuam editáveis.
- "Ver todos" com `hrefDe` da seção (PT/EN).
- Textos fixos em português do componente ganham inglês.
- Publicar post/case/webinar/matéria/e-book revalida a Insights.
- Insights marcada como página-mestra (`insights`).

## Fora de escopo
- Destaque escolhido à mão (decidido: não).

## Critérios de aceitação
- [ ] 5 faixas, cada uma com até 3 itens publicados, do mais novo para o mais antigo; tipo sem conteúdo não aparece.
- [ ] Rascunho nunca aparece.
- [ ] "Ver todos" leva à página-mestra certa em PT e EN.
- [ ] Publicar um webinar novo o leva à faixa sem ação manual.
- [ ] Testes do mapper das faixas; e2e da Insights atualizado.

## Notas técnicas
A revalidação ao publicar já cobre o layout inteiro (`revalidarSite`, ADR-007) — conferir que as collections de conteúdo disparam. Datas e "autor" de cada tipo vêm de campos diferentes (publishedAt, outlet…): normalizar no mapper.

## Riscos / dependências externas
A Insights muda de cara (decisão de 05/10); o marketing deve saber antes da publicação.
