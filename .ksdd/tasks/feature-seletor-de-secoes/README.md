# Tasks — Feature: Seletor de seções no admin

**Feature:** .ksdd/features/FEATURE-seletor-de-secoes.md
**Total:** 3 tasks
**Prioridade:** P0: 3 · P1: 0 · P2: 0
**Estimativa total:** ~3–4 dias

| ID | Título | Área | Prioridade | Estimativa | Status | Depende de |
|----|--------|------|------------|------------|--------|------------|
| 031 | Agrupar os blocos no seletor e ordenar alfabeticamente dentro de cada grupo | frontend | P0 | S | em revisão | — |
| 032 | Catálogo interno com os 28 blocos e dados de exemplo, fora da produção | frontend | P0 | M | cancelada | — |
| 033 | Miniaturas dos blocos — script de captura, `admin.images.thumbnail` e guia do editor | frontend | P0 | M | em revisão | 031 |

## Ordem sugerida (por dependência)

1. **031** — entrega sozinha: grupos + ordem alfabética já melhoram o seletor.
2. **032** — pode correr em paralelo com a 031.
3. **033** — fecha a feature com as miniaturas.

A busca ("Procurar bloco") já existe no Payload e não precisa de task.

**032 cancelada (28/09):** os 28 blocos aparecem em páginas reais; a 033 captura da própria página.

---
**Próximo passo:** `/ksdd:build:feature seletor-de-secoes` para implementar task por task.
