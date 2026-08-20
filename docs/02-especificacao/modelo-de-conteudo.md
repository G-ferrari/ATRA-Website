---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [../00-contexto/decisoes.md, ../01-descoberta/inventario-conteudo.md, blocos.md]
---

# Modelo de conteúdo

Collections e globals do Payload. Blocos flexíveis em [blocos](blocos.md);
tipos TypeScript resultantes em [contratos-de-dados](contratos-de-dados.md).

## Regras que valem para todo o modelo

| Regra | Razão |
|---|---|
| **Localization habilitada** (`pt` default, `en`) — todo campo de texto visível ao público é `localized: true` | D-07. Retrofit depois é migração de banco |
| **`slug` é localizado** e gerado do título com override manual | D-07 usa slugs traduzidos (`/sobre` → `/en/about`) |
| **`drafts: true`** em toda collection com URL pública | D-08: 15 itens entram sem corpo e não podem ir ao ar |
| **`versions: { drafts: true }`** também nos globals | Permite reverter uma edição errada de menu ou rodapé |
| Todo campo tem **`admin.description`** em PT-BR | O editor é o marketing, não o dev |
| Imagem sempre por `relationship` para `media`, nunca URL solta | Evita repetir o hotlink que a migração está eliminando |
| `title` e `slug` são obrigatórios; o resto nasce opcional | Rascunho precisa poder ser salvo incompleto |

**Nomes de collection, campo e slug em inglês** (D-05); rótulos e textos de ajuda
do admin em PT-BR.

## Mapa de collections

| Collection | Propósito | URL pública | Origem no legado |
|---|---|---|---|
| `media` | Biblioteca de imagens e arquivos | — | `public/`, `src/assets/`, hotlinks |
| `users` | Acesso ao admin | — | — |
| `topics` | Taxonomia única de assunto | — | tags e categorias soltas em 5 páginas |
| `cases` | Cases de sucesso | `/cases-de-sucesso/[slug]` | `SuccessStories.tsx:16`, `pages/cases/*` |
| `posts` | Artigos do blog | `/blog/[slug]` | `Blog.tsx:11` |
| `resources` | Relatórios e ebooks (material rico) | `/relatorios/[slug]`, `/ebooks/[slug]` | `Reports.tsx:10`, `Ebooks.tsx:9` |
| `webinars` | Webinars ao vivo e gravados | `/webinars/[slug]` | `Webinars.tsx:9` |
| `glossary-terms` | Termos técnicos | `/glossario#[slug]` | `Glossary.tsx:11` |
| `solutions` | Serviços da ATRA | `/solucoes/[slug]` | `App.tsx:45` |
| `partners` | Parceiros de tecnologia | `/parceiros/[slug]` (opcional) | `App.tsx:107`, `:1396`, `logo-clouds.tsx:24` |
| `clients` | Logos de cliente | — | `App.tsx:1860` |
| `testimonials` | Depoimentos | — | `App.tsx:1922` + `testimony` dos cases |
| `specialist-roles` | Perfis de consultor alocáveis | — | `Consultants.tsx:61` |
| `segments` | Verticais de mercado atendidas | `/segmentos/[slug]` | ⚠️ **só no WordPress** — 10 páginas, sem equivalente no protótipo (D-17) |
| `jobs` | Vagas | `/carreiras#[slug]` | 6 páginas no WordPress (P-02 respondida) |
| `pages` | Páginas institucionais montadas por blocos | `/[slug]` | Home, `/sobre`, `/carreiras`, `/contato`, `/politicas-e-termos` |

### Decisões de "collection separada vs. campo"

