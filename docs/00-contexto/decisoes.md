---
status: revisado
atualizado_em: 2026-09-27
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

> **Atualização (24/08/2026).** As 4 fotos passaram a existir no seed **atrás de
> `SEED_FIXTURES=1`**, para a revisão interna comparar a home com o gabarito
> ([D-27](#d-27--imagem-de-banco-do-protótipo-entra-como-fixture-nunca-como-conteúdo)).
> Isto **não** revoga D-14: sem a chave o seed **apaga** o campo `photo`, e o
> site mostra o monograma. Publicá-las continua sendo uma reversão desta
> decisão, e depende de foto real e autorizada — não de tirar a chave.

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

## D-26 — Os leads vão para o RD Station CRM; o Payload é registro de passagem

*Responde [P-18](pendencias.md), em 21/08/2026.*

**Contexto.** A collection `form-submissions` nasceu em MIG-100 sendo a **única**
cópia dos leads, e o comentário no topo dela já dizia que isso era provisório:
"P-18 pergunta se a ATRA usa RD Station ou HubSpot; se usar, o destino final dos
leads é lá e isto vira registro de passagem". A pergunta ficou aberta enquanto o
formulário era ligado.

**Escolha.** A ATRA usa **RD Station CRM** — o produto de CRM, não o RD Station
Marketing. Os formulários do site passam a alimentá-lo.

**Consequência.**

- **O lead grava no Postgres primeiro; o CRM é o segundo passo.** Mesmo contrato
  do aviso por e-mail: sem token, não falha — apenas não sincroniza, e a falta
  fica visível no admin. A ordem de MIG-100 (anti-spam → grava → avisa) ganha um
  quarto passo no fim, e não um novo primeiro. Lead perdido não volta.
- **A integração mora num hook de `form-submissions`, não na Server Action.**
  MIG-102, MIG-103 e MIG-104 são três formulários que ainda vão nascer e
  desembocam na mesma collection; no hook, os três já entram integrados.
- **Atribuição de campanha passou a ser coletada.** O `source` que existia
  responde *onde* o visitante converteu; o CRM precisa saber *de onde ele veio*.
  Os cinco parâmetros UTM entraram, capturados na chegada e guardados na sessão
  — ver `lib/utm.ts`.
- **Sincronizar exige idempotência.** Reenvio sem `crmId` gravado cria negócio
  duplicado no CRM, e o retry é obrigatório justamente porque a API é externa.
- **[P-22](pendencias.md) muda de peso.** Ela pergunta se `form-submissions`
  precisa de réplica em tempo real, porque o backup diário deixa o RPO do lead em
  24 h. Com o CRM recebendo cada lead, ele passa a ser a segunda cópia — a
  pergunta não desaparece, mas deixa de ser a única defesa.
- **Não decide o consentimento.** Mandar dado pessoal para um terceiro pede base
  legal explícita, e hoje **não existe aviso de privacidade nos formulários** —
  nem no porte nem no legado. Acrescentar um é elemento visível novo em `/` e
  `/insights`, que são rotas sob gate visual: é divergência deliberada do
  gabarito ([D-15](#d-15--o-porte-fiel-vale-também-para-a-decoração)) mais texto
  jurídico que ninguém escreveu ([D-22](#d-22--o-seed-espelha-o-vocabulário-do-legado-consolidar-é-decisão-de-conteúdo)).
  Continua em aberto, junto de [P-14](pendencias.md).

---

## D-27 — Imagem de banco do protótipo entra como fixture, nunca como conteúdo

**Contexto.** O protótipo ilustra 35 pontos com foto que não é da ATRA: 30
hotlinks do Unsplash e 5 do `picsum.photos`. O site novo põe marcador em todos —
`capa-pendente` nas capas, monograma nos 4 retratos de depoimento (D-14) —, e
isso deixa a revisão interna com uma página cheia de marcador exatamente onde o
gabarito tem foto: atrapalha quem compara, e o `capa-pendente` também não é o
que a ATRA quer ver num link enviado para aprovação.

Trazer as fotos é tecnicamente trivial: `legacy/scripts/baixar-imagens.mjs` já
as baixou para `legacy/public/imagens/`, com manifesto de proveniência.

**Escolha.** As imagens do protótipo entram no seed **só com `SEED_FIXTURES=1`**
(`scripts/seed/imagens-do-prototipo.ts`). Sem o sinal, o marcador continua. A
origem de cada arquivo vai junto para o campo `credit` da mídia.

Por quê a chave e não a decisão direta:

1. **Licença.** A licença do Unsplash permite uso comercial, mas não garante
   autorização de imagem das pessoas retratadas e proíbe uso que sugira endosso.
   As fotos do protótipo aparecem como equipe e como leitor de material da ATRA —
   é o mesmo risco que [D-14](#d-14--avatar-de-depoimento-opcional-com-monograma)
   já usou para descartar os 4 retratos de depoimento.
2. **`picsum.photos` não tem proveniência.** É gerador de placeholder; o arquivo
   guardado é o que o endereço devolveu num dia, sem autoria a registrar.
3. **Escolher capa é conteúdo** ([D-22](#d-22--o-seed-espelha-o-vocabulário-do-legado-consolidar-é-decisão-de-conteúdo)),
   e as 31 capas ilustram conteúdo fictício — artigos e materiais que não
   existem. O conteúdo real já veio do WordPress com as capas reais (Fase 4b).

⚠️ **Os 4 retratos de depoimento são de outra natureza que as 31 capas**, e a
chave protege coisas diferentes nos dois casos. Capa de artigo fictício é
decoração de algo que não existe. Retrato de depoimento aparece legendado com
**cargo e empresa reais** — "Superintendente de Risco, Banco Carrefour" —, então
a foto de um desconhecido se apresenta como pessoa identificável daquele banco.
D-14 continua valendo: publicá-los é reverter D-14, não estender D-27.

**Consequência.** A revisão interna e o CI passam a ver o protótipo inteiro; o
banco de produção não recebe nenhuma foto de banco de imagens, pela mesma chave
que já guarda os 6 posts e as 6 vagas fictícias. Se o marketing decidir adotar
alguma dessas fotos, é trocar `SEED_FIXTURES` por um upload no CMS — decisão
deles, com a licença conferida na hora.

⚠️ **Dois pontos a mais seguem no marcador, mesmo com a chave ligada**: a URL do
relatório "Benchmarks de Cloud Computing" e a do artigo "Data Center no Varejo"
respondem 404 na origem. O próprio protótipo desenha imagem quebrada ali; não há
imagem a trazer.

**O aceite visual não muda.** Rodado inteiro depois da troca: 240 testes, zero
divergência. Era o risco real da mudança — a máscara cobre a **caixa** da
imagem, e capa-pendente é 4:3 enquanto as do Unsplash são 3:2, então qualquer
caixa dimensionada pelo intrínseco da imagem teria mexido no layout. Nenhuma é:
todas usam `aspect-*`, `min-h-*` ou `fill`.

## D-28 — Compose + Caddy na VPS, deploy pelo GitHub Actions

*Responde [P-05](pendencias.md), em 25/08/2026 — decidida na prática, durante a
subida do staging.*

**Contexto.** O comparativo de `deploy-vps.md` recomendava Coolify pelo que ele
entrega pronto: deploy por git, backup agendado, segredos com UI. A VPS
contratada (Hostinger KVM 2, 2 vCPU/8 GB) mudou a conta: o painel custaria ~1 GB
de RAM e 1 vCPU numa máquina que também builda o site — e o build sozinho já
derrubou o Postgres por memória uma vez.

**Escolha.** **Compose + Caddy**, com a esteira no GitHub Actions: push na
`migracao` → CI valida → rsync → `infra/deploy/deploy.sh` (migra, builda contra
o banco real, troca com healthcheck, rollback por tag de SHA). Backup virou
timer de systemd com restore verificado (`infra/backup/`).

**Consequência.** Tudo que descreve o ambiente vive no git — compose, Caddyfile,
scripts — que era o critério de reprodutibilidade do comparativo. O que o
Coolify daria de graça foi pago uma vez em scripts que o repositório versiona e
o CI exercita a cada push. O rollback não é teórico: foi acionado três vezes por
falhas reais de rede sem o site piscar. Reversível como sempre foi — nada no
código sabe onde roda.

## D-29 — Lead do chat por formulário inline; o RD Station sincroniza por hook

*Em 03/09/2026. Executa [D-26](#d-26--os-leads-vão-para-o-rd-station-crm-o-payload-é-registro-de-passagem)
e responde parcialmente P-20. Tasks MIG-148/149/150.*

**Contexto.** A ideia de partida era enviar um formulário de qualificação por
e-mail para quem conversa com a ATRA AI. Dois problemas: o chat não sabe quem é
o visitante (nada persiste, P-20), e qualificar **depois** do engajamento, em
outro canal, é pedir uma segunda conversão de quem já estava convertendo.

**Escolha.**

1. **Qualificar dentro do próprio chat, com formulário inline** — um cartão de
   convite após N mensagens do visitante (N no CMS), dispensável, com os campos
   do formulário de contato. **Não** por function calling do Gemini: e-mail
   extraído pelo modelo é transcrição (um caractere errado perde o lead),
   reintroduziria a dependência do modelo que deixou a UI generativa de fora
   (P-04), e o anti-spam de MIG-101 pressupõe um `<form>`. O gatilho conta
   mensagens **do visitante**, então funciona até com a IA indisponível — que é
   quando capturar o contato mais importa. O `systemPrompt` pode convidar
   verbalmente; texto é do marketing (D-22).
2. **A conversa continua não persistindo.** Junto do lead vai só `chatContext`:
   as últimas ≤5 mensagens **do próprio visitante** (500 chars cada), nada do
   que o modelo respondeu. É o que o comercial precisa ("o que a pessoa
   perguntou"), é texto que o titular digitou e envia conscientemente com o
   formulário. P-20 fica parcialmente respondida: histórico completo, não.
3. **A sincronização com o CRM é o hook de D-26** (`hooks/sincronizar-crm.ts`),
   e vale para todos os formulários. Sincronizam: `contact`, `chat-lead`,
   `material-download` e `newsletter` **confirmada** (MIG-103). Ficam fora
   `job-application` e `talent-pool`: currículo é dado de RH, e pipeline de
   vendas seria desvio de finalidade — se a ATRA quiser o banco de talentos no
   CRM, é decisão dela. Idempotência por ids gravados (`crm.contactId`/
   `dealId`); falha deixa `syncedAt` vazio e **qualquer** edição no doc tenta
   de novo.
4. **Consentimento é gate de código, não combinado**: o convite só renderiza se
   o campo localizado `consentNotice` (global `atra-ai`) estiver preenchido — e
   ele nasce vazio, porque o texto é jurídico e é da ATRA (P-14). Em produção,
   `ENABLE_CHAT_LEAD` e `RDSTATION_CRM_TOKEN` só ligam depois de P-14.

**Consequência.** O follow-up comercial acontece dentro do RD Station, sem
régua de e-mail caseira (a ATRA usa o RD Station **CRM**; automação de e-mail é
o RD Station Marketing, produto que ela não assina). O e-mail transacional
continua sendo só o aviso interno de lead. Reversível por camadas: flag, toggle
no CMS e token são três chaves independentes.

## D-30 — Consentimento de cookies em três categorias; opt-in de verdade

*Em 03/09/2026. Executa MIG-109 (desmembrada em MIG-151–156) e a especificação
de `formularios-e-integracoes.md`. Interage com P-14 e P-19.*

**Contexto.** O inventário mostrou que o site público guarda **uma** coisa no
navegador (`sessionStorage atra:utm`) e não carrega terceiro nenhum — fonte
local, `youtube-nocookie`, zero analytics (nem o WordPress tem). O banner não
vem legalizar o existente: vem **habilitar** o que se decidiu capturar.

**Escolha.** Três categorias, com base legal explícita por item:

| Item | Categoria | Base |
|---|---|---|
| Cookie `atra-consent` (a própria preferência, ~180 dias, 1ª parte) | Essencial | Estritamente necessário — guardar "não quero cookies" exige um cookie. Isento |
| `payload-token` / draft mode | Essencial | Só editor autenticado; visitante nunca recebe |
| GA4 via GTM (Consent Mode v2) | **Estatística, opt-in** | Consentimento. Dupla chave: script só existe no DOM com `NEXT_PUBLIC_GTM_ID` preenchido (P-19) **e** aceite do visitante; `consent default denied` precede qualquer script |
| Captura de UTM (`atra:utm` → RD Station) | **Marketing, opt-in** | Consentimento. Reclassificada: era "abaixo da linha" (comentário de `lib/utm.ts`); vai a terceiro via CRM, então pergunta primeiro. A UTM da chegada espera em memória de módulo e só persiste se o aceite vier |
| Iframe de vídeo (YouTube/Vimeo) | Fora do banner | **Ação explícita**: click-to-load — o iframe só monta no clique do play. Fecha a brecha do Vimeo (que põe cookie) sem impedir ninguém de assistir |

Mais quatro pontos da decisão:

1. **Gate de código, como D-29**: os textos moram no global `cookie-consent` e
   `bannerMessage` nasce vazio — texto jurídico é da ATRA (P-14). Sem ele o
   mapper devolve `null`, o banner não existe, e o gabarito das 13 rotas do
   aceite visual segue válido. O seed nunca o preenche, nem com fixtures.
2. **Recusar tão visível quanto aceitar** — mesmo tamanho e tipografia, e é
   asserção de e2e, não estilo. Consentimento versionado: mudar as categorias
   sobe `VERSAO_DE_CONSENTIMENTO` e o banner pergunta de novo.
3. **Revogável por `/politicas-e-termos`** (botão "Gerenciar cookies"). O link
   "Cookies" do rodapé segue apontando para lá — o rodapé é dado do CMS, e
   interceptar clique por rótulo seria frágil.
4. **Consequência anotada, não resolvida**: GTM é script de terceiro injetando
   script — a CSP futura (a nota deliberada de `next.config.ts`) fica mais
   cara. E `@iconify/react` segue como risco latente (busca remota se alguém
   passar string; hoje nenhum call site passa) — higiene em task própria.

**Consequência.** Nenhum script não essencial antes do aceite vira propriedade
do sistema, não intenção: sem consentimento o script do GTM **não existe no
DOM**, a UTM não toca o storage e o vídeo não fala com o Google. Reversível por
camadas: apagar o texto no CMS desliga o banner; esvaziar `NEXT_PUBLIC_GTM_ID`
remove o GTM.

## D-31 — Melhoria de UI liberada para o trabalho do Impeccable; D-15 deixa de vetar design deliberado

*Decidida em 02/09/2026 pelo dono da ATRA, comunicada via G-ferrari (designer do
site). Registrada aqui em 10/09/2026, quando o commit `14e070f3` trouxe a
decisão dentro de `PRODUCT.md` sem o `D-xx` correspondente — decisão sem
registro é exatamente o que este arquivo existe para impedir.*

**Contexto.** D-15 servia à migração: com o porte fiel como contrato, um aceite
visual reprovado distingue erro de porte de escolha deliberada. As 20 rotas
estão portadas, o conteúdo real está no CMS e o site roda em homologação — e a
crítica de design do Impeccable (`.impeccable/critique/`) passou a apontar
melhorias que a regra proibia executar.

**Escolha.** Melhorias de UI guiadas pelo Impeccable **são permitidas**. D-15
continua descrevendo o que o porte **foi**, mas deixa de vetar mudança
deliberada de design.

**Limites que permanecem:**

1. **Toda mudança de UI regrava o gabarito** (`pnpm gate --baseline`) **com
   justificativa no PR** — consequência mecânica do aceite visual, independente
   da postura de design. O gabarito regravado vira o novo contrato, e a
   regressão visual segue sendo a rede de segurança — agora do design melhorado.
2. **D-22 segue intacta**: melhorar UI não autoriza reescrever texto, consolidar
   vocabulário nem escolher categorias. Decisão de conteúdo continua sendo do
   marketing.
3. **Os fatos em aberto continuam em aberto**: melhoria de UI não preenche
   número institucional (P-01), telefone (P-09) nem nenhum outro `P-xx` — não
   inventar.

**Consequência.** Os artefatos de design do repositório (`DESIGN.md`,
`.impeccable/design.json`, `PRODUCT.md`, `.ksdd/specs/`) passam a ser insumo de
trabalho legítimo. A nota de `PRODUCT.md` de que "os docs ainda descrevem a
política anterior" fica resolvida por esta decisão.

---

## Pendentes

As decisões ainda em aberto vivem em [pendencias.md](pendencias.md) — separadas
daqui porque decisão registrada é permanente e pendência existe para deixar de
existir. O subconjunto que depende da ATRA está em
[pendencias-atra.md](pendencias-atra.md).

## D-32 — As vagas do formulário vêm do ATRAIR; a grade de `/carreiras` continua do CMS

> ⚠️ **Substituída pela [D-33](#d-33--a-candidatura-a-uma-vaga-acontece-no-atrair-o-site-lista-e-leva-para-lá) em 22/09/2026**, no mesmo dia em que foi tomada: o desenho abaixo foi montado, visto e revisto. Fica registrada porque decisão registrada é permanente — e porque o motivo de ela não ter servido é o que justifica a D-33.

*Decidida em 22/09/2026 por Leonardo (dono do produto), ao pedir a integração
nos dois sentidos.*

**Contexto.** D-29 levou o currículo do Banco de Talentos para o ATRAIR
(`lib/atrair.ts`), mas só na ida. O ATRAIR sabe distinguir "candidatura para a
vaga X" de "currículo para o banco geral" — e o site não tinha como dizer qual
era, porque não conhecia as vagas de lá. Toda candidatura caía no banco geral.

**Opções.** (a) Substituir a grade de `/carreiras` pelas vagas do ATRAIR;
(b) manter a grade do CMS e oferecer as vagas do ATRAIR **apenas no formulário**;
(c) sincronizar as vagas do ATRAIR para dentro do CMS.

**Escolha: (b).** A grade é conteúdo de marketing — tem página própria por vaga
(MIG-051), texto trabalhado e SEO, e quem decide o que aparece nela é o
marketing (D-22). O formulário é outra coisa: ali a pergunta é operacional,
"para qual processo você quer entrar", e a resposta certa é a lista do sistema
que conduz os processos. (c) duplicaria a fonte da verdade e criaria um
sincronizador para manter.

**Consequência.**

- `/carreiras` resolve as vagas abertas no servidor (`buscarVagasAbertas`) e as
  passa como prop até o formulário — nenhum componente busca dado (regra 4).
- **Sem o ATRAIR, o formulário é o que era.** Lista vazia esconde o seletor; a
  página continua de pé. A candidatura vai para o banco geral, como antes.
- O select carrega `id::cargo` num campo só, porque o formulário funciona sem
  JavaScript: o id vai para o ATRAIR e o cargo para o admin, onde quem lê
  precisa do nome da vaga.
- O ATRAIR não expõe valores nem o nome do cliente nessa rota — a decisão de o
  que é público é de lá, e está registrada no item 172 do roadmap dele.

## D-33 — A candidatura a uma vaga acontece no ATRAIR; o site lista e leva para lá

*Decidida em 22/09/2026 por Leonardo (dono do produto), ao ver o desenho da
D-32 montado na página.* **Substitui a D-32** e revê a parte da D-22 que
mantinha a grade de vagas como conteúdo exclusivo do CMS.

**Contexto.** A D-32 pôs um seletor de vagas do ATRAIR dentro do formulário do
Banco de Talentos. Montado, o desenho mostrou o problema: `/carreiras` passou a
ter **duas listas de vagas na mesma página**, de fontes diferentes — a grade
(CMS) e o seletor (ATRAIR) — e quem se candidatava pelo seletor escolhia um
cargo numa lista suspensa, sem ler nada sobre a vaga.

**Opções.** (a) Manter o seletor e sincronizar a grade com ele; (b) trazer a
vaga do ATRAIR para uma página do site (`/carreiras/[slug]`) com o formulário;
(c) a vaga ganha **página pública no próprio ATRAIR**, e o site apenas lista e
aponta para lá.

**Escolha: (c).** Quem abre a vaga é quem cuida do recrutamento, no ATRAIR;
quem recebe a candidatura é o ATRAIR. Pôr a página no meio do site obrigaria a
copiar a descrição da vaga para cá (b) ou a manter dois lugares em sincronia
(a). Em (c) existe **um** lugar onde a vaga é escrita e **um** onde a
candidatura chega; o site faz o que sabe fazer — ser encontrado e levar a
pessoa até a vaga.

**Consequência.**

- **A grade de `/carreiras` lista as vagas do ATRAIR** quando elas existem, e
  cada card leva para a página da vaga lá (`url`, que vem pronta da API — o
  site não monta endereço do ATRAIR). Sem a integração, ou com o ATRAIR fora,
  a grade **cai para a lista do CMS** e a página continua de pé.
- **O seletor de vaga saiu do formulário.** O Banco de Talentos volta a ser o
  que era, e agora com um papel claro: é para quem **não** encontrou vaga que
  sirva. Saíram junto o `vagaId` enviado ao ATRAIR e o `lerVagaEscolhida`.
- **Nem toda vaga aberta é divulgada.** Quem cadastra a vaga no ATRAIR marca
  "tornar a vaga pública"; sem a marca, ela não vem na API e não tem página.
  É decisão de lá (item 173 do roadmap do ATRAIR), e existe porque a ATRA tem
  vagas que não devem ser divulgadas.
- **A página é do ATRAIR e tem a cara do ATRAIR**, com o logo de quem está
  contratando. Não é uma página do site da ATRA hospedada em outro domínio, e
  não deve ser tratada como tal aqui: o site só lista e aponta.
- O ATRAIR continua sem expor valores nem o nome do cliente.

## D-34 — `/consultores` sai da regressão visual; comportamento e smoke assumem

*Decidida em 24/09/2026 por G-ferrari, ao escolher entre gabarito próprio e
saída do gate.*

**Contexto.** Entre 21 e 23/09 a página recebeu seis mudanças pedidas pelo dono
(feature `consultores-solicitacao`, tasks 014 e 017–021, mais a remoção das
promessas de 48h): a chamada "Não encontrou um consultor?" foi para a seção de
diferenciais, o pedido virou uma aba lateral, as tags recolhem, o formulário
encolheu, e a aba adotou o visual da home. Nenhuma delas existe no protótipo.

O gate compara cada rota com uma captura do **legado** (`baseline.spec.ts`).
Para esta rota o gabarito passou a mostrar o desenho antigo: ele não reprova
regressão, reprova a decisão. Regravar "a partir do legado" não resolve — a
captura continuaria sendo a do protótipo.

**Opções.** (a) Gabarito próprio da rota: capturar o app novo e congelar no
estado aprovado; (b) tirar a rota do gate, como `/blog` e `/carreiras` em 4b;
(c) desfazer as mudanças visuais para o gate voltar a fechar.

**Escolha: (b).** (c) significaria reverter decisões de produto tomadas na
semana. (a) foi recusada: é o espelho que `estrategia-de-testes.md` descreve —
"capturar a própria saída e chamar de referência transforma o teste num espelho:
ele passa a provar que o código não mudou, não que está certo".

**Consequência.**

- `ROTAS_COM_GABARITO` perde `/consultores`; os três PNGs saíram de
  `e2e/gabarito/`. São **12 rotas** sob o gate.
- `e2e/consultores.spec.ts` cobre o que a captura cobria e mais: filtro em OU e
  em E (com e sem cobertura total), multi-seleção de senioridade, acúmulo no
  carrinho, remoção, a regra do "primeiro adicionar abre a aba", minimizar e
  expandir, envio com confirmação e o envio vazio recusado pelo navegador.
- `smoke.spec.ts` continua conferindo que a rota responde e que o filtro filtra.
- ⚠️ **O que se perde:** mudança visual não intencional nesta rota não é mais
  pega por ninguém. É o preço da escolha, e está registrado aqui.
- A decisão vale para **esta** rota. Outra que divergir de propósito repete a
  discussão — não herda a saída.

## D-35 — Sai o diagnóstico RC18, entra o diagnóstico de maturidade de dados

*Decidida em 26/09/2026 por G-ferrari, a partir do questionário do Roger (quiz
v1.7), repassado pela Taci depois da reunião de 24/09.* Substitui as tasks
005–007 da feature `rc18`.

**Contexto.** A feature RC18 (PR #11, 13/09) criou `/diagnostico-rc18`: uma
autoavaliação pelas 12 dimensões da RC 18/2025, que grava o lead como
`rc18-diagnostic`. Depois dela chegou o questionário de maturidade do Roger —
DAMA/DMBOK, 32 perguntas em 8 setores, das quais cada pessoa responde de 14 a
17 —, feito para colar no Elementor e enviar ao RD Station. O material está em
[`../02-especificacao/diagnostico-maturidade/`](../02-especificacao/diagnostico-maturidade/).

**Opções.** (a) Manter os dois diagnósticos; (b) estender o RC18 para outros
setores; (c) o questionário do Roger substitui o RC18.

**Escolha: (c).** O RC18 atende um setor e uma norma. O de maturidade atende os
vários clientes da ATRA e dá uma visão melhor de cada um. Dois diagnósticos no
site disputariam o mesmo visitante, e (b) reescreveria do zero o que o Roger já
entregou.

**Consequência.**

- O diagnóstico RC18 sai: rota, motor de pontuação e formulário. O valor
  `rc18-diagnostic` **fica** no enum de `form-submissions`, escondido — apagar
  valor de enum é migração destrutiva, e há leads de teste gravados com ele.
- O novo grava num kind próprio, `data-maturity-diagnostic`: não é específico
  de nenhuma norma, e reaproveitar o nome faria um lead de seguradora chegar ao
  CRM rotulado como RC18.
- É um formulário **transversal**, usado em várias áreas do site, e não um
  anexo da página RC18.
- O lead segue a D-26 (`form-submissions` → e-mail → RD Station **CRM**), e não
  o RD Station Marketing que o material original previa.
- `/solucoes/rc18` continua como solução, e o convite ao diagnóstico dela passa
  a levar ao novo. Se o formulário de contato da página fica ao lado dele é
  pergunta em aberto ao time.
- O desenho — rota, setor escolhido pela URL, o que fica no CMS — é da feature
  `diagnostico-maturidade-dados`, não desta decisão.

## D-36 — O glossário sai do ar até segunda ordem

*Decidida na reunião de 24/09/2026 (ata provisória, sem diarização), registrada
por G-ferrari em 26/09.* A ata não registra o motivo.

**Contexto.** `/glossario` veio do protótipo (MIG-040): item de primeiro nível
do menu, com painel próprio, link no rodapé, e uma das 12 rotas do gate visual.
A reunião pediu que ele fosse escondido.

**Opções.** (a) Apagar a página e os termos; (b) responder 404 e manter tudo
no CMS; (c) deixar acessível pela URL, só sem link.

**Escolha: (b).** É reversível sem reimportar nada. (c) deixaria a página
indexável e alcançável por quem já tinha o link — não é esconder. E 404, não
410: 404 é "agora não", e o robô volta a olhar; 410 tiraria a URL do índice
como coisa que deixou de existir.

**Consequência.**

- A página responde 404 nos dois idiomas (`NO_AR` em `glossario/page.tsx`) e
  sai do sitemap. A collection `glossary-terms` e o código da página ficam.
- Os links saem do menu e do rodapé — no admin, que é onde eles vivem, e no
  seed.
- `ROTAS_COM_GABARITO` perde `/glossario`: são **11 rotas** sob o gate. O smoke
  passa a conferir o 404.
- Para voltar: `NO_AR = true`, repor a categoria no global Navegação e o link
  no Rodapé, devolver a rota ao gate e ao sitemap.

## D-37 — A RC18 sai de Soluções e vira link na página de Bancos

*Decidida em 26/09/2026 por G-ferrari, a partir da reunião de 24/09.* Revê a aba
"RC18" que a feature `rc18` (13/09) pôs no mega-menu de Soluções.

**Contexto.** A RC 18/2025 é norma do setor financeiro. A feature `rc18` a pôs
como quarta categoria de Soluções, ao lado de Inovação & IA, Dados e Governança.
A reunião pediu que ela fosse para dentro do segmento financeiro.

**Opções.** (a) Manter nos dois lugares; (b) mover a página para dentro de
`/segmentos`; (c) tirar de Soluções e chegar a ela pela página de Bancos,
mantendo a URL.

**Escolha: (c).** `/solucoes/rc18` fica: é o endereço que a campanha vai
linkar, e mudá-lo obrigaria a trocar o documento de collection. Muda por onde se
chega, não onde a página mora.

**Consequência.**

- O mega-menu de Soluções e o índice `/solucoes` perdem a categoria RC18. O
  documento segue com `category: 'rc18'` — só deixa de ser agrupado; o valor do
  enum fica.
- A página de Bancos ganha uma chamada para `/solucoes/rc18`, pelo admin.
- O banner da RC18 no carrossel de destaques da home também leva a ela.

## D-38 — O nível do diagnóstico é o do rótulo, em todo lugar

*Decidida em 26/09/2026 por G-ferrari, na task 024 da feature
`diagnostico-maturidade-dados` — o e-mail do resultado é o primeiro lugar em que
o número e o nome do nível aparecem ao lado do que vai ao CRM.* Desvia, de
propósito, do questionário do Roger (v1.7) que a D-35 adotou.

**Contexto.** O HTML v1.7 dá o nível por dois critérios que não concordam. O
**rótulo** (`computeScores`) usa limiares — 1,8 / 2,6 / 3,5 / 4,3 — e é o que
segue para o CRM (`cf_quiz_nivel_dmbok` no original; `diagnostic.level` em
`form-submissions`, e dali para o RD Station). O **título** da tela de resultado
(`renderResult`) arredonda a média (`lvlNum = Math.round(overall)`), e é esse
número que escolhe o nome e a descrição do nível em `LEVELS`. Nas três faixas em
que os critérios se separam, o lead leria um nível no e-mail e o comercial
outro no CRM:

| Média | Rótulo (vai ao CRM) | Título da tela |
|---|---|---|
| 1,5 a < 1,8 | 1 · Inicial | Nível 2 · Repetível |
| 2,5 a < 2,6 | 2 · Repetível | Nível 3 · Definido |
| 4,3 a < 4,5 | 5 · Otimizado | Nível 4 · Gerenciado |

A task 022 portou os dois como estão (D-15), com um teste que fixava a
divergência.

**Opções.** (a) Manter os dois critérios, fiel ao HTML; (b) o título em todo
lugar, trocando o que vai ao CRM; (c) o rótulo em todo lugar.

**Escolha: (c).** O rótulo é o que vai ao CRM, e o número e o nome do nível não
podem discordar entre o e-mail que o lead recebe e o registro com que o
comercial o aborda. (b) mexeria no dado que o Roger desenhou para a automação —
os limiares são o critério explícito, o arredondamento é conta de tela. (a) era
fidelidade ao defeito numa tela que nem existe mais: o resultado agora só sai
por e-mail.

**Consequência.**

- `nivelNumerico` (motor) passa a sair do dígito do rótulo (`nivelDaMedia`). O
  título "Nível N · Nome", a chave de `NIVEIS` (nome e descrição) e o e-mail do
  resultado seguem o rótulo.
- É desvio deliberado do original. `motor.test.ts` continua rodando o HTML ao
  lado e prova que o número difere do `lvlNum` **exatamente** nas três faixas —
  nem uma média a mais. Quando o HTML unificar o critério, esse teste reprova, e
  é a hora de voltar a exigir igualdade.
- Avisar o Roger para unificar na próxima versão do questionário (v1.8), pelo
  rótulo.

## D-39 — A paridade com o protótipo sai do CI; os testes e2e voltam por comportamento

*Decidida em 26/09/2026 por G-ferrari, como designer do site, respondendo a
P-30. Aplicada em 27/09, quando o job `e2e` do CI foi religado.* Estende ao site
inteiro o que a D-34 fez com `/consultores`.

**Contexto.** O gate compara cada rota com uma captura do **legado**, gravada em
21/08. A D-31 (02/09) liberou melhoria de UI, e a passada de 13/09 (`d785a12`)
padronizou raios, tirou bordas de caixa e unificou o ritmo das seções **no app
novo** — o protótipo continua como estava. Medido em 24/09, as rotas sob o gate
divergiam de 2% (relatórios) a 21% (home) dos pixels, com alturas até 316px
diferentes. Ninguém viu antes porque o job `e2e` estava desligado desde 26/08
(decisão do Leonardo, para iterar em homologação). Religá-lo é pré-requisito do
cutover, e com aquele gabarito ele reprovaria as 11 rotas — por decisão de
design, não por regressão.

**Opções.** (a) Regravar o gabarito a partir do app novo; (b) aposentar a
paridade com o protótipo e cobrir as rotas por comportamento, como a D-34 fez;
(c) desfazer as melhorias de UI para o gate voltar a fechar.

**Escolha: (b).** (a) é o espelho que `estrategia-de-testes.md` descreve e que a
D-34 já recusou para `/consultores`: capturar a própria saída prova que o código
não mudou, não que está certo — e aqui ainda congelaria, sem revisão, o estado
de um site em plena passada de design. (c) contraria a D-31 e reverte decisões
de produto. A referência passa a ser **o site como está**, e a cobertura, o que
ele faz.

**Consequência.**

- **Sai do CI e da suíte padrão**, sem ser apagado: `e2e/visual.spec.ts`,
  `e2e/baseline.spec.ts`, `e2e/paridade-ds.spec.ts` e o teste do smoke que
  confere o legado em :3001. O mecanismo é o `testIgnore` de
  `playwright.config.ts`; religa com `PARIDADE_COM_PROTOTIPO=1`, e
  `pnpm gate --baseline` e `--rota` ligam sozinhos. Os PNGs de `e2e/gabarito/`
  ficam como registro de 21/08, não como contrato.
- **O CI não sobe mais o app legado.** O `gate.mjs` só exige o :3001 nos modos
  que capturam dele. A pasta `legacy/` continua lida pelo seed (as fotos de
  `SEED_FIXTURES`, D-27) até a Fase 8.
- **O que roda** — o job `e2e`, agora "smoke · comportamento", e o `deploy`
  volta a esperar por ele (`needs: [verify, e2e]`). É o `pnpm gate` padrão:
  build de produção e, contra ele, o smoke (status PT/EN, 404, redirects da
  D-35, sitemap, dados estruturados, formulários, megamenu, herói),
  `consultores.spec.ts`, `diagnostico-maturidade.spec.ts`, `chat-lead.spec.ts`,
  `cookies.spec.ts`, o contraste nos dois temas (`contraste.spec.ts`), o CSV
  inteiro de redirects (`redirects.spec.ts`) e o axe, que mede sem reprovar
  (D-13).
- `ROTAS_COM_GABARITO` continua sendo a lista de rotas do contraste e do axe; o
  nome ficou histórico.
- **O limite 1 da D-31 cai junto.** "Toda mudança de UI regrava o gabarito" era
  consequência mecânica do aceite visual; sem gabarito no aceite, não há o que
  regravar. Os limites 2 e 3 — D-22 e os `P-xx` em aberto — seguem.
- ⚠️ **O preço:** mudança visual **não intencional** — um espaçamento que
  escorrega, uma seção que encolhe, um bloco que some sem que nenhum teste
  interaja com ele — não é mais pega por pixel em rota nenhuma. O contraste
  continua pegando texto que o tema claro apaga, e o comportamento pega o que se
  clica; o resto depende de olho. É o preço da escolha, e está registrado aqui.
- **Depois do cutover**, um teste visual pode voltar contra o site **aprovado**:
  capturas de um estado que o designer der por certo, gravadas como decisão
  registrada, e não como reflexo do último build. Não é desta decisão — se vier,
  é D nova.

## D-40 — Os ids de GTM e Lusha moram no admin; a Lusha entra sob marketing

*Decidida em 27/09/2026 por G-ferrari (opção B do Passo 3), a partir do pedido da
Karen de 22/09 para instalar o Lusha Website Visitors no site novo.* Estende a
D-30.

**Contexto.** Até aqui o GTM lia o id do container de `NEXT_PUBLIC_GTM_ID`:
trocar exigia acesso à VPS e um deploy, e a variável seguia vazia (P-19). A Lusha
identifica a **empresa** de onde vem a visita, pelo IP, e precisa de um `siteId`
que é da conta da ATRA. Os dois ids decidem que código de terceiro roda em toda
página.

**Opções.** (A) Os dois no ambiente do servidor: só quem tem a VPS troca, com
deploy. (B) Os dois num global do admin: troca sem deploy, pela revalidação que
todo global já dispara.

**Escolha: (B)**, com três travas.

- **Só admin edita** o global `tracking` (Sistema → Rastreamento). Editor vê os
  valores e não muda: trocar o container é trocar o código que roda no site.
- **Formato fechado**, testado duas vezes (`lib/formatos-de-rastreamento.ts`):
  no admin, ao salvar, e no mapper, antes da página. `GTM-` com maiúsculas e
  dígitos; o `siteId` da Lusha, um UUID. Nada fora disso chega à URL de um
  script.
- `NEXT_PUBLIC_GTM_ID` fica **de reserva** para o GTM, lida no servidor. O
  admin vence. A Lusha nasceu no admin e não tem reserva.

**A Lusha entra sob marketing**, não sob estatística: é identificação de conta
para prospecção, não medição anônima de uso. O componente
(`components/layout/lusha.tsx`) espelha o `Gtm`: o script **nem existe no DOM**
antes do aceite, e revogar depois não o descarrega. Como marketing passou a
significar outra coisa, `VERSAO_DE_CONSENTIMENTO` foi de 1 para 2 — quem aceitou
marketing quando ele era só a UTM é perguntado de novo.

**Consequência.**

- **Preencher o id não carrega nada sozinho.** Cada script espera o aceite da
  sua categoria, e sem `bannerMessage` no `cookie-consent` (P-14) não há aviso,
  logo não há aceite. ⚠️ Onde o texto provisório do aviso foi semeado à mão
  (`scripts/seed/cookie-consent.ts`, em dev e homologação), o aviso existe: um
  id preenchido ali **carrega de verdade** para quem aceitar.
- **Os eventos** (`rastrear`, `lib/rastreio.ts`) deixaram de ler a variável: o
  `Gtm` avisa o módulo quando tem container (`definirContainer`).
- **Conteúdo segue da ATRA (D-22).** O parágrafo da Lusha na política de
  privacidade (P-14) e a descrição da categoria marketing no aviso são texto do
  marketing, editado no admin. A reserva em código da descrição de marketing
  (`lib/mappers/cookie-consent.ts`) leva, depois da frase da UTM, o texto da
  Karen **literal** — "sem tirar nem pôr", por decisão de G-ferrari em 27/09 —,
  porque sem ele a descrição omitiria a Lusha. Em inglês é tradução, marcada
  para revisão. O texto completo dos cookies (aviso, categorias, política) vai
  para revisão da ATRA, na P-14.
- O container do site atual é o `GTM-KR2VWNK`, com o GA4 `G-619E22CJKE` dentro
  (lido no HTML público do atra.com.br em 27/09). Reaproveitá-lo mantém a série
  do Analytics — o que responde, na prática, a P-19. Falta a Karen confirmar
  quem administra o container e que ele vale para o site novo.
- Coberto por `e2e/rastreamento.spec.ts` (sem aceite, só estatística, só
  marketing, aceite da versão 1, aceite dado depois), com ids de teste que o
  seed só grava com `SEED_FIXTURES=1`, e por `lib/mappers/tracking.test.ts`.

## D-41 — A integração com o ATRAIR liga e desliga no admin, em duas chaves

*Decidida em 29/09/2026 por Leonardo (dono do produto), ao pedir um feature
flag para a integração que carrega as vagas.* Estende a D-33, que trouxe as
vagas do ATRAIR para `/carreiras`, e segue o precedente da D-40, que tirou os
ids de rastreamento do ambiente.

**Contexto.** Desde a D-33 a grade de `/carreiras` vem do ATRAIR, e quem
decidia isso era o **ambiente**: `ATRAIR_API_URL` + `ATRAIR_API_KEY`
preenchidas ligavam, vazias desligavam, e mudar exigia deploy. Dois problemas.

O primeiro é operacional: desligar a integração — porque o ATRAIR está em
manutenção, porque o RH quer publicar vaga pelo CMS numa semana específica — não
podia ser feito por quem opera o site.

O segundo é pior e estava invisível. O desligamento era **implícito**:
`buscarVagasAbertas` devolvia `VagaAberta[]`, e `[]` queria dizer três coisas
incompatíveis — integração desligada, ATRAIR fora do ar, e ATRAIR respondendo
que **não há vaga aberta**. As duas primeiras querem a lista do CMS na tela; a
terceira quer a página vazia. Colapsadas em `[]`, uma vaga fechada no ATRAIR
**voltava ao ar** pela lista antiga da collection `jobs`, sem ninguém ver.

**Opções.** (a) Uma chave só, para a integração inteira; (b) duas chaves, uma
para a vinda das vagas e outra para a ida dos currículos; (c) manter no ambiente
e só documentar melhor.

**Decisão: (b), duas chaves, no global `integrations` (Sistema → Integrações).**

- **`atrair.jobsFeed`** — a grade de `/carreiras`. Ligada, as vagas vêm do
  ATRAIR e o card leva para a vaga lá. Desligada, vêm da collection `jobs`, com
  página própria em `/carreiras/[slug]`.
- **`atrair.talentPool`** — a ida do currículo do Banco de Talentos. Separada
  por decisão do dono: as duas pontas quebram por motivos diferentes e se
  desligam em momentos diferentes. Nada aqui muda o que o candidato vê — a
  inscrição é gravada no admin antes de qualquer sincronização (D-26).
- **`atrair.endpoint`** — o endereço, editável, que **nasce preenchido** com o
  do ambiente (`ATRAIR_API_URL`, que segue de reserva no mapper: o admin vence).
- **Só admin edita.** O site manda a `ATRAIR_API_KEY` no cabeçalho para o
  endereço deste campo — trocar o endereço é escolher para quem a chave de
  servidor é entregue. Formato fechado em `lib/formatos-de-integracao.ts`,
  testado duas vezes (admin e mapper): URL absoluta, sem query, sem fragmento,
  sem credencial embutida, e **`https` obrigatório** menos para o ATRAIR local —
  `http` para host externo poria a chave em texto claro na rede.

**A chave de API fica no ambiente.** Endpoint e liga/desliga são configuração;
`ATRAIR_API_KEY` é credencial, e credencial em coluna do Postgres entra no
backup diário e aparece no admin. As duas chaves são, portanto, a **segunda**
tranca: ligadas sem a credencial no servidor, a integração segue inerte.

**Consequência.**

- `buscarVagasAbertas` passou a devolver **`ResultadoDeVagas`**, um tipo somado:
  `{ fonte: 'atrair', vagas }` é "o ATRAIR respondeu" — inclusive com `vagas:
  []`, que mostra o vazio da página; `{ fonte: 'cms', motivo }` é "não foi
  possível perguntar", e aí o CMS assume. É a distinção que a decisão existe
  para criar, e o tipo é o que impede desfazê-la por descuido. A prop do bloco
  virou `VagaAberta[] | null` pela mesma razão.
- **As duas chaves nascem ligadas** (`defaultValue: true`), e um global ainda
  não gravado é lido como ligado (`?? true` no mapper). Somado à credencial no
  ambiente, isto faz a decisão **não mudar o que está no ar**: em produção, onde
  `ATRAIR_API_KEY` não está provisionada, a integração continua inerte e a grade
  continua vindo do CMS.
- ⚠️ O `defaultValue` do endpoint é **função, não literal**. Literal, o drizzle
  o assa como `DEFAULT` da coluna, com o valor do `ATRAIR_API_URL` de quem
  *gerou* a migração: a primeira tentativa produziu
  `"atrair_endpoint" varchar DEFAULT 'http://host.docker.internal:3300'` num
  arquivo versionado que roda no CI e em produção. Migração
  `20260929_122603_integracoes`.
- Ligar e desligar **não pede deploy**: o hook dos globals revalida o site
  (MIG-143). ⚠️ Desligar tem efeito imediato — a página deixa de chamar o
  ATRAIR. Ligar pode levar até 5 min para mostrar vaga nova, que é o cache do
  `fetch` da lista.
- O CI e o `pnpm gate` rodam **sem** as envs do ATRAIR, então a grade cai para o
  CMS e o smoke de `/carreiras` — que exige um link `/carreiras/<slug>` — segue
  valendo. O gabarito de `/carreiras` já estava fora do gate desde a Fase 4b.
- Coberto por `lib/atrair.test.ts` (os três motivos de cair para o CMS, as duas
  chaves independentes, e o caso "ATRAIR respondendo zero vagas é `atrair`"),
  `lib/formatos-de-integracao.test.ts` e `lib/mappers/integracao.test.ts`.
- ⚠️ **Pendência:** o `endpoint` de produção. O repo nunca registrou a URL do
  ATRAIR no Cloud Run — `docs/04-infra/ambientes.md` só a descreve. Enquanto
  `ATRAIR_API_URL` não for provisionada na VPS, o campo nasce apontando para o
  endereço de desenvolvimento e o mapper o recusa (`endpoint: null`), o que é o
  estado seguro: a grade vem do CMS.

## D-42 — Toda página interna termina com a mesma faixa, e as soluções perdem o formulário

*Decidida em 29/09/2026 por G-ferrari, na leva de ajustes antes dos testes de
30/09.*

**Contexto.** Cada tipo de página interna fechava de um jeito: case, artigo,
webinar e material com a caixa azul `ContactCta` (telefone, e-mail e "Fale com
um especialista"); as 12 soluções do WordPress e os 8 segmentos com uma faixa
escura seguida do **formulário** na própria página; IA e RC18 com um botão que
abria o **WhatsApp** (na RC18, o do Fabio); /sobre com "Vem ser ATRA", para as
vagas. A página do Google Cloud já terminava com a faixa que o dono queria para
todas.

**Decisão.** Todas as páginas internas terminam com a faixa do Google Cloud —
"Entre em contato", **"Fale conosco" para /contato** e "Dúvida Rápida? Fale com
nossa IA" para /chat —, com o texto da homologação em 29/09. Nas soluções e
segmentos **o formulário sai** ("Tira o formulário"): quem quer falar vai para
/contato, e o "Quero saber mais" do herói, que rolava até o formulário, passa a
levar para lá.

**Consequências.**

- Páginas em código usam `components/layout/chamada-final.tsx`, que é o próprio
  `BlocoCta` na variante `dark-centered` com texto PT/EN. As páginas por blocos
  foram trocadas pela migração `20260929_223200_fim_das_paginas_internas`, com a
  regra e a trava em `migrations/arquivos/fim-das-paginas.ts` (com teste): só
  mexe em página que termina como a migração conhece, e avisa no log o que
  deixou de fora. O seed (`migracoes-de-dados.ts`) e os importadores do
  WordPress chamam a mesma migração no fim, para banco novo sair igual.
- **Fica de fora a página de cada vaga**: a faixa dela é de recrutamento ("Quer
  fazer parte do time? Falar com o RH") e entra na revisão das vagas.
- A RC18 perde, no fim, o selo do prazo (a variante centralizada não o desenha)
  e o WhatsApp do Fabio; o herói dela segue igual, com os dois.
- Menos captura de lead dentro da página: o formulário de /contato passa a ser o
  único caminho de texto livre fora da home. Foi escolha explícita, contra a
  recomendação de mantê-lo.
- O texto da faixa está em dois lugares — o componente e cada bloco gravado. O
  bloco é editável no admin página a página; o componente, só por código.

## D-44 — Push na `main` também publica

*Decidida em 01/10/2026 por Leonardo, ao preparar a publicação do site.*

**Contexto.** Desde 24/08 o deploy era exclusivo da `migracao`: o job `deploy`
do `ci.yml` só rodava em push nessa branch. A `main` recebia CI (lint, types,
e2e) mas nunca publicava, e estava 209 commits atrás. Publicar dependia de quem
trabalha na `migracao` — um gargalo de pessoa, não de código.

**Decisão.** O job `deploy` roda em push para **`main` ou `migracao`**. A
`main` passa a ser o caminho de publicação que não depende de desenvolvedor
específico; a `migracao` continua publicando até o cutover, e sai do `if`
quando a migração fechar.

**Consequências.**

- As duas branches publicam no **mesmo** servidor (`VPS_HOST`), com o grupo de
  concorrência `deploy-vps` serializando. Não existe "produção pela main e
  homologação pela migracao": é um host só até a VM nova entrar.
- ⚠️ A `main` precisa estar **à frente** da `migracao` antes de qualquer push.
  Um push de `main` atrasada leva ao ar código velho sobre um banco que já
  recebeu as migrações novas — o Payload cai em `column ... does not exist`.
  Sincronizar é merge de `migracao` em `main` (ou fast-forward), nunca o
  contrário.
- PR continua sem deploy: o `if` exige `push`.
