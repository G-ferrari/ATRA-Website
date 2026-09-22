# Context — Task 019: tags recolhíveis

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/32 · **Base:** integração @ `f58175d` (014, 017, 018 dentro).

## O componente

`tags-recolhiveis.tsx` serve os dois lugares: o filtro de especialidades e as
tecnologias de cada card. Recolhido, mostra as primeiras e agrupa o resto em
"+N ⌄"; aberto, todas e "Mostrar menos ⌃". Estado local, um por lista — abrir um
card não abre os outros.

## Por que limite por faixa, e não medido

Quantas tags cabem por linha depende da largura (4 a 5 a 375px, 18 a 1280), e o
servidor não sabe a largura. Medir no cliente faria o filtro nascer com todas as
tags e encolher na hidratação. O limite é por faixa do Tailwind, em classes
(`hidden sm:inline-block`), e o "+N" tem um número por faixa — faixas vizinhas de
mesmo número juntas, para o card não sair com cinco cópias do mesmo "+1".

⚠️ Classes escritas por extenso em tabelas (`ESCONDE`, `MOSTRA_*`): o Tailwind
só gera CSS do que acha no fonte.

Limites do filtro: `{ base: 7, sm: 6, md: 7, lg: 11, xl: 15 }` — medidos para
dar 2 linhas a 375 e 1 linha a 640, 768, 1024 e 1280. Card: 7, como o legado
(`Consultants.tsx:604`).

## Decisões

- **Tag marcada nunca recolhe** (`fixos`), no filtro e no card. Sem isso,
  marcar uma tag que cai no "+N" escondia o que o visitante escolheu — e o card
  do Data Engineer não mostrava "SQL" com o filtro em SQL.
- **Sai a caixa de rolagem** do filtro (`max-h-28 overflow-y-auto`), herança do
  protótipo: no celular eram 8 linhas de tags dentro de 112px, com a roda do
  mouse presa nela.
- Nome acessível do controle: o "+N" visível mais um texto só para leitor de
  tela ("+28 especialidades a mais", "+1 tecnologias a mais em Data Engineer"),
  que contém o texto visível (WCAG 2.5.3). Aberto: "Mostrar menos" (e o perfil,
  nos cards). `aria-expanded` e `aria-controls` na lista.

## Verificação

- Filtro recolhido: 2 linhas a 375; 1 linha a 640, 768, 1024 e 1280. Aberto:
  as 35 tags; foco segue no controle.
- Card do Data Engineer: recolhido com 7, aberto com as 8 ("… dbt, SQL"), fecha
  de novo; os outros cards não abrem juntos.
- "SQL" marcada, tudo recolhido: visível no filtro e no card, e o "+1" do card
  some (nada mais escondido).
- `tsc` e `eslint` da rota.
