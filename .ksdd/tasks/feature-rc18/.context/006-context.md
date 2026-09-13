# Context — Task 006: rota e ilha do diagnóstico RC18

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/8
**Branch:** feature/rc18 · **Depende de:** 005 ✅

## Entregue
- `web/src/lib/routes.ts` — nova seção `diagnosticoRc18: { pt: 'diagnostico-rc18', en: 'rc18-diagnostic' }`
  em `SECOES`. O proxy resolve o alias EN via `canonizarSegmento`/`aliasEsperado` (genérico).
- `web/src/app/(frontend)/[locale]/diagnostico-rc18/page.tsx` — Server Component: metadata
  `noindex` (é ferramenta, como `/chat`), locale via `next/root-params`, e o `hrefContato`
  do resultado montado por `hrefDe('solucoes', locale, 'rc18') + '#contato'` (regra 6).
- `web/src/app/(frontend)/[locale]/diagnostico-rc18/diagnostico.tsx` — ilha cliente:
  questionário das 12 dimensões (0–3), barra de progresso, cálculo na hora via
  `calcularIndice` (lib da 005), tela de resultado (índice %, faixa, detalhe por dimensão
  com lacunas), CTA "Falar com um especialista" + "Refazer". Sem `motion` (transições CSS).

## Verificação
- `/diagnostico-rc18` e `/en/rc18-diagnostic` → 200. Questionário renderiza as 12 dimensões.
- Fluxo interativo conferido no navegador: respondi as 12 no nível 3 → progresso 100% →
  "Ver minha prontidão" → resultado **100% · Avançado**, detalhe por dimensão, CTAs. Bate
  com a lib (unit-tested). Visual on-brand (tema escuro, gradiente no índice).
- `typegen` + `typecheck` + `lint` verdes.

## Pendências repassadas
- Captura de lead **no próprio diagnóstico** (formulário + Server Action + kind + CRM) → task 007.
  Hoje o CTA do resultado leva ao formulário da página `/solucoes/rc18#contato`.
- Decisão de indexação/sitemap e smoke das rotas → task 008 (já deixei `noindex` como padrão de ferramenta).
