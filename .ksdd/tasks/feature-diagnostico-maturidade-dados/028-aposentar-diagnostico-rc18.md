---
id: 028
title: Aposentar o diagnóstico RC18 — redirect para a rota nova e remoção do motor antigo
status: para implementar
feature: diagnostico-maturidade-dados
area: frontend
priority: P0
estimate: M
depends_on: [027]
feature_refs:
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#42-link-antigo-do-diagnostico-rc18"
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#51-telas-modificadas"
spec_refs:
  - ".ksdd/specs/SPEC.md#78-interativas--internas"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-003--i18n-pt-na-raiz-en-em-en-com-slugs-traduzidos-d-07"
---

# 028 — Aposentar o diagnóstico RC18 — redirect para a rota nova e remoção do motor antigo

## Objetivo
Cumprir a D-35: um diagnóstico só no site. Só entra **depois** que o novo estiver completo (task 027) — até lá o RC18 continua no ar.

## Escopo
- `/diagnostico-rc18` e `/en/rc18-diagnostic` → redirect permanente para `/diagnostico-maturidade?setor=financeiro` (e equivalente EN), no mecanismo de redirects do site (`proxy.ts`/`redirects()`), sem laço (CLAUDE.md: `redirectsDoNext` descarta origem = destino).
- Remover a rota, `lib/diagnostico-rc18.ts` (+ teste), `actions/diagnostico-rc18.ts` e a leitura de `RC18_LEAD_EMAIL`; tirar a entrada de `routes.ts`/sitemap.
- Smoke: o teste da rota RC18 passa a esperar o redirect.
- `.ksdd/tasks/feature-rc18/` — tasks 005–007 com status `cancelada` e nota "substituída pela feature diagnostico-maturidade-dados (D-35)".

## Fora de escopo
- Remover `rc18-diagnostic` do enum (fica, D-35). A página `/solucoes/rc18` (task 029).

## Critérios de aceitação
- [ ] `curl -I /diagnostico-rc18` → 308/301 com `Location` na rota nova com `setor=financeiro`.
- [ ] Nenhuma referência a `diagnostico-rc18` sobra em `src/` além do valor de enum e da migração histórica.
- [ ] `lint`, `typecheck`, testes e smoke atualizados verdes.

## Notas técnicas
- Registros antigos `rc18-diagnostic` continuam no admin (a task 023 os mantém legíveis).

## Riscos / dependências externas
- Nenhum.
