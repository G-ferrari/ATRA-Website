---
id: 005
title: Motor de pontuação do diagnóstico RC18 (lib + testes)
status: cancelada
feature: rc18
area: backend
priority: P0
estimate: M
depends_on: []
feature_refs:
  - ".ksdd/features/FEATURE-rc18.md#52-telas-novas"
  - ".ksdd/features/FEATURE-rc18.md#82-componentes-novos-necessarios"
spec_refs:
  - ".ksdd/specs/SPEC.md#11-interacoes-e-comportamentos"
arch_refs:
  - ".ksdd/specs/architecture.md#9-estrategia-de-testes"
---

# 005 — Motor de pontuação do diagnóstico RC18 (lib + testes)

> **Cancelada.** Substituída pela feature `diagnostico-maturidade-dados` (D-35, 26/09/2026).

## Objetivo
Isolar a lógica do diagnóstico numa lib pura e determinística, para que a mesma função
calcule o índice de prontidão no cliente (na hora) e no servidor (ao gravar o lead), com
testes unitários que travam o comportamento.

## Escopo
- Criar `web/src/lib/diagnostico-rc18.ts`:
  - `DIMENSOES` — as 12 dimensões da RC 18/2025 (id, rótulo PT, pergunta, peso).
  - `ESCALA` — escala de maturidade por dimensão (ex.: 0–3: manual/planilha → política →
    regra versionada → regra em produção com evidência), rótulos por nível.
  - `calcularIndice(respostas) => { ipRc18: number, porDimensao: {...}, faixa: 'inicial'|'intermediario'|'avancado' }`
    — função pura, sem I/O, sem `window`, sem `Date` não injetado.
  - Helpers de validação (nº de respostas, faixa dos valores).
- Criar `web/src/lib/diagnostico-rc18.test.ts` (Vitest): índice 0% (tudo no mínimo), 100%
  (tudo no máximo), casos parciais, resposta inválida rejeitada, determinismo (mesma entrada
  → mesma saída), soma de pesos = 1 (ou normalização correta).

## Fora de escopo
- UI/ilha do diagnóstico (task 006).
- Persistência/Server Action e CRM (task 007).
- Envio de relatório por e-mail (v2 — FEATURE §2.2).

## Critérios de aceitação
- [ ] `calcularIndice` é pura e determinística (sem efeitos colaterais), tipada em strict.
- [ ] Testes cobrem mínimo (0%), máximo (100%), parcial, entrada inválida e determinismo,
      e passam em `pnpm test`.
- [ ] As 12 dimensões e a escala estão em um único lugar (fonte única), reutilizável por
      cliente e servidor.
- [ ] `pnpm typecheck` e `pnpm lint` verdes.

## Notas técnicas
- Manter em `lib/` puro para poder importar em componente cliente (island) sem arrastar
  dependência de servidor — mappers/CMS ficam de fora daqui.
- O índice pode alimentar a barra visual com o gradiente da marca (DESIGN.md) — mas a lib
  só devolve números/rótulos, sem cor.

## Riscos / dependências externas
- **Lista e nomes oficiais das 12 dimensões da RC 18/2025** — confirmar na norma/marketing
  (mesmo risco da task 003). Enquanto não confirmado, usar a lista candidata do PDF e marcar
  no código com comentário do porquê.
