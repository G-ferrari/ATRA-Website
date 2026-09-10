---
version: alpha
name: ATRA
description: >-
  Sistema visual do site institucional da ATRA (consultoria de Dados & IA),
  portado pixel a pixel do protótipo legado (D-15). Tema escuro por padrão,
  acento azul→laranja, tipografia Mona Sans com títulos leves. Tokens derivados
  de web/src/app/(frontend)/globals.css.
colors:
  primary: "#3C98FA"
  primary-dark: "#2A75C5"
  secondary: "#FF8B08"
  secondary-dark: "#D67200"
  surface: "#FFFFFF"
  surface-page: "#F8FAFC"
  surface-alt: "#F1F5F9"
  on-surface: "#0F172A"
  on-surface-subtle: "#334155"
  neutral: "#64748B"
  border: "#E2E8F0"
  dark-bg: "#0E1015"
  dark-surface: "#181B22"
  dark-surface-2: "#222631"
  on-dark: "#F3F4F6"
  on-dark-subtle: "#D1D5DB"
  on-dark-muted: "#9CA3AF"
  on-accent: "#FFFFFF"
typography:
  headline-display:
    fontFamily: Mona Sans
    fontSize: 3rem
    fontWeight: 300
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: Mona Sans
    fontSize: 2.25rem
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: Mona Sans
    fontSize: 1.5rem
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title-md:
    fontFamily: Mona Sans
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.3
  body-lg:
    fontFamily: Mona Sans
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Mona Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Mona Sans
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label-button:
    fontFamily: Mona Sans
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.05em"
rounded:
  sm: 4px
  md: 6px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-button}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-button}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-secondary-hover:
    backgroundColor: "{colors.secondary-dark}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-button}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 24px
  card-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.md}"
    padding: 24px
  chip:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.on-surface-subtle}"
    rounded: "{rounded.sm}"
    padding: 4px 12px
---

# DESIGN.md — ATRA

> **Origem:** Reverse-engineered via `/ksdd:setup` em 28/08/2026, a partir do artefato construído — os tokens acima foram extraídos de `web/src/app/(frontend)/globals.css` (bloco `@theme` + `html.dark`) e das utilities de componente, não de intenção de design.
> **Aviso:** Sistema derivado do código real. O gabarito é o protótipo legado (`legacy/src/index.css`), portado com fidelidade pixel a pixel (D-15). Qualquer "melhoria" tipográfica ou de cor aqui é divergência de porte — vai para o débito técnico, não para o CSS.

## Overview

A ATRA é uma consultoria de **Dados & IA** e parceira do Google Cloud. O site fala com um público **B2B de setores regulados** (bancos, saúde, varejo) e precisa soar **técnico, confiável e moderno**, sem cair no clichê de "startup de IA".

A personalidade visual nasce de três escolhas:

1. **Escuro por padrão.** O `<html>` carrega a classe `dark` no boot (`layout.tsx:130`) — o site abre no tema grafite (`#0E1015`), como o protótipo legado (`App.tsx:2575`). Existe tema claro, com botão fixo de alternância, mas a experiência-âncora e o gabarito de regressão visual são o escuro. Fundo grafite + acentos saturados dão o ar de "console/plataforma de dados".
2. **Acento azul → laranja.** O par `primary` (azul `#3C98FA`) + `secondary` (laranja `#FF8B08`) é a assinatura da marca. Aparece em gradiente (`text-gradient`, `bg-gradient-atra`) em títulos de destaque e CTAs, e sozinho em botões e realces.
3. **Títulos leves e apertados.** Todos os headings usam **peso 300** (light) com `letter-spacing: -0.02em` — uma voz editorial contida, que contrasta com o corpo em peso normal e com os rótulos de botão em caixa-alta espaçada.

A resposta emocional pretendida é **competência tranquila**: nada grita, o brilho fica nos detalhes (o efeito `GlowCard`, o gradiente da marca), e a hierarquia vem do tamanho e do espaço, não de bordas pesadas.

## Colors

A paleta é **dual (claro/escuro)** com os mesmos nomes de token trocando de valor por tema. No CSS, os valores do `@theme` são o **tema claro (base)** e `html.dark` os sobrescreve — por isso os tokens acima registram a camada clara como canônica, com a escura documentada aqui.

