---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [inventario-rotas.md, inventario-componentes.md, inventario-conteudo.md, inventario-assets.md]
---

# Débito técnico

Classificação: **🔴 bloqueia a migração** · **🟡 resolver durante** · **🟢 resolver depois**

## Rota `/chat`

### Onde está a chave de API — verificado

A chave **não vaza para o bundle do cliente**. Cadeia verificada:

1. `src/services/geminiService.ts:6` — o cliente faz `fetch('/api/chat')`, sem SDK
   e sem chave.
2. `server.ts:53` — o Express lê `process.env.GEMINI_API_KEY` **no servidor** e
   instancia `GoogleGenAI` (`server.ts:63`).
3. `grep -rn "GEMINI_API_KEY\|process.env" legacy/src` → **zero ocorrências**.

⚠️ **Mas há uma armadilha armada.** `vite.config.ts:12` declara:

```ts
define: { 'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY) }
```

O `define` do Vite faz substituição textual em tempo de build. Hoje nenhum código
de cliente referencia esse identificador, então nada é inlinado. **No dia em que
alguém escrever `process.env.GEMINI_API_KEY` em um componente, a chave entra no
JavaScript público sem nenhum aviso** — sem erro de build, sem lint.

**Encaminhamento 🔴:** não portar esse `define`. No Next, a chave fica em variável
de ambiente sem prefixo `NEXT_PUBLIC_`, acessível só em Route Handler / Server
Component. O prefixo obrigatório do Next é justamente a proteção que falta aqui.

### Outros pontos do chat

| Item | Evidência | Classe |
|---|---|---|
| Sem rate limiting — endpoint público que gasta cota de LLM a cada POST | `server.ts:38-84` | 🔴 |
| Sem autenticação, sem CAPTCHA, sem origem verificada | `server.ts:38` | 🔴 |
| Modelo fixo no código: `'gemini-3.6-flash'` | `server.ts:66` | 🟡 |
| System prompt de 40 linhas hardcoded no servidor | `server.ts:6-36` | 🟡 — vira global do Payload, editável pelo marketing |
| Sem streaming — resposta inteira de uma vez, com timeout de 25 s no cliente | `Chat.tsx:133` | 🟢 |
| Sem persistência de conversa; recarregar perde tudo | `Chat.tsx:90` | 🟢 |
| Protocolo de UI generativa por tags `[UI_*]` parseadas com regex | `Chat.tsx:17-57` | 🟡 — funciona, mas quebra silenciosamente se o modelo variar o formato |
| `ChartCard` renderiza gráfico com **dados fictícios** apresentados como demonstração | `ChatGenerativeUI.tsx:109` | 🟡 — validar com o jurídico/marketing |

✅ **Resolvido — D-12:** rate limit por IP + teto de custo mensal, com degradação
graciosa (atingido o teto, o chat responde indisponível em vez de continuar
gastando). O system prompt sai do código e vira global editável pelo marketing.

> [!DECISÃO PENDENTE] **P-04** — qual o teto de custo mensal aceitável para a ATRA?
> Os números concretos (req/IP/hora e limite em R$) saem na Etapa 2.

## Estado do `/design-system`

`src/pages/DesignSystem.tsx` — 1.141 linhas, a segunda maior do projeto.
Sete seções: cores, tipografia, ícones, botões/inputs, badges, componentes
dinâmicos, UI generativa. Linkada publicamente no rodapé (`App.tsx:2532`).

| Item | Classe |
|---|---|
| É **vitrine**, não fonte — os tokens reais estão em `src/index.css:6-30`; a página os repete à mão | 🟡 |
| Indexável pelo Google (sem `noindex`) e linkada no rodapé de todas as páginas | 🟡 |
| Único consumidor de `TabFilter` (`:62`) — componente que as outras 5 páginas de filtro ignoram | 🟡 |
| Mostra amostras de componentes que não existem mais como usados | 🟢 |

**Encaminhamento:** portar por último (Fase 6), como rota interna com `noindex`, e
reconstruída a partir dos tokens reais em vez de repetir valores. Não é candidata a
paridade visual estrita — é ferramenta interna.

