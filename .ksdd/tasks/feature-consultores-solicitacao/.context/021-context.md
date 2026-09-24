# Context — Task 021: aba no visual da home

**Base:** integração @ `b0ce702` (015 dentro).

## De onde veio

Perguntei qual seria a referência visual da página, já que ela divergiu do
protótipo de propósito. A resposta de G-ferrari mudou a pergunta, e para melhor:
manter a página como está e **retrabalhar a aba com a home como gabarito**. O
DESIGN.md já dizia isso — "a home é a lei; o resto deriva dela".

## O que foi copiado, medida a medida

De `blocks/contato-com-foto.tsx` (a seção de contato da home) e de
`blocks/painel-de-contatos.tsx`:

| Elemento | Home | Aba, agora |
|---|---|---|
| Título | `font-light font-display`, grande | `text-2xl font-light font-display` |
| Linha de apoio | `font-light` | `text-sm font-light` |
| Ladrilho | `rounded-[6px] px-4 py-3`, rótulo micro em caixa-alta sobre o valor | igual, com o nível como rótulo e o cargo como valor |
| Quadrado de ícone | `w-9 h-9 rounded-[6px]` | monograma e lixeira |
| Ação principal | branco no escuro, azul no claro | "Enviar solicitação", "Fechar" e a barra |
| Separação | espaço | a linha acima do formulário saiu |

A linha sob o cabeçalho **fica**: ele é fixo enquanto o corpo rola, e é ela que
marca onde um termina. O formulário em si já era o da home desde a 013 — `CAMPO`
é a mesma string nos dois arquivos.

## Verificação

- Abrir, minimizar (barra com "1 PERFIL / Minha solicitação"), expandir,
  remover e enviar: tudo funcionando; lead 22 gravado com "- ML Engineer
  (Senior)".
- Nos dois temas, 375 e 1280.
- `contraste`, `paridade-ds` e `smoke` verdes (75 testes), 284 unitários,
  detector do Impeccable sem achados.

## O que continua em aberto

A pergunta do gabarito visual da rota **não foi respondida** e segue de pé para
a 016: o gate compara com o legado, e a página não bate mais com ele de
propósito. As opções continuam sendo gabarito próprio da rota (captura do app
novo, congelada) ou tirar a rota do gate, como `/blog` e `/carreiras`.
