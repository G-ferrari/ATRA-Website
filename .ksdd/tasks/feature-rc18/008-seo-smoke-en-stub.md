---
id: 008
title: SEO, JSON-LD, smoke e EN stub das rotas RC18
status: em revisão
feature: rc18
area: qa
priority: P1
estimate: M
depends_on: [003, 006]
feature_refs:
  - ".ksdd/features/FEATURE-rc18.md#10-criterios-de-aceite"
  - ".ksdd/features/FEATURE-rc18.md#93-riscos"
spec_refs:
  - ".ksdd/specs/SPEC.md#75-segmentos-segmentos-slug"
  - ".ksdd/specs/SPEC.md#135-descoberta-organica-seo"
arch_refs:
  - ".ksdd/specs/architecture.md#9-estrategia-de-testes"
---

# 008 — SEO, JSON-LD, smoke e EN stub das rotas RC18

## Objetivo
Garantir que `/solucoes/rc18` e `/diagnostico-rc18` sejam indexáveis, tenham metadata/JSON-LD
coerentes, resolvam em EN sem quebrar, e estejam cobertas por smoke (a rede que já pegou
rotas "done" mais curtas que o esperado).

## Escopo
- Conferir/definir `generateMetadata` (title, description, OG) e `hreflang` recíproco das
  duas rotas; JSON-LD: `Service` na página RC18 (já emitido pela rota `[slug]`) e um
  `WebPage`/`Service` no diagnóstico.
- Adicionar as duas rotas ao smoke (`web/e2e/smoke.spec.ts`): 200 por idioma disponível
  (PT; EN conforme o stub/redirect definido). **Não** entram no gate visual (rota nova sem
  gabarito legado — padrão de `/segmentos`, SPEC §7.5).
- Garantir que o sitemap inclua `/solucoes/rc18` (via coleção) e decidir se o diagnóstico
  entra no sitemap (rota de conversão — provável `noindex` no diagnóstico; página RC18
  indexável).
- Formalizar o comportamento EN (stub/redirect) das duas rotas, sem 404 nem erro de build.

## Fora de escopo
- Tradução EN completa (FEATURE §2.2).
- Reativar o gate do CI (desligado por decisão, 26/08) — fora desta feature.
- Otimização de Lighthouse além do que o padrão do site já entrega.

## Critérios de aceitação
- [ ] `/solucoes/rc18` e `/diagnostico-rc18` respondem 200 (PT) no smoke; EN resolve sem 404.
- [ ] Ambas têm `<title>`/description/OG e `hreflang` corretos; a página RC18 tem JSON-LD
      `Service`.
- [ ] `/solucoes/rc18` aparece no sitemap; o diagnóstico segue a decisão de indexação
      (documentada no PR).
- [ ] `pnpm test:e2e` (smoke) verde para as rotas novas; `pnpm typecheck` e `pnpm lint` verdes.

## Notas técnicas
- O smoke confere que a página **responde**, não que está inteira — a completude do conteúdo
  é responsabilidade das tasks 003/006 (nota da Fase 3 em `docs/03-plano/tasks.md`).
- Metadata vem de `toSeo` + `metadataDe`; JSON-LD via helper `servico(...)` já usado na rota
  de solução.
- Diagnóstico como página de conversão: avaliar `noindex` (não é conteúdo de SEO, é ferramenta).

## Riscos / dependências externas
- Depende de as duas telas existirem (tasks 003 e 006). Sem elas o smoke não tem o que medir.
