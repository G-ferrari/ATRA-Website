---
id: 035
title: Criar os blocos "Lista da seção" e "Destaques da seção" e o resolvedor da página-mestra
status: em revisão
feature: paginas-mestras
area: backend
priority: P0
estimate: L
depends_on: [034]
feature_refs:
  - ".ksdd/features/FEATURE-paginas-mestras.md#2-escopo"
  - ".ksdd/features/FEATURE-paginas-mestras.md#6-impacto-no-modelo-de-dados"
  - ".ksdd/features/FEATURE-paginas-mestras.md#7-impacto-na-api"
  - ".ksdd/features/FEATURE-paginas-mestras.md#8-impacto-no-design"
spec_refs:
  - ".ksdd/specs/SPEC.md#7-estrutura-de-páginas-e-telas"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-009--componente-não-conhece-o-cms-mappers-como-fronteira-regra-3"
  - ".ksdd/specs/architecture.md#adr-007--revalidação-em-processo-ao-publicar-mig-143"
---

# 035 — Criar os blocos "Lista da seção" e "Destaques da seção" e o resolvedor da página-mestra

## Objetivo
Ter os dois blocos que levam a parte automática de cada seção para dentro do layout da Página, e um resolvedor que busca a página-mestra e injeta os dados da lista — a peça que as rotas de seção vão usar.

## Escopo
- Bloco `sectionListing` ("Lista da seção"): linha de apoio, título, destaque e texto de abertura opcionais; sem escolher a seção (vem da página).
- Bloco `sectionFeatured` ("Destaques da seção"): sem campos de conteúdo além de opções mínimas (ex.: rótulo do botão), automático.
- Tipos de apresentação em `types/content.ts`, mappers em `lib/mappers/blocks.ts`, registro em `RenderBlocks`.
- `resolverPaginaMestra(secao, locale, opções)` em `lib/paginas.ts`: busca a página pela seção (publicada; rascunho no preview), monta os blocos e injeta os dados da lista/destaques da seção — consultas com `select` e filtro de publicado.
- Despacho por seção dentro dos blocos (qual lista e qual carrossel desenhar), reaproveitando os componentes atuais.
- Blocos só válidos em página-mestra: em página comum, não renderizam (e o admin avisa).
- Miniaturas dos dois blocos no seletor de seções.
- Migração de schema + inclusão na migração antecipada (tabelas dos blocos novos são lidas por toda consulta a `pages`).

## Fora de escopo
- Ligar cada rota (036–040).

## Critérios de aceitação
- [ ] Blocos aparecem no seletor com miniatura, no grupo certo.
- [ ] Página-mestra de teste com os dois blocos renderiza a lista e o carrossel da seção.
- [ ] Em página comum os blocos não quebram a página.
- [ ] Rascunho de conteúdo (post, case…) nunca aparece na lista.
- [ ] Testes dos mappers e do resolvedor.
- [ ] `pnpm migrate` num banco zerado passa.

## Notas técnicas
`resolverPagina` (`lib/paginas.ts:19`) já injeta vagas, clientes, parceiros e depoimentos — seguir o mesmo desenho. `select` é obrigatório em `solutions`/`segments` (18–23 s sem ele). Componentes não importam `@/payload-types`.

## Riscos / dependências externas
Bloco novo = tabela nova lida por toda consulta a `pages` → migração antecipada.
