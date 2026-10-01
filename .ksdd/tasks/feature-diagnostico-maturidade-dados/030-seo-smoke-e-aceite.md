---
id: 030
title: SEO, smoke e e2e de comportamento do diagnóstico
status: concluída
feature: diagnostico-maturidade-dados
area: qa
priority: P1
estimate: M
depends_on: [027, 028]
feature_refs:
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#10-criterios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#10-responsividade"
arch_refs:
  - ".ksdd/specs/architecture.md#9-estrategia-de-testes"
---

# 030 — SEO, smoke e e2e de comportamento do diagnóstico

## Objetivo
Cobrir o diagnóstico por comportamento — como `/consultores` (D-34) —, já que ele não tem gabarito visual no protótipo.

## Escopo
- Smoke: `/diagnostico-maturidade` e rota EN → 200 com `noindex`; `/diagnostico-rc18` → redirect; fora do sitemap.
- `e2e/diagnostico-maturidade.spec.ts` nas 3 larguras: setor pela URL; contagem de perguntas de um setor; avanço automático desligado sob `?e2e=1` e `prefers-reduced-motion`; voltar; e-mail pessoal recusado; envio sem consentimento bloqueado; envio válido chega à conclusão sem nenhum número do resultado; registro gravado com `kind` e grupo do diagnóstico (consulta ao banco de teste).
- Fixture de seed para o e2e só com `SEED_FIXTURES=1` (CLAUDE.md).

## Fora de escopo
- Pixel (P-30 / D-38).

## Critérios de aceitação
- [ ] Specs verdes no container oficial do Playwright (`pnpm gate` ou executor do CI religado).
- [ ] Nenhuma fixture inventada vai ao ar sem `SEED_FIXTURES=1`.

## Notas técnicas
- Hover e troca por teclado: ver as armadilhas de `hover()` e `toPass` no CLAUDE.md.

## Riscos / dependências externas
- Sem Playwright local e com o job do CI desligado, a suíte só roda quando o CI for religado (D-38, pendente).
