# Tasks — Feature: RD Station nos formulários do site novo

**Feature:** .ksdd/features/FEATURE-rd-station-formularios.md
**Total:** 5 tasks
**Prioridade:** P0: 5 · P1: 0 · P2: 0
**Estimativa total:** ~7 dias (4 × M + 1 × S), mais o tempo de resposta da Taci e do Léo na 047

| ID | Título | Área | Prioridade | Estimativa | Status | Depende de |
|----|--------|------|------------|------------|--------|------------|
| 043 | Configurar o RD no admin — identificadores livres, tags, Trabalhe Conosco e situação da chave | data-model | P0 | M | em revisão | — |
| 044 | Mandar tags, LinkedIn e dados de candidato na conversão; Trabalhe Conosco no RD | backend | P0 | M | em revisão | 043 |
| 045 | Avisar o time pelo site só quando a conversão não chegou ao RD | backend | P0 | M | em revisão | 044 |
| 046 | E-book — identificador no RD por material e formulário depois do texto | frontend | P0 | M | em revisão | 044 |
| 047 | Ligar na homologação e provar os quatro formulários no RD com a Taci | qa | P0 | S | para implementar | 043, 044, 045, 046 |

A **lista do RD** (identificadores, tags, campos e automações de hoje) é a dependência que mais pesa: dá para pedir à Taci já, em paralelo com a 043.

---
**Próximo passo:** `/ksdd:build:feature rd-station-formularios` para implementar task por task.
