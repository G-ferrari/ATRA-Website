# Context — Task 016: e2e e a saída do gate

**Base:** integração @ `d09cab1` (021 dentro).

## O que esta task fecha

- `e2e/consultores.spec.ts`: 8 cenários — filtro em OU, em E sem cobertura total
  (a lista **não** esvazia e o selo diz "cobre 2 de 3"), em E com cobertura
  total (quem cobre tudo vai ao topo), senioridade multi-seleção pela união,
  acúmulo e remoção pela lixeira sobrevivendo à troca de filtro, a regra do
  "primeiro adicionar abre a aba", o envio com confirmação, e o envio vazio
  recusado pelo navegador. Verde nos 3 viewports.
- `/consultores` **sai** de `ROTAS_COM_GABARITO` (D-34), e os 3 PNGs saíram de
  `e2e/gabarito/`. São 12 rotas sob o gate.

## Checagem de mutação

Tirar o `if (!jaAbriu.current)` de `aoAdicionar` — a regra da 018 — reprova
"o primeiro perfil abre a aba, o segundo só atualiza a barra". O código voltou
ao original logo depois. Teste que não reprova quando o comportamento quebra não
é teste.

## O envio roda uma vez, de propósito

O caso do envio é `skip` fora do desktop. O formulário é o mesmo markup em toda
largura; o que muda com o viewport é a posição da aba, coberta pelos outros
casos. E cada corrida grava um lead de verdade: rodá-lo nos três triplicaria
isso e esbarraria no teto de 5 envios por IP por hora, que responde **sucesso
falso** — verde na tela, nada no banco.

## O gate não fecha verde, e não é desta feature (P-30)

Rodado completo em 24/09, depois da saída da rota: **as 12 rotas restantes
reprovam**, de 2% (relatórios) a 21% (home) dos pixels, com alturas até 316px
diferentes. Nenhuma delas é tocada por esta feature.

O gabarito é de **21/08**. Desde então: D-31 (02/09) liberou melhoria de UI, e a
passada de 13/09 (`d785a12`) padronizou raios, tirou bordas de caixa e unificou
o ritmo das seções **no app novo** — o protótipo continua como era. O gate do CI
está desligado desde 26/08, então ninguém viu.

Regravar a partir do legado não resolve (traz o desenho antigo de volta), e
regravar a partir do app novo é o espelho que a estratégia de testes recusa. É
decisão, não conserto: está em **P-30**.

## Ambiente

- `web/.env.local` criado com os valores do compose local (autorizado). Fora do
  git.
- ⚠️ `scripts/gate.mjs` chama `pnpm` direto; nesta máquina o pnpm só existe via
  `corepack`, e o passo do build falhava sem dizer por quê. Contornado com um
  atalho `pnpm` no PATH da corrida. Na máquina do Leonardo e no CI não aparece.
- O protótipo legado subiu no :3001 (`cd legacy && docker compose up -d`), que o
  gate e a paridade exigem.