## Código morto e entrelaçamento

| Item | Evidência | Classe |
|---|---|---|
| `App.tsx` com 2.668 linhas concentrando 18 componentes de seção não exportados | `src/App.tsx` | 🟡 — a extração é o próprio trabalho de porte |
| `Navbar` sozinho tem ~816 linhas, com o texto dos 7 menus inline | `App.tsx:277-1093` | 🟡 |
| `TechSectionBoundary` exportado e nunca usado | `TechDetails.tsx:243` | 🟢 |
| `RoundedDiamond` importado em `App.tsx:9` e nunca renderizado | `App.tsx:9` | 🟢 |
| `better-sqlite3` nas dependências, zero imports no projeto (dependência nativa, exige toolchain no build) | `package.json` | 🟡 — remover |
| `@fluentui/react-icons` e `@iconify-json/fluent-color` declarados, zero imports | `package.json` | 🟢 |
| `framer-motion` **e** `motion` declarados; só `motion/react` é importado (24 arquivos) | `package.json` | 🟡 — remover `framer-motion` |
| 6 scripts `.cjs` de manipulação de código-fonte na raiz | `fix_hero.cjs`, `fix_theme.cjs`, `fix_ui.cjs`, `refactor.cjs`, `remove_borders.cjs`, `minify.cjs` | 🟢 — não portar |
| `update_locales.js` (13 KB) reescrevendo os JSON de tradução por script | `update_locales.js` | 🟢 — não portar |
| Rotas duplicadas apontando ao mesmo componente | `App.tsx:2617` e `:2618` | 🟡 |
| Link para rota inexistente `/contato` | `CaseDetailBase.tsx:211` | 🟡 |
| 12+ links `href="#"` sem destino | `App.tsx:58,69,75,86,92,109-116`; `Blog.tsx:229` | 🟡 |

### Sobre a corrupção das imagens — hipótese anterior refutada

Levantei antes a suspeita de que os scripts `fix_*.cjs` teriam corrompido os
binários. **Verificado: não foram eles.** Todos os 6 scripts são seguros quanto a
isso — `fix_hero`, `fix_theme`, `fix_ui` e `minify` operam só sobre
`src/App.tsx`; `refactor.cjs` sobre `App.tsx` e `index.css`;
`remove_borders.cjs` percorre diretórios mas filtra por extensão
(`remove_borders.cjs:48`: `.endsWith('.tsx') || .endsWith('.ts')`);
`update_locales.js` só toca os JSON de locale.

O que o git mostra:

- `public/imgs/LIPT 2026.png` **não existe** no commit inicial `114f190`.
- Aparece **já corrompido** em `d5ab550` (`git cat-file` → `efbfbd50 4e47`).
- Os scripts `.cjs` foram adicionados **nesse mesmo commit** (`114f190` tem zero).

### Confirmado: a corrupção é do caminho de export, não do AI Studio

O protótipo está publicado em **https://atra-website.ai.studio** (build do AI
Studio, em análise interna). Verificado em 17/08/2026:

- **52 imagens na home, zero quebradas** — incluindo as duas que estão corrompidas
  no repositório (`lipt-2026.png` e `salesforceinformatica.png`).
- O asset publicado é **byte-idêntico** ao gêmeo íntegro do repositório:

```
sha256  9dd01651cbc297e9…  atra-website.ai.studio/assets/lipt-2026-y0TumdP7.png
sha256  9dd01651cbc297e9…  legacy/imgs/LIPT 2026.png
```

Ou seja: **os binários estão íntegros no AI Studio**; a mangling acontece no
caminho de export/sync para o GitHub. Isso confirma de duas formas independentes
(gêmeo interno + build publicado) que as cópias `imgs/` são os originais.

**Consequência:** o risco é recorrente, não histórico. Enquanto o projeto for
sincronizado do AI Studio para o git, qualquer binário novo pode chegar
corrompido — e o build publicado continuará bonito, escondendo o problema de quem
só olha o site. Recuperação em [inventario-assets](inventario-assets.md).

## Ausências estruturais