| Decisão | Justificativa em 1 linha |
|---|---|
| `resources` única, com `type: report \| ebook` | Schema idêntico (título, resumo, capa, arquivo, tags, data); separar triplicaria a superfície de admin sem ganho de modelagem |
| `webinars` separada de `resources` | Tem vídeo, palestrante e estado ao vivo/gravado, e não tem arquivo para download — forma e ciclo de vida diferentes |
| `posts` separada de `cases` | Case tem cliente, desafio, solução, resultado e tecnologias; post tem autor e corpo livre — só o cabeçalho coincide |
| `topics` como collection, não array de texto | Tag livre já produziu "IA" vs "Inteligência Artificial" e "Governança" vs "Governança & LGPD" no legado; relationship força vocabulário |
| `testimonials` separada, referenciada pelos cases | O mesmo depoimento aparece na home e dentro do case (`App.tsx:1938` e `RiskEfficiency.tsx:27` são o mesmo texto) |
| `clients` separada de `partners` | Cliente é quem contrata (logo + nome); parceiro é fornecedor de tecnologia, com descrição, nível e página própria |
| `specialist-roles`, não `consultants` | ⚠️ O legado não cadastra pessoas: `Consultants.tsx:61` lista **perfis de cargo** alocáveis. Nome no plural de cargo evita o mal-entendido de virar base de currículos |
| `solutions` collection, não bloco de página | D-09 dá URL própria a cada uma, e o mega-menu precisa consultá-las |
| `pages` com blocos, não global por página | Home, `/sobre` e `/carreiras` compartilham as mesmas seções; landing page nova não deve exigir deploy |

---

## `media`

Upload do Payload, com storage S3-compatível.

| Campo | Tipo | Obrigatório | Observações |
|---|---|---|---|
| `alt` | `text` (localized) | **sim** | Texto alternativo. Ajuda: "Descreva a imagem para quem usa leitor de tela" |
| `caption` | `text` (localized) | não | Legenda opcional |
| `credit` | `text` | não | Crédito/fonte da foto |

Tamanhos gerados: `thumbnail` 400w, `card` 768w, `hero` 1600w, além do original.
Formatos aceitos: `image/*`, `application/pdf` (para `resources.file`).

> Regra: `alt` obrigatório resolve de saída o `alt="ATRA Moment"` repetido 10×
> em `About.tsx:219`.

## `topics`

| Campo | Tipo | Obrigatório | Observações |
|---|---|---|---|
| `name` | `text` (localized) | **sim** | Ex.: "IA Generativa", "Governança & LGPD" |
| `slug` | `text` (localized, unique) | **sim** | Gerado de `name` |
| `description` | `textarea` (localized) | não | Para futura página de tópico |

Valores iniciais do seed, consolidando o vocabulário hoje disperso: IA Generativa,
Governança & LGPD, Google Cloud, Databricks, Lakehouse, FinOps, Analytics & BI,
Migração de Legados, Cloud, Cybersecurity, Estratégia, Negócios.

## `cases`

`drafts: true` · URL `/cases-de-sucesso/[slug]`

| Campo | Tipo | Obrig. | Validação / padrão | Ajuda ao editor |
|---|---|---|---|---|
| `title` | `text` (loc) | **sim** | — | Título do case como aparece na listagem |
| `slug` | `text` (loc, unique) | **sim** | gerado de `title` | Parte final da URL |
| `client` | `text` (loc) | **sim** | — | Nome do cliente (ex.: Banco ABC) |
| `clientLogo` | `rel → media` | não | — | Logo exibido no card |
| `summary` | `textarea` (loc) | **sim** | máx. 220 caracteres | Resumo do card e da meta description |
| `heroImage` | `rel → media` | **sim** | — | Imagem de capa |
| `impact` | `text` (loc) | não | — | Métrica de destaque no card (ex.: "51x mais rápido") |
| `topics` | `rel → topics` (hasMany) | **sim** | mín. 1 | Assuntos, usados no filtro |
| `challenges` | `array{ text: textarea (loc) }` | não | — | Um item por desafio |
| `solution` | `richText` (loc) | não | — | Como a ATRA resolveu |
| `results` | `array{ text: textarea (loc) }` | não | — | Um item por resultado |
| `technologies` | `array{ name: text }` | não | — | Não localizado: nome de produto não se traduz |
| `partners` | `rel → partners` (hasMany) | não | — | Parceiros envolvidos |
| `testimonial` | `rel → testimonials` | não | — | Depoimento ligado a este case |
| `aboutClient` | `textarea` (loc) | não | — | Parágrafo institucional sobre o cliente |
| `featured` | `checkbox` | não | `false` | Destaca no hub `/insights` e no carrossel da home |
| `publishedAt` | `date` | **sim** | hoje | Ordenação |
| `seo` | grupo (ver abaixo) | não | — | — |

