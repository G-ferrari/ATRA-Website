---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [modelo-de-conteudo.md, ../01-descoberta/inventario-componentes.md]
---

# Blocos flexíveis

Usados em `pages.layout`, `solutions.layout` e `partners.layout`. Cada bloco
corresponde a uma seção que **já existe** no legado — nenhum bloco foi inventado.

## Catálogo

| Bloco | Origem no legado | Usado por | Campos |
|---|---|---|---|
| `hero` | `aether-flow-hero.tsx:91` + `Clients` (`App.tsx:2051`) | home | `headline` (loc), `rotatingWords[]` (loc), `subheadline` (loc), `showAiPrompt` (bool), `backgroundStyle: aether \| gradient \| plain` |
| `pageHero` | `About.tsx:150`, `Glossary.tsx:71`, `Careers.tsx:99` | páginas internas | `badge` (loc), `chip` (loc), `title` (loc), `description` (loc), `ctas[]`, `mediaMode: none \| image \| marquee`, `images[] → media`, `subtitle` (loc), `align: left \| center`, `metrics[]`, `ctaVariant`, `descriptionWidth` |
| `statsGrid` | `Stats` (`App.tsx:1131`), `About.tsx:236` | home, sobre | `variant: bento \| compact`, `source: siteSettings \| custom`, `customItems[]{ value, suffix, label (loc), icon }` |
| `sealsBanner` | `App.tsx:1217-1295`, `Careers.tsx:306` | home, carreiras, sobre | `title` (loc), `description` (loc), `seals` (de `site-settings`) |
| `featureTabs` | `Features` (`App.tsx:1437`) | home | `eyebrow` (loc), `title` (loc), `description` (loc), `items[]{ badge, title, description, icon, image → media }`, `autoRotateSeconds` |
| `logoMarquee` | `LogoCloudSwap` (`App.tsx:1428`), `ClientCarousel` (`App.tsx:1859`) | home, sobre | `title` (loc), `source: partners \| clients`, `filterFeatured` (bool) |
| `caseCarousel` | `CustomerStories` (`App.tsx:1603`) | home | `eyebrow` (loc), `title` (loc), `description` (loc), `mode: featured \| manual`, `cases[] → cases`, `ctaLabel` (loc) |
| `testimonialCarousel` | `Testimonials` (`App.tsx:1919`) | home | `title` (loc), `mode: featured \| manual`, `testimonials[] → testimonials` |
| `contentTeaser` | `BlogSection` (`App.tsx:2166`) | home, sobre | `eyebrow` (loc), `title` (loc), `description` (loc), `sources[]: posts \| cases \| resources \| webinars`, `limit`, `showNewsletter` (bool) |
| `richTextSection` | `About.tsx:291`, `SolutionAI.tsx:218` | todas | `eyebrow` (loc), `title` (loc), `body` richText (loc), `image → media`, `imagePosition: left \| right \| none`, `headerLayout: inline \| centered` + `description`/`subtitle`/`callout{label,text}` (loc) |
| `iconCardGrid` | `About.tsx:403`, `:434`, `SolutionAI.tsx:252` | sobre, soluções | `eyebrow` (loc), `title` (loc), `columns: 2..4`, `variant: compact \| card \| card-centered`, `headerWidth`, `items[]{ icon, title (loc), description (loc) }` |
| `valueCards` | `About.tsx:351`, `Careers.tsx:222` | sobre, carreiras | `eyebrow`/`title`/`highlight`/`description` (loc), `variant: glow \| expanded`, `items[]{ icon, glowColor, title (loc), description (loc), bullets[] (loc) }` |
| `processSteps` | `Careers.tsx:362`, `SolutionAI.tsx:395` | carreiras, soluções | `title` (loc), `steps[]{ number, title (loc), description (loc), icon }` |
| `stickyPageNav` | `About.tsx:258`, `Careers.tsx:159`, `SolutionAI.tsx:180` | páginas longas | `variant: institutional \| solution`, `bottomGap: normal \| none`; `items[]{ label (loc), anchor }` — **gerado dos blocos com `anchor` preenchido** |
| `partnerShowcase` | `About.tsx:376` | sobre, soluções | `title` (loc), `partners[] → partners`, `grayscale` (bool) |
| `ctaContact` | `CTA` (`App.tsx:2284`), `Consultants.tsx:685` | home, contato, consultores | `title` (loc), `subtitle` (loc), `formId`, `showContactCard` (bool), `backgroundImage → media` |
| `ctaBanner` | `CaseDetailBase.tsx:185`, `About.tsx:456` | fim de página | `title` (loc), `description` (loc), `cta{ label (loc), href }`, `variant: primary \| subtle` |
| `resourceList` | `SuccessStories.tsx:90`, `Blog.tsx:93` | índices | `source`, `showSearch` (bool), `showTopicFilter` (bool), `pageSize` |
| `videoEmbed` | novo (D-11) | webinars | `url`, `caption` (loc) |
| `methodCards` | `SolutionAI.tsx:218` | soluções | cabeçalho (`eyebrow`+`eyebrowIcon`+`title`+`description`), `headerCta{label,href}`, `items[]{icon, accent, badge, title (loc), description (loc), bullets[]}` |
| `bentoGrid` | `SolutionAI.tsx:395` | soluções, home | cabeçalho, `items[]{span: 5\|6\|7\|12, size: featured-wide\|featured\|supporting, accent, icon, badge, chip, title, description, metrics[], tags[], bullets[], footer}` |
| `audienceSplit` | `SolutionAI.tsx:621` | soluções | cabeçalho, `cta{label,href}`, `items[]{icon, accent, title (loc), description (loc)}` |
| `accordionSteps` | `SolutionAI.tsx:685` | soluções | cabeçalho, `image → media`, `imageBadge{icon,title,subtitle}`, `steps[]{title (loc), description (loc)}` — a primeira abre expandida |

