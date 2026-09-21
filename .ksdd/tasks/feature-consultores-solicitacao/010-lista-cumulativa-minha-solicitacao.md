---
id: 010
title: Lista cumulativa "Minha solicitação" com quantidade por perfil
status: para implementar
feature: consultores-solicitacao
area: frontend
priority: P0
estimate: L
depends_on: [009]
feature_refs:
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#21-o-que-entra-v1"
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#41-do-filtro-ao-pedido-fluxo-principal"
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#82-componentes-novos-necessarios"
spec_refs:
  - ".ksdd/specs/SPEC.md#9-touchpoints-criticos"
  - ".ksdd/specs/SPEC.md#8-componentes-globais-reutilizaveis"
arch_refs:
  - ".ksdd/specs/architecture.md#10-decisoes-arquiteturais-significativas-adrs"
---

# 010 — Lista cumulativa "Minha solicitação" com quantidade por perfil

## Objetivo
Dar ao visitante um lugar para juntar os perfis que precisa e dizer quantas
pessoas de cada — substituindo o "Solicitar" que hoje joga o contexto fora ao
navegar para `/contato`.

## Escopo
- Estado `escolhidos: Map<slug, quantidade>` na ilha
  `lista-de-consultores.tsx`, com ordem de inserção preservada.
- **"Solicitar" do card** (`:296-306`) deixa de ser `<Link href={contatoHref}>` e
  vira `<button>` que adiciona o perfil; com o perfil já na lista, o botão mostra
  o estado "já na lista" e remove ao clicar de novo.
- **"Solicitar este Profissional" do modal** (`:420-434`) adiciona e fecha o
  modal.
- Painel **"Minha solicitação"** entre a grade de perfis e a seção de
  diferenciais: um item por perfil escolhido (sigla, cargo, nível), **stepper de
  quantidade** (mínimo 1, teto 20), botão de remover, e botão de enviar que rola
  até `#solicitar-consultores`.
- Painel **não renderiza** quando a lista está vazia.
- Remover a prop `contatoHref` de `ListaDeConsultores` se ela ficar sem uso, e o
  `hrefDe('contato', locale)` correspondente em `consultores/page.tsx:206` —
  junto com o import, se órfão.
- Atualizar `web/e2e/smoke.spec.ts:364-374`: os 8 "Solicitar" viram `button`, não
  `link`.
- Rótulos em PT e EN.

## Fora de escopo
- Ligar o envio (tasks 011–013): o botão de enviar apenas rola até a seção.
- CTA "Não encontrou um consultor nesta lista?" (task 014).
- Persistir a lista entre visitas — v1 é estado de sessão da página
  (FEATURE §2.2).
- Regravação do gabarito (task 016).

## Critérios de aceitação
- [ ] Clicar "Solicitar" num card adiciona o perfil ao painel e o botão indica
      que já está na lista; clicar de novo remove.
- [ ] "Solicitar este Profissional" no modal adiciona e fecha o modal.
- [ ] Nenhum dos dois navega para `/contato`.
- [ ] O stepper respeita mínimo 1 e teto 20; o botão de menos fica desabilitado
      em 1.
- [ ] Remover o último item esconde o painel.
- [ ] O botão de enviar rola até a seção de solicitação.
- [ ] A lista sobrevive a mudanças de filtro: filtrar não remove escolhidos.
- [ ] `web/e2e/smoke.spec.ts` atualizado e verde.
- [ ] `pnpm lint` e `pnpm typecheck` passam, sem prop nem import órfão.

## Notas técnicas
- ⚠️ **Atualizar o smoke nesta task, não antes.** Editado numa task anterior, ele
  passa a falhar contra o código que ainda renderiza `<Link>`.
- O `slug` de `ConsultantRole` é o id da collection em texto
  (`lib/mappers/consultant.ts`) — serve de chave do `Map`.
- Painel fixo no mobile é opção de UI, não requisito: se virar barra fixa,
  conferir que não cobre o rodapé da grade. O acabamento é da task 015.
- Reaproveitar `MetricChip`/`StatusBadge` para o estado "já na lista"
  (`DESIGN.md` §Components) em vez de recompor classes soltas.
- ⚠️ Cor em par claro/escuro, valor escuro por último; `rounded-[6px]` como raio
  padrão.

## Riscos / dependências externas
- ⚠️ O gate visual segue vermelho (task 016). O painel novo muda a altura da
  página nos 3 viewports.
