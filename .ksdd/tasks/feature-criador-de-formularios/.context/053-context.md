# Contexto de implementação — 053

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/168
**Branch:** `feature/criador-de-formularios/053-fechamento` (a partir da branch da 052, PR #167; PR para a `migracao`, mesclar depois do #158, #161, #163, #165 e #167)
**Task:** `.ksdd/tasks/feature-criador-de-formularios/053-miniatura-e2e-e-documentacao.md`

## Task em uma página

- **Objetivo:** deixar a feature pronta para o marketing usar e coberta no CI, para uma regressão no envio não passar sem ninguém ver.
- **Critérios:** o seletor de seções mostra "Formulário" com miniatura; o e2e novo passa no CI do PR; guia do editor e decisão no PR.
- **Fora de escopo:** o teste com o marketing e com o RD de verdade (054).

## Feature spec relevante (FEATURE-criador-de-formularios.md, 10 e 11)

> - [ ] O seletor de seções mostra "Formulário" com miniatura.
> - [ ] Os formulários existentes continuam exatamente como estão (testes atuais passando).

> Fase 2 — acabamento: miniatura, e2e, guia do editor e decisão.

## Estado atual do código

- A miniatura (`public/miniaturas-de-blocos/formSection.webp`) já entrou na 051, porque o `index.test.ts` exige o arquivo; o bloco está em `e2e/miniaturas.spec.ts` como `null` (nenhuma página real usa a seção).
- O seed de teste só cria fixture com `SEED_FIXTURES=1` (só o CI liga); `scripts/seed/run.mjs` roda os seeds em ordem, e `migracoes-de-dados.ts` regrava páginas no fim.
- O teto de 5 envios por IP por hora é um só para a suíte, que já gasta 4 no desktop (`smoke.spec.ts`); o diagnóstico confere o banco e reprovaria com o sucesso falso. `lib/ip.ts` lê `x-real-ip` primeiro.
- `contraste.spec.ts` e o axe medem `ROTAS_COM_GABARITO`, que inclui `/solucoes/ia-generativa-e-agentes-conversacionais`.

## Plano de implementação

- `scripts/seed/fixtures-de-formulario.ts` (constantes, sem efeito colateral) e `scripts/seed/formulario-de-teste.ts` (dois formulários publicados e as duas seções na solução medida, antes da faixa final; idempotente), por último em `run.mjs`.
- `e2e/formulario-do-admin.spec.ts`: campos e rótulos (3 tamanhos), erro de obrigatório com foco e valores mantidos (3 tamanhos), envio que grava e mostra a mensagem e envio que leva a outra página (desktop, com banco, `x-real-ip` próprio, lead apagado).
- Guia do editor: "Criar um formulário e pôr numa página". Decisão D-66 (a D-65 está no #155). Parágrafo no `CLAUDE.md`.

## Quality gates

- [ ] `typecheck` · `lint` · `test`
- [ ] Seed da fixture duas vezes num banco de teste (idempotente)
- [ ] e2e novo contra o servidor de desenvolvimento, com a fixture; contraste da rota; axe nas seções
- [ ] Captura do seletor de seções com a miniatura
- [ ] Revisão por agente
- [ ] CI do PR verde (critério da tarefa)
