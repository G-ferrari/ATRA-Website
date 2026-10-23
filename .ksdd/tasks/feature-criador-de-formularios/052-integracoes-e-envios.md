---
id: 052
title: Mostrar os formulários do admin em Integrações e filtrar os envios por formulário
status: em revisão
feature: criador-de-formularios
area: frontend
priority: P1
estimate: S
depends_on: [048, 049]
feature_refs:
  - ".ksdd/features/FEATURE-criador-de-formularios.md#21-o-que-entra-v1"
  - ".ksdd/features/FEATURE-criador-de-formularios.md#51-telas-modificadas"
spec_refs:
  - ".ksdd/specs/SPEC.md#21-marina--editora-de-marketing-usuária-primária-do-cms"
arch_refs:
  - ".ksdd/specs/architecture.md#34-globals"
---

# 052 — Integrações e envios

## Objetivo
Deixar o marketing conferir num lugar só tudo o que vai ao RD e achar os leads de cada formulário.

## Escopo
- Sistema → Integrações, grupo do RD: campo `ui` (componente de servidor, sem coluna) listando os formulários do admin com nome, situação (publicado ou rascunho), identificador, tags e link para editar; formulário sem identificador aparece marcado como "não vai ao RD".
- Envios de formulário: coluna e filtro pelo formulário de origem; as respostas legíveis no documento (049) em ordem.

## Fora de escopo
- Editar identificador ou tags pela lista (edita-se no formulário).

## Critérios de aceitação
- [ ] A lista em Integrações mostra os formulários criados, incluindo os sem identificador marcados.
- [ ] Na lista de envios, filtrar por um formulário mostra só os envios dele.
- [ ] Nenhum dado de lead aparece em Integrações.

## Notas técnicas
- Mesmo padrão do `SituacaoDaChaveRd` (campo `ui` com componente de servidor); `pnpm payload generate:importmap` depois de criar o componente.

## Riscos / dependências externas
Nenhum.