**Marca (idêntica nos dois temas):**
- `primary` `#3C98FA` — azul de ação: botões primários, links, realces, foco visual.
- `primary-dark` `#2A75C5` — hover do primário.
- `secondary` `#FF8B08` — laranja de destaque: CTAs secundários, o segundo pé do gradiente.
- `secondary-dark` `#D67200` — hover do secundário.
- Gradiente da marca: `primary → secondary`, esquerda→direita, em títulos e faixas de CTA.

**Superfícies e texto — tema claro (base):**
- `surface-page` `#F8FAFC` (fundo), `surface` `#FFFFFF` (cartão), `surface-alt` `#F1F5F9` (cartão recuado).
- `on-surface` `#0F172A` (texto principal), `on-surface-subtle` `#334155`, `neutral` `#64748B` (texto secundário).
- `border` `#E2E8F0`.

**Superfícies e texto — tema escuro (override `html.dark`):**
- `dark-bg` `#0E1015` (fundo), `dark-surface` `#181B22` (cartão), `dark-surface-2` `#222631` (cartão recuado).
- `on-dark` `#F3F4F6`, `on-dark-subtle` `#D1D5DB`, `on-dark-muted` `#9CA3AF`.
- Bordas por transparência: `rgba(255,255,255,0.08)` (principal) e `0.05` (sutil) — no escuro a borda é luz difusa, não linha sólida.

> ⚠️ **Cor sempre em par (armadilha paga).** Escrever `text-white` sem `dark:` sobre fundo que clareia — ou `text-text-main` sobre painel que escurece — some no tema alternado. O par correto é `text-slate-900 dark:text-white`, com o **valor escuro depois**, porque é ele que o gabarito compara. Auditoria de contraste (`e2e/contraste.spec.ts`) mede os **dois** temas.

## Typography

Família única: **Mona Sans** (SIL OFL 1.1), fonte variável `wght` 200–900, servida por `next/font/google` (D-16) — a **mesma build** que o legado consome, para a métrica bater a 0,0000% na regressão visual. `--font-sans` e `--font-display` apontam ambas para Mona Sans.

**Estratégia:**
- **Títulos (`headline-*`)** — peso **300**, `letter-spacing -0.02em`. Leves e apertados; a hierarquia entre níveis vem do tamanho, não do peso. É a voz da marca.
- **Corpo (`body-*`)** — peso 400, `line-height` 1.5–1.6. Legibilidade em texto longo (blog, materiais, glossário).
- **Títulos de cartão (`title-md`)** — peso 600, onde um bloco precisa de um rótulo mais firme que o heading leve.
- **Rótulos de botão (`label-button`)** — peso 600, `text-xs`, **caixa-alta** com `tracking-wider`. O contraponto "técnico" aos títulos leves.

> ⚠️ **Não introduzir propriedade tipográfica que o legado não tem (D-25).** Nada de `antialiased`/`-webkit-font-smoothing`: ligar a suavização move a rasterização de todo glifo e estoura o limite de 0,1%. Não pedir `axes: ['wdth']` no `next/font`: o Google serve outro corte e o itálico fica 3,2% mais largo.

## Layout

- **Grid fluido** centrado, com largura máxima de contêiner e respiro lateral crescente por breakpoint. Seções empilham verticalmente; a home e as páginas institucionais são compostas por **blocos** (ver Components).
- **Escala de espaçamento** em múltiplos de 8/4px (Tailwind). Cartões usam `padding` 24px (`p-6`), subindo para 32px (`sm:p-8`) a partir de tablet.
- **Breakpoints** (os três da regressão visual): **mobile 375px**, **tablet 768px**, **desktop 1280px**.
- **Ritmo vertical** por blocos com espaçamento configurável (`spacing` no campo comum de bloco). Fundo pode receber a **grade de pontos** (`vort-dot-grid`) como textura sutil.

## Elevation & Depth

Hierarquia por **sombra suave + camada tonal**, não por bordas fortes (as bordas dos cartões são `border-0` ou luz difusa no escuro):

- **Cartões** — `shadow-md`/`shadow-xl` no claro; no escuro, `shadow-2xl shadow-black/60` (a sombra é mais o "peso" da caixa que uma projeção).
- **GlowCard** — o efeito de assinatura: uma borda de brilho que segue o cursor (`[data-glow]` com máscara de gradiente radial em `::before`/`::after`, variáveis `--x`/`--y`/`--hue`). No legado vinha injetado por instância (13 cópias na home); no porte vive uma vez só no CSS, com saída idêntica.
- **Vidro** — `glass-card` (branco translúcido + sombra) e `glass-card-dark` para sobreposições (header, painéis de chat) com `backdrop-blur`.

