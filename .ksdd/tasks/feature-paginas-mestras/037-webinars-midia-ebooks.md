---
id: 037
title: Montar /webinars, /atra-na-midia e /ebooks pela página-mestra
status: em revisão
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
  - ".ksdd/specs/SPEC.md#76-conteúdo-editorial"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-003--i18n-pt-na-raiz-en-em-en-com-slugs-traduzidos-d-07"
---

# 037 — Montar /webinars, /atra-na-midia e /ebooks pela página-mestra

## Objetivo
Passar as três seções de destaque + grade para a página-mestra: carrossel em "Destaques da seção", grade em "Lista da seção", textos e SEO no admin.

## Escopo
- Destaques: `FeaturedHero` nas variantes de cada seção (webinars; matérias com link externo e rótulo por item; e-books com capa).
- Lista: grade de cada seção com cartão inteiro clicável (como hoje).
- ATRA na mídia: título, destaque e os dois parágrafos de abertura na "Lista da seção"; a faixa final vira bloco `ctaBanner` padrão.
- Conteúdo inicial PT/EN literal num módulo de `arquivos/paginas-mestras/`.
- Remover `TEXTOS` das rotas; 404 se despublicada.

## Fora de escopo
- Página de cada webinar/e-book.

## Critérios de aceitação
- [ ] Visual igual ao de hoje nas três (captura antes/depois).
- [ ] SEO igual.
- [ ] h1 continua único (hoje a mídia alterna h1/h2 conforme há destaque).
- [ ] EN responde nos slugs traduzidos.

## Notas técnicas
`atra-na-midia/page.tsx` troca `h1`↔`h2` conforme há destaque — manter no bloco. Rótulos de botão ("Leia a matéria", "Assistir") podem virar campo do bloco ou ficar como texto de interface.

## Riscos / dependências externas

