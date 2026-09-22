# Context — Task 014: CTA "Não encontrou um consultor nesta lista?"

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/24 · **Base:** integração @ `c7ef643` (010, 012, 013 dentro).

## Duas decisões de interpretação

**1. O CTA não esvazia o carrinho.** A task diz "leva à seção de solicitação sem nenhum
perfil marcado", mas a pré-condição do fluxo (FEATURE §4.2) já é "o filtro não
devolveu nada, ou o visitante não se identificou com nenhum arquétipo" — carrinho
vazio é o estado **esperado**, não uma ação. Quem escolheu dois perfis e clica para
descrever um terceiro perderia os dois sem pedir.

**2. Chamada com link, não `pill-btn-*`.** A nota técnica pede `pill-btn-outline` ou
`-secondary`, mas os dois são `uppercase tracking-wider text-xs`, e a cópia do dono
tem mais de 100 caracteres: em caixa-alta espaçada dentro de um botão, ilegível. A
pergunta vai como texto e a segunda frase como link, com superfície e tipografia que
a página já usa. A cópia fica **exatamente** como veio (D-22).

## Mecanismo

- `<a href="#descricao-da-solicitacao">` — sem JavaScript, a âncora leva ao campo.
- Com JavaScript, o clique centraliza o campo na tela e dá foco nele. O foco é
  consequência do clique da pessoa, então não "rouba" foco de ninguém; o leitor de
  tela anuncia o rótulo do campo ao chegar.
- O id do campo é constante compartilhada em `solicitacao-contexto.tsx`, o módulo que
  as duas ilhas já importam.

## Onde

1. No estado vazio, abaixo de "Resetar Filtros".
2. Ao fim da grade — depois dos parciais, no modo E —, só quando há perfis visíveis
   (no estado vazio já existe o primeiro, e dois seria repetição).

## Verificação

- Contraste: `e2e/contraste.spec.ts` já mede `/consultores` nos dois temas no
  carregamento, e o CTA do fim da grade aparece no carregamento.
- Envio só com o texto livre, conferido no Postgres (cota: 5 por IP).