| O que falta | Consequência | Classe |
|---|---|---|
| **SSR / SSG** — SPA pura, HTML inicial vazio (`legacy/index.html:9`) | Sem SEO. É o motivo declarado da migração | 🔴 |
| **`<title>` e `<meta>` por rota** — o `<title>` global é `"My Google AI Studio App"` (`legacy/index.html:6`) | 20 rotas com o mesmo título de template | 🔴 |
| Sem `sitemap.xml`, `robots.txt`, canonical, OG, dados estruturados | Invisível para buscadores e link preview | 🔴 |
| **Sem rota 404** — `<Routes>` sem `path="*"` (`App.tsx:2611-2631`) | URL inválida renderiza layout vazio, com status 200 | 🟡 |
| **Nenhum teste** — sem runner, sem arquivo de teste, sem CI | Zero rede de segurança para o porte | 🔴 (a suíte de regressão visual é o primeiro entregável real) |
| **Formulários sem destino** — 4 formulários que não enviam nada | `App.tsx:2309` (`preventDefault` e nada mais), `Careers.tsx:487` (só marca estado local), `Consultants.tsx:750`, `Insights.tsx:643` | 🔴 — cada envio hoje é um lead perdido |
| Sem analytics, sem GTM, sem consentimento de cookie | Sem medição; LGPD pendente | 🟡 |
| Sem `lang` dinâmico no `<html>` (fixo `lang="en"` com site em PT) | `legacy/index.html:2` — erro de acessibilidade e de SEO | 🟡 |
| `package-lock.json` fora de sincronia com `package.json` | `npm ci` falha; projeto é mantido com `bun.lock` | 🟡 |
| Sem tratamento de erro de rota / error boundary | Um throw derruba a página inteira | 🟢 |

## Acessibilidade — amostragem

| Item | Evidência | Classe |
|---|---|---|
| `alt` genérico repetido em 10 imagens: `alt="ATRA Moment"` | `About.tsx:219` | 🟡 |
| Botões de categoria sem `aria-pressed` | `SuccessStories.tsx:138`, `Blog.tsx:141` | 🟡 |
| Mega-menu abre por `onMouseEnter`, sem equivalente por teclado | `App.tsx:397`, `:477` | 🟡 |
| Contraste de `text-muted` (`#64748b`) sobre `surface-1` (`#f8fafc`) em textos de 10-11 px | `index.css:13`; usado em `App.tsx:1188` etc. | 🟡 — medir no porte |
| Ponto positivo: `prefers-reduced-motion` respeitado no contador | `App.tsx:1105` | — |

✅ **Resolvido — D-13:** axe no CI **reportando, sem reprovar PR**. Os achados
viram backlog priorizado em fase própria. Aceita-se conscientemente lançar com as
falhas atuais, em troca de não travar a fábrica de rotas — mas com a dívida
visível em vez de invisível.

## Inconsistências de conteúdo

Registradas em detalhe em [inventario-conteudo](inventario-conteudo.md). Resumo do
que **bloqueia o modelo de conteúdo**:

| # | Inconsistência | Classe |
|---|---|---|
| 1 | Métricas divergentes entre home e /sobre: 150+ vs 140+ profissionais, 20+ vs 30+ clientes, **5x vs 4x GPTW** | 🔴 — o seed precisa de um número só |
| 2 | Case fantasma: "RD Saúde" no carrossel da home aponta para o slug do Banco ABC | `App.tsx:1658-1669` | 🔴 |
| 3 | Mesmo case com título diferente em 3 lugares | 🟡 |
| 4 | Contadores do hub Insights não batem com as listas reais | `Insights.tsx:57-61` | 🟡 |
| 5 | Parceiro sem nome, cadastrado como `"Partner"` | `App.tsx:111` | 🟡 |
| 6 | Telefone do site (`96305-2391`) diverge do contato oficial registrado (`96306-0267`) | 🟡 |
| 7 | Depoimentos de clientes reais com foto de banco de imagem | `App.tsx:1927-1945` | 🟡 |
| 8 | 5 das 6 soluções do mega-menu sem página (`link: "#"`) | `App.tsx:58-92` | 🟡 |

