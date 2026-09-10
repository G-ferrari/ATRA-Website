---
name: ATRA
description: Sistema visual da ATRA (consultoria de Dados & IA) — grafite sereno, acento azul→laranja, tipografia Mona Sans leve. Ancorado na home.
colors:
  atra-blue: "#3C98FA"
  atra-blue-deep: "#2A75C5"
  atra-orange: "#FF8B08"
  atra-orange-burnt: "#D67200"
  ink: "#0F172A"
  slate: "#334155"
  slate-muted: "#64748B"
  paper: "#FFFFFF"
  mist: "#F8FAFC"
  mist-sunken: "#F1F5F9"
  hairline: "#E2E8F0"
  graphite: "#0E1015"
  graphite-raised: "#181B22"
  graphite-light: "#222631"
  on-graphite: "#F3F4F6"
  on-graphite-subtle: "#D1D5DB"
  on-graphite-muted: "#9CA3AF"
  on-accent: "#FFFFFF"
typography:
  display:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4rem)"
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 300
    lineHeight: 1.35
    letterSpacing: "normal"
  body:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  chip: "4px"
  box: "6px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.atra-blue}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.box}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.atra-blue-deep}"
  button-secondary:
    backgroundColor: "{colors.atra-orange}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.box}"
    padding: "12px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.atra-orange-burnt}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.box}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.box}"
    padding: "24px"
  card-dark:
    backgroundColor: "{colors.graphite-raised}"
    textColor: "{colors.on-graphite}"
    rounded: "{rounded.box}"
    padding: "24px"
  chip-filter:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.slate-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "4px 12px"
  chip-filter-active:
    backgroundColor: "{colors.atra-blue}"
    textColor: "{colors.on-accent}"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.box}"
    padding: "10px 16px"
---

# Design System: ATRA

## Overview

**Creative North Star: "O Console Sereno"**

A ATRA é uma consultoria de Dados & IA. O sistema visual soa como o **console de uma plataforma de dados madura**: fundo grafite, superfícies calmas, e o brilho reservado para os detalhes — a corrente azul→laranja da marca. É técnico e confiável sem gritar; a autoridade vem da precisão, não do volume. **Competência tranquila.**

**A home é a lei.** A página inicial é a superfície mais refinada e a mais validada pelos stakeholders — ela é a **referência canônica** deste sistema. Toda outra tela se compõe a partir dos componentes da home ou de **variações documentadas** deles; nenhuma tela inventa uma linguagem visual própria. Quando este documento e a home discordarem, a home vence, e este documento é atualizado para segui-la.

O tema **escuro é o padrão** (o `<html>` nasce em `dark`, grafite `#0E1015`); existe um tema claro alternável, e ambos são a mesma linguagem com os tokens trocando de valor. A profundidade é **contida**: superfícies planas em repouso, sombra suave crescendo no hover, e um brilho de assinatura no `GlowCard`. Nada de contorno pesado.

**Key Characteristics:**
- Grafite escuro por padrão; acento azul→laranja usado com parcimônia.
- Títulos leves (Mona Sans peso 300) contra rótulos técnicos em caixa-alta.
- Caixas **sem borda**: hierarquia por tom de superfície e sombra suave.
- Escala de raio enxuta (6px padrão, 12px em superfícies maiores, 4px em chips); um brilho de assinatura (GlowCard).
- A home é o gabarito; o resto deriva dela.

## Colors

A paleta é **dual (claro/escuro)**: os mesmos papéis trocam de valor por tema. No código, os valores do tema claro vivem em `@theme` (`globals.css`) e `html.dark` os sobrescreve; cada token abaixo corresponde a uma custom property (`--color-*`).

### Primary
- **Azul ATRA** (`#3C98FA`, `--color-primary`): a cor de ação. Botões primários, links, realces, foco, ícones ativos, o primeiro pé do gradiente da marca. É o azul que carrega quase toda a intenção da interface.
- **Azul Profundo** (`#2A75C5`, `--color-primary-dark`): estado hover do primário.

