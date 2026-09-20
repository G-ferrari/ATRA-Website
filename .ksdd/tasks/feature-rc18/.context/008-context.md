# Context — Task 008: SEO, JSON-LD, smoke e EN das rotas RC18

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/10
**Branch:** feature/rc18 · **Depende de:** 003 ✅, 006 ✅

## Entregue
- `web/e2e/smoke.spec.ts`:
  - Contagens do índice `/solucoes` ajustadas pela chegada da RC18: **19** soluções (era 18),
    **4** categorias (era 3, +RC18), **14** links `hasPage` (era 13), com asserção de que
    `/solucoes/rc18` está entre eles.
  - Novo bloco "RC 18/2025 — página e diagnóstico": `/solucoes/rc18` e `/en/solutions/rc18`
    = 200; a página é indexável e declara `Service`; `/diagnostico-rc18` e `/en/rc18-diagnostic`
    = 200 e são `noindex`; a autoavaliação calcula o índice (12 no máximo → Avançado).

## Verificação (via HTTP + navegador)
- `/solucoes/rc18`: no sitemap, `Service` JSON-LD, **sem** noindex, hreflang (en/pt-BR/x-default)
  + canonical — igual às outras soluções.
- `/diagnostico-rc18`: **noindex**, **fora** do sitemap (rota não-coleção, ferramenta).
- EN: `/en/solutions/rc18` e `/en/rc18-diagnostic` = 200.
- `typecheck` + `lint` verdes.

## Pendência honesta
- As contagens novas (19/14/4) são deltas determinísticos da RC18 sobre o baseline do gate
  (18/13/3 com `SEED_FIXTURES=1`), verificados por lógica + curl, **não** por uma corrida
  completa de `pnpm gate` (que exige build de produção + container Playwright + fixtures). O
  gate do CI está desligado (26/08); `pnpm gate` local é o aceite e religá-lo é pré-requisito
  do cutover — a confirmação final das contagens acontece lá.
