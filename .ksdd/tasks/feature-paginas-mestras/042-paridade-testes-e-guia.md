---
id: 042
title: Provar a paridade visual, atualizar testes e o guia do editor
status: concluída
feature: paginas-mestras
area: qa
priority: P0
estimate: M
depends_on: [041]
feature_refs:
  - ".ksdd/features/FEATURE-paginas-mestras.md#8.3-tokens--padrões-visuais"
  - ".ksdd/features/FEATURE-paginas-mestras.md#10-criterios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#2-personas"
arch_refs:
  - ".ksdd/specs/architecture.md#9-estratégia-de-testes"
---

# 042 — Provar a paridade visual, atualizar testes e o guia do editor

## Objetivo
Fechar a feature com a prova de que nada mudou no visual (exceto a Insights), os testes ajustados e o time de conteúdo sabendo usar.

## Escopo
- Captura antes/depois das 9 páginas (3 tamanhos × 2 temas), com diferença zero ou explicada.
- e2e: smoke das seções, Insights nova, trava de apagar, Live Preview (se viável), CSV de redirects.
- Guia do editor: seção "Páginas-mestras" (o que se edita, o que é automático, por que não apaga, como renomear a seção).
- Decisão registrada em `docs/00-contexto/decisoes.md` (próximo D-xx) e nota no CLAUDE.md.
- Checklist do projeto atualizado.

## Fora de escopo
- Fase 2 (endereço pelo admin, consultores inteira).

## Critérios de aceitação
- [ ] Relatório de capturas anexado ao PR.
- [ ] CI verde (verify + e2e).
- [ ] Guia revisado com o fluxo 4.1 da feature.

## Notas técnicas
A paridade com o protótipo está desligada (D-39); aqui a comparação é antes/depois do próprio site, não contra o protótipo.

## Riscos / dependências externas

