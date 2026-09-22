---
id: 018
title: Aba de pedido — carrinho que abre, minimiza e envia
status: concluída
feature: consultores-solicitacao
area: frontend
priority: P1
estimate: L
depends_on: [017]
feature_refs:
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#41-do-filtro-ao-pedido-fluxo-principal"
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#revisão-de-2109"
spec_refs:
  - ".ksdd/specs/SPEC.md#10-responsividade"
  - ".ksdd/specs/SPEC.md#11-interacoes-e-comportamentos"
arch_refs:
  - ".ksdd/specs/architecture.md#4-server-actions"
---

# 018 — Aba de pedido

## Objetivo
Pedido de G-ferrari em 21/09: quando o visitante solicita um consultor, abre uma
aba como a de um carrinho, e **todo o pedido acontece ali** — a contagem dos
consultores e o formulário de envio.

## Comportamento (decidido em 21/09)
- **Três estados:** oculta · expandida · minimizada.
- O **primeiro** "adicionar" da visita abre a aba **expandida**. Os seguintes não
  reabrem: com a aba minimizada, só a contagem da barra muda (e é anunciada).
- **Minimizar** (botão na aba, `Esc`, clique fora) recolhe a aba numa **barra de
  resumo** fixa no rodapé — "N perfis · M pessoas" e um botão para expandir —,
  baixa, para não ocupar a tela, sobretudo no celular.
- **Expandir** de novo pela barra.
- **Formato:** no celular sobe de baixo para cima (altura máxima ~85% da tela,
  rolando por dentro); no computador desliza da direita (~440px, altura toda).
- **Conteúdo:** os perfis escolhidos com quantidade e remoção (o que hoje é o
  painel "Minha solicitação"), o total, o formulário inteiro e a confirmação.
- O painel "Minha solicitação" entre a grade e os diferenciais **sai**.
- **Seção final** ("Vamos acelerar sua equipe…"): título, subtítulo e painel de
  contatos ficam; o formulário sai e entra um **botão que abre a aba**. Um
  formulário só na página.
- A chamada "Não encontrou…" (017) abre a aba expandida com o **campo livre
  focado**, mesmo com o carrinho vazio. O botão da seção final abre com o foco
  no **título** — revisto na implementação: quem chega por ali pode ter perfis
  no carrinho, e pular para o campo livre passava por cima de nome e e-mail.
- Depois do envio: confirmação dentro da aba e carrinho vazio. Minimizar com o
  carrinho vazio **oculta** a barra.
- Remover o último perfil com a aba expandida **não** a fecha: a pessoa pode
  estar descrevendo um perfil no campo livre.

## Acessibilidade
- Expandida é **diálogo modal**: o foco vai para o título ao abrir e fica preso
  dentro; `Esc` minimiza; o foco volta para quem abriu (ou para a barra). Fundo
  inerte e rolagem da página travada.
- A barra minimizada não é modal; a contagem fica em `aria-live`.
- `prefers-reduced-motion`: sem deslizamento.

## O que não pode regredir (garantido pela 013)
- **Envio sem JavaScript.** O formulário tem de ser alcançável e enviável sem JS
  — p. ex. `<dialog>` aberto por comando nativo do HTML, ou o formulário em
  fluxo até a hidratação. Decidir na implementação e **medir no Postgres** com JS
  desligado.
- Carimbo renovado na primeira interação, UTM, isca e valores devolvidos na
  recusa: as notas de `formulario-de-solicitacao.tsx` valem inteiras. O
  componente **muda de lugar, não é reescrito**.

## Fora de escopo
- Persistência do carrinho entre visitas (§2.2 da feature).
- Campos novos no formulário, ou mudança na Server Action.
- Texto institucional (D-22).

## Critérios de aceitação
- [ ] O 1º "adicionar" abre a aba expandida; o 2º não a reabre.
- [ ] Minimizar vira barra com perfis e pessoas; expandir volta à aba.
- [ ] 375px: sobe de baixo; a barra minimizada não esconde conteúdo (a página
      ganha espaço no fim enquanto ela existe).
- [ ] 1280px: desliza da direita.
- [ ] Quantidade, remoção e envio funcionam de dentro da aba; o lead
      `consultant-request` chega com perfis e quantidades (conferido no Postgres).
- [ ] A chamada "Não encontrou…" abre a aba com o campo livre focado; o botão da
      seção final, com o título focado.
- [ ] Teclado: `Tab` fica dentro da aba, `Esc` minimiza, o foco volta.
- [ ] Sem JavaScript: envio com texto livre grava o lead.
- [ ] Contraste nos **dois** temas.
- [ ] `pnpm lint`, `pnpm typecheck` e `pnpm test` passam.

## Notas técnicas
- O estado da aba (oculta/expandida/minimizada) mora no provedor de
  `solicitacao-contexto.tsx`, junto do carrinho: a lista, a chamada e a seção
  final precisam abri-la.
- ⚠️ `setState` sempre na forma funcional (regra da 009 e da 010).
- ⚠️ Elementos fixos que já disputam a tela: o botão de tema, a barra do topo, o
  modal de detalhe do perfil (`z-50`) e o banner de cookies (D-30, que aparece no
  rodapé quando P-14 for respondida). A barra minimizada não pode cobrir nenhum.
- ⚠️ `e2e/smoke.spec.ts` procura os botões `Solicitar: …` dos cards — conferir.
- O gate captura a página com o carrinho vazio: a aba não aparece, e o que muda
  no gabarito é a seção final (formulário → botão). Regravação na 016.

## Riscos / dependências externas
- Suporte a comando nativo de `<dialog>` sem JavaScript varia por navegador;
  se não servir, o fallback em fluxo resolve o sem-JS.
