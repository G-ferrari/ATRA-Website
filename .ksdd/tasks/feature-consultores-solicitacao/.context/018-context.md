# Context — Task 018: aba de pedido

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/29 · **Base:** empilhada sobre a 017 (#28) → 48h (#26) → 014 (#25).

## Decisões de produto (G-ferrari, 21/09)

- Abre **só no primeiro** "adicionar"; tem **minimizar** (barra de resumo) e **expandir**.
- **Lateral no computador**, de baixo no celular.
- A seção final **vira botão** que abre a aba — um formulário só na página.

## O que virou o quê

| Antes | Agora |
|---|---|
| Painel "Minha solicitação" entre a grade e os diferenciais | Lista dentro da aba (`aba-de-pedido.tsx`) |
| Formulário na seção final | Dentro da aba; na seção, botão "Solicitar consultores" (`abrir-pedido.tsx`) |
| Resumo "Sua solicitação: N perfis" com "Editar" no formulário | Saiu: a lista com quantidades está logo acima, na mesma aba |
| Chamada "Não encontrou…" como âncora | `<button>` que abre a aba com foco no campo livre |
| `GRADIENTES` dentro da lista | `gradientes.ts`, porque a aba também desenha o monograma |
| `useActionState` no formulário | Na aba — ver "sem JavaScript" |

O provedor (`solicitacao-contexto.tsx`) ganhou o estado da aba (`aba`, `abrirAba`,
`fecharAba`, `aoAdicionar`, `tomarRetorno`). `aoAdicionar` só abre na primeira vez
(ref `jaAbriu`); qualquer abertura conta como "já abriu".

## `<dialog>` nativo

`showModal()` dá foco preso, fundo inerte, `Esc` e a camada de cima (acima do
cabeçalho fixo) sem reimplementar nada. Todo fechamento — "Minimizar"
(`<form method="dialog">`), `Esc`, clique no fundo — é o `close` nativo, e um
handler só (`aoFechar`) sincroniza o estado. Abrir é sempre pelo provedor; o
efeito chama `showModal()`.

Animação: `@starting-style` + `transition-behavior: allow-discrete` (`starting:`,
`transition-discrete` do Tailwind 4), com `display` e `overlay` na transição para
a saída também deslizar. `motion-reduce` desliga.

## Sem JavaScript (não podia regredir da 013)

- **Abrir:** `commandfor`/`command="show-modal"` nos botões (comando nativo do
  HTML). Minúsculos e por espalhamento: o React 19.2 não conhece as props.
  Com JavaScript o clique é cancelado e o provedor abre — um estado só.
- **Minimizar:** `<form method="dialog">`, que fecha em qualquer navegador.
- **Resposta do envio:** a página volta do servidor com `envio` preenchido, e a
  aba sai com `open` (não modal) — senão a confirmação ficaria num diálogo
  fechado. Por isso o `useActionState` subiu para a aba. `open` só na
  renderização do servidor (`useSyncExternalStore` com snapshot de servidor
  `true`): depois da hidratação o React larga o atributo, ou reabriria como não
  modal um diálogo que o visitante fechou.
- Não modal, a aba volta ao fluxo comum de empilhamento: o "Fale Conosco" do
  cabeçalho (`z-40`) e o botão de tema (`z-[100]`) passavam por cima dela.
  `z-[105]` — abaixo do aviso de cookies (`z-[110]`).
- Navegador sem o comando nativo **e** sem JavaScript fica sem a aba; sobra o
  painel de contatos da seção final. Registrado em `debito-tecnico.md`.

## Foco

- Abrir foca o título da aba (ou o campo livre, vindo de "Não encontrou…"). O
  botão da seção final também foca o título, e não o campo livre como a task
  pedia: quem chega por ali pode ter perfis no carrinho, e o campo livre fica
  depois de nome e e-mail — pular para ele passava por cima dos dois.
- Remover um item foca o título antes de desmontar o item.
- Fechar devolve o foco a quem abriu. Duas exceções pegas no teste:
  - pelo **detalhe do perfil**: o botão do detalhe some junto com ele — quem
    abre passa um `retorno` (o botão do card);
  - pela **barra**: a barra some no mesmo render que abre a aba, então quando o
    efeito anota a origem o foco já está no `<body>`. `<body>` não conta como
    origem, e o foco vai para a barra.
- `Tab` sai uma vez da aba em 25 tentativas: é o comportamento nativo do diálogo
  modal, que deixa o foco escapar para a interface do navegador (o conteúdo da
  página continua inerte).

## Outros detalhes

- A barra fica à esquerda do botão de tema no celular (`right-[60px]`) e
  centralizada a partir do tablet; `z-40`, abaixo do detalhe do perfil (`z-50`).
  Enquanto ela existe, o `body` ganha `padding-bottom` para o rodapé não ficar
  embaixo dela.
- Página não rola com a aba aberta (`overflow: hidden` no `<html>`).
- Formulário numa coluna só dentro da aba: a grade passou a responder ao
  contêiner (`@container` / `@lg:`), não ao viewport — a 440px as duas colunas
  cortavam os placeholders.
- Depois do envio, a aba rola ao topo, onde está a confirmação.
- Seção final centralizada na vertical ao lado da foto (a coluna ficou curta).

## Verificação

- Fluxo em 375 e 1280: abre no 1º "Solicitar", minimiza, o 2º não reabre, barra
  com contagem, expandir, `+`/`−`/remover, `Esc`, clique fora, chamada
  "Não encontrou…" (foco no campo livre), botão da seção final, detalhe do
  perfil (foco volta ao card). Console sem erro além do contador do herói em
  dev (conhecido).
- Barra sem sobreposição com o botão de tema (medido).
- **Envio com JS** gravado no Postgres: lead 10, "2× Data Engineer, 1× Cloud
  Architect, 6 meses".
- **Envio sem JS** gravado: lead 11 (texto livre); a resposta volta com a aba
  aberta e a confirmação visível.
- ⚠️ Playwright sem JavaScript acusa "element is not stable" se o clique no
  enviar vier durante a animação de entrada, e não reavalia — mas a posição
  amostrada assenta em ~500ms, e o clique depois disso envia. Não é defeito da
  página.
- `e2e/smoke.spec.ts` (consultores e detalhe) verde contra :3000.
- `tsc`, `eslint`, 203 testes de `src/lib`.
- Leads de teste 10–14 com `@exemplo.com.br` no banco local.
