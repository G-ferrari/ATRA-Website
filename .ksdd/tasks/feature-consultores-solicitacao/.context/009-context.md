# Context — Task 009: Filtro multi-seleção com alternador OU|E e ordenação por cobertura

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/13
**Branch:** `feature/consultores-solicitacao/009-filtro-multiselecao` (base: `origin/migracao` @ `1a80d51`)

---

## 1. Task em uma página

```yaml
id: 009
title: Filtro multi-seleção com alternador OU|E e ordenação por cobertura
status: para implementar
feature: consultores-solicitacao
area: frontend
priority: P0
estimate: L
depends_on: []
```

**Objetivo.** Permitir que o visitante marque várias tecnologias e senioridades de
uma vez, e escolher entre "qualquer uma destas" (OU) e "todas estas" (E) — sem que
o modo E esvazie a lista, que é o que aconteceria com corte seco sobre 8
arquétipos.

**Escopo e critérios de aceitação:** ver
`.ksdd/tasks/feature-consultores-solicitacao/009-filtro-multiselecao-ou-e.md`.

---

## 2. Feature spec relevante (colado, §2.1 e §5.1)

> - **Filtro multi-seleção** de tags e de senioridade, com **alternador `OU | E`**
>   visível e **contador de resultados** ao vivo. "Todos"/"Todas" continua limpando
>   a dimensão.
> - **Modo "E" por ordenação de cobertura, não por corte seco.** Os perfis que
>   cobrem **todas** as tags marcadas vão ao topo; os que cobrem parte aparecem logo
>   abaixo, com selo **"cobre 2 de 3"** e a chamada de **combinar dois perfis**.
>   ⚠️ **O modo "E" nunca esvazia a lista sozinho** — com 8 arquétipos, exigir três
>   tags zeraria a maioria das combinações, e um beco sem saída no meio do funil é
>   pior que um resultado parcial. É também o que empurra o visitante para o
>   comportamento certo: quando nenhum perfil cobre tudo, a resposta é **pedir dois
>   perfis**, que é exatamente o *"preciso de 1 de cada"* da Karen.

Telas modificadas por esta task (§5.1):

> | `/consultores` — barra de filtros | Multi-seleção em tags e senioridade; alternador `OU \| E`; contador de resultados; resumo de filtros ativos passa a listar N valores | `lista-de-consultores.tsx:148-249` |
> | `/consultores` — estado vazio | ⚠️ Deixa de ser o destino normal do modo **E**: sobra para busca textual sem casamento e para tag sem nenhum perfil |
> | `/consultores` — grade de perfis | Em modo **E**, separador entre "cobrem tudo" e "cobrem parte", com selo de cobertura por card |

---

## 3. SPEC relevante

**§7.7 Institucional e conversão** — `/consultores` (catálogo de perfis com filtros).

**§4.2 Referência / apoio** — `SpecialistRoles` (perfis de cargo, **não pessoas**).
Isto é o núcleo do problema: o catálogo é de **arquétipos**, e é por isso que
interseção pura devolve vazio.

**§11 Interações e Comportamentos** (colado, o que se aplica):

> - **Empty/error states** — `EmptyState`; listagens sem item mostram estado vazio.
> - **Tema** — alternador claro/escuro; contraste medido nos dois (`contraste.spec.ts`).
> - **Anel de foco removido** fora de campos de formulário — débito de a11y portado
>   (D-13), não "consertar".

**§10 Responsividade** — os três breakpoints (375/768/1280) são exatamente os
viewports da regressão visual.

---

## 4. Arquitetura relevante

**ADR-004 — Regressão visual pixel a pixel como contrato (D-15, D-25).**
⚠️ Relaxado por **D-31**: melhoria de UI é permitida, mas cada mudança regrava o
gabarito com justificativa no PR. A regravação **não é desta task** — é a 016.

