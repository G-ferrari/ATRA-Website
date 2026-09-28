---
id: 032
title: Catálogo interno com os 28 blocos e dados de exemplo, fora da produção
status: cancelada
feature: seletor-de-secoes
area: frontend
priority: P0
estimate: M
depends_on: []
feature_refs:
  - ".ksdd/features/FEATURE-seletor-de-secoes.md#52-telas-novas"
  - ".ksdd/features/FEATURE-seletor-de-secoes.md#92-riscos"
spec_refs:
  - ".ksdd/specs/SPEC.md#78-interativas--internas"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-009--componente-nao-conhece-o-cms-mappers-como-fronteira-regra-3"
---

# 032 — Catálogo interno com os 28 blocos e dados de exemplo, fora da produção

> **Cancelada em 28/09.** Os 28 blocos já aparecem em páginas reais do site, então a miniatura (033) é capturada da própria página — mais fiel e sem rota extra a esconder da produção. Ver `.context/033-context.md` §2.

## Objetivo
Uma página que renderiza cada bloco com o componente de verdade e dados de exemplo, um abaixo do outro, identificável pelo slug — a fonte das miniaturas (033), inclusive dos blocos que hoje não aparecem em nenhuma página.

## Escopo
- Rota interna (nome a definir; ⚠️ pasta com `_` no App Router é privada e não vira rota) que responde **404 quando `NODE_ENV === 'production'`** e fora do e2e.
- Dados de exemplo por bloco **no formato de apresentação** (`web/src/types/content.ts`), passados ao `RenderBlocks` — sem CMS, sem banco.
- Cada bloco envolto num marcador estável (`data-bloco="<slug>"`) para o script recortar.
- `noindex`, fora do sitemap.
- Teste: no build de produção a rota responde 404.

## Fora de escopo
- Captura e miniaturas (033).
- Qualquer conteúdo de exemplo no CMS ou em página pública (D-22).

## Critérios de aceitação
- [ ] Os 28 blocos aparecem no catálogo em desenvolvimento, cada um com `data-bloco`.
- [ ] Build de produção: a rota responde 404 (teste).
- [ ] Rota fora do sitemap e com `noindex`.
- [ ] Nenhum dado de exemplo vai ao CMS.
- [ ] `lint`, `typecheck`, `test` verdes.

## Notas técnicas
- Reusa `RenderBlocks` — a miniatura tem que ser o componente real (FEATURE §8.1).
- Blocos que dependem de dado da página (vagas, parceiros, insights) recebem os dados de exemplo pelas props que a página injetaria.
- Imagens de exemplo: as do protótipo em `legacy/public/imagens/` já usadas pelo seed com `SEED_FIXTURES=1` (D-27), servidas só no catálogo.

## Riscos / dependências externas
- Bloco com lógica de cliente (carrosséis) precisa ficar parado para a captura: usar o mesmo `?e2e=1` que congela carrossel e rotação.
