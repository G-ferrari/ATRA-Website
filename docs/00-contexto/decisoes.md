---
status: revisado
atualizado_em: 2026-08-17
depende_de: [../01-descoberta/inventario-rotas.md, ../01-descoberta/inventario-conteudo.md, ../01-descoberta/inventario-assets.md, ../01-descoberta/debito-tecnico.md]
---

# Registro de decisões

ADR enxuto: contexto → opções → escolha → consequência. Decisão registrada aqui
vale para todas as etapas seguintes; mudá-la é ato consciente, não deriva.

## Decisões de partida (trazidas no briefing)

| # | Decisão | Escolha |
|---|---|---|
| D-01 | Banco de dados | PostgreSQL |
| D-02 | Escopo do WordPress | O site novo **substitui** `atra.com.br` — inclui redirects 301 e migração de mídia |
| D-03 | Hospedagem | VPS; plataforma (Coolify/Dokploy vs. Compose+Caddy) ainda aberta → ver P-05 |
| D-04 | Stack | Next.js App Router + Payload CMS 3, mesmo projeto, pasta `web/` |
| D-05 | Idioma da documentação | PT-BR; código, identificadores, campos do Payload e commits em inglês |
| D-06 | Versionamento | Branches locais por ora; publicação no remoto aberta → ver P-06 |

---

## D-07 — Dois idiomas, com prefixo de rota para o inglês

**Contexto.** O site é bilíngue via i18next, mas a troca de idioma não muda a URL
(`legacy/src/App.tsx:1046,1057`), então o Google indexa uma versão só. Com SSR,
cada idioma precisa de URL própria.

**Opções.** Prefixo `/en/...` · prefixo nos dois (`/pt` e `/en`) · subdomínio
`en.atra.com.br` · slugs sempre em PT.

**Escolha.** **PT na raiz, EN sob `/en/...`, com slugs traduzidos** (`/sobre` →
`/en/about`). É o único formato que o Google indexa como páginas distintas sem
configuração extra, mantém as URLs atuais do WP intactas na raiz (preservando o
SEO existente) e é o padrão do App Router.

**Consequência.** Payload com `localization` habilitada desde a fundação; todo
campo de texto nasce `localized: true`; cada collection com URL pública precisa de
slug **por idioma**. `hreflang` recíproco no `generateMetadata`. O sitemap dobra.
Retrofit disso depois seria migração de banco — por isso entra na Fase 1, não
depois.

## D-08 — Páginas de detalhe para os quatro tipos de conteúdo

**Contexto.** Blog, relatórios, ebooks e webinars só têm listagem; o card não leva
a lugar nenhum (`legacy/src/pages/Blog.tsx:229` → `"#"`). Sem página de detalhe,
publicar não gera tráfego orgânico — e SEO é o motivo declarado da migração.

**Opções.** Todos os 4 · só blog · nenhum.

**Escolha.** **Os quatro**, com `/blog/[slug]`, `/relatorios/[slug]`,
`/ebooks/[slug]` e `/webinars/[slug]`.

**Consequência — atenção, esta é cara.** O corpo dos artigos **não existe em lugar
nenhum**. Verificado: o código tem só `title`, `description`, `date`, `tags`,
`image`; `legacy/CONTEUDO_DO_SITE.md:7.2-7.5` acrescenta autor, mas também para no
resumo. São **15 itens sem texto** (6 posts, 3 relatórios, 3 ebooks, 3 webinars).

Consequências práticas:
- O seed popula metadado; o corpo fica vazio.
- Publicar 15 páginas magras é pior que não publicar — *thin content* prejudica o
  domínio inteiro.
- Portanto: as collections nascem com `drafts: true` e **nada vai ao ar sem corpo**.
  As listagens no cutover mostram só o que estiver publicado.
- Entra no roadmap uma frente de produção de conteúdo, do lado da ATRA, paralela
  à engenharia. → ver P-07.
- Estas rotas **não têm baseline legado** para regressão visual — são páginas
  novas. O critério de aceite delas é funcional, não comparativo.