**ADR-009 — Componente não conhece o CMS: mappers como fronteira (regra 3).**
A ilha recebe `ConsultantRole[]` já mapeado. **Não importar `@/payload-types`.**

**Regra 4 do `CLAUDE.md`** — nenhuma página busca dado dentro de componente. A ilha
continua recebendo `perfis` por prop; `page.tsx` não muda nesta task.

---

## 5. Design

**Tokens e componentes (DESIGN.md):**
- Pílulas/chips: `rounded-[4px]`, `px-3 py-1`, `text-xs`, fundo `surface-alt`,
  texto `on-surface-subtle`. As atuais usam `px-2 py-0.5` / `px-2.5 py-0.5` — seguir
  o que já está no arquivo, não o genérico do DESIGN.md.
- Raio padrão do resto: `rounded-[6px]`.
- `MetricChip` / `StatusBadge` para o selo de cobertura, em vez de recompor classes.

**Do's and Don'ts que mordem aqui:**
> - **Do** escrever cor sempre em par claro/escuro, com o valor escuro por último
>   (`text-slate-900 dark:text-white`). É o que o gabarito escuro compara.
> - **Don't** introduzir `antialiased` ou qualquer propriedade de renderização de
>   texto ausente no legado (D-25).

---

## 6. Estado atual do código

`web/src/app/(frontend)/[locale]/consultores/lista-de-consultores.tsx`

```ts
const [especialidade, setEspecialidade] = useState(TODOS)   // :125 — UMA tag
const [senioridade, setSenioridade]   = useState(TODOS)     // :126 — UM nível

const filtrados = useMemo(() => {                            // :132-144
  const termo = busca.trim().toLowerCase()
  return perfis.filter((p) => {
    const casaEsp = especialidade === TODOS || p.tags.includes(especialidade)
    const casaSen = senioridade === TODOS || p.level === senioridade
    const casaBusca = termo === '' || [p.role, p.description, ...p.tags].join(' ').toLowerCase().includes(termo)
    return casaEsp && casaSen && casaBusca
  })
}, [perfis, busca, especialidade, senioridade])
```

Os 8 perfis semeados e suas tags estão em `web/scripts/seed/consultores.ts:23-96`.

---

## 7. Plano de implementação

### 7.1 Arquivos

| Arquivo | Ação |
|---|---|
| `web/src/lib/consultores.ts` | **novo** — lógica pura de filtro/cobertura |
| `web/src/lib/consultores.test.ts` | **novo** — testes da lógica pura |
| `web/src/app/(frontend)/[locale]/consultores/lista-de-consultores.tsx` | modificado — estado, controles, grade |

Extrair a lógica para `lib/` (e não deixá-la na ilha) é o padrão do repositório —
mesmo desenho de `lib/diagnostico-rc18.ts` + `.test.ts`. Torna os critérios de
aceitação verificáveis por teste unitário, não só por e2e.

### 7.2 Contrato da função pura

```ts
export type ModoFiltro = 'ou' | 'e'

export function filtrarPerfis(entrada: {
  perfis: ConsultantRole[]
  tags: ReadonlySet<string>
  niveis: ReadonlySet<string>
  busca: string
  modo: ModoFiltro
}): {
  completos: { perfil: ConsultantRole; cobertura: number }[]
  parciais:  { perfil: ConsultantRole; cobertura: number }[]
  alvo: number        // tags.size — o "de M" do selo
}
```

**Regras:**
1. **Corte** (vale nos dois modos): `niveis` vazio ou `niveis.has(p.level)`; e a
   busca textual sobre `role + description + tags`.
2. **Dimensão de tags:** `tags` vazio → todos passam. Senão, passa quem tem
   `cobertura > 0`.
3. **Cobertura** = `p.tags.filter((t) => tags.has(t)).length`.
4. **Agrupamento:** `completos` = `cobertura === tags.size`; `parciais` = o resto.
   Com `tags` vazio, tudo é `completos` e `alvo` é 0.
