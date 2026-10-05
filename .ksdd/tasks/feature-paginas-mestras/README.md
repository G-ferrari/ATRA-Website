# Tasks — Feature: Páginas-mestras editáveis no admin

**Feature:** .ksdd/features/FEATURE-paginas-mestras.md
**Total:** 9 tasks
**Prioridade:** P0: 8 · P1: 1 · P2: 0
**Estimativa total:** ~13 dias (S=1, M=1–2, L=2–3)
**Entrega:** única (decisão de 05/10) — as tasks são a ordem de trabalho, não PRs separados.

| ID | Título | Área | Prioridade | Estimativa | Status | Depende de |
|----|--------|------|------------|------------|--------|------------|
| 034 | Marcar e proteger as páginas-mestras em `pages`, com Live Preview | data-model | P0 | M | para implementar | — |
| 035 | Criar os blocos "Lista da seção" e "Destaques da seção" e o resolvedor | backend | P0 | L | para implementar | 034 |
| 036 | Montar /solucoes e /segmentos pela página-mestra | frontend | P0 | M | para implementar | 035 |
| 037 | Montar /webinars, /atra-na-midia e /ebooks pela página-mestra | frontend | P0 | M | para implementar | 035 |
| 038 | Montar /cases-de-sucesso e /blog (com /blog/pagina/N) | frontend | P0 | L | para implementar | 035 |
| 039 | Montar /consultores pela página-mestra (topo, textos e SEO) | frontend | P1 | M | para implementar | 035 |
| 040 | Tornar a Insights automática: 3 mais recentes por tipo e "Ver todos" | frontend | P0 | M | para implementar | 035 |
| 041 | Criar as páginas-mestras por migração de dados e no seed | backend | P0 | M | para implementar | 036–040 |
| 042 | Provar a paridade visual, atualizar testes e o guia do editor | qa | P0 | M | para implementar | 041 |

---
**Próximo passo:** `/ksdd:build:feature paginas-mestras` para implementar task por task.
