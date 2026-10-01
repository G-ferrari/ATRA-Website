# Contexto de implementação — Task 028

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/64
**Branch:** `feature/diagnostico-maturidade-dados/028-aposentar-rc18` → PR para `feature/diagnostico-maturidade-dados/integracao`

## 1. Task em uma página

```yaml
id: 028
title: Aposentar o diagnóstico RC18 — redirect para a rota nova e remoção do motor antigo
area: frontend · priority: P0 · estimate: M · depends_on: [027]  # concluída
```

**Critérios de aceitação**
- [ ] `curl -I /diagnostico-rc18` → 308/301 com `Location` na rota nova com `setor=financeiro`.
- [ ] Nenhuma referência a `diagnostico-rc18` sobra em `src/` além do valor de enum e da migração histórica.
- [ ] `lint`, `typecheck`, testes e smoke atualizados verdes.

## 2. Feature spec e decisão

- §4.2 — "Visitante abre `/diagnostico-rc18` (e-mail da campanha, favorito). Redirect permanente para `/diagnostico-maturidade?setor=financeiro`."
- §5.1 — "Diagnóstico RC18 (`/diagnostico-rc18`, §7.8) · Deixa de existir: redirect permanente · `proxy.ts` / redirects · D-35."
- **D-35** — "O diagnóstico RC18 sai: rota, motor de pontuação e formulário. O valor `rc18-diagnostic` **fica** no enum de `form-submissions`, escondido."

## 3. Inventário (grep em 26/09)

Remover: `src/app/(frontend)/[locale]/diagnostico-rc18/` (page + diagnostico.tsx), `src/actions/diagnostico-rc18.ts`, `src/lib/diagnostico-rc18.ts` + `.test.ts`, a seção `diagnosticoRc18` de `src/lib/routes.ts` (e o que dela depender: sitemap, links), a leitura de `RC18_LEAD_EMAIL` (vive na action antiga) e o `RC18_LEAD_EMAIL` do `docker-compose.prod.yml` (comentário P-29).

Ajustar comentários que citam o antigo como modelo: `actions/consultores.ts` (2), `actions/consultores.test.ts`, `lib/solicitacao-consultores.ts`, `lib/consultores.ts`, `diagnostico-maturidade/page.tsx` — apontar para os equivalentes novos (`actions/diagnostico-maturidade.ts`, `lib/diagnostico-maturidade/`).

Manter: `rc18-diagnostic` em `collections/FormSubmissions.ts` (com o `filterOptions`), em `lib/crm.ts` (`KINDS_COMERCIAIS` — registros antigos ainda sincronizam) e em `payload-types.ts`; migrações históricas.

`scripts/seed/solucoes-rc18.ts` aponta os CTAs da página RC18 para `/diagnostico-rc18` — **isso é da task 029**; aqui o redirect já cobre o link antigo.

## 4. Plano

- Redirect permanente no mecanismo do site: `next.config.ts` `redirects()` (308) ou `proxy.ts` — o comentário em `proxy.ts:34` explica a divisão (410 no proxy, 307/308 no `redirects()`). PT `/diagnostico-rc18` → `/diagnostico-maturidade?setor=financeiro`; EN `/en/rc18-diagnostic` → `/en/data-maturity-assessment?setor=financeiro`. Cuidado com a normalização de barra final e laço (CLAUDE.md, `redirectsDoNext`). Teste unitário se o mecanismo tiver função pura.
- Smoke: o teste da rota RC18 (em `e2e/smoke.spec.ts`, bloco "Feature rc18") passa a esperar o redirect; remover o teste do quick check.
- `.ksdd/tasks/feature-rc18/` — tasks 005, 006, 007: `status: cancelada` + nota "Substituída pela feature `diagnostico-maturidade-dados` (D-35)"; atualizar o README da feature rc18.
- ⚠️ Integração futura com o PR #51 (destino por formulário): ele altera `actions/diagnostico-rc18.ts`, que esta task apaga — no merge, o conflito se resolve **aceitando a remoção**.

## 5. Quality gates
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` (container; rodar `pnpm typegen` após remover a rota, e apagar `.next/types` velho se o typecheck acusar a rota removida — CLAUDE.md)
- [ ] curl no dev: `/diagnostico-rc18` e `/en/rc18-diagnostic` → 308 com o `Location` certo; a rota nova → 200
- [ ] grep final sem referências fora do permitido
