---
id: 016
title: e2e do filtro, do acúmulo e do envio + regravação do gabarito
status: para implementar
feature: consultores-solicitacao
area: qa
priority: P0
estimate: M
depends_on: [015, 021]
feature_refs:
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#10-criterios-de-aceite"
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#92-riscos"
spec_refs:
  - ".ksdd/specs/SPEC.md#10-responsividade"
arch_refs:
  - ".ksdd/specs/architecture.md#9-estrategia-de-testes"
---

# 016 — Aceite visual: e2e novos e regravação do gabarito

## Objetivo
Fechar a feature com a rede de testes que descreve o comportamento novo, e
regravar o gabarito visual de `/consultores` com justificativa — a única forma
legítima de a rota voltar ao verde depois de mudar de layout.

## Escopo
- e2e novos em `web/e2e/`, cobrindo:
  - **OU**: `GCP` + `FinOps` + `PySpark` devolve 4 perfis;
  - **E sem cobertura total**: as mesmas três **não esvaziam** a lista e mostram
    "cobre 2 de 3";
  - **E com cobertura total**: `AWS` + `GCP` põe Cloud Architect e FinOps & Cloud
    Cost Specialist no topo;
  - multi-seleção de senioridade devolve a união;
  - acúmulo: adicionar 2 perfis, remover 1 pela lixeira, e a lista sobrevive a
    trocar o filtro — tudo de dentro da aba de pedido (018 e 020);
  - aba: o 1º "adicionar" abre expandida, o 2º não reabre; minimiza em barra e
    expande de novo;
  - envio: preenche, envia, vê a confirmação que ocupa a aba, fecha e o
    carrinho está vazio;
  - envio sem perfis e sem texto livre é recusado.
- Conferir que `e2e/contraste.spec.ts` e `e2e/paridade-ds.spec.ts` seguem verdes.
- Rodar `pnpm gate` completo; **regravar** com `pnpm gate --baseline` e **escrever
  a justificativa no PR**, nomeando o que mudou por task.
- Rodar `pnpm gate` de novo após a regravação e confirmar verde nos 3 viewports.

## Fora de escopo
- Mudança de comportamento ou de UI (tasks 009–015). Se um teste reprovar por
  defeito real, corrigir na task de origem, não aqui.
- Religar o gate do CI — desligado desde 26/08 por decisão do Leonardo; religar
  antes de produção é item do runbook de cutover, não desta feature.

## Critérios de aceitação
- [ ] Os 8 cenários acima existem como testes e passam.
- [ ] `pnpm test:e2e` verde dentro da imagem oficial do Playwright.
- [ ] `pnpm gate` completo verde nos 3 viewports (375/768/1280) após a
      regravação.
- [ ] O PR traz a justificativa da regravação, task a task.
- [ ] `e2e/contraste.spec.ts` e `e2e/paridade-ds.spec.ts` verdes.
- [ ] Nenhuma rota além de `/consultores` teve gabarito regravado.

## Notas técnicas
- ⚠️ **Regravar gabarito apaga evidência de regressão.** Por isso vem por último,
  depois de a UI estar fechada (task 015), e por isso exige justificativa (D-31).
- ⚠️ `--baseline` **não reescreve o que passou dentro da tolerância** (0,1%). Ver
  um subconjunto dos arquivos mudar é o esperado, não sinal de captura velha.
- ⚠️ **Depois de mexer no seed, gate inteiro** — com `--sem-build` o servidor
  devolve HTML pré-renderizado antigo e a comparação repete o mesmo número de
  pixels da corrida anterior.
- ⚠️ `scripts/gate.mjs` aborta se a :3100 estiver ocupada — um servidor de corrida
  anterior já fez a suíte medir o build velho, com 240 testes de falha plausível.
- `?e2e=1` congela carrossel e rotação nos dois apps; `stabilize()` reporta
  `IntersectionObserver` visível na hora, menos para âncoras.
- ⚠️ Teste de `hover` dentro de `toPass`: `hover()` só move o ponteiro, e mover
  para onde ele já está não emite `mouseenter`. Passar por outro elemento antes.
- O gate exige o legado no :3001 e `.env.local` no host — ver as notas de
  operação do projeto antes de rodar nesta máquina.

## Riscos / dependências externas
- Gate completo custa ~9 minutos e a máquina; o container do Playwright entra com
  `--cpus=4`. Reservar tempo, não rodar em paralelo com build.