5. **Ordenação** dentro de cada grupo: cobertura desc, e desempate pela ordem de
   entrada (que já vem por `sort: 'order'` do CMS) — **ordenação estável**.

> ⚠️ **Não reintroduza o corte por cobertura no modo E.** OU e E devolvem o mesmo
> conjunto de perfis de propósito; o que muda é a **leitura**: E pergunta "quem
> cobre tudo?" e responde explicitamente, inclusive quando a resposta é "ninguém",
> sem deixar o visitante na mão. Cortar traria de volta o vazio que esta task
> existe para eliminar — ver FEATURE §2.1 e §9.2.

### 7.3 UI

- `TODOS` deixa de ser sentinela de valor e vira "conjunto vazio". Manter o
  rótulo "Todos"/"Todas" na pílula que limpa a dimensão, e marcá-la ativa quando o
  conjunto está vazio.
- Alternador `OU | E`: dois botões segmentados, com `aria-pressed`. Rótulos
  sugeridos — PT: `Qualquer uma` / `Todas estas`; EN: `Any of these` / `All of these`.
  O par `OU | E` fica como legenda curta.
- **Contador:** OU → `t.exibindo(n)` como hoje. E com `alvo > 0` → "N cobrem tudo ·
  M cobrem parte" (omitir a metade que for zero).
- **Separador** antes de `parciais`, só quando existem `completos` **e** `parciais`:
  "Cobrem parte do que você marcou — combine dois perfis."
- **Selo** no card, só em E e só em `parciais`: "cobre {cobertura} de {alvo}".
- **Filtros ativos:** listar as N tags e os N níveis; "Limpar filtros" zera os três.

### 7.4 Testes

`web/src/lib/consultores.test.ts`, com os 8 perfis reais como fixture:
- OU com `GCP`+`FinOps`+`PySpark` → 4 perfis.
- E com as mesmas três → `completos: []`, `parciais` com 4, sendo FinOps & Cloud
  Cost Specialist e Cloud Architect com `cobertura: 2`.
- E com `AWS`+`GCP` → `completos` = Cloud Architect e FinOps & Cloud Cost Specialist.
- E com `Looker`+`GCP`+`Delta Lake`+`BigQuery` → `completos: []`, `parciais` não vazio.
- Dois níveis → união.
- Conjuntos vazios → todos os perfis, `alvo: 0`.
- Busca textual sem casamento → tudo vazio (o **único** caminho para o estado vazio).
- Ordenação estável entre perfis de mesma cobertura.

---

## 8. Quality gates

- [ ] `docker compose exec -T web pnpm test` (unitários)
- [ ] `docker compose exec -T web pnpm lint`
- [ ] `docker compose exec -T web pnpm typecheck`
- [ ] `web/e2e/smoke.spec.ts:364-374` continua passando **sem edição**
- [ ] `Agent(code-reviewer)`
- [ ] ~~`security-auditor`~~ — não se aplica: sem auth, PII, pagamento, upload ou SQL

⚠️ `pnpm` **não existe no host** e `web/node_modules` não está instalado. Tudo roda
por `docker compose exec -T web`. Os containers `web`, `postgres` e `minio` estão
de pé.

---

## 9. Riscos específicos

- ⚠️ **O gate visual fica vermelho a partir desta task.** A barra de filtros muda de
  altura. Esperado; a regravação justificada é a task 016.
- ⚠️ `Set` não dispara render por mutação — sempre `setX(new Set(prev))`, e incluir
  os `Set` nas deps do `useMemo`.
- ⚠️ `cn()` é tailwind-merge: **tamanho antes** de `leading-*`, senão o `leading` é
  descartado.
- ⚠️ Tailwind 4: `bg-linear-to-*`, nunca `bg-gradient-to-*`.
- ⚠️ Fora de escopo desta task: carrinho (010), CTA "Não encontrou" (014), envio
  (012/013), regravação do gabarito (016).
