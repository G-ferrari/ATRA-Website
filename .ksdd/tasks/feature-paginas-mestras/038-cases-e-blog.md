---
id: 038
title: Montar /cases-de-sucesso e /blog (com /blog/pagina/N) pela página-mestra
status: em revisão
feature: paginas-mestras
area: frontend
priority: P0
estimate: L
depends_on: [035]
feature_refs:
  - ".ksdd/features/FEATURE-paginas-mestras.md#2-escopo"
  - ".ksdd/features/FEATURE-paginas-mestras.md#5-impacto-em-telas-existentes"
  - ".ksdd/features/FEATURE-paginas-mestras.md#9-dependencias-e-riscos"
  - ".ksdd/features/FEATURE-paginas-mestras.md#10-criterios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#73-cases-cases-de-sucesso--slug"
  - ".ksdd/specs/SPEC.md#76-conteúdo-editorial"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-003--i18n-pt-na-raiz-en-em-en-com-slugs-traduzidos-d-07"
---

# 038 — Montar /cases-de-sucesso e /blog (com /blog/pagina/N) pela página-mestra

## Objetivo
Passar as duas listas com filtro para a página-mestra, sem perder busca, filtros, paginação nem o aviso de rascunho incompleto.

## Escopo
- Cases: destaques + `ListaDeCases` (filtro por tópico, busca) dentro da "Lista da seção"; `RascunhoIncompleto` no preview.
- Blog: destaques só na página 1; `ListaDeArtigos` com busca, filtro e paginação; `/blog/pagina/N` e o seu `generateStaticParams` leem a mesma página-mestra; canônica por página como hoje.
- Teaser de webinar do fim do blog: vira bloco editável (ou parte da lista com textos no admin) — mantendo a capa automática do último webinar.
- Conteúdo inicial PT/EN literal; remover `TEXTOS`/`CATEGORIAS` das rotas.

## Fora de escopo
- Página de cada artigo/case.
- Mudar o tamanho da página (12) ou a ordem.

## Critérios de aceitação
- [ ] Visual igual ao de hoje em /cases-de-sucesso, /blog e /blog/pagina/2.
- [ ] Busca, filtro e paginação funcionando (e2e existentes verdes).
- [ ] `/blog/pagina/1` continua redirecionando para `/blog`.
- [ ] SEO e canônica iguais.

## Notas técnicas
O título do blog alterna h1/h2 entre a página 1 e as demais. `metadataDoBlog` monta título e canônica por página — passar a usar o `seo` da página-mestra como base.

## Riscos / dependências externas
`generateStaticParams` da paginação conta posts no build — a página-mestra precisa existir no banco do build.
