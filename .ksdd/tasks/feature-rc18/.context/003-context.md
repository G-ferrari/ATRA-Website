# Context — Task 003: página de solução RC18 (blocos + seed)

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/5
**Branch:** feature/rc18 · **Depende de:** 002 (categoria rc18) ✅

## Entregue
- `web/scripts/seed/solucoes-rc18.ts` — cria/atualiza (upsert por slug) o doc RC18
  (`category: rc18`, `icon: shield-check`, `slug: rc18`, `hasPage: true`, `_status: published`)
  e grava o layout de 9 blocos, PT + EN (EN = stub em PT). Registrado em `run.mjs`.
- Layout: pageHero → stickyPageNav → iconCardGrid (o que a norma exige, 5) →
  iconCardGrid (12 dimensões, Art. 2º) → valueCards glow (arquitetura Google Cloud, 5) →
  processSteps (roadmap 4 fases) → audienceSplit (por que ATRA) → ctaBanner dark
  (diagnóstico) → ctaContact (form-only; cartão vem na 004).

## Conteúdo (fonte)
- 12 dimensões: texto oficial do Art. 2º da Resolução Conjunta nº 18/2025 (BCB), confirmado.
- Arquitetura GCP e roadmap: RC18_2026.pdf. Prazo 31/12/2026, relatório semestral, dossiê 5 anos.
- Cópia é rascunho (D-22): marketing refina no CMS.

## Gotchas pagas nesta task
1. **`methodCards.items` tem `maxRows: 3`** — o roadmap tem 4 fases. Trocado para
   `processSteps` (numerado, sem limite).
2. **`href` do CTA NÃO é `localized`** — gravar `/en/...` no passo EN sobrescrevia o PT na
   mesma coluna (a PT servia `/en/rc18-diagnostic`). Um único path `/diagnostico-rc18` para
   os dois locales, como os demais seeds (`/chat`, `#contato`).
3. **`icon` dos blocos é união fechada** — o conteúdo guarda string; casar com
   `Icone = (typeof ICONES)[number]` na montagem, senão `tsc` reprova (runtime era válido).

## Verificação
- `pnpm seed` (só o RC18): "1 página, 9 blocos, 2 idiomas". Idempotente.
- `/solucoes/rc18`, `/en/solutions/rc18`, `/solucoes` → 200. RC18 no índice e nos anchors
  (o-que-exige, dimensoes, arquitetura, roadmap, por-que-atra, contato).
- CTA de diagnóstico → `href="/diagnostico-rc18"` nos dois locales (rota chega na 006).
- Visual conferido no navegador (tema escuro): hero on-brand (métricas 12/4/5), page nav,
  glow cards da arquitetura, formulário de contato. Design system respeitado.
- `pnpm typecheck` + `pnpm lint` verdes.

## Pendências repassadas
- Cartão de contato + variante com foto (padrão da home) → task 004.
- Rota `/diagnostico-rc18` (o CTA aponta para ela) → task 006.
- RC18 não entra no rodapé (global `Footer` é curado à parte) — fora de escopo.
