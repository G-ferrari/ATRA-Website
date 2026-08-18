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

## D-16 — Mona Sans via `next/font/google`, para bater com o legado

> ⚠️ **Esta decisão foi reescrita em 17/08/2026, durante a Fase 1.** A versão
> anterior partia de duas premissas erradas, corrigidas por medição. O histórico
> do erro está em "O que estava errado", ao final.

**Contexto.** Mona Sans é a tipografia oficial da marca (confirmado por Leonardo).
Licença **SIL OFL 1.1**, fonte variável, `wght` 200–900 — cobre de `font-light`
(300) a `font-black` (900), que é a faixa que o legado usa.

O legado **já a carrega**, por `@import` do Google Fonts em
`legacy/src/index.css:1`. Verificado no browser:
`document.fonts.check('16px "Mona Sans"')` → `true`, com as faces roman e itálica
carregadas.

**O ponto que decide.** Existem duas builds distintas da Mona Sans, e elas **não
são metricamente idênticas**. Medido no browser, mesma string de 56 caracteres a
32 px:

| Peso | Google Fonts (v4) | GitHub (v2.0.27) | Diferença |
|---|---|---|---|
| 300 | 900,80 px | 886,17 px | −1,6% |
| 400 | 912,80 px | 899,89 px | −1,4% |
| 700 | 951,45 px | 929,31 px | **−2,3%** |
| 900 | 977,22 px | 959,80 px | −1,8% |

A build do GitHub é consistentemente mais estreita. **2,3% em uma linha de 900 px
são ~21 px** — muito acima do limite de 0,1% da regressão visual.

**Escolha.** O app novo usa **`next/font/google`** com Mona Sans.

Por quê: o `next/font/google` baixa a fonte **em tempo de build e a serve do nosso
domínio**. Ou seja, entrega os três objetivos de uma vez —

1. **Métrica idêntica ao legado**, porque é o mesmo arquivo que o legado consome.
2. **Sem requisição do visitante ao Google** em runtime: resolve a questão de
   privacidade/LGPD que motivava o self-hosting.
3. Sem DNS e conexão extra no carregamento.

Self-hostar a build do GitHub faria o oposto: **introduziria** a divergência de
métrica que esta decisão existe para evitar.

**Consequência.** MIG-008 (carregar a fonte no legado) **deixa de existir** — não
há o que corrigir. MIG-009 passa a ser `next/font/google`, não `next/font/local`.
O baseline visual pode ser congelado assim que as imagens forem recuperadas
(MIG-070, feita).

### O que estava errado

| Afirmação anterior | Realidade | Como o erro passou |
|---|---|---|
| "A Mona Sans nunca carrega; o site roda no fallback do sistema" | Carrega, via `@import` do Google Fonts | Procurei `<link>` em `index.html` e `@font-face` no CSS; o `@import` está na **linha 1** de `index.css` e não casava com nenhum dos dois padrões |
| "Mona Sans não está no Google Fonts" | Está, e é servida | Suposição não verificada |
| "O baseline nasceria errado sem corrigir o legado" | O baseline já estaria certo | Decorrência do primeiro erro |

**Lição para o resto do projeto:** a verificação empírica (abrir o browser e
medir) contradisse a leitura estática do código em dois pontos. Antes de tratar
algo como defeito do legado, conferir no browser.

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

## D-18 — Dois papéis: editor e admin

**Contexto.** Até a Fase 1, `users` tinha só `auth: true`: **todo usuário era
administrador pleno**. Marketing, RH e dev teriam acesso idêntico, inclusive ao
system prompt da IA e aos currículos enviados por candidatos.

**Escolha.** `editor` e `admin`. O editor cria, edita e publica todo conteúdo; o
admin também mexe no que muda o comportamento do site (navegação, rodapé,
`ai-assistant`), em usuários e em dado pessoal de terceiros.

**Consequência.** Toda collection passa a declarar `access` explicitamente — sem
declaração o Payload libera para qualquer autenticado. O campo `role` precisa de
`access.update` restrito a admin, senão o editor se promove sozinho. Resolve
**P-20** (prompt da IA) e endereça **P-17** (retenção de currículo).

## D-19 — Sem etapa de aprovação para publicar

**Contexto.** Publicar poderia exigir revisão de um aprovador.

**Escolha.** Quem edita, publica.

**Consequência.** O Payload não traz workflow de aprovação embutido; construir um
recriaria a dependência que a migração existe para eliminar — trocaria "esperar o
dev" por "esperar o aprovador". A rede de segurança fica com drafts, Live Preview,
versionamento com restauração, e a regra de D-08 de nada ir ao ar sem corpo.

## D-20 — A experiência do editor é entregável, não consequência

**Contexto.** O objetivo declarado da migração é o marketing publicar sem
depender de desenvolvedor. O plano cobria o lado dos dados a fundo e o lado de
quem usa quase nada: papéis, Live Preview, idioma do admin, organização da
navegação e treinamento não existiam em lugar nenhum. Nenhuma task tinha como
critério de aceite "uma pessoa de marketing publica um case sem chamar um dev".

**Escolha.** Tratar isso como escopo próprio, com documento
([experiencia-do-editor](../02-especificacao/experiencia-do-editor.md)), tasks e
critério de conclusão verificável na Fase 6: alguém do marketing executa seis
passos sem ajuda, sob observação, e o que travar vira correção — não item de
treinamento.

