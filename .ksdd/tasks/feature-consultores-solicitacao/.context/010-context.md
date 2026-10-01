# Context — Task 010: Lista cumulativa "Minha solicitação"

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/18
**Branch:** `feature/consultores-solicitacao/010-lista-cumulativa` (base: `migracao` @ `6f4ad71`)
**Dependência:** task 009 ✅ mergeada (PR #14); a 011 ✅ mergeada (PR #17), mas não é dependência desta.

---

## 1. Task em uma página

```yaml
id: 010
title: Lista cumulativa "Minha solicitação" com quantidade por perfil
area: frontend · priority: P0 · estimate: L · depends_on: [009]
```

**Objetivo.** Dar ao visitante um lugar para juntar os perfis que precisa e dizer quantas
pessoas de cada — substituindo o "Solicitar" que hoje joga o contexto fora ao navegar
para `/contato`.

---

## 2. Feature spec relevante (§2.1 e §4.1, colado)

> - **Lista cumulativa "Minha solicitação"** — o botão "Solicitar" do card e o
>   "Solicitar este Profissional" do modal passam a **adicionar o perfil à lista**, em
>   vez de navegar para `/contato`. Painel com os perfis escolhidos, remoção individual
>   e botão de enviar.
> - **Quantidade de pessoas por perfil** (stepper, padrão 1) dentro da lista.

Do fluxo principal (§4.1), passos 5–7:

> 5. Clica **"Solicitar"** no card (ou no modal) → o perfil entra em **"Minha
>    solicitação"**; o botão do card passa a indicar que já está na lista.
> 6. Ajusta a **quantidade** de pessoas de cada perfil na lista; pode remover itens.
> 7. Clica em enviar → desce para a seção de solicitação, já com os perfis resumidos à vista.

⚠️ Decisão registrada em 20/09: o CTA do card **vira só "adicionar"**, sem preservar
atalho para `/contato`. Um caminho só, menos cliques — e a lista sempre mostra o botão
de enviar, então o destino continua a um clique, agora levando o perfil junto.

---

## 3. SPEC relevante

**§9 Touchpoints críticos** — "Fale conosco" é CTA recorrente; esta task troca o
destino **apenas em `/consultores`**, onde o contexto se perde hoje.
**§8 Componentes** — reaproveitar `MetricChip`/`StatusBadge`, não recompor classes.
**§10 Responsividade** — 375 / 768 / 1280 são os viewports do gate.
**§11** — `EmptyState` para listagem vazia; anel de foco removido é débito portado (D-13).

---

## 4. Estado atual do código (após a 009)

`web/src/app/(frontend)/[locale]/consultores/lista-de-consultores.tsx`

| Ponto | Linha | O que é hoje |
|---|---|---|
| prop `contatoHref` | `:139`, `:143` | recebida da página |
| `cartao(...)` | `:182` | função local que rende o card (os dois grupos usam) |
| "Detalhes" | `:270` | `setAberto(p)` |
| "Solicitar" do card | `:278` | **`<Link href={contatoHref}>`** |
| grade de principais | `:452-454` | `vista.principais.map((x) => cartao(x, false))` |
| "Solicitar este Profissional" | `:587` | **`<Link href={contatoHref}>`** |

A seção de destino já tem âncora: `id="solicitar-consultores"` em
`consultores/solicitar-consultores.tsx`.

---

## 5. Plano de implementação

### 5.1 Estado

```ts
const [escolhidos, setEscolhidos] = useState<ReadonlyMap<string, number>>(new Map())
```

Chave = `p.slug` (que o mapper preenche com o id da collection em texto). `Map`
preserva ordem de inserção, que é a ordem em que o visitante escolheu — melhor que
reordenar por catálogo, porque reflete o raciocínio dele.

⚠️ **Mesma armadilha da 009:** `Map` não dispara render por mutação, e o `setState`
tem de ser **funcional** (`setEscolhidos((atual) => ...)`). Dois cliques no mesmo tick
partindo do estado do render perdem um — foi exatamente o bug de `9ddc069`.

### 5.2 Card e modal

- "Solicitar" vira `<button>`: alterna o perfil na lista. Com o perfil dentro, muda
  rótulo/aparência para o estado "na lista" e remove ao clicar de novo.
- "Solicitar este Profissional" adiciona **e** fecha o modal (`setAberto(null)`).
- `contatoHref` fica órfão → remover a prop, o tipo, e o `hrefDe('contato', locale)`
  de `consultores/page.tsx`, mais o import se sobrar sozinho.

### 5.3 Painel "Minha solicitação"

Entre a grade de perfis e a seção de diferenciais. Não renderiza vazio. Por item:
sigla + cargo + nível, stepper (1..20), remover. No rodapé: total de perfis e de
pessoas, e botão que rola até `#solicitar-consultores`.

### 5.4 Teste

`web/e2e/smoke.spec.ts:364-374` espera 8 `link` "Solicitar" → viram `button`.
**Atualizar nesta task**, não antes.

Lógica pura de carrinho (adicionar/alternar/quantidade/totais) vai para
`lib/consultores.ts`, ao lado de `filtrarPerfis`/`exibicao`, com teste — é o que
tornou os critérios da 009 verificáveis em milissegundos em vez de pelo gate.

---

## 6. Quality gates

- [ ] `./node_modules/.bin/vitest run` (host) ou `docker compose exec -T web pnpm test`
- [ ] `pnpm lint` · `pnpm typecheck`
- [ ] e2e: `NEXT_URL=http://localhost:3000 ./node_modules/.bin/playwright test e2e/smoke.spec.ts -g "consultores"`
      — ⚠️ **agora roda no host**: as dependências foram instaladas em 21/09 e os
      browsers do Playwright já estavam em `~/Library/Caches/ms-playwright`
- [ ] Verificação no navegador dos critérios, um a um
- [ ] Revisão independente

⚠️ `pnpm gate` (visual) **continua fora de alcance**: falta `web/.env.local` no host e
o legado em `:3001`. É a task 016.

---

## 7. Riscos específicos

- ⚠️ `Map`/`Set` com `setState` funcional (ver §5.1).
- ⚠️ `cn()` é tailwind-merge: tamanho antes de `leading-*`.
- ⚠️ Cor em par claro/escuro, **valor escuro por último** — é o que o gabarito compara.
- ⚠️ Tailwind 4: `bg-linear-to-*`, nunca `bg-gradient-to-*`.
- ⚠️ Gate visual vermelho por desenho até a 016.
