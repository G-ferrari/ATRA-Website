---
id: 026
title: Rota /diagnostico-maturidade — perfil com setor pela URL e perguntas (ilha)
status: concluída
feature: diagnostico-maturidade-dados
area: frontend
priority: P0
estimate: L
depends_on: [022, 023]
feature_refs:
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#52-telas-novas"
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#8-impacto-no-design"
spec_refs:
  - ".ksdd/specs/SPEC.md#78-interativas--internas"
  - ".ksdd/specs/SPEC.md#10-responsividade"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-003--i18n-pt-na-raiz-en-em-en-com-slugs-traduzidos-d-07"
  - ".ksdd/specs/architecture.md#adr-009--componente-nao-conhece-o-cms-mappers-como-fronteira-regra-3"
---

# 026 — Rota /diagnostico-maturidade — perfil com setor pela URL e perguntas (ilha)

## Objetivo
Pôr no ar a primeira metade do fluxo do Roger — perfil e perguntas — com a cara do site, pronta para ser linkada de qualquer página com o setor já escolhido.

## Escopo
- Rota em `lib/routes.ts` (PT `diagnostico-maturidade`, EN traduzido), página Server Component que lê o global (task 023) e monta props; ilha cliente recebe tudo pronto (regra 4, modelo `cases-de-sucesso/lista-de-cases.tsx`).
- `?setor=` lido no servidor e validado contra os 8 códigos; inválido é ignorado.
- **Perfil:** setor, porte, cargo; linha "Impactos avaliados: … entre outros" ao escolher o setor; "Começar" só com os três.
- **Perguntas:** uma por tela; pílula do pilar e "N/M"; enunciado; 4 alternativas como `radiogroup` com letras A–D e navegação por teclado; etiquetas de regulação relevantes ao setor; avanço automático em 350 ms (não sob `prefers-reduced-motion`, não com `?e2e=1`); "Voltar"; barra de progresso.
- Trocar de setor recomeça as respostas (regra do Roger).
- Bloco "Prefere conversar?" com o WhatsApp do global.
- Metadata com `noindex`; rota EN serve o conteúdo PT.

## Fora de escopo
- Contato, envio e conclusão (task 027).

## Critérios de aceitação
- [ ] `/diagnostico-maturidade?setor=saude` abre com Saúde escolhido e os impactos certos; setor inválido abre sem seleção.
- [ ] Nº de perguntas por setor igual ao do motor (task 022).
- [ ] Teclado: Tab entra no grupo, setas trocam a alternativa, Enter/Espaço escolhe; foco visível.
- [ ] 375/768/1280 sem rolagem horizontal; área de toque das alternativas ≥ 44 px.
- [ ] Contraste nos dois temas (`e2e/contraste.spec.ts` não piora); par claro/escuro com o valor escuro por último.
- [ ] `lint`, `typecheck` verdes.

## Notas técnicas
- Componentes: botões `pill-btn-*`, chips sem borda, cartões 6 px (DESIGN.md). Nada de `bg-gradient-to-*` (Tailwind 4 → `bg-linear-to-*`, CLAUDE.md).
- Estado do questionário só no cliente; nada vai ao servidor até o envio.

## Riscos / dependências externas
- Nenhum.