**Consequência.** Entram no backlog: papéis e access control, i18n do admin em
pt, Live Preview, organização do admin, guia do editor e sessão de handoff.
A engenharia sozinha não fecha o objetivo — sem transferência, ninguém usa.

## D-21 — Migrações versionadas, sem push automático de schema

**Contexto.** O adapter Postgres do Payload vem com `push: true` em
desenvolvimento: ele sincroniza o schema sozinho a cada mudança. Ao modelar os
cases, duas alterações — tornar um array localizado e tirar `localized` de um
campo — foram classificadas como destrutivas pelo Drizzle, e o servidor **parou
num prompt interativo** (`Accept warnings and push schema to database? (y/N)`).
Toda requisição pendurou até o timeout: uma delas levou 9,9 minutos.

**Escolha.** `push: false`. Schema muda por **migração versionada**:
`pnpm migrate:create <nome>` gera, `pnpm migrate` aplica.

**Consequência.** Uma etapa a mais por mudança de schema — e a Fase 3 terá
dezenas. Em troca: o servidor nunca mais trava esperando resposta, a migração
fica no git e pode ser revisada em PR, e staging/produção aplicam exatamente o
que foi revisado. É o que [ambientes](../04-infra/ambientes.md#migrações-de-banco)
já prescrevia; faltava implementar.

⚠️ O deploy precisa rodar `pnpm migrate` **antes** de o Next atender — já
previsto na estratégia de deploy.

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
| **P-24** | **Quem da ATRA vai editar o site**, e quem é o ponto de contato nos 30 dias após o cutover? | treinamento e guia do editor (D-20) | Sem nome, o treinamento não tem convidado e o guia não tem destinatário — e o objetivo da migração depende de alguém do outro lado |
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

## D-22 — O seed espelha o vocabulário do legado; consolidar é decisão de conteúdo

**Contexto.** [Topics](../02-especificacao/modelo-de-conteudo.md) existe como
collection justamente porque tag livre produziu "IA" vs. "Inteligência
Artificial" no legado. Na primeira versão do seed dos cases eu apliquei esse
raciocínio aos dados: as 12 tags dos 4 cases viraram 4 assuntos "limpos"
(`Governança & LGPD`, `Google Cloud`…).

Isso quebrou a regressão visual — os chips renderizam outro texto — e, mais
importante, foi eu tomando uma decisão que não é minha.

**Escolha.** O seed reproduz as tags exatas do legado
(`legacy/src/pages/SuccessStories.tsx:28-60`). O vocabulário controlado continua
existindo como **mecanismo**; os **valores** são do marketing, que agora pode
consolidá-los pelo admin sem pedir deploy.

**Consequência.** A migração entrega o site igual e a ferramenta para melhorá-lo,
em vez de entregar o site diferente por conta própria. Vale como regra geral:
**mudança de conteúdo não entra junto com mudança de tecnologia** — se entrar, um
aceite visual reprovado não distingue erro de porte de escolha editorial.

## D-23 — A barra de filtro das listagens vem do CMS

**Contexto.** O legado tem 6 categorias fixas escritas no código
(`SuccessStories.tsx:20`), e elas não são todas as tags em uso. Duas saídas
óbvias: repetir a lista fixa (repete o problema que a migração resolve) ou
derivar de tudo em uso (12 chips onde havia 6 — enche a barra e muda o layout).

**Escolha.** Dois campos em `topics`: `showInFilter` e `filterOrder`. A listagem
mostra os assuntos marcados, na ordem definida no admin. O seed marca exatamente
as 5 categorias do legado, na ordem original.

**Consequência.** Saída idêntica hoje, editável amanhã sem deploy — que é o
objetivo declarado da migração. Custa uma migração de schema e dois campos que o
editor precisa entender; a descrição em português no admin cobre isso.

## D-24 — Case tem dois textos de abertura, não um

**Contexto.** O legado usa `description` em dois lugares com **conteúdo
diferente**: o do array da listagem e o passado a `CaseDetailBase` em cada página
de case. Modelei um `summary` só, e a página de detalhe abria com a frase do
card. A diferença apareceu na regressão visual.

**Escolha.** `summary` (card e descrição para buscadores, obrigatório) e
`heroSubtitle` (abertura da página, opcional). Vazio, `heroSubtitle` cai em
`summary` — quem só quer um texto preenche um.

**Consequência.** Um campo a mais no formulário, com fallback que evita página
sem abertura. O padrão vale para blog, relatórios e webinars, que têm a mesma
estrutura — decidir uma vez aqui evita redecidir quatro vezes na Fase 3.

## D-25 — Não introduzir propriedade tipográfica que o legado não tem

**Contexto.** Eu havia posto `antialiased` no `<html>` do app novo por hábito. O
legado não define `-webkit-font-smoothing`. Depois de fonte e layout já baterem —
as 60 caixas de texto da listagem coincidem ao décimo de pixel — ainda sobravam
~3.400 pixels divergentes, todos em borda de letra, espalhados por toda página
com texto.

**Escolha.** Removido. Nenhuma propriedade de renderização de texto entra sem
existir no legado.

**Consequência.** Extensão natural de [D-15](#d-15--o-porte-fiel-vale-também-para-a-decoração):
o porte fiel não é só de estrutura e cor. Se a ATRA quiser ligar suavização
depois, é mudança de uma linha — feita conscientemente, com o gabarito regravado,
e não escondida dentro de uma migração.
