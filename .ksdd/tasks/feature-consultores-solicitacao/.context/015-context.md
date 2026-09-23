# Context — Task 015: acabamento de UI (Impeccable)

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/37 · **Base:** integração @ `dcb13d7` (ATRAIR do dev dentro).

Passada de `polish` do Impeccable: refinamento, não redesenho. Nada de
comportamento, copy, herói, diferenciais ou painel de contatos.

## O que a evidência mostrou

Medido antes de editar, nos dois temas e em 375/768/1280:

1. **Um valor de filtro invisível no celular.** A linha de senioridade era
   `overflow-x-auto no-scrollbar`: rolava 54px **sem barra à vista**, e
   "Lead / Principal" ficava fora da tela sem nada indicando que havia mais.
2. **O resumo "Filtros ativos" era o texto menos legível do painel no tema
   claro:** tag 2,97:1, senioridade 2,35:1 e o termo buscado **1,72:1**.
   `contraste.spec.ts` não pegava porque essa linha só existe **depois** de
   filtrar, e o teste mede a página recém-carregada.
3. **Tudo que é "recuado" sumia no tema claro.** Pílulas, campo de busca, tags
   do card, linha da aba: todos `bg-surface-1` (#F8FAFC) dentro de caixas
   brancas — 2% de diferença, e sem borda (regra sem-borda) não sobrava nada.
   No escuro o mesmo tom funciona, porque é mais escuro que o cartão.
4. **Três medidas de pílula na mesma caixa:** 11px (senioridade e modo), 10,5px
   (especialidade), rótulos de 10px.
5. **Selos do card com contorno de 1px**, contra a regra sem-borda do DESIGN.

## O que mudou

- Linhas de senioridade e de modo **quebram linha** em vez de rolar escondido.
- Uma métrica de pílula só, a do `ChipFilter` do design system (`px-3 py-1`,
  12px), e rótulos em 11px. ⚠️ **Não** é o `ChipFilter` em si: aquele é de
  seleção única, carrega o próprio layout e é comparado com o legado pelo
  `paridade-ds`. Aqui a seleção é múltipla — variação documentada, não
  recomposição.
- `RECUADA` = `bg-surface-3 dark:bg-surface-1`: par para superfície recuada
  dentro de cartão, aplicado às pílulas, ao campo de busca, às tags do card, ao
  chip de ecossistema, ao "Detalhes", ao "Na solicitação" e às linhas da aba.
- Resumo de filtros em pares de cor: **4,72 / 5,03 / 5,03** no claro.
- Selos do card (nível, cobertura, ecossistema) e do modal sem contorno.
- Lixeira da aba de 32 para 36px.
- Limites do recolhido remedidos com a pílula maior:
  `{ base: 5, sm: 6, md: 7, lg: 9, xl: 12 }` — duas linhas a 375, uma de 640 a
  1536.

## O achado que não era desta task

`e2e/paridade-ds.spec.ts` estava **vermelho desde 13/09**, e não por esta
feature: o commit `d785a12` ("drop box borders", passada anterior do
Impeccable) tirou o contorno do `StatusBadge` e do `SearchInput`, e o teste
seguia cobrando o 1px do legado. Conferido com `git stash`: reprovava igual sem
nenhuma mudança minha.

O teste agora **fixa a divergência** em vez de deixar de comparar: o novo tem de
ser o legado com `borderWidth: 0px`. Se o contorno voltar, se o legado mudar ou
se qualquer outra propriedade divergir, ele fala. Teste que vive vermelho não
avisa mais nada.

## Verificação

- Cliques do caminho principal (filtrar → 2 perfis → enviar): **6 antes, 6
  depois**.
- 375/768/1280: sem scroll horizontal, sem corte, nenhuma rolagem escondida no
  filtro.
- `contraste.spec.ts` e `paridade-ds.spec.ts` verdes (com o legado no :3001).
- Detector mecânico do Impeccable: zero achados.
- `tsc`, `eslint`, 284 testes unitários.
- Gabarito **não** regravado — é a task 016.