⚠️ `CaseDetailBase.tsx:167` tem uma lista fixa de "Áreas de atuação" idêntica nos
4 cases. Vira `topics` — não é campo novo.

## `posts`

`drafts: true` · URL `/blog/[slug]`

| Campo | Tipo | Obrig. | Observações |
|---|---|---|---|
| `title` | `text` (loc) | **sim** | |
| `slug` | `text` (loc, unique) | **sim** | |
| `summary` | `textarea` (loc) | **sim** | máx. 220 caracteres |
| `coverImage` | `rel → media` | **sim** | |
| `author` | `text` (loc) | não | Campo que o código não tem e o export traz: "Engenharia ATRA", "Time de IA ATRA" (`CONTEUDO_DO_SITE.md` §7.2) |
| `topics` | `rel → topics` (hasMany) | **sim** | |
| `body` | `richText` (loc) | não | ⚠️ **vazio nos 6 posts existentes** — sem ele o post não publica |
| `readingTime` | `number` | não | Minutos; calculado do `body` por hook |
| `featured` | `checkbox` | não | |
| `publishedAt` | `date` | **sim** | |
| `seo` | grupo | não | |

## `resources`

`drafts: true` · URL `/relatorios/[slug]` ou `/ebooks/[slug]`, conforme `type`

| Campo | Tipo | Obrig. | Observações |
|---|---|---|---|
| `type` | `select: report \| ebook` | **sim** | Define o prefixo da URL e o rótulo do card |
| `title` | `text` (loc) | **sim** | |
| `slug` | `text` (loc, unique) | **sim** | Único **por tipo** |
| `summary` | `textarea` (loc) | **sim** | |
| `coverImage` | `rel → media` | **sim** | Ebook usa proporção 3/4; relatório, 16/10 |
| `body` | `richText` (loc) | não | ⚠️ vazio nos 6 itens existentes |
| `file` | `rel → media` | não | PDF entregue após o formulário |
| `gated` | `checkbox` | não | `true` = exige formulário; `false` = download direto |
| `pageCount` | `number` | não | Só ebook — condicional a `type === 'ebook'` |
| `topics` | `rel → topics` (hasMany) | **sim** | |
| `featured` | `checkbox` | não | |
| `publishedAt` | `date` | **sim** | |
| `seo` | grupo | não | |

## `webinars`

`drafts: true` · URL `/webinars/[slug]`

| Campo | Tipo | Obrig. | Observações |
|---|---|---|---|
| `title` | `text` (loc) | **sim** | |
| `slug` | `text` (loc, unique) | **sim** | |
| `summary` | `textarea` (loc) | **sim** | |
| `coverImage` | `rel → media` | **sim** | |
| `state` | `select: upcoming \| recorded` | **sim** | `upcoming` mostra inscrição; `recorded` mostra player (D-11) |
| `scheduledAt` | `date` | **sim** | Substitui a string livre "Amanhã, 15:00" de `Webinars.tsx:14` |
| `videoUrl` | `text` | não | YouTube/Vimeo. Obrigatório quando `state === 'recorded'` |
| `durationMinutes` | `number` | não | Substitui o `"45:00"` fixo em `Webinars.tsx:78` |
| `speakers` | `array{ name, role (loc), photo → media }` | não | Hoje o nome do palestrante está dentro do título |
| `registrationUrl` | `text` | não | Para `upcoming` sem formulário próprio |
| `topics` | `rel → topics` (hasMany) | **sim** | |
| `featured` | `checkbox` | não | |
| `seo` | grupo | não | |

