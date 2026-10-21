---
id: 053
title: Fechar a feature — miniatura no seletor, e2e do envio, guia do editor e decisão
status: em revisão
feature: criador-de-formularios
area: qa
priority: P1
estimate: M
depends_on: [050, 051, 052]
feature_refs:
  - ".ksdd/features/FEATURE-criador-de-formularios.md#10-critérios-de-aceite"
  - ".ksdd/features/FEATURE-criador-de-formularios.md#11-fases-de-implementação"
spec_refs:
  - ".ksdd/specs/SPEC.md#13-fluxos-críticos-user-journeys"
arch_refs:
  - ".ksdd/specs/architecture.md#9-estratégia-de-testes"
---

# 053 — Miniatura, e2e e documentação

## Objetivo
Deixar a feature pronta para o marketing usar e coberta no CI, para uma regressão no envio não passar sem ninguém ver.

## Escopo
- Miniatura de "Formulário" em `public/miniaturas-de-blocos/` (comando do CLAUDE.md, banco sem `SEED_FIXTURES`).
- Fixture de formulário no seed de teste (só com `SEED_FIXTURES=1`) e uma página que o usa.
- `e2e/formulario-do-admin.spec.ts`: envio válido grava e mostra a mensagem; obrigatório vazio mostra o erro; depois do envio por página navega para ela; axe sem violação nova.
- Guia do editor (`docs/05-operacao/guia-do-editor.md`): criar, publicar, ligar ao RD, o que não pedir, e que o agradecimento e o aviso são montados no RD.
- Decisão nova em `docs/00-contexto/decisoes.md` (criador de formulários: campos da v1, aviso, consentimento) e um parágrafo no `CLAUDE.md`.

## Fora de escopo
- O teste com o marketing e com o RD de verdade (054).

## Critérios de aceitação
- [ ] O seletor de seções mostra "Formulário" com miniatura.
- [ ] O e2e novo passa no `pnpm gate` (CI do PR verde).
- [ ] Guia do editor e decisão publicados no PR.

## Notas técnicas
- O e2e roda sem chave do RD: confere a gravação e a tela, não a conversão (essa é unitária, 050).

## Riscos / dependências externas
Nenhum.
