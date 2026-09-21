---
id: 015
title: Acabamento de UI da página guiado pelo Impeccable
status: para implementar
feature: consultores-solicitacao
area: design
priority: P1
estimate: M
depends_on: [013, 014]
feature_refs:
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#8-impacto-no-design"
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#21-o-que-entra-v1"
spec_refs:
  - ".ksdd/specs/SPEC.md#10-responsividade"
  - ".ksdd/specs/SPEC.md#8-componentes-globais-reutilizaveis"
arch_refs: []
---

# 015 — Acabamento de UI guiado pelo Impeccable

## Objetivo
Fechar a tela como uma coisa só depois de três tasks acrescentarem controles a
ela, atendendo ao pedido de *"reduzir o número de cliques"* e de *"alguns
ajustezinhos pra ficar mais bacana"*.

## Escopo
- Passar a página pelo Impeccable e aplicar o que ele apontar em: hierarquia
  entre filtro / grade / painel "Minha solicitação" / formulário, densidade das
  pílulas, legibilidade do selo de cobertura, e o caminho do primeiro clique até
  o envio.
- **Mobile (375px)**: decidir e implementar o comportamento do painel "Minha
  solicitação" — barra fixa ou seção no fluxo —, sem cobrir conteúdo.
- **Tablet (768px)** e **desktop (1280px)**: conferir que a grade de 2 colunas e o
  separador de cobertura não quebram.
- Revisar contraste dos elementos novos nos **dois** temas.
- Contar os cliques do caminho principal (filtrar → escolher 2 perfis → enviar) e
  registrar o número no PR, antes e depois.

## Fora de escopo
- Mudar comportamento ou copy (tasks 009–014).
- Regravar o gabarito (task 016) — o acabamento vem **antes**, senão a regravação
  acontece duas vezes.
- Tocar na barra de números do herói, na seção de diferenciais ou no
  `PainelDeContatos`.

## Critérios de aceitação
- [ ] Caminho principal com contagem de cliques registrada no PR, menor ou igual
      à de hoje.
- [ ] Nos 3 viewports não há sobreposição, corte de texto nem scroll horizontal.
- [ ] `e2e/contraste.spec.ts` passa nos dois temas.
- [ ] `e2e/paridade-ds.spec.ts` segue verde — nada de recompor componente-base
      com classes soltas.
- [ ] Nenhum bloco de CMS novo criado.
- [ ] `pnpm lint` e `pnpm typecheck` passam.

## Notas técnicas
- **D-31** libera melhoria de UI guiada pelo Impeccable; **D-22 continua valendo**
  — melhorar UI não autoriza mexer em conteúdo nem preencher pendência `P-xx`.
- ⚠️ `stabilize()` troca imagem por PNG 1×1: onde a caixa não é fixa, a altura
  vira o quadrado esticado. Copiar markup do gabarito, não só as classes.
- ⚠️ `overflow-x-auto` guarda `scrollLeft` depois da rolagem vertical — `settle()`
  zera trilhos; se um trilho novo entrar, conferir que está coberto.
- Iterar com `pnpm gate --rota consultores --viewport desktop`: 1 teste em vez de
  207. O gate completo fica para a task 016.
- ⚠️ Contador de números fica em `0` com `?e2e=1` **só no servidor de dev** — não
  perseguir; em produção aparece certo.

## Riscos / dependências externas
- Nenhuma. É a última task antes do aceite visual.