## `glossary-terms`

Sem `drafts` — termo é curto e nasce completo. URL: âncora em `/glossario`.

| Campo | Tipo | Obrig. | Observações |
|---|---|---|---|
| `term` | `text` (loc) | **sim** | |
| `slug` | `text` (loc, unique) | **sim** | Âncora `#term-lakehouse` |
| `definition` | `textarea` (loc) | **sim** | |
| `category` | `rel → topics` | **sim** | Reaproveita a taxonomia |
| `relatedSolutions` | `rel → solutions` (hasMany) | não | Liga o glossário à oferta comercial |

## `solutions`

`drafts: true` · URL `/solucoes/[slug]` (D-09)

| Campo | Tipo | Obrig. | Observações |
|---|---|---|---|
| `title` | `text` (loc) | **sim** | |
| `slug` | `text` (loc, unique) | **sim** | |
| `category` | `select: innovation-ai \| data-bi \| governance-culture` | **sim** | As 3 categorias do mega-menu (`App.tsx:45-97`) |
| `icon` | `text` | **sim** | Nome do ícone Fluent (ex.: `fluent:brain-circuit-24-regular`) |
| `shortDescription` | `textarea` (loc) | **sim** | Texto do mega-menu e do card do índice |
| `hasPage` | `checkbox` | não | `false` = aparece no menu sem link. Cobre as 5 sem conteúdo hoje |
| `layout` | `blocks` | não | Ver [blocos](blocos.md). Só quando `hasPage` |
| `order` | `number` | não | Ordem dentro da categoria |
| `seo` | grupo | não | |

## `partners`

URL `/parceiros/[slug]` quando `hasPage`

| Campo | Tipo | Obrig. | Observações |
|---|---|---|---|
| `name` | `text` | **sim** | Não localizado: nome próprio |
| `slug` | `text` (unique) | **sim** | |
| `logo` | `rel → media` | **sim** | Preferir os SVGs íntegros já no repo |
| `description` | `textarea` (loc) | **sim** | Texto do mega-menu |
| `tier` | `text` (loc) | não | "Premier Partner", "Cloud Solutions" (`App.tsx:1188`) |
| `featured` | `checkbox` | não | Aparece no bloco de destaque da home |
| `hasPage` | `checkbox` | não | Só Google Cloud hoje |
| `layout` | `blocks` | não | Conteúdo da página de parceiro |
| `order` | `number` | não | |

⚠️ P-10: um parceiro está cadastrado como `"Partner"` (`App.tsx:111`) — nome real
desconhecido. Não migrar até resolver.

## `clients`

| Campo | Tipo | Obrig. | Observações |
|---|---|---|---|
| `name` | `text` | **sim** | |
| `logo` | `rel → media` | **sim** | |
| `logoScale` | `select: normal \| boost` | não | Substitui o `boost: bool` de `App.tsx:1861` |
| `order` | `number` | não | |

## `testimonials`

| Campo | Tipo | Obrig. | Observações |
|---|---|---|---|
| `quote` | `textarea` (loc) | **sim** | |
| `authorName` | `text` | não | ⚠️ Vazio nos 4 da home; preenchido nos dos cases |
| `authorRole` | `text` (loc) | **sim** | |
| `company` | `text` | **sim** | |
| `photo` | `rel → media` | não | **Opcional por decisão** (D-14): sem foto, monograma |
| `featured` | `checkbox` | não | Entra no carrossel da home |

## `specialist-roles`

