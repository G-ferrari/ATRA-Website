---
id: 033
title: Miniaturas dos blocos — script de captura, admin.images.thumbnail e guia do editor
status: em revisão
feature: seletor-de-secoes
area: frontend
priority: P0
estimate: M
depends_on: [031, 032]
feature_refs:
  - ".ksdd/features/FEATURE-seletor-de-secoes.md#21-o-que-entra-v1"
  - ".ksdd/features/FEATURE-seletor-de-secoes.md#83-tokens--padroes-visuais"
  - ".ksdd/features/FEATURE-seletor-de-secoes.md#10-criterios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#21-marina--editora-de-marketing-usuaria-primaria-do-cms"
arch_refs:
  - ".ksdd/specs/architecture.md#9-estrategia-de-testes"
---

# 033 — Miniaturas dos blocos: script de captura, `admin.images.thumbnail` e guia do editor

## Objetivo
Cada card da tela "Adicionar Seção" mostra como a seção fica no site, gerado por um script que se roda de novo quando o design muda.

## Escopo
- Script versionado (ex.: `web/scripts/admin/miniaturas-dos-blocos.ts`) que abre o catálogo (032) na imagem oficial do Playwright — a mesma do gate —, captura cada `[data-bloco]` no tema escuro, recorta o topo em 3:2 e grava `web/public/admin/blocos/<slug>.webp` a 480×320 (`sharp`).
- `admin.images.thumbnail` (com `alt` em PT) em cada um dos 28 blocos, apontando para o arquivo.
- Teste unitário: todo bloco tem miniatura e o arquivo existe em `public/`.
- Guia do editor (`docs/05-operacao/guia-do-editor.md`): o seletor tem grupos, busca ("Procurar bloco") e miniaturas.
- Comando documentado (no topo do script e no CLAUDE.md, em "Comandos").

## Fora de escopo
- Miniatura do tema claro (FEATURE §2.2).
- Comparação de pixel das miniaturas (o teste confere existência).

## Critérios de aceitação
- [ ] Os 28 cards do drawer mostram miniatura própria, nenhum com a imagem genérica.
- [ ] Rodar o script de novo regrava as 28 sem passo manual.
- [ ] Teste reprova bloco sem miniatura ou com arquivo inexistente.
- [ ] Guia do editor atualizado.
- [ ] `lint`, `typecheck`, `test` verdes; conferido no admin da homologação.

## Notas técnicas
- Payload 3.88: `admin.images.thumbnail: { url, alt }`; o antigo `imageURL` está depreciado.
- `public/` já é copiado no runner do Dockerfile; o admin serve do mesmo domínio (a senha da homologação não atrapalha).
- Captura em 1280px de largura e reduzida, para o card mostrar o desenho do desktop.

## Riscos / dependências externas
- Nenhum externo. Tamanho no repositório: 28 WebP de ~20–40 KB.