## Composição das páginas iniciais

Reproduz a ordem exata do legado — requisito de paridade visual (D-15).

| Página | Blocos, em ordem |
|---|---|
| `home` | `hero` → `statsGrid` → `sealsBanner` → `featureTabs` → `logoMarquee`(partners) → `caseCarousel` → `testimonialCarousel` → `contentTeaser` → `ctaContact` |
| `sobre` | `pageHero` → `statsGrid` → `stickyPageNav` → `richTextSection` → `valueCards` → `partnerShowcase` → `iconCardGrid` → `iconCardGrid` → `ctaBanner` |
| `carreiras` | `pageHero`(center) → `stickyPageNav` → `valueCards`(expanded) → `sealsBanner` → `processSteps` → `jobsList` → `iconCardGrid`(card-centered) → `richTextSection`(centered) — **corrigida em MIG-050a**, ver abaixo |
| `contato` (nova, D-10) | `pageHero` → `ctaContact` |
| `insights` | `insightsHub` — sete seções num bloco só, porque compartilham o estado do filtro |
| `solucoes/[slug]` | `pageHero` → `stickyPageNav` → `methodCards` → `bentoGrid` → `audienceSplit` → `accordionSteps` → `ctaBanner`(dark) — **corrigida em MIG-056**, ver abaixo |
| `parceiros/[slug]` | `partnerHero` → `partnerSplit`(image) → `partnerSplit`(checklist) → `partnerSplit`(specGrid) → `ctaBanner`(dark-centered) — **corrigida em MIG-054a**, ver abaixo |

> [!ATENÇÃO] **A composição prevista para `solucoes/[slug]` estava errada.**
> Ela dizia `iconCardGrid → processSteps → richTextSection`, e `SolutionAI.tsx`
> não tem nenhuma dessas seções: tem três cards com selo de etapa e lista de
> conferência, um bento de 12 colunas com cards de anatomia diferente, uma seção
> de duas colunas com perfis e um acordeão ao lado de uma imagem. Reusar os
> blocos existentes só seria possível desfigurando o gabarito, o que D-15 proíbe.
>
> MIG-056 acrescentou quatro blocos — `methodCards`, `bentoGrid`,
> `audienceSplit`, `accordionSteps` — e três variantes: `ctaBanner: dark`,
> `stickyPageNav: solution` e, no `pageHero`, `metrics[]` + `ctaVariant` +
> `descriptionWidth`. A justificativa de cada um está junto da definição, em
> `web/src/blocks/index.ts`. Todos nascem configuráveis porque esta página é o
> **template das outras 5** e das 13 de MIG-093.
>
> Lição para as composições que faltam (`home`, `/insights`, `segmentos`): elas
> foram escritas a partir do inventário de seções, não do markup. Conferir
> contra o arquivo do legado **antes** de estimar a task.

> [!ATENÇÃO] **A composição prevista para `carreiras` também estava errada**, e
> pelo mesmo motivo. Ela previa sete blocos, dois deles `iconCardGrid`, e
> terminava num `ctaContact`. O que `Careers.tsx` tem:
>
> - a seção "Jeito ATRA de Ser" não é grade de ícones: são os **mesmos três
>   valores de /sobre** num cartão alto com tagline, divisor e checklist
>   (`:222`) — virou `valueCards: expanded`;
> - o cartão "Banco de Talentos" fica **dentro** da seção de vagas, sob a grade,
>   e é para onde os cards de vaga do legado apontam (`:450`) — virou o grupo
>   `talentBank` do `jobsList`, não uma faixa no fim da página;
> - faltavam "Vantagens de ser ATRA" (`:550`) e "Programa de Trainee ATRA"
>   (`:579`), que são `iconCardGrid: card-centered` e
>   `richTextSection: headerLayout centered` com `callout`.
>
> MIG-050a acrescentou também dois campos em nível de página, porque o legado
> **não é uniforme entre rotas**: `spacing` (em `camposComuns`) e `bottomGap` (no
> `stickyPageNav`). Ver [debito-tecnico](../01-descoberta/debito-tecnico.md).

