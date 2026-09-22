# Context — Task 017: chamada "Não encontrou…" junto dos diferenciais

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/27 · **Base:** empilhada sobre a branch do 48h (#26), que está sobre a 014 (#25).

## O que virou o quê

- `diferenciais.tsx` (Server Component, novo): a seção "Por que os maiores
  players…" saiu de dentro do `page.tsx`, com os textos dela, e ganhou a chamada
  no fim.
- `chamada-sob-medida.tsx` (ilha cliente, nova): a chamada da 014, que morava
  como função dentro da lista, agora com duas variantes:
  - `destaque` — na seção de diferenciais;
  - `discreta` — no estado vazio do filtro, igual à da 014.
- A chamada do fim da grade saiu: a seção de diferenciais começa logo abaixo da
  grade, e duas chamadas iguais com uma seção de distância seriam repetição.

## Três decisões

**1. Chamada depois dos diferenciais, não antes.** Primeiro o argumento (por que
confiar), depois o pedido. "Nesta lista" segue fazendo sentido: a grade termina
logo acima da seção.

**2. O destaque é o gradiente da marca.** O DESIGN.md prevê o par azul → laranja
em "títulos de destaque e faixas de CTA", e nenhum outro bloco de /consultores o
usa. Moldura de 1px no gradiente, ícone num quadrado com o gradiente, título na
voz dos headings (peso 300) e um véu fraco do gradiente no fundo. O cartão
inteiro é clicável (o `after:` do link se estende), com um `<a>` só.

**3. Continua no estado vazio (decisão minha, reversível).** O pedido falava em
juntar a chamada com os diferenciais; no estado vazio ela é a saída do beco sem
saída, e ali a seção de diferenciais não está à vista. Com o filtro vazio a
página tem, portanto, duas chamadas: a discreta e a de destaque.

## Contraste — o véu cobrou um ajuste

Com 7% de véu no tema claro, o link `primary-dark` caía para ~4,2:1 onde o véu
fica laranja (o link atravessa o cartão inteiro no celular). Ficou 4% no claro,
sem reforço no hover, e 7% → 12% no hover só no escuro. Medido no pixel (canvas
sobre o print, os dois temas, 375 e 1280, com e sem hover): pior caso **4,55:1**
no claro e **5,33:1** no escuro.

## Verificação

- Clique no link e clique no título do cartão levam ao campo livre com foco;
  hash no histórico; carrinho intacto (1 item antes, 1 depois).
- 375 / 768 / 1280 nos dois temas: sem scroll horizontal.
- `tsc` e `eslint` da rota.
- O aviso "1 Issue" do overlay de dev é o contador do herói em `0` no servidor
  de desenvolvimento (CLAUDE.md, "não perseguir") — anterior a esta task.

## Na 018

O destino da chamada muda: em vez de rolar até o campo, abre a aba de pedido
com o campo livre focado. `irParaDescricao` é o único ponto a trocar.
