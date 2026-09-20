---
id: 009
title: Filtro multi-seleção com alternador OU|E e ordenação por cobertura
status: em revisão
feature: consultores-solicitacao
area: frontend
priority: P0
estimate: L
depends_on: []
feature_refs:
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#21-o-que-entra-v1"
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#51-telas-modificadas"
spec_refs:
  - ".ksdd/specs/SPEC.md#7-estrutura-de-paginas-e-telas"
  - ".ksdd/specs/SPEC.md#11-interacoes-e-comportamentos"
arch_refs:
  - ".ksdd/specs/architecture.md#10-decisoes-arquiteturais-significativas-adrs"
---

# 009 — Filtro multi-seleção com alternador OU|E e ordenação por cobertura

## Objetivo
Permitir que o visitante marque várias tecnologias e senioridades de uma vez, e
escolher entre "qualquer uma destas" (OU) e "todas estas" (E) — sem que o modo E
esvazie a lista, que é o que aconteceria com corte seco sobre 8 arquétipos.

## Escopo
- Em `web/src/app/(frontend)/[locale]/consultores/lista-de-consultores.tsx`:
  trocar `especialidade: string` e `senioridade: string` (`:125-126`) por
  `Set<string>`; a pílula passa a **alternar** em vez de substituir, e
  "Todos"/"Todas" limpa o conjunto da dimensão.
- Estado novo `modo: 'ou' | 'e'`, padrão `'ou'`, com alternador visível acima das
  pílulas de tag.
- **Cobertura** = `|tags marcadas ∩ p.tags|`. Regras de listagem:
  - **OU** — mantém quem tem ≥ 1 tag marcada; ordena por cobertura desc.
  - **E** — **não corta por cobertura**; ordena por cobertura desc e separa a
    grade em "cobrem tudo" e "cobrem parte", com separador visível só quando
    existem os dois grupos.
- **Senioridade e busca continuam cortando** de verdade nos dois modos — só a
  dimensão de tags muda de semântica.
- Selo **"cobre N de M"** no card, apenas em modo E e apenas com cobertura
  parcial.
- Contador de resultados ao vivo: em OU conta a lista inteira; em E conta os que
  cobrem tudo.
- Resumo de "Filtros ativos" (`:214-241`) passa a listar N valores por dimensão,
  com "Limpar filtros" limpando os três estados.
- Rótulos novos em PT e EN nas duas chaves de `TEXTOS` (`:29-82`).

## Fora de escopo
- Lista cumulativa "Minha solicitação" e quantidade por perfil (task 010).
- Mudar o destino dos botões "Solicitar" (task 010).
- CTA "Não encontrou um consultor nesta lista?" (task 014).
- Regravação do gabarito visual (task 016).

## Critérios de aceitação
- [ ] `GCP` + `FinOps` + `PySpark` em **OU** devolve 4 perfis (Data Engineer,
      Cloud Architect, Data Scientist, FinOps & Cloud Cost Specialist).
- [ ] As mesmas três em **E** **não esvaziam a lista**: 0 cobrem tudo, e
      FinOps & Cloud Cost Specialist e Cloud Architect aparecem com "cobre 2 de 3".
- [ ] `AWS` + `GCP` em **E** põe Cloud Architect e FinOps & Cloud Cost Specialist
      no topo como cobertura total (2 de 2).
- [ ] O separador "cobrem parte" só aparece quando há os dois grupos.
- [ ] Marcar duas senioridades devolve a união dos dois níveis.
- [ ] "Todos"/"Todas" limpa a dimensão; "Limpar filtros" zera tags, senioridade e
      busca.
- [ ] O estado vazio só aparece quando busca ou senioridade não casam — nunca
      como resultado direto do modo E.
- [ ] Rótulos novos existem em `pt` e `en`.
- [ ] `pnpm lint` e `pnpm typecheck` passam; o teste de senioridade existente
      (`web/e2e/smoke.spec.ts:364-374`) continua passando sem edição.

## Notas técnicas
- A ilha continua recebendo `perfis` prontos por prop (regra 4 do `CLAUDE.md`) e
  **não** importa `@/payload-types` (regra 3). A derivação de `especialidades`
  a partir dos perfis (`:129`) permanece.
- `Set` não dispara render por mutação: sempre `setX(new Set(prev))`, e incluir o
  `Set` nas deps do `useMemo` de `filtrados` (`:132-144`).
- ⚠️ `cn()` é tailwind-merge: escreva o **tamanho antes** de `leading-*`, senão o
  `leading` é descartado.
- ⚠️ Cor sempre em par claro/escuro com o **valor escuro por último**
  (`text-slate-900 dark:text-white`) — `e2e/contraste.spec.ts` mede os dois temas.
- ⚠️ Tailwind 4: `bg-linear-to-*`, nunca `bg-gradient-to-*` (o nome antigo não
  gera `background-image` e some no tema claro).
- Pílulas seguem o padrão do `DESIGN.md`: `rounded-[4px]`, `px-2 py-0.5`. O
  alternador OU|E é um par de segmentos exclusivos, não um `select` — dois
  `select` já custaram ~300px de altura nesta seção (ver a nota em `:18-21`).
- `SENIORIDADES` (`:98`) continua literal espelhando o schema, não derivada dos
  perfis.

## Riscos / dependências externas
- ⚠️ **O gate visual fica vermelho a partir desta task** — a barra de filtros muda
  de altura. É esperado e a regravação justificada é a task 016. Para iterar:
  `pnpm gate --rota consultores --viewport desktop`.