## Shapes

Linguagem de cantos **discreta e consistente**:
- `rounded.md` **6px** — o raio-assinatura. Botões, cartões, campos, chips grandes: quase tudo é `rounded-[6px]`.
- `rounded.sm` **4px** — chips/badges pequenos e etiquetas.
- `rounded.full` **9999px** — apenas avatares/monogramas e pontos indicadores.

Sem cantos exagerados: o 6px dá modernidade sem "bolha". Formas retangulares dominam; o brilho e o gradiente fazem o trabalho de personalidade.

## Components

Os componentes vivem em `web/src/components/{ui,blocks,forms,layout,content}` e são alimentados por **props** (nenhum busca dado). Os blocos de conteúdo (26, em `blocks/index.ts`) são o vocabulário de layout que o marketing compõe no CMS.

**Botões** (utilities `pill-btn-*`): três variantes — `primary` (azul), `secondary` (laranja), `outline` (transparente, texto sobre hover `primary/10`). Todos: `rounded-[6px]`, `px-6 py-3`, rótulo em **caixa-alta `text-xs tracking-wider`**, `shadow-md` → `hover:shadow-lg`, `active:scale-[0.98]`.

**Cartões:** `vort-card` (claro) / `vort-card-dark` (escuro) — base de conteúdo; `GlowCard` — cartão com borda de brilho interativa; `ContentCard`, `GlowCard`, `MetricChip`, `StatusBadge`, `TabFilter`, `SearchInput`, `EmptyState` são os componentes-base do design system (Fase 2), verificados por `e2e/paridade-ds.spec.ts`.

**Chips/etiquetas:** fundo `surface-alt`, texto `on-surface-subtle`, `rounded-[4px]`, `px-3 py-1`, `text-xs`. Usados em filtros de listagem (vindos de `topics` com `showInFilter`) e tags.

**Chrome:** `SiteHeader` com **mega-menu** (8 categorias, painéis alimentados por collections), `SiteFooter` (4 colunas), `ThemeToggle` fixo, gaveta mobile. `chat/conversa.tsx` é a ilha do assistente.

**Domínio:** carrosséis de cases e depoimentos (`caseCarousel`, `testimonialCarousel`), esteira de logos (`logoMarquee`, `animate-marquee-horizontal`, pausa no hover), `statsGrid` (contadores), `featureTabs`, `bentoGrid`/`homeBento`.

## Do's and Don'ts

- **Do** escrever cor sempre em par claro/escuro, com o valor escuro por último (`text-slate-900 dark:text-white`). É o que o gabarito escuro compara.
- **Do** usar `rounded-[6px]` como raio padrão e a utility de botão correta (`pill-btn-*`) em vez de recompor classes soltas.
- **Do** usar Mona Sans peso 300 em títulos e caixa-alta espaçada em rótulos de botão — é a assinatura.
- **Do** medir contraste nos **dois** temas; contraste baixo igual nos dois é escolha de design (D-15), mas quebra só no claro é regressão (`contraste.spec.ts`).
- **Don't** introduzir `antialiased`, `axes: ['wdth']` ou qualquer propriedade de renderização de texto ausente no legado (D-25).
- **Don't** "consertar" o contraste do botão azul/branco nem o anel de foco removido durante a migração: são débito técnico conhecido (D-13), portados fiel e registrados — corrigir aqui quebra a paridade.
- **Don't** criar bloco novo quando uma **variante** de bloco existente resolve (ex.: `valueCards.variant: glow|expanded`) — bloco novo exige justificativa no PR.
- **Don't** usar SVG como mídia de upload (bloqueado por segurança, MIG-144); logos de parceiro SVG entram por caminho próprio.

> **Nota de contraste (honesta):** `button-primary` (branco sobre `#3C98FA`) fica abaixo de WCAG AA 4.5:1. É fiel ao produto real e coberto por D-13/D-15 (acessibilidade medida, não bloqueante; porte fiel). Registrado como dívida a tratar na fase de a11y — não como valor a "corrigir" no token.
