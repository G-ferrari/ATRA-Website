# Tasks — Feature: Criador de formulários no admin, ligado ao RD

**Feature:** .ksdd/features/FEATURE-criador-de-formularios.md
**Total:** 7 tasks
**Prioridade:** P0: 4 · P1: 3 · P2: 0
**Estimativa total:** ~11 dias (1 × L + 4 × M + 2 × S), mais o tempo da Taci na 054

| ID | Título | Área | Prioridade | Estimativa | Status | Depende de |
|----|--------|------|------------|------------|--------|------------|
| 048 | Criar a collection "Formulários" no admin, com os campos, o depois do envio e o grupo do RD | data-model | P0 | M | em revisão | — |
| 049 | Receber o envio de um formulário do admin — validar, gravar e avisar o time | backend | P0 | M | para implementar | 048 |
| 050 | Levar o envio do formulário do admin ao RD com identificador, tags, campos mapeados e consentimento | backend | P0 | M | para implementar | 048, 049 |
| 051 | Desenhar a seção "Formulário" no site, com os nove tipos de campo e o depois do envio | frontend | P0 | L | para implementar | 048, 049 |
| 052 | Mostrar os formulários do admin em Integrações e filtrar os envios por formulário | frontend | P1 | S | para implementar | 048, 049 |
| 053 | Fechar a feature — miniatura no seletor, e2e do envio, guia do editor e decisão | qa | P1 | M | para implementar | 050, 051, 052 |
| 054 | Testar com o marketing na homologação — criar e publicar um formulário sem ajuda | qa | P1 | S | para implementar | 053 |

A 050 e a 051 dependem das mesmas duas e podem andar juntas; a 052 também.

---
**Próximo passo:** `/ksdd:build:feature criador-de-formularios` para implementar task por task.