## Resumo por classe

**🔴 Bloqueia a migração (9)** — SSR/SEO ausente, metadata por rota, sitemap/robots,
`define` da chave no Vite, rate limiting do chat, formulários sem destino, ausência
de testes, métricas divergentes, case fantasma.

**🟡 Resolver durante (24)** — extração do `App.tsx`, duplicações de componente,
rotas duplicadas, `/contato` quebrado, links `#`, deps não usadas, 404, analytics,
`lang`, lockfile, acessibilidade, design system, inconsistências de conteúdo.

**🟢 Resolver depois (10)** — código morto, scripts `.cjs`, streaming do chat,
persistência de conversa, error boundary, deps de ícone não usadas.

## Achados durante o porte (Fase 1)

| Item | Evidência | Classe |
|---|---|---|
| ~~Rota inexistente responde 200 no legado~~, servindo a home — o Google indexa URL quebrada como página boa | `legacy` | ✅ **resolvido em MIG-062**: o app novo responde 404 com página desenhada e casca completa |
| **Anel de foco removido globalmente** fora de campos de formulário: `outline: none !important` em `*:focus`, `button:focus`, `a:focus` etc. Quem navega por teclado perde a indicação de onde está | `legacy/src/index.css:110-131`, portado fielmente para `web/src/app/(frontend)/globals.css` | 🟡 — porte fiel (D-15) manda replicar; corrigir na fase de a11y (D-13) |
| `--color-border-main` renderiza com alpha 0,0784 no app novo contra 0,08 no legado — mesma cor, notação normalizada pelo minificador CSS do Next (`rgba(255,255,255,0.08)` → `#ffffff14`), enquanto o Vite preserva a original | medido no browser, 10 dos 11 tokens batem exatamente | 🟢 — diferença abaixo do que um canal de 8 bits distingue na maioria dos casos; observar quando o baseline visual for congelado |
| **Subtexto do destaque com marcador solto**: `FeaturedHero` monta `${client} • ${date}`, mas nenhum case tem `date` — o site no ar mostra "Banco ABC • ". Portado fielmente porque MIG-030 compara contra aquele build | `legacy/src/components/FeaturedHero.tsx:53`; reproduzido em `web/src/app/(frontend)/[locale]/cases-de-sucesso/page.tsx` na função `subtitulo()` | 🟡 — correção é passar `publishedAt`, uma linha, **depois** do aceite visual. Regravar o gabarito junto |
| **"Áreas de atuação" é a mesma lista em todos os cases**, escrita no JSX | `legacy/src/components/CaseDetailBase.tsx:167`; hoje em `web/src/lib/areas.ts` | 🟡 — candidata a virar campo do case (são as áreas *daquele* projeto) ou global. Decidir em MIG-072 |
| ~~**Logo do Google Cloud é marcador 1×1** no seed~~ | `web/scripts/seed/cases.ts` | ✅ **resolvido**: o PNG do WordPress foi baixado para `web/scripts/seed/assets/parceiros/logo_google_cloud.png` e a constante `MARCADOR` saiu. O doc de mídia 1×1 que ficou de runs anteriores é órfão — apagar pelo admin |
| **O logo da AWS no carrossel do legado se chama "Partner"**: `name` e `alt` são literalmente `"Partner"`, enquanto os outros 8 têm o nome da marca. Quem usa leitor de tela ouve "Partner" no lugar de "AWS" | `legacy/src/components/ui/logo-clouds.tsx:60` e `:65`; o arquivo está em `web/scripts/seed/assets/parceiros/logo_aws.png` | 🟡 — corrigir ao portar o carrossel em MIG-059; o alt certo não muda pixel, então não conflita com o aceite visual |
| ~~**Os 4 logos da vitrine de /sobre não são a marca**: `legacy/public/imgs/logo_*.svg` são aproximações desenhadas à mão (nome em Arial, proporção 4:1), não os logos oficiais que o legado renderiza~~ | `web/scripts/seed/sobre.ts`, `PARCEIROS_DA_VITRINE` | ✅ **resolvido**: Azure, Google Cloud, Databricks e Atlan agora vêm dos mesmos PNGs que `About.tsx:384` usa, em `web/scripts/seed/assets/parceiros/`. Como a altura é fixa e a largura sai do aspecto, o desenho também errava a caixa |
| ~~**Selo do GPTW é a capa marcadora** e o selo FEEx não existia~~: os dois eram hotlink do WordPress, e `/carreiras` mostrava 2 selos onde o legado mostra 3 | `web/scripts/seed/sobre.ts`, global `site-settings.seals` | ✅ **resolvido**: baixados para `web/scripts/seed/assets/selos/`. ⚠️ O arquivo do FEEx se chama `GPTW-Selos-site-1-768x768.png` no WordPress e não é selo do GPTW |
| **`antialiased` mudava a rasterização de todo o site**: o legado não define `-webkit-font-smoothing` e eu havia ligado no layout. Layout e fonte batiam ao décimo de pixel e ainda assim as bordas de todo glifo divergiam | `web/src/app/(frontend)/[locale]/layout.tsx:54` — removido | 🟢 — resolvido. Vale como regra: não introduzir propriedade tipográfica que o legado não tem |
| **Logo da ATRA é hotlink do WordPress** no cabeçalho e no rodapé, portado igual ao legado para os dois renderizarem o mesmo arquivo | `legacy/src/App.tsx:333` e `:2460`; `web/src/lib/navegacao.ts`, constante `LOGO_ATRA` | 🟡 — entra na migração de mídia com os outros 32 hotlinks (MIG-071) |
| **Redes sociais e links legais do rodapé apontam para `#`** | `legacy/src/App.tsx:2470-2478` e `:2532-2534`, portado fielmente | 🟡 — os legais são MIG-094; as redes sociais precisam das URLs reais (novo P-26) |
| **Alternador de tema não guarda preferência**: volta a escuro a cada carregamento | `legacy/src/App.tsx:2575`, portado fielmente | 🟢 — melhoria consciente para depois do aceite visual; muda pixel e exige regravar o gabarito |
| **Suíte visual depende do servidor de dev**, mitigada por aquecimento de rotas e 2 workers | `web/e2e/support/aquecimento.ts` | 🟠 — **MIG-035**: comparar contra build de produção. Enquanto não for feito, o gate é lento (~2,5 min) e sensível à carga da máquina |
| **Os 6 materiais não têm arquivo para baixar**: "Solicitar acesso" e "Baixar agora" não fazem nada, igual ao legado. O card está completo; falta o PDF e o formulário | `legacy/src/pages/Reports.tsx:88` e `Ebooks.tsx:71`; portado igual | 🟠 — o formulário é MIG-045; o arquivo depende de P-07 (quem escreve os materiais) |
| **Capas dos materiais são um marcador gerado**: no legado são hotlinks do Unsplash — imagem de banco que não é da ATRA | `web/scripts/seed/assets/capa-pendente.png`, alt "CAPA PENDENTE" | 🟡 — capas reais entram com o conteúdo (P-07) |
| **Datas dos e-books são inventadas**: o legado não tem data neles e ordena pelo array. Semeadas em ordem decrescente para `-publishedAt` reproduzir aquela ordem | `web/scripts/seed/resources.ts` | 🟡 — trocar por campo de ordenação explícito se o marketing quiser controlar |
| **`"Amanhã, 15:00"` no primeiro webinar** é texto relativo que envelhece sozinho: amanhã já passou | `legacy/src/pages/Webinars.tsx:14`, portado como `dateLabel` | 🟡 — agora é editável pelo admin; trocar por data real é decisão de conteúdo (D-22) |
| **Nenhum webinar tem vídeo**: `videoUrl` vazio nos três, e o legado também não reproduz nada | `web/scripts/seed/webinars.ts` | 🟠 — a página de detalhe (MIG-046) precisa tratar ausência de vídeo, não presumir embed |
| **Duração "45:00" e selo "HD"** são iguais nos três cards do legado | duração virou campo editável; "HD" segue literal no componente | 🟢 — duração já é por webinar; "HD" é decoração |
| **Paginação do blog é decorativa**: `currentPage` muda de estado mas a lista nunca é fatiada, e são dois botões fixos para 6 posts | `legacy/src/pages/Blog.tsx:68` e `:246`, portado igual | 🟠 — **bloqueia a Fase 4b**: com 207 posts reais a listagem precisa de paginação de verdade, ou a página carrega tudo de uma vez |
| **Chip de categoria do blog usa outra cor** que as demais listagens: `dark:text-gray-300` (#d1d5db) contra `text-text-muted` (#9ca3af no escuro) — uma das 9 duplicações divergentes | `legacy/src/pages/Blog.tsx:146`; reproduzido em `ChipFilter` pela prop `variante` | 🟡 — unificar é decisão de design para depois do aceite visual |
| **Modal de detalhe do consultor sem "Entregáveis" e "Escopo de Responsabilidade"**: o legado lista os dois (`Consultants.tsx:1000` e `:1016`), mas a collection `specialist-roles` não modela os campos | `web/src/app/(frontend)/[locale]/consultores/lista-de-consultores.tsx` | 🟡 — o modal nasce fechado, então não entra na regressão visual. Acrescentar exige dois `array` no schema e conteúdo para os 8 perfis |
| **Formulário de solicitação de consultores é estático**, como o de /contato: campos desabilitados com a aparência do legado | `web/src/app/(frontend)/[locale]/consultores/solicitar-consultores.tsx` | 🟠 — MIG-100, e depende de P-14 (política de privacidade) e P-18 (destino dos leads). No legado ele também não envia: só troca estado local |
| **A gaveta do menu no celular fecha sozinha com mouse**: o `onMouseLeave` que fecha o menu está no container da barra, e a gaveta é **irmã** dele — levar o ponteiro para dentro da gaveta dispara o fechamento antes de qualquer clique. Só acontece com mouse em viewport estreito; em aparelho de toque não há hover | `legacy/src/App.tsx:324`; portado igual em `site-header.tsx` | 🟡 — o conserto é envolver barra e gaveta no mesmo elemento que escuta o evento. Muda comportamento, então fica para depois do aceite visual |
| **Selo do herói da página de IA mostra a chave de tradução crua**: `t('solution.categoryBadge')` renderiza literalmente `solution.categoryBadge` — a chave não existe em `pt.json` nem em `en.json`, e o i18next devolve o nome dela. Conferido no navegador, não deduzido | `legacy/src/pages/SolutionAI.tsx:110`; portado igual em `web/scripts/seed/solucao-ia.ts` | 🔴 — **texto quebrado visível em produção**. Trocar exige saber o que deveria estar escrito (decisão de conteúdo, D-22) e regravar o gabarito |
| **Menu fixo da página de solução se espreme no mobile**: a fonte diz `hidden md:block`, mas o `cn()` (tailwind-merge) descarta o `hidden` porque `flex` vem depois no mesmo grupo. O menu aparece no celular com os 4 rótulos quebrando em várias linhas, 96px de altura em vez de 52 | `legacy/src/pages/SolutionAI.tsx:182`; reproduzido na variante `solution` de `bloco-menu-da-pagina.tsx` | 🟠 — quase certamente não é o que o autor quis: o `hidden` está lá de propósito e não faz efeito. Corrigir muda pixel e exige regravar o gabarito |
| **Caixa do ícone em "Para quem é" é sempre azul**, mesmo quando o traço é laranja: `bg-primary/10` fixo com `text-secondary` dentro | `legacy/src/pages/SolutionAI.tsx:669`; portado igual em `bloco-para-quem.tsx` | 🟢 — decoração; unificar depois do aceite visual |
| **Acordeão da página de solução monta um ícone por etapa e nunca o desenha**: `IconCmp` é atribuído e some — código morto que sugere uma versão anterior com ícone | `legacy/src/pages/SolutionAI.tsx:759` | 🟢 — o bloco `accordionSteps` não tem campo de ícone por etapa, de propósito |
| **Os 6 posts do blog são fixture do porte**, fictícios, sem corpo, publicados só para o gate ter o que comparar | `web/scripts/seed/posts.ts` | 🔴 — **nenhum pode ir ao ar no cutover**. Somem na Fase 4b junto com os 207 reais do WP (D-17) |
| **Landing de material não entrega o material**: o botão de download é inerte e a página sai com `noindex` | `web/src/components/content/pagina-de-material.tsx` | 🟠 — **MIG-104** liga o download, e depende de MIG-100 (formulário) e de duas pendências: publicar a política de privacidade (**P-14**) antes de coletar dado pessoal, e decidir o destino dos leads (**P-18**) |
| **O legado não tem escala de respiro única entre páginas**: /sobre usa `py-16 md:py-20` nas oito seções e /carreiras usa `py-20 md:py-24` em seis das sete, com `premiacoes` (`Careers.tsx:306`) sozinha na escala curta. E o menu fixo institucional fecha com `mb-8 sm:mb-10` em /sobre (`About.tsx:259`) e sem margem em /carreiras (`:161`), com o mesmo componente | reproduzido pelos campos `spacing` (em `camposComuns`) e `bottomGap` (no `stickyPageNav`) | 🟡 — os dois campos existem só para reproduzir a inconsistência. Unificar a escala é decisão de design, e muda pixel nas duas páginas |
| **"Jeito ATRA de Ser" e "Nossos Valores" são o mesmo conteúdo em dois cartões**: os três valores da ATRA aparecem em `About.tsx:353` num `GlowCard` curto e em `Careers.tsx:222` num cartão alto com tagline colorida, divisor e checklist. As frases são idênticas; o checklist só existe na versão alta | variante `expanded` do bloco `valueCards` | 🟢 — duplicação do original, reproduzida por fidelidade. Se o marketing quiser uma forma só, é uma troca de `variant` |
| **Formulário do banco de talentos é estático**, como os de /contato e /consultores: seis campos desabilitados com a aparência do legado, que também não envia nada | `web/src/components/blocks/banco-de-talentos.tsx` | 🟠 — MIG-102, e depende de P-17 (prazo de retenção de currículo) e P-14 (política de privacidade) |
| **O card de vaga mostra só o título**, embora a collection tenha área e local: a linha extra sobe cada card em 16px e o gabarito é contra o legado, que não a tem | `web/src/components/blocks/bloco-vagas.tsx` | 🟢 — informação a mais é melhoria, e melhoria não entra junto com migração (D-15). Acrescentar depois do aceite exige regravar o gabarito de /carreiras |
| **`ContadorAnimado` fica em zero no servidor de dev com `?e2e=1`**, e só nele: `congelado()` lê `window`, então o HTML do servidor sai com `0` e a hidratação do modo de desenvolvimento não reescreve o texto. No build de produção — que é o que o `pnpm gate` compara — os três números aparecem certos | `web/src/components/blocks/contador-animado.tsx` | 🟢 — não afeta o aceite nem a produção. Está aqui para ninguém gastar uma tarde perseguindo, como já aconteceu em MIG-050a |
| **"transform desafios" no texto do parceiro**: falta o "ar" em `partner.benefitsDesc`, e a frase sai errada na seção "Capacidades" de toda página de parceiro | `legacy/src/locales/pt.json`; portado como está em `web/scripts/seed/parceiros.ts` | 🟡 — **texto errado visível em produção**, e agora editável pelo admin. Corrigir é decisão de conteúdo (D-22) e exige regravar o gabarito de `/parceiros/google-cloud` |
| **"Especialização" é literal em português** nas fichas da página de parceiro, mesmo na versão inglesa | `legacy/src/components/PartnerPageBase.tsx:299` | ✅ **traduzido no porte**: é chrome de componente, não texto de marketing, e não muda um pixel em PT — que é o que o aceite compara |
| **A página de parceiro fecha com `pb-12`**, e é a única rota do site que põe respiro abaixo da última faixa | `legacy/src/components/PartnerPageBase.tsx:97` | 🟢 — portado igual; unificar depois do aceite |
| **O logo do parceiro é hotlink do `gstatic.com`** no herói, na etiqueta da imagem e em cada ficha de especialização | `legacy/src/pages/PartnerGoogleCloud.tsx:50`; no porte vem do acervo | ✅ **resolvido no porte**, junto dos outros hotlinks de MIG-071 |
| **A home e /sobre discordam em dois números**: 150+ profissionais e 20+ clientes lá (`App.tsx:1336`), 140+ e 30+ aqui | os do bento ficam no bloco, não no global `site-settings` | 🟡 — é **P-01**. Ligar os dois ao mesmo global consertaria de passagem, e a escolha do número certo é do marketing (D-22) |
| **Os 4 cartões de conteúdo da home são fixture**: título inventado, capa do `picsum.photos` e `href="#"`. Não saem de `posts` nem de `resources` porque o legado não os liga a nada | bloco `contentTeaser` em `scripts/seed/home.ts` | 🟠 — ligar em `/blog` e `/insights` é melhoria, não migração (D-15). Vira task depois do aceite; os títulos são de conteúdo (D-22) |
| **Os avatares dos depoimentos são retratos de banco** no gabarito — não são as pessoas que deram o depoimento | portados como o marcador `capa-pendente.png` | 🟡 — deixar sem foto **não** era opção: a caixa de 40px some, o bloco encolhe 3px e a página inteira anda junto. Foto real ou ilustração é decisão de conteúdo |
| **Os três logos de nuvem do bento vêm do `@iconify/react` por rede**, e o pacote `logos` não está instalado no legado: dentro do container do aceite, sem internet, ele renderiza `<span></span>` vazio nos três | no porte vêm do acervo, em `<img>` | 🟡 — servir o logo real é o produto certo. A diferença fica em três caixas de 28px, dentro do limite de 0,1% |
| **A "onda" da faixa de logos não foi portada**: no legado os 9 logos sobem em cascata a cada 4s (`logo-clouds.tsx:213`) | `bloco-faixa-de-logos.tsx` | 🟢 — é animação de estado que o `congelado()` já congela no aceite; portá-la exigiria um componente cliente para um efeito que a captura nunca vê |
| **A contagem das pílulas de `/insights` é escrita à mão e não confere**: os cartões dizem 4 cases, 6 artigos, 3 relatórios, 4 webinars e 4 ebooks, e o hub lista 10 conteúdos no total | `legacy/src/pages/Insights.tsx:56`; portada como campo `count` do formato | 🟡 — números soltos que envelhecem sozinhos. Derivar da collection é melhoria e muda pixel |
| **Sete das dez capas de `/insights` são hotlink do Unsplash** — banco de imagens que não é da ATRA | `web/scripts/seed/insights.ts`, marcador `capa-pendente.png` | 🟡 — capas reais entram com o conteúdo (P-07) |
| **A caixa de inscrição de `/insights` não inscreve ninguém**: no gabarito só troca um estado local por uma tela de sucesso | `bloco-hub-de-insights.tsx`, campos desabilitados | 🟠 — MIG-100, e depende de P-14 e P-18 |
| **A UI generativa do chat não foi portada**: o system prompt manda o modelo injetar `[UI_SERVICE:…]`, `[UI_PARTNER:…]`, `[UI_CHART:…]` e `[UI_CONTACT]`, e o legado troca as tags por cartões (`Chat.tsx:17`) | `web/src/app/(frontend)/[locale]/chat/conversa.tsx` | 🟠 — portar exige o modelo respondendo, e o teto de custo que autoriza isso é **P-04**. Sem ela a resposta sai como texto, com as tags à mostra caso o modelo as injete |
| **O rate limit do chat conta em memória do processo**: serve a um servidor só (P-05), some a cada reinício e multiplica com mais de uma instância | `web/src/app/api/chat/route.ts` | 🟠 — trocar por Redis depende de saber o teto real (**P-04**). Os 20 req/IP/hora são um padrão conservador, editável no admin |
| **`/chat` é a única rota com casca diferente**: `h-[100dvh] overflow-hidden` e sem rodapé (`App.tsx:2600`) | `web/src/components/layout/casca.tsx` | 🟢 — portado igual. Com o rodapé a página passa da viewport e os 15px da barra de rolagem deslocam tudo |