> [!ATENÇÃO] **E a de `parceiros/[slug]` também.** Aqui o erro tem outra origem:
> o legado não monta essa página com seções, e sim com um componente único,
> `PartnerPageBase.tsx`, que as 8 páginas de parceiro instanciam com props. As
> **três seções do meio são o mesmo esqueleto** de duas colunas, mudando só a
> coluna direita — imagem com etiqueta, lista de conferência, grade de fichas.
>
> MIG-054a acrescentou `partnerHero` (que carrega a faixa de prêmios, e cuja
> escala de `h1` sobe em quatro degraus contra os três do `pageHero`) e
> `partnerSplit` (com `rightColumn`), mais a variante `ctaBanner: dark-centered`.
> São dois blocos porque é assim que o legado se organiza — reproduzir com os
> genéricos foi o que MIG-054 tentou, e a página saiu 38% mais curta.

> [!ATENÇÃO] **E a da home.** Ela previa seis blocos em duas tasks
> (`hero`, `featureTabs`, `logoMarquee`; depois `caseCarousel`,
> `testimonialCarousel`, `contentTeaser`) e faltavam dois: o **bento** de
> `App.tsx:1132` — seis cartões, dois largos e quatro de número — e a **caixa de
> conversa com a IA** de `:2055`.
>
> A caixa de IA não é um bloco irmão: no legado ela é `children` do herói
> (`:2548`), e o canvas de partículas é `absolute inset-0` do container que
> envolve os dois. Separá-los encurtaria o canvas para a altura do herói e
> mudaria a densidade de partículas, que sai de `largura * altura / 22000`. É um
> grupo de campos dentro de `homeHero`.
>
> A faixa que fecha a home **não** é o `ctaContact` de /contato: aquela rota é
> nova (D-10) e não tem gabarito, e a composição de MIG-053 divergiu do original
> — três campos mais `textarea` contra quatro campos, e um painel de gradiente
> no lugar do cartão com foto. Daí a variante `ctaContact: photo`.

> [!ATENÇÃO] **E `/insights` não agrega nada.** O plano dizia "agrega 4
> collections" e o legado tem uma **lista curada com texto próprio**: dos 10
> itens, só 3 repetem o título da página de origem. O mesmo case do Banco
> Carrefour aparece no hub como "Processamento de Dados 51x Mais Rápido no
> Google Cloud" e em /cases-de-sucesso com outro nome. Agregar mudaria o texto
> de sete cartões; trocar o texto do hub pelo das collections é decisão de
> conteúdo (D-22). Virou o bloco `insightsHub`, com os itens em array.

> **Padrão que se repete.** Cinco composições previstas estavam erradas —
> `solucoes/[slug]`, `carreiras`, `parceiros/[slug]`, `home`, `/insights` — e
> nas cinco o erro foi o mesmo: foram escritas a partir do **inventário de
> seções**, não do markup. Antes de estimar `segmentos` e as 13 de MIG-093,
> abrir o arquivo do legado.

## Regras de bloco

1. **Bloco não busca dado.** Recebe tudo por props, resolvidas na page server
   component. Ver [contratos-de-dados](contratos-de-dados.md).

   Na prática são injetores em `lib/paginas.ts`, um por fonte, e cada um só
   consulta se algum bloco da página pede: `comVagas`, `comClientes`,
   `comDepoimentos` e `comContato`. O bloco declara um campo (`vagas`,
   `clientes`, `contato`) que nasce vazio no mapper e chega preenchido na
   renderização — e o preview de um bloco solto no admin, onde nada injeta,
   simplesmente esconde a parte que dependia do dado.
2. **Todo bloco aceita `anchor` (`text`), `theme` (`surface-1 | surface-2`),
   `borda` e `spacing` (`normal | roomy`).** O `anchor` alimenta o
   `stickyPageNav`; os outros três reproduzem, seção a seção, a alternância de
   fundo, de linha divisória e de respiro vertical que o legado faz — e que
   **não é a mesma entre páginas**: /sobre é uniforme em `py-16 md:py-20`,
   /carreiras usa `py-20 md:py-24` em seis das sete seções (MIG-050a).

   ⚠️ **Exceção, descoberta em MIG-056: `ctaBanner` tem âncora mas não entra no
   menu.** Ter id e estar no sumário são coisas diferentes — a faixa que fecha a
   página de solução precisa de `id="contato"` porque três botões apontam para
   lá, mas o menu do legado lista quatro itens e ela não é um deles. A exclusão
   vive em `ancorasDe()`.
3. **Bloco novo exige justificativa** no PR: por que nenhum dos existentes serve.
   É o que impede 20 rotas virarem 20 dialetos.
4. **`mode: featured | manual`** é o padrão para blocos que listam conteúdo:
   `featured` consulta a collection por `featured: true`; `manual` recebe uma
   seleção explícita. Evita duplicar conteúdo como o hub `/insights` faz hoje.

> [!DECISÃO PENDENTE] `iconCardGrid` aparece duas vezes seguidas em `sobre`,
> `carreiras` e `parceiros` com conteúdos distintos ("Soluções" e "Por que
> escolher"). Funciona, mas o editor vê dois blocos de mesmo nome na lista. Vale
> criar variantes nomeadas (`solutionsGrid`, `benefitsGrid`) para clareza no
> admin, ao custo de mais tipos no schema?
