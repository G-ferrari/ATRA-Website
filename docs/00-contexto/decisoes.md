---
status: revisado
atualizado_em: 2026-08-21
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

---

## Pendentes

As decisões ainda em aberto vivem em [pendencias.md](pendencias.md) — separadas
daqui porque decisão registrada é permanente e pendência existe para deixar de
existir. O subconjunto que depende da ATRA está em
[pendencias-atra.md](pendencias-atra.md).