### Secondary
- **Laranja ATRA** (`#FF8B08`, `--color-secondary`): o acento de destaque e o segundo pé do gradiente. CTAs secundários, selos, pontos de ênfase. Escasso por design. ⚠️ A linha de ênfase do **herói da home é laranja sólido**, não o gradiente — e hoje via **hex hardcoded** (`text-[#FF8B08]`); migrar para o token `--color-secondary`. A utility `.text-gradient` (azul→laranja) fica reservada a realces/CTA pontuais, não ao herói.
- **Laranja Queimado** (`#D67200`, `--color-secondary-dark`): hover do secundário.

### Neutral — tema claro
- **Papel** (`#FFFFFF`, `--color-surface-2`): fundo de cartão.
- **Névoa** (`#F8FAFC`, `--color-surface-1`): fundo da página.
- **Névoa Recuada** (`#F1F5F9`, `--color-surface-3`): cartão recuado / hover.
- **Tinta** (`#0F172A`, `--color-text-main`): texto principal.
- **Ardósia** (`#334155`, `--color-text-subtle`) e **Ardósia Clara** (`#64748B`, `--color-text-muted`): texto secundário.
- **Traço Névoa** (`#E2E8F0`, `--color-border-main`): borda herdada — **em retirada** (ver A Regra Sem-Borda).

### Neutral — tema escuro (override `html.dark`)
- **Grafite** (`#0E1015`): fundo. **Grafite Elevado** (`#181B22`): cartão. **Grafite Claro** (`#222631`): cartão recuado.
- **Alvo** (`#F3F4F6`), **#D1D5DB**, **#9CA3AF**: texto principal → secundário. Bordas, quando existem, são luz difusa (`rgba(255,255,255,0.08)`), nunca linha.

### Named Rules
**A Regra do Acento Escasso.** O azul e o laranja são pontuação, não tinta de parede. Usados em ação, realce e estado — não em grandes áreas. Sua raridade é o efeito.

**A Regra do Par.** Toda cor de texto/superfície nasce com par claro/escuro, e o **valor escuro vem por último** (`text-slate-900 dark:text-white`) — é ele que o gabarito escuro compara. Cor sem par some no tema alternado.

## Typography

**Display / Corpo:** Mona Sans (com fallback `ui-sans-serif, system-ui, sans-serif`), fonte variável servida por `next/font/google` — a mesma build do gabarito, métrica travada. Família única para tudo.

**Character:** uma voz editorial contida. Os títulos são **leves e apertados**; os rótulos, técnicos e espaçados. O contraste entre os dois é a personalidade tipográfica.

### Hierarchy
- **Display** (300, `clamp(2.5rem, 6vw, 4rem)`, lh 1.05, ls −0.02em): heróis e aberturas.
- **Headline** (300, `clamp(1.75rem, 3.5vw, 2.5rem)`, lh 1.1, ls −0.02em): títulos de seção.
- **Title** (~1.25rem): **títulos de cartão.** ⚠️ Renderiza **peso 300 como todo heading** — a regra global `h1..h6{font-weight:300}` (`globals.css:151`, fora de `@layer`) vence os utilitários, então `font-bold`/`font-extrabold` em heading são **inertes**. Derivação honesta do build atual; se o cartão precisar de um peso mais firme, é mudança de código (escopar uma utilidade que vença ou remover a regra global), adiada.
- **Body** (400, 1rem, lh 1.6): texto corrido; alvo de 65–75 caracteres por linha em leitura longa (blog, materiais).
- **Body-sm** (400, 0.875rem, lh 1.5): metadados, resumos de cartão.
- **Label** (600, 0.75rem, ls 0.08em, **CAIXA-ALTA**): rótulos de botão, eyebrows, etiquetas.

