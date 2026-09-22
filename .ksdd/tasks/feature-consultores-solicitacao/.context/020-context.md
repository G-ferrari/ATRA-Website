# Context — Task 020: pedido enxuto

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/34 · **Base:** integração @ `7ebe313` (até a 019).

## A pergunta que valia perguntar

"Remover a quantidade de pessoas" tinha duas leituras: tirar o stepper de cada
perfil, ou tirar só o "· 4 pessoas" do cabeçalho. G-ferrari escolheu **tirar o
contador todo** — quantas pessoas de cada perfil vira assunto da conversa
comercial. Isso desfaz parte da task 010.

## Fora de ponta a ponta, não só da tela

A quantidade saiu do carrinho (`Escolhidos` era `Map<slug, quantidade>` e virou
`ReadonlySet<slug>`), do que o cliente manda (`perfis` é JSON de slugs), do que
o servidor confere (`PerfilConfirmado` sem quantidade) e do resumo que o
comercial lê ("- Data Engineer (Senior)", sem "2×" e sem a soma de pessoas).

Com os campos que saíram do formulário — empresa, modelo de alocação e duração
— saíram também `lerDuracao`, `lerModelo`, `MODELOS` e `MAX_MESES`: sem campo
que os alimente, seriam analisadores de nada.

⚠️ **Compatibilidade de uma aba velha.** Quem estava com a página aberta antes
do deploy manda o formato antigo (`[{ slug, quantidade }]`). `lerPerfisPedidos`
devolve lista vazia em vez de estourar, e o pedido ainda chega pela descrição —
com teste para isso.

## Confirmação

Ocupa a aba inteira (ícone, "Solicitação enviada", texto e "Fechar"). Como a aba
já é um `<dialog>` modal, isto **é** o aviso modal pedido — sem um segundo
diálogo por cima. Fica até o visitante fechar: o que a aba guarda é **qual**
resultado foi dispensado, não um booleano, então a confirmação do envio seguinte
aparece sozinha, sem efeito sincronizando estado. O "Fechar" é
`<form method="dialog">`, que funciona sem JavaScript.

⚠️ **O carrinho esvazia na aba, não no formulário.** O efeito de limpeza morava
no formulário, que desmonta no mesmo render em que a confirmação entra — e
efeito de componente que desmonta não roda. Na prática a limpeza só acontecia
quando o visitante fechava a aba e o formulário remontava, e até lá a
confirmação exibia "2 perfis" no topo. Pego no teste.

## Verificação

- 375px: cabeçalho "1 perfil", sem stepper, lixeira em cada linha; formulário
  com nome, e-mail, telefone e descrição; botão "Enviar solicitação".
- Envio com JS → confirmação na aba, cabeçalho sem contagem, carrinho vazio, os
  8 cards de volta em "Solicitar". Lead 16: "- Data Engineer (Senior)" e
  "- ML Engineer (Senior)", telefone gravado, sem empresa.
- Envio **sem JS** → a resposta volta com a aba aberta na confirmação; lead 17,
  só com a descrição.
- `tsc`, `eslint` e 186 testes unitários (os de quantidade viraram testes de
  conjunto e de resumo sem quantidade).
- Leads de teste 16 a 18 com `@exemplo.com.br` no banco local.
