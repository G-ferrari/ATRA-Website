# Contexto de implementação — Task 030

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/68
**Branch:** `feature/diagnostico-maturidade-dados/030-e2e` → PR para `feature/diagnostico-maturidade-dados/integracao`

## 1. Task em uma página

```yaml
id: 030
title: SEO, smoke e e2e de comportamento do diagnóstico
area: qa · priority: P1 · estimate: M · depends_on: [027, 028]  # concluídas
```

**Objetivo.** Cobrir o diagnóstico por comportamento — como `/consultores` (D-34) —, já que ele não tem gabarito visual no protótipo.

**Critérios de aceitação**
- [ ] Specs verdes no container oficial do Playwright.
- [ ] Nenhuma fixture inventada vai ao ar sem `SEED_FIXTURES=1`.

## 2. Escopo (task)

- Smoke: `/diagnostico-maturidade` e rota EN → 200 com `noindex`; `/diagnostico-rc18` → redirect; fora do sitemap.
- `e2e/diagnostico-maturidade.spec.ts` nas 3 larguras: setor pela URL; contagem de perguntas de um setor; avanço automático desligado sob `?e2e=1` e `prefers-reduced-motion`; voltar; e-mail pessoal recusado; envio sem consentimento bloqueado; envio válido chega à conclusão sem nenhum número do resultado; registro gravado com `kind` e grupo do diagnóstico (consulta ao banco de teste).
- Fixture de seed para o e2e só com `SEED_FIXTURES=1`.

## 3. Arquitetura (§9) e precedente

- "**E2E (Playwright):** `baseline`, `visual`, `smoke`, `contraste`, `acessibilidade`, `redirects`, `paridade-ds`." — o diagnóstico entra como spec de comportamento, no molde de `e2e/consultores.spec.ts` (D-34).
- A suíte roda na imagem oficial `mcr.microsoft.com/playwright:v1.62.1-noble` (a mesma do `scripts/gate.mjs`), **presente nesta máquina**.

## 4. Plano

- Ler `web/scripts/gate.mjs` e `web/playwright.config.ts` para rodar só os specs desta task contra o servidor de dev (`http://localhost:3000`), dentro da imagem oficial, sem o build de produção do gate.
- `e2e/diagnostico-maturidade.spec.ts` (padrão `consultores.spec.ts`): cenários da §2; a verificação no banco pode ser pela API do Payload em modo de teste ou pelo que `consultores.spec.ts` já faz para confirmar envios — seguir o precedente; apagar os leads criados pelo teste.
- Sitemap: conferir que `/diagnostico-maturidade` não entra (é `noindex`); se entrar, tirar.
- Smoke já tem as rotas PT/EN, o `noindex` e o redirect (tasks 026 e 028) — completar o que faltar.

## 5. Quality gates
- [ ] Specs desta task verdes na imagem oficial, nas 3 larguras
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`