### Named Rules
**A Regra do Título Leve.** Todo heading é peso **300** com `letter-spacing −0.02em`; a hierarquia entre níveis vem do **tamanho**, não do peso. Isto é imposto globalmente por `h1..h6{font-weight:300}` (`globals.css:151`), que vence classes de peso — inclusive nos títulos de cartão. Não há exceção de peso no build atual.
**A Regra Sem-Suavização.** Nunca introduzir `antialiased`/`-webkit-font-smoothing` nem pedir o eixo `wdth` na fonte — muda a rasterização/métrica e estoura o gate visual (D-16/D-25).

## Layout

Grid fluido centrado, com contêiner de largura máxima e respiro lateral crescente por breakpoint. As páginas empilham verticalmente e são compostas por **blocos** (26 blocos no CMS); a home define a ordem e o ritmo de referência.

- **Espaçamento** em múltiplos de 8/4px. Cartões respiram em 24px (`p-6`), subindo a 32px (`sm:p-8`) a partir de tablet.
- **Breakpoints** de referência (os três do gate visual): **375**, **768**, **1280**. Tailwind: `sm 640 · md 768 · lg 1024 · xl 1280`.
- **Densidade:** confortável, não compacta — o respiro é parte da "serenidade". Padronizar as escalas de respiro (hoje `/sobre` usa `py-16/20` e `/carreiras` `py-20/24`) rumo à escala da home é um alvo de consistência.

## Elevation & Depth

Sistema **contido, não plano**: profundidade por **sombra suave + camada tonal**, nunca por contorno. Superfícies são planas em repouso e ganham sombra como **resposta a estado** (hover, foco).

### Shadow Vocabulary
- **Repouso** (`box-shadow: 0 1px 2px rgba(0,0,0,0.05)` — `shadow-sm`): cartões parados.
- **Hover** (`shadow-xl`): o cartão sobe ao passar o mouse; no escuro, `shadow-2xl` com `rgba(0,0,0,0.6)` — a sombra é o "peso" da caixa.
- **Brilho de assinatura (GlowCard):** uma borda de **luz** que segue o cursor (gradiente radial mascarado em `::before/::after`), não uma linha. É o detalhe que dá vida ao grafite.

### Named Rules
**A Regra Plano-em-Repouso.** Nenhuma caixa nasce com sombra forte; a sombra aparece como resposta a hover/foco. Em repouso, a separação é tonal.

## Shapes

Linguagem de cantos **discreta e única**. Retângulos dominam; o brilho e o gradiente fazem a personalidade, não a geometria.

### Named Rules
**A Regra da Escala de Raio.** Uma escala enxuta, não um valor único: **6px** é o padrão de caixa e controle (cartão, botão, campo, painel); **12px** para superfícies maiores que pedem mais suavidade (ex.: painéis grandes, cards de destaque); **4px** nos chips de filtro menores; **círculo** (`9999px`) só para pontos de status e avatares/monogramas. O que hoje foge da escala em runtime — 8px×16, 7px×14, 5px, 16px — deve **snapar** ao passo mais próximo (8/7→6, 16→12, 5→4 ou 6). Nada de raio avulso fora de {4, 6, 12, full}.

**A Regra Sem-Borda.** ⚠️ **Nenhuma caixa do layout carrega linha de borda.** Cartões, chips, campos, painéis e selos se separam por **tom de superfície + sombra suave + brilho**, nunca por traço. Os componentes da home já são assim (`border-0` + glow). Divergências a padronizar: `ContentCard`, `ChipFilter` (inativo), `StatusBadge`, `MetricChip` e `SearchInput` ainda usam `border border-slate-200 dark:border-white/5` — migrar para sem-borda, aproximando-os da home. (Distinto de um **divisor** funcional — uma hairline `border-t` que separa conteúdo dentro de um cartão — que é permitido; a regra proíbe a borda que **contorna a caixa**.)

## Components

Todo componente recebe dados por props (nenhum busca dado). A home é a fonte; as outras telas usam estes componentes ou variações documentadas.

