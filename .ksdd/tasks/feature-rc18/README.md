# Tasks — Feature: Página RC18 (Soluções) + diagnóstico de prontidão

**Feature:** .ksdd/features/FEATURE-rc18.md
**Total:** 7 tasks
**Prioridade:** P0: 6 · P1: 1 · P2: 0
**Estimativa total:** ~11–12 dias

| ID | Título | Área | Prioridade | Estimativa | Status | Depende de |
|----|--------|------|------------|------------|--------|------------|
| 002 | Adicionar categoria/aba "RC18" ao mega-menu de Soluções | data-model | P0 | M | em revisão | — |
| 003 | Criar a página de solução RC18 (blocos CMS + seed idempotente) | frontend | P0 | L | em revisão | 002 |
| 004 | Formulário de contato na página RC18 no padrão da home | frontend | P0 | S | em revisão | 003 |
| 005 | Motor de pontuação do diagnóstico RC18 (lib + testes) | backend | P0 | M | em revisão | — |
| 006 | Rota e ilha do diagnóstico RC18 (autoavaliação com nota na hora) | frontend | P0 | L | para implementar | 005 |
| 007 | Captura de lead do diagnóstico (kind + Server Action + CRM) | backend | P0 | M | para implementar | 006 |
| 008 | SEO, JSON-LD, smoke e EN stub das rotas RC18 | qa | P1 | M | para implementar | 003, 006 |

## Ordem sugerida (por dependência)

**Trilha A — a página no menu (entrega valor sozinha):** 002 → 003 → 004
**Trilha B — o diagnóstico (paralela à A):** 005 → 006 → 007
**Fecho:** 008 (depende de 003 e 006)

As duas trilhas são independentes até 008 — 005 pode começar em paralelo com 002/003.

---
**Próximo passo:** `/ksdd:build:feature rc18` para implementar task por task.