| Campo | Tipo | Obrig. | Observações |
|---|---|---|---|
| `title` | `text` (loc) | **sim** | Ex.: "Engenheiro de Dados" |
| `seniority` | `select: pleno \| senior \| lead` | **sim** | De `Consultants.tsx:59` |
| `specialty` | `rel → topics` | **sim** | |
| `description` | `textarea` (loc) | **sim** | |
| `skills` | `array{ name: text }` | não | Não localizado: nome de tecnologia |
| `availableCount` | `number` | não | "N especialistas disponíveis" no card |

## `segments`

`drafts: true` · URL `/segmentos/[slug]` · **entra por D-17**

Verticais de mercado. Existem no WordPress (10 páginas) e não têm equivalente no
protótipo. Mesma forma de `solutions` — a diferença é semântica: solução é *o que*
a ATRA faz; segmento é *para quem*.

| Campo | Tipo | Obrig. | Observações |
|---|---|---|---|
| `name` | `text` (loc) | **sim** | Bancos & Serviços Financeiros, Saúde, Varejo, Educação, Logística, Telecom, Indústria, Utilidades |
| `slug` | `text` (loc, unique) | **sim** | |
| `icon` | `text` | **sim** | Ícone Fluent |
| `shortDescription` | `textarea` (loc) | **sim** | Card do índice |
| `layout` | `blocks` | não | Conteúdo da página |
| `relatedSolutions` | `rel → solutions` (hasMany) | não | Liga vertical à oferta |
| `relatedCases` | `rel → cases` (hasMany) | não | Prova social por segmento — o case do Banco ABC vive em "Bancos" |
| `clients` | `rel → clients` (hasMany) | não | Logos por vertical |
| `order` | `number` | não | |
| `seo` | grupo | não | |

> `relatedCases` e `clients` fazem a página de segmento se montar sozinha à medida
> que cases e clientes são cadastrados — em vez de repetir conteúdo.

## `jobs`

`drafts: true` · URL `/carreiras#[slug]` (ou `/carreiras/[slug]` — ver nota)

**P-02 respondida por evidência:** as 6 vagas atuais são páginas do WordPress,
publicadas pelo RH. Não há ATS. O fluxo se mantém, muda o CMS.

| Campo | Tipo | Obrig. | Observações |
|---|---|---|---|
| `title` | `text` (loc) | **sim** | |
| `slug` | `text` (loc, unique) | **sim** | |
| `area` | `rel → topics` | **sim** | |
| `seniority` | `select` | **sim** | Mesmo vocabulário de `specialist-roles` |
| `workModel` | `select: remote \| hybrid \| onsite` | **sim** | O site promete "100% Remoto" (`App.tsx:725`) |
| `location` | `text` (loc) | não | |
| `description` | `richText` (loc) | **sim** | |
| `applyUrl` | `text` | não | Se a candidatura for externa |
| `isOpen` | `checkbox` | não | `true` |

> ⚠️ As 6 vagas do WP têm **URL de raiz** (`/key-account-manager-pl-sr/`), não
> aninhada. Se virarem âncora em `/carreiras`, os 6 redirects apontam todos para a
> mesma página — o candidato cai na lista, não na vaga. Recomendo
> `/carreiras/[slug]` para preservar o destino 1:1.

## `pages`

`drafts: true` · URL `/[slug]` — home é `slug: "home"`, renderizada em `/`

| Campo | Tipo | Obrig. | Observações |
|---|---|---|---|
| `title` | `text` (loc) | **sim** | Uso interno e `<h1>` quando o bloco não define |
| `slug` | `text` (loc, unique) | **sim** | |
| `layout` | `blocks` | **sim** | Ver [blocos](blocos.md) |
| `seo` | grupo | não | |

Páginas iniciais: `home`, `sobre`, `carreiras`, `contato` (D-10).

## Grupo `seo` (reutilizado)

