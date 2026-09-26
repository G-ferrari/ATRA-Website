# Contexto de implementação — Task 026

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/60
**Branch:** `feature/diagnostico-maturidade-dados/026-perguntas` → PR para `feature/diagnostico-maturidade-dados/integracao`

## 1. Task em uma página

```yaml
id: 026
title: Rota /diagnostico-maturidade — perfil com setor pela URL e perguntas (ilha)
area: frontend · priority: P0 · estimate: L · depends_on: [022, 023]  # concluídas
```

**Objetivo.** Pôr no ar a primeira metade do fluxo do Roger — perfil e perguntas — com a cara do site, pronta para ser linkada de qualquer página com o setor já escolhido.

**Critérios de aceitação**
- [ ] `/diagnostico-maturidade?setor=saude` abre com Saúde escolhido e os impactos certos; setor inválido abre sem seleção.
- [ ] Nº de perguntas por setor igual ao do motor (task 022).
- [ ] Teclado: Tab entra no grupo, setas trocam a alternativa, Enter/Espaço escolhe; foco visível.
- [ ] 375/768/1280 sem rolagem horizontal; área de toque das alternativas ≥ 44 px.
- [ ] Contraste nos dois temas; par claro/escuro com o valor escuro por último.
- [ ] `lint`, `typecheck` verdes.

## 2. Feature spec relevante (§5.2 e §8)

**`/diagnostico-maturidade`.** Objetivo: levar o visitante do perfil ao contato em poucos minutos e entregar o resultado por e-mail.
- A. **Cabeçalho** — título e texto do global (CMS), barra de progresso e rótulo da etapa ("Perfil", "Pergunta 4 de 17", "Contato").
- B. **Perfil** — setor (8 opções do Roger), porte (5 faixas), cargo (6 opções); linha "Impactos avaliados" ao escolher o setor.
- C. **Pergunta** — pílula do pilar, contador, enunciado, 4 alternativas como opções de rádio (A–D), etiquetas de regulação do setor.
- D. Contato e E. Conclusão — **task 027**.
- F. **Ajuda** — "Prefere conversar?" com WhatsApp, visível durante o fluxo.
- Componentes: `pill-btn-primary`, chips sem borda, `StatusBadge`, campos do padrão de formulário do site, barra de progresso no estilo do carrossel de cases. Mobile: coluna única; alternativas com área de toque ≥ 44 px; voltar/avançar no rodapé do cartão.
- §8.2: `OpcaoDoQuestionario` (rádio com letra A–D; estados default, hover, foco, selecionada, desabilitada) e `BarraDeProgresso` (0–100%). Nenhum token novo.

## 3. SPEC (§7.8, §10) e arquitetura (ADR-003, ADR-009)

- §7.8 — páginas interativas/internas (`/chat`, `/newsletter`); o diagnóstico entra aqui, com `noindex`.
- §10 — Desktop 1280+, Tablet 768–1279, Mobile < 768; os três são os viewports de teste.
- **ADR-003** — "rotas distintas por idioma, slugs localizados … cada rota pública tem slug por idioma; `hreflang` recíproco."
- **ADR-009** — "Server Component resolve dado, mapper converte, componente recebe props de apresentação." Nenhum componente importa `@/payload-types`.

## 4. Design (DESIGN.md na raiz — "O Console Sereno")

- Grafite no escuro (padrão), acento azul `#3C98FA` → laranja `#FF8B08` com parcimônia; títulos Mona Sans **peso 300**; rótulos em caixa-alta espaçados.
- **Sem borda** em caixas (tom de superfície + sombra suave); raio 6px (12px em superfícies grandes); `pill-btn-primary`.
- **Regra do Par:** `text-slate-900 dark:text-white` — valor escuro por último. Nada de `bg-gradient-to-*` (Tailwind 4: `bg-linear-to-*`).
- Impeccable está disponível no projeto (`.impeccable/`): opcional rodar `critique` depois.

## 5. Plano de implementação

- `lib/routes.ts`: seção `diagnosticoMaturidade` → pt `diagnostico-maturidade`, en `data-maturity-assessment` (conferir como o `proxy.ts` traduz o segmento EN).
- `app/(frontend)/[locale]/diagnostico-maturidade/page.tsx` (Server Component): `generateStaticParams` dos idiomas, `generateMetadata` com `noindex`, lê o global (`lerDiagnosticoDeMaturidade('pt')` — conteúdo é PT nos dois idiomas), lê `?setor=` (validado com `ehSetor`), monta props (setores, portes, cargos, perguntas por setor já resolvidas ou o motor no cliente — o motor é puro e pode ir ao cliente) e renderiza a ilha.
  - ⚠️ Next 16: ler `web/AGENTS.md` e `node_modules/next/dist/docs/` para `searchParams` (Promise) e o que torna a página dinâmica; preferir resolver o setor no cliente se ler `searchParams` impedir a pré-renderização — decidir e comentar.
- `app/(frontend)/[locale]/diagnostico-maturidade/questionario.tsx` (`'use client'`): etapas `perfil` → `pergunta[i]` → `contato` (esta última é um marcador simples até a task 027), estado local, `perguntasDoSetor`, `impactosDoSetor`, `impactosDaPergunta`; avanço automático 350 ms (não com `prefers-reduced-motion` nem `?e2e=1` — `lib/e2e.ts`), "Voltar", trocar setor zera respostas, barra e rótulo da etapa, bloco "Prefere conversar?" com o WhatsApp do global.
- Componentes: `OpcaoDoQuestionario` com `role="radiogroup"`/`role="radio"`, roving tabindex e setas; `BarraDeProgresso`.
- Sem mexer em menu/rodapé (a rota não é linkada ainda).

## 6. Quality gates
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` (container)
- [ ] Rota responde 200 em PT e EN, `noindex` no HTML; `?setor=saude` pré-seleciona; setor inválido ignorado
- [ ] Conferência visual no navegador em 375/1280, nos dois temas (prints para o designer)
- [ ] Teclado e foco visível