**Ganho colateral.** O export traz um campo que o código não tem: **autor**
(Engenharia ATRA, Time de IA ATRA, Time de Cloud ATRA, Consultoria Estratégica
ATRA, Governança e Segurança, Arquitetura de Infraestrutura). Entra no modelo.

## D-09 — `/solucoes` vira índice, com página por solução

**Contexto.** O mega-menu lista 6 soluções (`App.tsx:45-97`), **5 com `link: "#"`**.
Só IA tem página, e ela atende duas rotas idênticas (`App.tsx:2617` e `:2618`).

**Opções.** Índice + páginas por solução · só IA com 301 · índice agora, páginas depois.

**Escolha.** **`/solucoes` como índice das 6 + `/solucoes/[slug]` por solução**,
a partir de um template único (o mesmo padrão de `PartnerPageBase`).

**Consequência.** Collection `solutions` com blocos flexíveis. 5 páginas novas sem
baseline legado — mesma observação de D-08: critério funcional, e o conteúdo tem
que vir do marketing. `/solucoes/inteligencia-artificial` é a única com conteúdo
real hoje e vira o modelo de referência das outras. Resolve os 5 links mortos.

## D-10 — `/contato` como página real

**Contexto.** `legacy/src/components/CaseDetailBase.tsx:211` linka para `/contato`,
que não existe no router — **link quebrado em produção**. Os demais CTAs usam a
âncora `/#fale-conosco`, que exige carregar a home inteira. O bloco de contato está
duplicado em 4 lugares.

**Opções.** Página real · 301 para a âncora · seção reutilizável em toda página.

**Escolha.** **Página `/contato` própria**, com formulário, endereço, WhatsApp e
redes, alimentada pelo global `contact`.

**Consequência.** Conserta o link quebrado, dá destino único aos CTAs, elimina a
quádrupla duplicação e cria uma página de conversão indexável. A âncora
`/#fale-conosco` continua existindo na home; `/contato` não é redirect.

## D-11 — Webinars com embed de vídeo

**Contexto.** Os cards mostram play sem player; `"45:00"` e `"HD"` são texto fixo
idêntico em todos (`legacy/src/pages/Webinars.tsx:78,81`).

**Escolha.** Campo de URL de vídeo (YouTube/Vimeo) + duração real por item; o vídeo
toca na página de detalhe.

**Consequência.** Hosting de vídeo fica com a plataforma externa — sem custo de
storage nem banda. `duration` vira campo, não markup. Se um webinar for futuro, o
campo de vídeo fica vazio; a UI precisa lidar com os dois estados.

## D-12 — Chat com rate limit por IP e teto de custo

**Contexto.** `/api/chat` é público, sem autenticação, sem limite; cada POST gasta
cota do Gemini (`legacy/server.ts:38-84`).

**Escolha.** **Rate limit por IP + teto de custo mensal**, com degradação graciosa:
atingido o teto, o chat responde com mensagem de indisponibilidade em vez de
continuar gastando.