| Campo | Tipo | Observações |
|---|---|---|
| `metaTitle` | `text` (loc) | Cai para `title` se vazio |
| `metaDescription` | `textarea` (loc) | Cai para `summary`. Máx. 160 |
| `ogImage` | `rel → media` | Cai para `heroImage`/`coverImage` |
| `noIndex` | `checkbox` | Para `/design-system` e rascunhos |

---

## Globals

| Global | Conteúdo | Origem |
|---|---|---|
| `navigation` | Itens do menu, mega-menu por categoria, CTA do topo | `App.tsx:368-899` |
| `footer` | Colunas de links, "sobre a ATRA", texto legal | `App.tsx:2446-2537` |
| `contact` | E-mail, telefone, WhatsApp, endereço, redes | duplicado em 4 lugares |
| `site-settings` | Métricas institucionais, selos, logo, título padrão | `App.tsx:1131`, `About.tsx:134` |
| `ai-assistant` | System prompt, modelo, temperatura, rate limit, prompts sugeridos | `server.ts:6-36`, `Chat.tsx:59` |

### `site-settings` — resolve P-01 na origem

| Campo | Tipo | Observações |
|---|---|---|
| `metrics.yearsInMarket` | `number` | Hoje `15+` nos dois lugares ✓ |
| `metrics.professionals` | `number` | ⚠️ 150 (home) vs 140 (/sobre) |
| `metrics.clients` | `number` | ⚠️ 20 vs 30 |
| `metrics.certifications` | `number` | 40 |
| `metrics.partners` | `number` | 9 |
| `metrics.gptwYears` | `number` | ⚠️ **5 vs 4** |
| `seals` | `array{ image → media, label (loc) }` | GPTW, LIPT |
| `defaultOgImage` | `rel → media` | |

> Um número, um lugar. As 4 divergências de P-01 deixam de ser possíveis por
> construção — resta escolher o valor certo.
>
> **Como ficou no porte (MIG-072).** `metrics` é um array de linhas
> (`value` + `suffix` + `label`), e não um campo por número: o legado desenha 5
> em /sobre e 3 na home, e um campo nomeado por métrica engessaria a lista que o
> marketing mexe. Cada linha tem um `pending` — marcado nas três em disputa, é o
> que faz o admin avisar que houve escolha, em vez de o número controverso
> parecer conferido.

### `footer` — colunas, e não três campos

O legado desenha a mesma coluna três vezes com listas diferentes. Modelar como
`solutions`/`institutional`/`legal` fixaria no schema uma escolha de layout: o
editor não poderia renomear um título nem trocar a ordem sem PR. É um array de
colunas, cada uma com `title`, `kind` e `links`.

`kind: 'contact'` existe para a coluna que **não tem links próprios** — ela
desenha telefone, e-mail e endereço do global `contact`, com ícone. Sem esse
tipo, ou os dados de contato seriam digitados de novo aqui (a duplicação que a
migração existe para acabar), ou a coluna ficaria fora do array e presa entre
duas outras no JSX.

### `ai-assistant` — implementa D-12

| Campo | Tipo | Observações |
|---|---|---|
| `systemPrompt` | `textarea` (loc) | Sai de `server.ts:6-36`; marketing edita sem deploy |
| `model` | `text` | Default `gemini-3.6-flash`; hoje fixo em `server.ts:66` |
| `temperature` | `number` | Default `0.7` |
| `rateLimitPerHour` | `number` | Por IP |
| `monthlyBudgetBRL` | `number` | Teto; atingido, degrada graciosamente (P-04) |
| `suggestedPrompts` | `array{ icon, title (loc), description (loc), prompt (loc) }` | `Chat.tsx:59-84` |
| `disclaimer` | `text` (loc) | `App.tsx:2119` |

> [!DECISÃO PENDENTE] `systemPrompt` editável pelo marketing é conveniência real,
> mas é também injeção de prompt por design: quem edita o global controla o que a
> IA diz em nome da ATRA. Restringir esse campo a um papel `admin`, ou aceitar que
> qualquer editor mexa?
