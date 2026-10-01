---
id: 006
title: Rota e ilha do diagnóstico RC18 (autoavaliação com nota na hora)
status: cancelada
feature: rc18
area: frontend
priority: P0
estimate: L
depends_on: [005]
feature_refs:
  - ".ksdd/features/FEATURE-rc18.md#52-telas-novas"
  - ".ksdd/features/FEATURE-rc18.md#41-da-campanha-ao-lead-qualificado-fluxo-principal"
spec_refs:
  - ".ksdd/specs/SPEC.md#78-interativas-internas"
  - ".ksdd/specs/SPEC.md#10-responsividade"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-003-i18n-pt-na-raiz-en-em-en-com-slugs-traduzidos-d-07"
---

# 006 — Rota e ilha do diagnóstico RC18 (autoavaliação com nota na hora)

> **Cancelada.** Substituída pela feature `diagnostico-maturidade-dados` (D-35, 26/09/2026).

## Objetivo
Entregar a página `/diagnostico-rc18` com a autoavaliação interativa: o visitante responde
as 12 dimensões e vê o índice de prontidão na tela na hora, no visual da ATRA.

## Escopo
- Registrar a seção no `web/src/lib/routes.ts` (`SECOES`):
  `diagnosticoRc18: { pt: 'diagnostico-rc18', en: 'rc18-diagnostic' }` (regra 6). Conferir
  que `proxy.ts` (via `canonizarSegmento`/`aliasEsperado`) resolve o segmento EN → path PT.
- Criar `web/src/app/(frontend)/[locale]/diagnostico-rc18/page.tsx` — Server Component:
  metadata (`generateMetadata`), JSON-LD, e render de uma ilha cliente. **Não** colocar sob
  `/solucoes/rc18/...` (colidiria com a rota dinâmica `[slug]`).
- Criar a ilha cliente `diagnostico-rc18/*.tsx`: passos da autoavaliação (uma dimensão por
  vez ou lista), estado de respostas, cálculo via `lib/diagnostico-rc18.ts` (task 005),
  tela de resultado (índice + leitura por dimensão), e o formulário de contato para receber
  o retorno. A submissão em si é a task 007 (esta task deixa o `<form>` pronto e chamando um
  stub/placeholder da action).
- Visual pelo design system: `GlowCard`, `MetricChip`, `pill-btn-*`, gradiente da marca,
  Mona Sans peso 300 em títulos, `rounded-[6px]`; cor sempre em par claro/escuro com o valor
  escuro por último (DESIGN.md).
- PT-only na v1: em locale EN, redirecionar para a versão PT (ou renderizar PT), sem 404.

## Fora de escopo
- A lógica de score (vem da lib da task 005).
- A gravação do lead / Server Action / CRM (task 007).
- Entrar no gate visual (rota nova sem gabarito — cobertura é smoke, task 008).

## Critérios de aceitação
- [ ] `/diagnostico-rc18` responde 200 (PT) e é acessível pelo botão da página RC18.
- [ ] O visitante responde as 12 dimensões e vê o **índice de prontidão** na tela em < 1s,
      sem reload, com leitura por dimensão.
- [ ] O resultado usa os tokens/visual da ATRA e é legível nos dois temas (claro/escuro).
- [ ] Responsivo nos 3 breakpoints (375/768/1280) — uma dimensão por vez / coluna única no
      mobile.
- [ ] Locale EN não dá 404 (redirect/stub); `pnpm typecheck` e `pnpm lint` verdes.

## Notas técnicas
- Ler o locale por `next/root-params` (`getLocale()`), como as demais rotas do App Router
  desta versão do Next (ver `web/AGENTS.md`).
- Ilha cliente recebe tudo por props (regra 4: página resolve dado/serviço, ilha é interativa).
- Congelar animações com `?e2e=1` se a ilha animar entradas (`lib/e2e.ts`), para o smoke.
- Botão de origem: o `ctaBanner.secondaryCta` da task 003 já aponta para esta rota via
  `hrefDe('diagnosticoRc18', locale)`.

## Riscos / dependências externas
- Nova seção em `routes.ts` + `proxy.ts`: validar que o segmento PT (`diagnostico-rc18`) é o
  path de arquivo e o EN é reescrito para ele (padrão dos slugs traduzidos, ADR-003).