**Consequência.** Números concretos (req/IP/hora e teto em R$) ficam para a Etapa 2
e dependem de P-04. O system prompt sai do código e vira global editável
(`legacy/server.ts:6-36`). O `define` do `vite.config.ts:12` **não é portado** —
ver [debito-tecnico](../01-descoberta/debito-tecnico.md#rota-chat).

## D-13 — Acessibilidade medida, não bloqueante

**Contexto.** O porte fiel replica os problemas atuais: mega-menu só por mouse
(`App.tsx:397`), `alt` genérico repetido (`About.tsx:219`), filtros sem
`aria-pressed`.

**Escolha.** **axe no CI reportando, sem reprovar PR.** Os achados viram backlog
priorizado em fase própria.

**Consequência.** A fábrica de rotas não trava e o porte segue fiel; em troca,
aceita-se conscientemente lançar com as mesmas falhas de hoje. O relatório do axe
torna a dívida visível em vez de invisível.

## D-14 — Avatar de depoimento opcional, com monograma

**Contexto.** Os 4 depoimentos da home usam foto de banco de imagem (Unsplash) para
representar pessoas reais de ABC Brasil e Banco Carrefour (`App.tsx:1927-1945`).

**Escolha.** Campo de foto **opcional**; sem foto, iniciais em círculo com a cor da
marca.

**Consequência.** Elimina o risco de apresentar rosto de desconhecido como cliente.
Funciona com o acervo atual: os depoimentos dos cases já têm nome real e nenhuma
foto. As 4 URLs do Unsplash são descartadas no seed.

## D-15 — Porte fiel vale também para a decoração

**Contexto.** `Tech*` e `Decorations` somam ~460 linhas de enfeite em 6 rotas.

**Escolha.** **Porte fiel, sem exceção.**

**Consequência.** A regressão visual do Playwright funciona como rede de segurança
real — decoração alterada faria todo snapshot exigir julgamento humano, destruindo
o valor do teste. Simplificação vira item de backlog para a fase de refactor.

## D-16 — Mona Sans, self-hosted — e o baseline visual precisa ser corrigido antes

**Contexto.** `legacy/src/index.css:19-20` declara `"Mona Sans"` como `--font-sans`
e `--font-display`, mas não há `@font-face`, arquivo de fonte, nem `<link>` em
`legacy/index.html`. **A fonte nunca carrega** — o site em produção renderiza
inteiro no fallback do sistema.

**Escolha.** Mona Sans é a tipografia oficial da marca (confirmado por Leonardo em
17/08/2026), servida via `next/font/local`.

Verificado em [github/mona-sans](https://github.com/github/mona-sans):
licença **SIL Open Font License 1.1** (permissiva, self-hosting sem custo), fonte
**variável** em arquivo único `MonaSansVF[wdth,wght,opsz,ital].woff2`, com eixos
`wght` 200–900, `wdth` 75–125%, `opsz` 1–100 e itálico. Cobre todos os pesos que o
legado usa (`font-light` 300 a `font-extrabold` 800) em um só arquivo.

**Consequência — afeta a estratégia de testes.** O site novo vai renderizar com
Mona Sans; o legado renderiza com fonte de sistema. Comparar um contra o outro faria
**toda captura com texto acusar diferença**, exatamente o oposto do que a regressão
visual serve para detectar.

Duas saídas:

| | Abordagem | Avaliação |
|---|---|---|
| **A** | Carregar Mona Sans **no legado primeiro**, num commit isolado em `legacy/`, e só então congelar o baseline | **Recomendada.** Mudança pequena e reversível; o baseline passa a refletir o design pretendido, e a comparação volta a ser pixel a pixel de verdade |
| B | Aceitar tipografia como diferença conhecida e comparar só layout/estrutura | Enfraquece o teste justamente onde ele é mais útil, e obriga julgamento humano em todo snapshot |

**Escolha: A.** Entra como primeira tarefa da Fase 2, antes de qualquer captura de
referência. Efeito colateral bem-vindo: mostra pela primeira vez como o site foi
desenhado para parecer — o que pode revelar quebras de layout que hoje estão
escondidas pelo fallback (métricas de fonte diferentes mudam altura de linha e
largura de texto).

⚠️ **Portanto o baseline visual ainda não pode ser congelado.** A pendência saiu de
"qual é a fonte" para "carregar a fonte no legado" — que é execução, não decisão.

## D-17 — Paridade de conteúdo antes do cutover

**Contexto.** O levantamento do sitemap real (17/08/2026) mostrou que o protótipo
cobre 20 rotas contra ~259 URLs indexáveis em `atra.com.br`. Detalhe completo em
[lacuna-de-escopo](../02-especificacao/lacuna-de-escopo.md).

**Opções.** A paridade antes do cutover · B cutover parcial com WP em subdomínio ·
C cutover só do institucional, com proxy · D reduzir o site com 301 em massa.

**Escolha. A** — o site novo só assume `atra.com.br` quando cobrir o que o
WordPress cobre.

**Consequência.** Entram no escopo:

| Frente | Volume | Natureza |
|---|---|---|
| Migração do blog | 207 posts | **Automatizável** — a API REST do WP (`/wp-json/wp/v2/posts`) entrega título, slug, corpo HTML, data, autor, categorias e imagem destacada. Converter HTML → Lexical e baixar mídia é script |
| Expansão de soluções | 6 → 13 | Conteúdo existe no WP; precisa de curadoria editorial ao migrar |
| Nova collection `segments` | 10 páginas | **Modelagem nova** — não há nada equivalente no protótipo |
| Importação de vagas | 6 | Vira `jobs`, com o mesmo fluxo de hoje |
| Página legal | 1 | `/politicas-e-termos` — bloqueia LGPD, já que haverá formulários |

Os 6 posts fictícios do protótipo (`legacy/src/pages/Blog.tsx:11-60`) são
**descartados**, não migrados: não correspondem a nenhum conteúdo real.

O cutover fica mais longe, e é o ponto: trocar o domínio antes da paridade
significaria escolher entre perder 6 anos de SEO ou manter dois sites no ar.

---

## Decisões pendentes

Numeradas, com o custo de não decidir. **P-01 a P-03 bloqueiam a Etapa 2.**

| # | Pergunta | Bloqueia | Impacto de não decidir |
|---|---|---|---|
| **P-01** | As **métricas institucionais** corretas: profissionais (150+ vs 140+), clientes (20+ vs 30+), certificações (40+), parceiros (9) e **GPTW: 5x ou 4x**? Home e `/sobre` divergem em 4 números | seed + global `siteSettings` | O site novo publica número errado sobre a própria empresa, agora em SSR e indexado. Divergência que hoje passa despercebida entre duas páginas vira dado estruturado único — errado em todo lugar de uma vez |
| ~~P-02~~ | ~~Como as vagas chegam ao site~~ | — | ✅ **Respondida por evidência (17/08/2026).** O sitemap do WP mostra 6 vagas publicadas como páginas comuns — não há ATS. A collection `jobs` está correta e o fluxo atual se mantém, só muda o CMS. Resta confirmar com o RH se querem seguir assim ou adotar um ATS na virada |
| ~~P-03~~ | ~~Tipografia oficial da marca~~ | — | ✅ **Resolvida em 17/08/2026 → D-16.** Mona Sans, SIL OFL 1.1, self-hosted |
| **P-04** | Qual o **teto de custo mensal** aceitável para a ATRA AI? | números concretos de D-12 | Fase 5 sem critério de aceite; risco de conta aberta em produção |
| **P-05** | Plataforma de deploy: **Coolify/Dokploy ou Compose + Caddy**? | provisionamento da VPS | ✳️ **Comparativo entregue em [deploy-vps](../04-infra/deploy-vps.md), com recomendação de Coolify.** Falta confirmar — e vale checar se a ATRA já tem padrão de infra (o WP roda em RunCloud) |
| **P-06** | A branch `migracao` vai para o remoto `G-ferrari/ATRA-Website`, ou trabalhamos em fork? | fluxo de PR por rota | Hoje não bloqueia (branches locais); bloqueia quando a Fase 3 começar a produzir uma PR por rota |
| **P-07** *(reduzida)* | Quem escreve o corpo dos **9 materiais** (3 relatórios, 3 ebooks, 3 webinars) que só existem no protótipo? | publicação desses 9 itens | ✅ Os **6 posts** saíram do escopo: os fictícios são descartados e os 207 reais vêm do WP com corpo (D-17). Restam os 9 materiais, que não existem em lugar nenhum — ficam em rascunho até alguém escrever |
| **P-08** | O **conteúdo EN existente** (169 chaves) é tradução aprovada pelo marketing ou saída de máquina do protótipo? | escopo de revisão antes do cutover | Se for de máquina, o site publica inglês não revisado sob o domínio da ATRA. Entra revisão humana no roadmap |
| **P-09** | Confirmar o **telefone oficial**: o site usa `+55 11 96305-2391` (`App.tsx:2391`); o contato institucional registrado é `+55 11 96306-0267` | global `contact` | Lead ligando para o número errado |
| **P-10** | Qual o **nome real do parceiro** cadastrado como `"Partner"` (`App.tsx:111`)? | collection `partners` | Card de parceiro genérico em produção |
| **P-11** | O **case "RD Saúde"** do carrossel da home (`App.tsx:1658-1669`) existe? Hoje aponta para o slug do Banco ABC | seed de `cases` | Ou some no porte, ou vira case real — mas não pode continuar apontando para o case de outro cliente |
| **P-12** | Manter o `Content-Signal: ai-train=yes` do robots.txt atual? | `robots.ts` | Autoriza treino de modelos com o conteúdo da ATRA — decisão de negócio, não técnica |
| **P-13** | Exportar do **Search Console** as URLs com impressão nos últimos 12 meses | priorização dos redirects | Sem dado real, a prioridade de preservação é palpite estruturado. Barato de obter, caro de não ter |
| **P-14** | `/politicas-e-termos/` e `/eventos/` têm destino no site novo? | redirects + rodapé | Formulário coletando dado pessoal sem política de privacidade publicada é exposição de LGPD |
| ~~P-15~~ | ~~Qual caminho para a lacuna de escopo~~ | — | ✅ **Resolvida em 17/08/2026 → D-17.** Caminho A, paridade de conteúdo antes do cutover |
| **P-16** | A redução de 13 soluções para 6, e o sumiço dos segmentos, foi **decisão de posicionamento** do marketing ou simplificação de protótipo? | escopo de D-17 | Com A escolhido, o padrão é **restaurar**. Se foi decisão deliberada, restaurar desfaz uma escolha de negócio sem querer |
| **P-17** | Prazo de retenção de currículos e quem no RH tem acesso | formulário de candidatura | Exigência de LGPD, não preferência |
| **P-18** | A ATRA já usa ferramenta de e-mail marketing / CRM (RD Station, HubSpot)? | newsletter e destino dos leads | Se usa, os formulários devem alimentar o CRM em vez de virar lista isolada no Payload |
| **P-19** | Existe GA4/GTM na conta da ATRA aplicado ao WP por fora do tema? | baseline de tráfego | Sem analytics antes do cutover, **não há como provar** se a migração melhorou ou piorou nada. Instalar no WP agora é a única forma de ter comparação |
| **P-20** | Guardar o histórico de conversas da ATRA AI? | `/api/chat` | Dado pessoal de visitante; alternativa é registrar só métricas agregadas |
| **P-21** | Ligar o proxy da Cloudflare (nuvem laranja)? Hoje o DNS está lá, mas em modo direto | CDN, cache, WAF | Ganho de graça em performance e proteção; custa uma camada a mais para depurar. Recomendação: **depois** do cutover estabilizar |
| **P-22** | Replicar `form-submissions` para fora do banco em tempo real? | RPO dos leads | Com backup diário, o RPO dos leads é de até 24 h. Para conteúdo é aceitável; para lead, não — lead perdido não volta. Depende de P-18 |
| **P-23** | **Quem tem acesso à conta Cloudflare da ATRA?** | cutover | Sem resolver com antecedência, o cutover trava no passo mais crítico. Barato agora, caro às 7h da manhã do dia da virada |

### Encaminhamento

**Com a ATRA, assumidas por Leonardo:** P-01, P-08, P-09, P-10, P-11, P-12, P-13,
P-14, P-16, P-17, P-18, P-19.
**Recomendação técnica a apresentar:** P-04 (Etapa 2), P-05 (Etapa 4), P-20.
**Destrava sozinha:** P-06, quando a Fase 3 começar a produzir PRs.
**Decisão de gestão:** P-07.

Duas merecem prioridade por serem baratas agora e caras depois:

- **P-19** — se não há analytics no WordPress, instalar **hoje** é a única forma de
  ter baseline de tráfego para comparar no cutover. Cada semana sem isso é uma
  semana a menos de histórico.
- **P-13** — o export do Search Console transforma a priorização de redirects de
  palpite em dado. É um clique.

Nenhuma bloqueia a Etapa 3. O modelo prevê os campos; **seed** e **priorização de
redirects** ficam esperando valores.
