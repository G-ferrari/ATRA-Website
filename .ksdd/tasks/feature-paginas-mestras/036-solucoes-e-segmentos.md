---
id: 036
title: Montar /solucoes e /segmentos pela página-mestra
status: para implementar
feature: paginas-mestras
area: frontend
priority: P0
estimate: M
depends_on: [035]
feature_refs:
  - ".ksdd/features/FEATURE-paginas-mestras.md#2-escopo"
  - ".ksdd/features/FEATURE-paginas-mestras.md#5-impacto-em-telas-existentes"
  - ".ksdd/features/FEATURE-paginas-mestras.md#10-criterios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#74-soluções-solucoes--slug"
  - ".ksdd/specs/SPEC.md#75-segmentos-segmentos--slug"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-003--i18n-pt-na-raiz-en-em-en-com-slugs-traduzidos-d-07"
---

# 036 — Montar /solucoes e /segmentos pela página-mestra

## Objetivo
Tirar do código o topo, os textos e o SEO de Soluções e Segmentos, que passam a vir da página-mestra (topo `pageHero` + "Lista da seção").

## Escopo
- Rotas leem a página-mestra; 404 se despublicada.
- Lista da seção: grade por aba (soluções, com selo) e grade de segmentos (com a contagem no chip, se mantida).
- Metadata pelo `seo` da página.
- Conteúdo inicial (PT/EN, literal de `TEXTOS`/`META` de hoje) num módulo em `src/migrations/arquivos/paginas-mestras/` usado pela migração (041) e pelo seed.
- Remover `TEXTOS`/`META` das rotas.

## Fora de escopo
- Página de cada solução/segmento (`[slug]`).

## Critérios de aceitação
- [ ] Visual igual ao de hoje (captura antes/depois, 3 tamanhos, 2 temas).
- [ ] Título e descrição de SEO iguais.
- [ ] Editar o título no admin muda a página após publicar.
- [ ] EN responde em `/en/solutions` e `/en/segments`.

## Notas técnicas
O topo atual das duas é o mesmo cartão do `BlocoHero` (selo, etiqueta, título com destaque) — usar `pageHero`. O chip "4 frentes"/contagem: decidir se vira texto do admin ou continua calculado.

## Riscos / dependências externas

