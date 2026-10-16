---
id: 046
title: E-book — identificador no RD por material e formulário depois do texto
status: para implementar
feature: rd-station-formularios
area: frontend
priority: P0
estimate: M
depends_on: [044]
feature_refs:
  - ".ksdd/features/FEATURE-rd-station-formularios.md#42-download-de-e-book"
  - ".ksdd/features/FEATURE-rd-station-formularios.md#51-telas-modificadas"
  - ".ksdd/features/FEATURE-rd-station-formularios.md#62-alterações-em-entidades-existentes"
  - ".ksdd/features/FEATURE-rd-station-formularios.md#10-critérios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#76-conteúdo-editorial"
  - ".ksdd/specs/SPEC.md#133-download-de-material-gated"
arch_refs:
  - ".ksdd/specs/architecture.md#31-conteúdo-com-página-própria-drafts--slug-localizado"
  - ".ksdd/specs/architecture.md#adr-009--componente-não-conhece-o-cms-mappers-como-fronteira-regra-3"
---

# 046 — E-book: identificador por material e formulário depois do texto

## Objetivo
O RD saber qual e-book foi baixado (cada um com automação e segmentação próprias) e o visitante ler o conteúdo antes de chegar ao formulário — pedido da Taci (14/10).

## Escopo
- `resources`: campo "Identificador no RD" (`rdConversionIdentifier`, texto opcional, mesma validação da 043), na lateral do documento, com descrição dizendo que vazio vale `ebook-<slug>`.
- Gancho de RD: `material-download` usa o identificador do material; vazio, `ebook-<slug>` (o slug em português). Consulta ao material com `select` (só slug e identificador).
- Página do e-book (`components/content/pagina-de-material.tsx`):
  - o `DownloadGate` sai do herói e vai para depois do corpo, antes de `ChamadaFinal` ("Entre em contato"), com âncora (`#baixar`);
  - com PDF, o herói mantém um botão que leva ao formulário; sem PDF, o estado atual (botão inativo) fica como está [a confirmar com a Taci: botão no herói];
  - o formulário legível no fundo da página, nos dois temas e no celular.
- Migração de schema (e a antecipada, se alguma migração de dados ler `resources` com o config de hoje).
- Guia do editor: o campo novo e para que serve.

## Fora de escopo
- Mandar o e-book por e-mail (FEATURE 2.2).
- Os PDFs dos materiais (P-07, conteúdo).
- A ordem ou o texto dos blocos da página.

## Critérios de aceitação
- [ ] Teste: download de material com identificador → conversão com ele; sem → `ebook-<slug>`.
- [ ] E2E: na página de um e-book com PDF, o formulário vem depois do texto e antes de "Entre em contato"; o botão do herói rola até ele; nos três tamanhos de tela.
- [ ] Contraste e axe sem regressão na rota do e-book, nos dois temas.
- [ ] O download continua liberado na hora, com ou sem RD (URL assinada de 15 min).
- [ ] `migrate:create` sem diferença; migrações em banco zerado.

## Notas técnicas
- Sem PDF não há formulário (regra de MIG-104): para o e2e, a fixture do seed (`SEED_FIXTURES=1`) precisa de um material com arquivo, ou o teste sobe um PDF mínimo válido (o Payload exige `%PDF-` e `xref`/`%%EOF` no fim — `utilities/validatePDF`).
- O card do e-book clicável inteiro (#126) não muda.

## Riscos / dependências externas
- PDFs reais dos e-books (P-07) para o teste de ponta a ponta na homologação (047).