### Buttons
- **Shape:** 6px (`rounded-[6px]`), `border-0`.
- **Primary:** fundo Azul ATRA, texto branco, `padding 12px 24px`, rótulo **CAIXA-ALTA `text-xs` espaçado**, `shadow-md`; hover → Azul Profundo + `shadow-lg`; `active:scale(0.98)`.
- **Secondary:** idêntico com Laranja ATRA → Laranja Queimado.
- **Outline / Ghost:** transparente, texto Tinta, hover `bg primary/10` — **sem borda**; realce por fundo, não por traço.

### Chips (filtro de listagem)
- **Style:** `px-3 py-1`, 4px, `text-xs font-medium`. **Ativo:** fundo Azul ATRA + texto branco + `font-semibold`. **Inativo:** fundo Papel + texto Ardósia Clara (alvo: **sem borda**). `aria-pressed` no estado.

### Badges & MetricChip
- **StatusBadge:** `inline-flex`, 6px, `text-xs font-semibold`, fundo tonal do papel da cor (ex.: `primary/10` + `text-primary`), com ponto pulsante opcional. Alvo: sem contorno.
- **MetricChip:** número em `font-mono font-extrabold text-primary` + rótulo Ardósia Clara; `shadow-xs`. Alvo: sem contorno.

### Cards / Containers
- **Corner:** 6px. **Background:** Papel (claro) / Grafite Elevado (escuro). **Shadow:** repouso `shadow-sm` → hover `shadow-xl` (ver Elevation). **Border:** **nenhuma** (Regra Sem-Borda). **Padding:** 24px → 32px (`sm`).
- **ContentCard** (listagens): imagem `16:9` com overlay em gradiente e `scale-105` no hover; eyebrow CAIXA-ALTA azul; título 700 que vira azul no hover; CTA com seta que desliza. Alvo: retirar a `border` de contorno.

### Inputs / Fields
- **Style:** fundo Papel, texto Tinta, 6px, `padding 10px 16px`. **Focus:** `focus:border-primary` hoje — alvo: **realce sem borda** (anel/sombra do Azul ATRA) coerente com a Regra Sem-Borda. Lupa à esquerda, limpar (X) à direita.

### GlowCard (assinatura)
Cartão com borda de **brilho** interativa (gradiente radial mascarado seguindo `--x/--y/--hue`). É o componente que define o grafite "vivo" — reservar para destaques, não para toda caixa.

## Do's and Don'ts

### Do:
- **Do** ancorar toda tela nova nos componentes da home ou em variações documentadas deles (A home é a lei).
- **Do** usar **6px** em toda caixa/controle e o par de utilities `pill-btn-*` para botões.
- **Do** comunicar profundidade por **superfície + sombra suave**; use o GlowCard como o único brilho de assinatura.
- **Do** escrever cor sempre em par claro/escuro, com o **valor escuro por último**, e medir contraste nos dois temas.
- **Do** manter títulos em Mona Sans **peso 300** e rótulos em CAIXA-ALTA 600.

### Don't:
- **Don't** pôr **linha de borda em caixa** (cartão, chip, campo, selo, painel) — separe por tom e sombra (Regra Sem-Borda).
- **Don't** introduzir um segundo raio (`8px`/`rounded-lg`) nem um segundo brilho concorrente ao GlowCard.
- **Don't** espalhar o acento azul/laranja em grandes áreas — ele é pontuação (Regra do Acento Escasso).
- **Don't** adicionar `antialiased`/`-webkit-font-smoothing` nem o eixo `wdth` (quebra o gate).
- **Don't** inventar uma linguagem visual por página; se a home não tem, é variação a documentar, não invenção.

<!-- Nota: mudanças visuais que apliquem estas regras (ex.: retirar bordas) regravam o gabarito (`pnpm gate --baseline`), com justificativa no PR. Este arquivo é a autoridade do Impeccable; o `.ksdd/specs/DESIGN.md` é a referência de spec do KSDD. Se divergirem, o código (e este arquivo, derivado dele) vence. -->
